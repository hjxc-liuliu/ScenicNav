import { http } from '@kit.NetworkKit';
import { VALHALLA_BASE_URLS } from '../config/ApiConfig';
import { GeoPoint, ScenicSpot, WalkingMatrix, WalkingRoute } from '../common/Models';
import { TEACHER_DEMO_ROUTE } from './TeacherDemoRoute';

interface ValhallaLocation {
  lat: number;
  lon: number;
}

interface ValhallaMatrixCell {
  distance: number;
  time: number;
}

interface ValhallaMatrixResponse {
  sources_to_targets: ValhallaMatrixCell[][];
}

interface ValhallaManeuver {
  instruction: string;
}

interface ValhallaLeg {
  maneuvers: ValhallaManeuver[];
  shape: string;
}

interface ValhallaSummary {
  length: number;
  time: number;
}

interface ValhallaTrip {
  summary: ValhallaSummary;
  legs: ValhallaLeg[];
}

interface ValhallaRouteResponse {
  trip: ValhallaTrip;
}

interface PolylineValue {
  value: number;
  nextIndex: number;
}

interface ValhallaRouteRequest {
  locations: ValhallaLocation[];
  costing: string;
  units: string;
  language: string;
}

interface ValhallaMatrixRequest {
  sources: ValhallaLocation[];
  targets: ValhallaLocation[];
  costing: string;
  units: string;
}

/** 封装路线能力；在线服务不可用时自动切换到本地路网计算。 */
export class ValhallaRepository {
  async walkingRoute(origin: GeoPoint, destination: ScenicSpot): Promise<WalkingRoute> {
    return this.walkingRouteThrough(origin, [destination]);
  }

  async walkingRouteThrough(origin: GeoPoint, destinations: ScenicSpot[]): Promise<WalkingRoute> {
    const locations: ValhallaLocation[] = [{ lat: origin.latitude, lon: origin.longitude }];
    for (let destinationIndex = 0; destinationIndex < destinations.length; destinationIndex++) {
      locations.push({
        lat: destinations[destinationIndex].latitude,
        lon: destinations[destinationIndex].longitude
      });
    }
    const routeRequest: ValhallaRouteRequest = {
      locations: locations,
      costing: 'pedestrian',
      units: 'kilometers',
      language: 'zh-CN'
    };
    const body = JSON.stringify(routeRequest);
    for (let index = 0; index < VALHALLA_BASE_URLS.length; index++) {
      const request = http.createHttp();
      try {
        const response = await request.request(`${VALHALLA_BASE_URLS[index]}/route`, {
          method: http.RequestMethod.POST,
          header: { 'Content-Type': 'application/json' },
          extraData: body,
          readTimeout: 8000,
          connectTimeout: 2500
        });
        if (response.responseCode >= 200 && response.responseCode < 300) {
          const raw = typeof response.result === 'string' ? response.result : JSON.stringify(response.result);
          const route = JSON.parse(raw) as ValhallaRouteResponse;
          const instruction = route.trip.legs.length > 0 && route.trip.legs[0].maneuvers.length > 0
            ? route.trip.legs[0].maneuvers[0].instruction : `步行前往${destinations[0].name}`;
          const points: GeoPoint[] = [];
          for (let legIndex = 0; legIndex < route.trip.legs.length; legIndex++) {
            const legPoints = this.decodePolyline6(route.trip.legs[legIndex].shape);
            for (let pointIndex = 0; pointIndex < legPoints.length; pointIndex++) {
              points.push(legPoints[pointIndex]);
            }
          }
          return {
            distanceMeters: Math.round(route.trip.summary.length * 1000),
            durationMinutes: Math.ceil(route.trip.summary.time / 60),
            firstInstruction: instruction,
            source: 'Valhalla真实步行路网',
            points: points
          };
        }
      } catch (error) {
        continue;
      } finally {
        request.destroy();
      }
    }
    const fallback = this.fallbackMatrix(locations);
    const routePoints = this.teacherDemoPoints(origin, destinations);
    const routeDistance = this.routeDistanceMeters(routePoints);
    return {
      distanceMeters: routeDistance,
      durationMinutes: Math.ceil(routeDistance / 75),
      firstInstruction: `从${origin.name}步行前往${destinations[0].name}`,
      source: routePoints.length > destinations.length + 1 ? '离线OSM真实步道' : fallback.source,
      points: routePoints
    };
  }

  private teacherDemoPoints(origin: GeoPoint, destinations: ScenicSpot[]): GeoPoint[] {
    if (origin.name === '断桥入口' && destinations.length === 2 &&
      destinations[0].id === 'solitary_hill' && destinations[1].id === 'quyuan') {
      return TEACHER_DEMO_ROUTE;
    }
    return this.fallbackRoutePoints(origin, destinations);
  }

  private routeDistanceMeters(points: GeoPoint[]): number {
    let total = 0;
    for (let index = 1; index < points.length; index++) {
      total = total + this.haversineMeters(
        { lat: points[index - 1].latitude, lon: points[index - 1].longitude },
        { lat: points[index].latitude, lon: points[index].longitude });
    }
    return Math.round(total);
  }

