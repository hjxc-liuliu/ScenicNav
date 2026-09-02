import {
  CrowdSnapshot,
  ItineraryPlan,
  ItineraryProfile,
  ItineraryReplanResult,
  RecommendedRoute,
  ScenicSpot,
  TicketProduct
} from '../common/Models';
import { ScenicRepository } from '../data/ScenicRepository';

export class ScenicViewModel {
  readonly repository: ScenicRepository = new ScenicRepository();

  formatPrice(price: number): string {
    return `￥${price.toFixed(2)}`;
  }

  canBook(ticket: TicketProduct): boolean {
    return ticket.remaining > 0;
  }

  recommendRoute(preference: string): RecommendedRoute {
    const routes = this.repository.routes();
    for (let index = 0; index < routes.length; index++) {
      if (routes[index].tags.indexOf(preference) >= 0) {
        return routes[index];
      }
    }
    return routes[0];
  }

  estimatedWait(queueSize: number, serviceRatePerMinute: number): number {
    if (serviceRatePerMinute <= 0) {
      return 0;
    }
    return Math.ceil(queueSize / serviceRatePerMinute);
  }

  crowdForSpot(spot: ScenicSpot, snapshots: CrowdSnapshot[]): CrowdSnapshot {
    for (let index = 0; index < snapshots.length; index++) {
      if (snapshots[index].spotId === spot.id) {
        return snapshots[index];
      }
    }
    return {
      spotId: spot.id,
      currentPercent: spot.crowdPercent,
      forecastPercent: spot.crowdPercent,
      trend: '平稳',
      updatedAt: '刚刚'
    };
  }

  crowdLevel(percent: number): string {
    if (percent <= 45) {
      return '畅通';
    }
    if (percent <= 70) {
      return '适中';
    }
    if (percent <= 85) {
      return '拥挤';
    }
    return '严重拥挤';
  }

  heatColor(percent: number): string {
    if (percent <= 45) {
      return '#2E9B63';
    }
    if (percent <= 70) {
      return '#D7A72E';
    }
    if (percent <= 85) {
      return '#E57C32';
    }
    return '#D84A4A';
  }

  isHighCrowd(snapshot: CrowdSnapshot): boolean {
    return snapshot.forecastPercent > 70;
  }

  generateItinerary(profile: ItineraryProfile, spots: ScenicSpot[], snapshots: CrowdSnapshot[]): ItineraryPlan {
    const selectedSpotIds: string[] = [];
    const avoidedSpotNames: string[] = [];
    const targetStopCount = Math.min(spots.length, Math.max(2, Math.floor(profile.durationMinutes / 60)));
    let elapsedMinutes = 0;
    let currentX = 31;
    let currentY = 49;

    for (let round = 0; round < targetStopCount; round++) {
      let candidate = this.findBestCandidate(profile, spots, snapshots, selectedSpotIds, currentX, currentY, elapsedMinutes, false);
      if (candidate === undefined) {
        candidate = this.findBestCandidate(profile, spots, snapshots, selectedSpotIds, currentX, currentY, elapsedMinutes, true);
      }
      if (candidate === undefined) {
        break;
      }
      const travelMinutes = this.estimatedWalkMinutes(currentX, currentY, candidate.x, candidate.y);
      selectedSpotIds.push(candidate.id);
      elapsedMinutes = elapsedMinutes + travelMinutes + candidate.stayMinutes;
      currentX = candidate.x;
      currentY = candidate.y;
    }

    for (let index = 0; index < spots.length; index++) {
      const snapshot = this.crowdForSpot(spots[index], snapshots);
      if (this.isHighCrowd(snapshot) && this.interestMatchCount(spots[index], profile.interestTags) > 0) {
        avoidedSpotNames.push(spots[index].name);
      }
    }

    const comfortScore = this.comfortScore(selectedSpotIds, spots, snapshots);
    const savedWaitMinutes = avoidedSpotNames.length * 18;
    const explanation = avoidedSpotNames.length > 0
      ? `已避开 ${avoidedSpotNames.join('、')} 的预测高峰，优先安排同类低热度景点。`
      : '当前客流平稳，已按兴趣、步行距离与游玩时间生成舒适路线。';
    return {
      id: `itinerary-${Date.now()}`,
      title: `${profile.durationMinutes / 60} 小时${profile.interestTags.join('·')}错峰行程`,
      spotIds: selectedSpotIds,
      durationMinutes: elapsedMinutes,
      comfortScore: comfortScore,
      avoidedSpotNames: avoidedSpotNames,
      savedWaitMinutes: savedWaitMinutes,
      explanation: explanation,
      generatedAt: '刚刚'
    };
  }

