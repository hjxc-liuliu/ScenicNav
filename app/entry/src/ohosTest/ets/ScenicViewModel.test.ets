import { describe, expect, it } from '@ohos/hypium';
import { CrowdSnapshot, DEMO_SPOTS, ItineraryPlan, ItineraryProfile } from '../../main/ets/common/Models';
import { ScenicViewModel } from '../../main/ets/viewmodel/ScenicViewModel';

export default function scenicViewModelTest(): void {
  describe('ScenicViewModel', () => {
    const viewModel = new ScenicViewModel();

    it('formats ticket price in yuan', 0, () => {
      expect(viewModel.formatPrice(128)).assertEqual('￥128.00');
    });

    it('selects a matching leisure route', 0, () => {
      expect(viewModel.recommendRoute('休闲').id).assertEqual('leisure');
    });

    it('estimates wait safely when service is unavailable', 0, () => {
      expect(viewModel.estimatedWait(10, 0)).assertEqual(0);
    });

    it('maps crowd percent to four heat levels', 0, () => {
      expect(viewModel.crowdLevel(45)).assertEqual('畅通');
      expect(viewModel.crowdLevel(70)).assertEqual('适中');
      expect(viewModel.crowdLevel(85)).assertEqual('拥挤');
      expect(viewModel.crowdLevel(86)).assertEqual('严重拥挤');
    });

    it('builds an itinerary within the visitor time budget', 0, () => {
      const profile: ItineraryProfile = { durationMinutes: 120, interestTags: ['文化'] };
      const plan = viewModel.generateItinerary(profile, DEMO_SPOTS, viewModel.repository.crowdSnapshots());
      expect(plan.spotIds.length > 0 ? 1 : 0).assertEqual(1);
      expect(plan.durationMinutes <= profile.durationMinutes ? 1 : 0).assertEqual(1);
    });

    it('avoids a forecast high-crowd attraction when alternatives exist', 0, () => {
      const profile: ItineraryProfile = { durationMinutes: 240, interestTags: ['文化'] };
      viewModel.repository.setCrowdScenario('断桥高峰');
      const plan = viewModel.generateItinerary(profile, DEMO_SPOTS, viewModel.repository.crowdSnapshots());
      expect(plan.spotIds.indexOf('broken_bridge') < 0 ? 1 : 0).assertEqual(1);
      viewModel.repository.setCrowdScenario('常态');
    });

    it('replans only future high-crowd stops and keeps completed stops', 0, () => {
      const profile: ItineraryProfile = { durationMinutes: 240, interestTags: ['文化'] };
      viewModel.repository.setCrowdScenario('常态');
      const initial = viewModel.generateItinerary(profile, DEMO_SPOTS, viewModel.repository.crowdSnapshots());
      viewModel.repository.setCrowdScenario('断桥高峰');
      const replanned = viewModel.replanItinerary(initial, 1, profile, DEMO_SPOTS, viewModel.repository.crowdSnapshots());
      expect(replanned.plan.spotIds[0]).assertEqual(initial.spotIds[0]);
      expect(replanned.changed ? 1 : 0).assertEqual(1);
    });

    it('keeps the original route when no low-crowd replacement is available', 0, () => {
      const profile: ItineraryProfile = { durationMinutes: 120, interestTags: ['文化'] };
      const allHigh: CrowdSnapshot[] = [];
      for (let index = 0; index < DEMO_SPOTS.length; index++) {
        allHigh.push({
          spotId: DEMO_SPOTS[index].id,
          currentPercent: 90,
          forecastPercent: 92,
          trend: '上升',
          updatedAt: '刚刚'
        });
      }
      const plan: ItineraryPlan = {
        id: 'test-plan',
        title: '测试路线',
        spotIds: ['broken_bridge', 'solitary_hill'],
        durationMinutes: 90,
        comfortScore: 8,
        avoidedSpotNames: [],
        savedWaitMinutes: 0,
        explanation: '测试',
        generatedAt: '刚刚'
      };
      const replanned = viewModel.replanItinerary(plan, 0, profile, DEMO_SPOTS, allHigh);
      expect(replanned.changed ? 1 : 0).assertEqual(0);
    });
  });
}