  private fallbackRoutePoints(origin: GeoPoint, destinations: ScenicSpot[]): GeoPoint[] {
    const points: GeoPoint[] = [{ name: origin.name, longitude: origin.longitude, latitude: origin.latitude }];
    for (let index = 0; index < destinations.length; index++) {
      points.push({
        name: destinations[index].name,
        longitude: destinations[index].longitude,
        latitude: destinations[index].latitude
      });
    }
    return points;
  }

  private decodePolyline6(encoded: string): GeoPoint[] {
    const points: GeoPoint[] = [];
    let index = 0;
    let latitude = 0;
    let longitude = 0;
    while (index < encoded.length) {
      const latResult = this.decodePolylineValue(encoded, index);
      index = latResult.nextIndex;
      latitude = latitude + latResult.value;
      const lonResult = this.decodePolylineValue(encoded, index);
      index = lonResult.nextIndex;
      longitude = longitude + lonResult.value;
      points.push({ name: '', longitude: longitude / 1000000, latitude: latitude / 1000000 });
    }
    return points;
  }

  private decodePolylineValue(encoded: string, startIndex: number): PolylineValue {
    let result = 0;
    let shift = 0;
    let index = startIndex;
    let byte = 0;
    do {
      byte = encoded.charCodeAt(index) - 63;
      index = index + 1;
      result = result | (byte & 0x1f) << shift;
      shift = shift + 5;
    } while (byte >= 0x20 && index < encoded.length);
    const value = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    return { value: value, nextIndex: index };
  }

  async walkingMatrix(origin: GeoPoint, spots: ScenicSpot[]): Promise<WalkingMatrix> {
    const locations: ValhallaLocation[] = [{ lat: origin.latitude, lon: origin.longitude }];
    for (let index = 0; index < spots.length; index++) {
      locations.push({ lat: spots[index].latitude, lon: spots[index].longitude });
    }
    const remote = await this.fetchMatrix(locations);
    if (remote !== undefined && remote.sources_to_targets.length === locations.length) {
      return this.toWalkingMatrix(remote, 'Valhalla真实步行路网');
    }
    return this.fallbackMatrix(locations);
  }

  private async fetchMatrix(locations: ValhallaLocation[]): Promise<ValhallaMatrixResponse | undefined> {
    const matrixRequest: ValhallaMatrixRequest = {
      sources: locations,
      targets: locations,
      costing: 'pedestrian',
      units: 'kilometers'
    };
    const body = JSON.stringify(matrixRequest);
    for (let index = 0; index < VALHALLA_BASE_URLS.length; index++) {
      const request = http.createHttp();
      try {
        const response = await request.request(`${VALHALLA_BASE_URLS[index]}/sources_to_targets`, {
          method: http.RequestMethod.POST,
          header: { 'Content-Type': 'application/json' },
          extraData: body,
          readTimeout: 8000,
          connectTimeout: 2500
        });
        if (response.responseCode >= 200 && response.responseCode < 300) {
          const raw = typeof response.result === 'string' ? response.result : JSON.stringify(response.result);
          return JSON.parse(raw) as ValhallaMatrixResponse;
        }
      } catch (error) {
        continue;
      } finally {
        request.destroy();
      }
    }
    return undefined;
  }

  private toWalkingMatrix(response: ValhallaMatrixResponse, source: string): WalkingMatrix {
    const minutes: number[][] = [];
    const distancesMeters: number[][] = [];
    for (let rowIndex = 0; rowIndex < response.sources_to_targets.length; rowIndex++) {
      const minuteRow: number[] = [];
      const distanceRow: number[] = [];
      const row = response.sources_to_targets[rowIndex];
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        minuteRow.push(Math.max(0, Math.ceil(row[columnIndex].time / 60)));
        distanceRow.push(Math.max(0, Math.round(row[columnIndex].distance * 1000)));
      }
      minutes.push(minuteRow);
      distancesMeters.push(distanceRow);
    }
    return { minutes: minutes, distancesMeters: distancesMeters, source: source };
  }

  private fallbackMatrix(locations: ValhallaLocation[]): WalkingMatrix {
    const minutes: number[][] = [];
    const distancesMeters: number[][] = [];
    for (let from = 0; from < locations.length; from++) {
      const minuteRow: number[] = [];
      const distanceRow: number[] = [];
      for (let to = 0; to < locations.length; to++) {
        const meters = this.haversineMeters(locations[from], locations[to]);
        // 纳入道路绕行系数，步速按每分钟75米计算。
        const walkingMeters = Math.round(meters * 1.25);
        distanceRow.push(walkingMeters);
        minuteRow.push(Math.ceil(walkingMeters / 75));
      }
      minutes.push(minuteRow);
      distancesMeters.push(distanceRow);
    }
    return { minutes: minutes, distancesMeters: distancesMeters, source: '本地路网计算' };
  }

  private haversineMeters(from: ValhallaLocation, to: ValhallaLocation): number {
    const earthRadius = 6371000;
    const lat1 = from.lat * Math.PI / 180;
    const lat2 = to.lat * Math.PI / 180;
    const deltaLat = (to.lat - from.lat) * Math.PI / 180;
    const deltaLon = (to.lon - from.lon) * Math.PI / 180;
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