  replanItinerary(
    plan: ItineraryPlan,
    completedCount: number,
    profile: ItineraryProfile,
    spots: ScenicSpot[],
    snapshots: CrowdSnapshot[]
  ): ItineraryReplanResult {
    const nextSpotIds: string[] = [];
    const replacedNames: string[] = [];
    for (let index = 0; index < plan.spotIds.length; index++) {
      const spotId = plan.spotIds[index];
      const spot = this.findSpot(spots, spotId);
      if (spot === undefined || index < completedCount || !this.isHighCrowd(this.crowdForSpot(spot, snapshots))) {
        nextSpotIds.push(spotId);
        continue;
      }
      const alternative = this.findAlternative(profile, spots, snapshots, nextSpotIds, plan.spotIds, spotId);
      if (alternative === undefined) {
        nextSpotIds.push(spotId);
        continue;
      }
      nextSpotIds.push(alternative.id);
      replacedNames.push(`${spot.name} → ${alternative.name}`);
    }

    if (replacedNames.length === 0) {
      return { plan: plan, changed: false, reason: '未发现需要绕行的未到达景点。' };
    }
    const reason = `预测高峰触发绕行：${replacedNames.join('；')}。`;
    const replanned: ItineraryPlan = {
      id: plan.id,
      title: plan.title,
      spotIds: nextSpotIds,
      durationMinutes: plan.durationMinutes,
      comfortScore: this.comfortScore(nextSpotIds, spots, snapshots),
      avoidedSpotNames: plan.avoidedSpotNames,
      savedWaitMinutes: plan.savedWaitMinutes + replacedNames.length * 18,
      explanation: reason,
      generatedAt: '刚刚'
    };
    return { plan: replanned, changed: true, reason: reason };
  }

  private findBestCandidate(
    profile: ItineraryProfile,
    spots: ScenicSpot[],
    snapshots: CrowdSnapshot[],
    selectedSpotIds: string[],
    currentX: number,
    currentY: number,
    elapsedMinutes: number,
    allowHighCrowd: boolean
  ): ScenicSpot | undefined {
    let best: ScenicSpot | undefined = undefined;
    let bestScore = -100000;
    for (let index = 0; index < spots.length; index++) {
      const spot = spots[index];
      if (this.containsSpotId(selectedSpotIds, spot.id)) {
        continue;
      }
      const snapshot = this.crowdForSpot(spot, snapshots);
      if (!allowHighCrowd && this.isHighCrowd(snapshot)) {
        continue;
      }
      const walkMinutes = this.estimatedWalkMinutes(currentX, currentY, spot.x, spot.y);
      if (elapsedMinutes + walkMinutes + spot.stayMinutes > profile.durationMinutes) {
        continue;
      }
      const score = this.interestMatchCount(spot, profile.interestTags) * 100 + (100 - snapshot.forecastPercent) - walkMinutes * 3;
      if (score > bestScore) {
        best = spot;
        bestScore = score;
      }
    }
    return best;
  }

  private findAlternative(
    profile: ItineraryProfile,
    spots: ScenicSpot[],
    snapshots: CrowdSnapshot[],
    completedSpotIds: string[],
    originalSpotIds: string[],
    replacingSpotId: string
  ): ScenicSpot | undefined {
    let best: ScenicSpot | undefined = undefined;
    let bestScore = -100000;
    for (let index = 0; index < spots.length; index++) {
      const spot = spots[index];
      if (spot.id === replacingSpotId || this.containsSpotId(completedSpotIds, spot.id) || this.containsSpotId(originalSpotIds, spot.id)) {
        continue;
      }
      const snapshot = this.crowdForSpot(spot, snapshots);
      if (this.isHighCrowd(snapshot)) {
        continue;
      }
      const score = this.interestMatchCount(spot, profile.interestTags) * 100 + (100 - snapshot.forecastPercent);
      if (score > bestScore) {
        best = spot;
        bestScore = score;
      }
    }
    return best;
  }

  private estimatedWalkMinutes(fromX: number, fromY: number, toX: number, toY: number): number {
    return Math.max(8, Math.ceil((Math.abs(fromX - toX) + Math.abs(fromY - toY)) / 4));
  }

  private comfortScore(spotIds: string[], spots: ScenicSpot[], snapshots: CrowdSnapshot[]): number {
    if (spotIds.length === 0) {
      return 0;
    }
    let total = 0;
    for (let index = 0; index < spotIds.length; index++) {
      const spot = this.findSpot(spots, spotIds[index]);
      if (spot !== undefined) {
        total = total + (100 - this.crowdForSpot(spot, snapshots).forecastPercent);
      }
    }
    return Math.round(total / spotIds.length);
  }

  private interestMatchCount(spot: ScenicSpot, interests: string[]): number {
    let count = 0;
    for (let tagIndex = 0; tagIndex < interests.length; tagIndex++) {
      if (spot.interestTags.indexOf(interests[tagIndex]) >= 0) {
        count = count + 1;
      }
    }
    return count;
  }

  private containsSpotId(spotIds: string[], spotId: string): boolean {
    return spotIds.indexOf(spotId) >= 0;
  }

  private findSpot(spots: ScenicSpot[], spotId: string): ScenicSpot | undefined {
    for (let index = 0; index < spots.length; index++) {
      if (spots[index].id === spotId) {
        return spots[index];
      }
    }
    return undefined;
  }
}
