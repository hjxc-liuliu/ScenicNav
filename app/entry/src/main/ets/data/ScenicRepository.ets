import {
  http
} from '@kit.NetworkKit';
import {
  API_BASE_URLS
} from '../config/ApiConfig';
import {
  ApiResponse,
  CrowdSnapshot,
  DEMO_MERCHANTS,
  DEMO_PRODUCTS,
  DEMO_PROJECTS,
  DEMO_ROUTES,
  DEMO_SPOTS,
  DEMO_TICKETS,
  MallProduct,
  MerchantItem,
  ProjectReservation,
  RecommendedRoute,
  ScenicSpot,
  TicketOrder,
  TicketProduct
} from '../common/Models';

interface ApiEnvelope {
  code: number;
  message: string;
  data: Object;
  traceId: string;
}

interface LoginUser {
  account: string;
  nickname: string;
  roleCode: string;
  roleName: string;
  passwordHash: string;
  points: number;
}

const DEMO_LOGIN_USERS: LoginUser[] = [
  {
    account: 'tourist',
    nickname: '旅行者',
    roleCode: 'TOURIST',
    roleName: '游客',
    passwordHash: 'demo-password-123456',
    points: 320
  },
  {
    account: 'admin',
    nickname: '景区管理员',
    roleCode: 'ADMIN',
    roleName: '管理员',
    passwordHash: 'demo-password-123456',
    points: 0
  }
];

/**
 * 景区数据仓储。正式部署时在本类中接入真实 REST API，页面层无需改动。
 */
export class ScenicRepository {
  private crowdScenario: string = '常态';
  private crowdTick: number = 0;

  async login(account: string, password: string): Promise<ApiResponse<string>> {
    const users = await this.fetchList<LoginUser>('/users/demo-accounts', DEMO_LOGIN_USERS);
    let matched: LoginUser | undefined = undefined;
    for (let index = 0; index < users.length; index++) {
      if (users[index].account === account && users[index].passwordHash === `demo-password-${password}`) {
        matched = users[index];
      }
    }
    const allowed = matched !== undefined;
    const role = matched !== undefined && matched.roleCode === 'ADMIN' ? 'admin' : 'tourist';
    const response: ApiResponse<string> = {
      code: allowed ? 0 : 401,
      message: allowed ? (role === 'admin' ? '管理员登录成功' : '游客登录成功') : '账号或密码不正确',
      data: allowed ? `mock-token-${role}-001` : '',
      traceId: 'login-demo-001'
    };
    return response;
  }

  async backendAvailable(): Promise<boolean> {
    const users = await this.fetchList<LoginUser>('/users/demo-accounts', []);
    return users.length > 0;
  }

  tickets(): TicketProduct[] {
    return DEMO_TICKETS;
  }

  spots(): ScenicSpot[] {
    return DEMO_SPOTS;
  }

  crowdSnapshots(): CrowdSnapshot[] {
    return this.buildCrowdSnapshots(0);
  }

  refreshCrowdSnapshots(): CrowdSnapshot[] {
    const offset = (this.crowdTick % 3) - 1;
    this.crowdTick = this.crowdTick + 1;
    return this.buildCrowdSnapshots(offset);
  }

  setCrowdScenario(scenario: string): void {
    this.crowdScenario = scenario;
    this.crowdTick = 0;
  }

  currentCrowdScenario(): string {
    return this.crowdScenario;
  }

  crowdScenarios(): string[] {
    return ['常态', '断桥高峰', '雷峰塔高峰'];
  }

  routes(): RecommendedRoute[] {
    return DEMO_ROUTES;
  }

  projects(): ProjectReservation[] {
    return DEMO_PROJECTS;
  }

  merchants(): MerchantItem[] {
    return DEMO_MERCHANTS;
  }

  products(): MallProduct[] {
    return DEMO_PRODUCTS;
  }

  async loadTickets(): Promise<TicketProduct[]> {
    const rows = await this.fetchList<TicketProduct>('/tickets', []);
    if (rows.length === 0) {
      return DEMO_TICKETS;
    }
    const tickets: TicketProduct[] = [];
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const fallback = index < DEMO_TICKETS.length ? DEMO_TICKETS[index] : DEMO_TICKETS[0];
      tickets.push({
        id: row.id,
        name: row.name,
        price: row.price / 100,
        remaining: row.remaining,
        description: row.description,
        startAt: row.startAt.length > 0 ? row.startAt : fallback.startAt,
        endAt: row.endAt.length > 0 ? row.endAt : fallback.endAt
      });
    }
    return tickets;
  }

  async loadSpots(): Promise<ScenicSpot[]> {
    const rows = await this.fetchList<ScenicSpot>('/guide/spots', []);
    if (rows.length === 0) {
      return DEMO_SPOTS;
    }
    const spots: ScenicSpot[] = [];
    for (let index = 0; index < rows.length; index++) {
      const fallback = index < DEMO_SPOTS.length ? DEMO_SPOTS[index] : DEMO_SPOTS[0];
      const row = rows[index];
      spots.push({
        id: row.id,
        name: row.name,
        subtitle: row.subtitle,
        imageName: fallback.imageName,
        crowdLevel: this.crowdLevelFromPercent(row.crowdPercent),
        crowdPercent: row.crowdPercent,
        x: fallback.x,
        y: fallback.y,
        audioMinutes: fallback.audioMinutes,
        interestTags: fallback.interestTags,
        stayMinutes: fallback.stayMinutes,
        longitude: row.longitude > 0 ? row.longitude : fallback.longitude,
        latitude: row.latitude > 0 ? row.latitude : fallback.latitude
      });
    }
    return spots;
  }

  async loadRoutes(): Promise<RecommendedRoute[]> {
    const rows = await this.fetchList<Record<string, Object>>('/guide/routes', []);
    if (rows.length === 0) {
      return DEMO_ROUTES;
    }
    const routes: RecommendedRoute[] = [];
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      routes.push({
        id: row['id'] as string,
        title: row['title'] as string,
        duration: `${row['durationMinutes'] as number} 分钟`,
        distance: `${((row['distanceMeters'] as number) / 1000).toFixed(1)} km`,
        tags: row['tags'] as string[],
        spots: row['spotIds'] as string[]
      });
    }
    return routes;
  }

  async loadProjects(): Promise<ProjectReservation[]> {
    const rows = await this.fetchList<Record<string, Object>>('/reservations/projects', []);
    if (rows.length === 0) {
      return DEMO_PROJECTS;
    }
    const projects: ProjectReservation[] = [];
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      projects.push({
        id: row['projectId'] as string,
        name: row['name'] as string,
        category: row['description'] as string,
        venue: '景区服务点',
        startTime: row['startTime'] as string,
        endTime: row['endTime'] as string,
        startAt: row['startAt'] as string,
        endAt: row['endAt'] as string,
        waitMinutes: 20,
        queueSize: 30,
        remaining: row['remaining'] as number,
        capacity: row['capacity'] as number,
        reminderMinutes: 15,
        fastPassPrice: (row['fastPassPrice'] as number) / 100,
        fastPassRemaining: row['fastPassRemaining'] as number,
        fastPassCapacity: row['fastPassCapacity'] as number
      });
    }
    return projects;
  }

  async loadMerchants(): Promise<MerchantItem[]> {
    const rows = await this.fetchList<MerchantItem>('/merchants', []);
    if (rows.length === 0) {
      return DEMO_MERCHANTS;
    }
    const merchants: MerchantItem[] = [];
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const fallback = index < DEMO_MERCHANTS.length ? DEMO_MERCHANTS[index] : DEMO_MERCHANTS[0];
      merchants.push({
        id: row.id,
        name: row.name,
        category: row.category === 'HOTEL' ? '住宿' : '餐饮',
        priceText: row.priceText,
        rating: row.rating,
        description: row.description,
        offerTitle: fallback.offerTitle,
        offerDetails: fallback.offerDetails,
        facilities: fallback.facilities,
        reviewCount: fallback.reviewCount,
        latestReview: fallback.latestReview,
        reviewTime: fallback.reviewTime,
        bookingStartAt: row.bookingStartAt.length > 0 ? row.bookingStartAt : fallback.bookingStartAt,
        bookingEndAt: row.bookingEndAt.length > 0 ? row.bookingEndAt : fallback.bookingEndAt
      });
    }
    return merchants;
  }

  async loadProducts(): Promise<MallProduct[]> {
    const rows = await this.fetchList<MallProduct>('/mall/products', []);
    if (rows.length === 0) {
      return DEMO_PRODUCTS;
    }
    const products: MallProduct[] = [];
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      products.push({
        id: row.id,
        name: row.name,
        price: row.price / 100,
        points: row.points,
        description: row.description
      });
    }
    return products;
  }

  createTicketOrder(ticket: TicketProduct, visitDate: string): TicketOrder {
    const order: TicketOrder = {
      id: `T${Date.now()}`,
      ticketName: ticket.name,
      visitDate,
      totalPrice: ticket.price,
      status: '已支付',
      qrPayload: `SCENICNAV|${ticket.id}|${visitDate}|${Date.now()}`
    };
    return order;
  }

  private buildCrowdSnapshots(offset: number): CrowdSnapshot[] {
    if (this.crowdScenario === '断桥高峰') {
      return this.withCrowdOffset([
        { spotId: 'broken_bridge', currentPercent: 91, forecastPercent: 94, trend: '上升', updatedAt: '刚刚' },
        { spotId: 'solitary_hill', currentPercent: 64, forecastPercent: 69, trend: '上升', updatedAt: '刚刚' },
        { spotId: 'quyuan', currentPercent: 29, forecastPercent: 35, trend: '平稳', updatedAt: '刚刚' },
        { spotId: 'sudi', currentPercent: 48, forecastPercent: 52, trend: '平稳', updatedAt: '刚刚' },
        { spotId: 'flower_harbor', currentPercent: 33, forecastPercent: 38, trend: '平稳', updatedAt: '刚刚' },
        { spotId: 'leifeng_pagoda', currentPercent: 58, forecastPercent: 62, trend: '下降', updatedAt: '刚刚' }
      ], offset);
    }
    if (this.crowdScenario === '雷峰塔高峰') {
      return this.withCrowdOffset([
        { spotId: 'broken_bridge', currentPercent: 61, forecastPercent: 66, trend: '平稳', updatedAt: '刚刚' },
        { spotId: 'solitary_hill', currentPercent: 45, forecastPercent: 50, trend: '下降', updatedAt: '刚刚' },
        { spotId: 'quyuan', currentPercent: 28, forecastPercent: 33, trend: '平稳', updatedAt: '刚刚' },
        { spotId: 'sudi', currentPercent: 48, forecastPercent: 52, trend: '平稳', updatedAt: '刚刚' },
        { spotId: 'flower_harbor', currentPercent: 43, forecastPercent: 48, trend: '上升', updatedAt: '刚刚' },
        { spotId: 'leifeng_pagoda', currentPercent: 89, forecastPercent: 93, trend: '上升', updatedAt: '刚刚' }
      ], offset);
    }
    return this.withCrowdOffset([
      { spotId: 'broken_bridge', currentPercent: 56, forecastPercent: 62, trend: '上升', updatedAt: '刚刚' },
      { spotId: 'solitary_hill', currentPercent: 46, forecastPercent: 48, trend: '平稳', updatedAt: '刚刚' },
      { spotId: 'quyuan', currentPercent: 26, forecastPercent: 30, trend: '下降', updatedAt: '刚刚' },
      { spotId: 'sudi', currentPercent: 42, forecastPercent: 47, trend: '平稳', updatedAt: '刚刚' },
      { spotId: 'flower_harbor', currentPercent: 30, forecastPercent: 34, trend: '下降', updatedAt: '刚刚' },
      { spotId: 'leifeng_pagoda', currentPercent: 55, forecastPercent: 61, trend: '平稳', updatedAt: '刚刚' }
    ], offset);
  }

  private withCrowdOffset(snapshots: CrowdSnapshot[], offset: number): CrowdSnapshot[] {
    const result: CrowdSnapshot[] = [];
    for (let index = 0; index < snapshots.length; index++) {
      const snapshot = snapshots[index];
      result.push({
        spotId: snapshot.spotId,
        currentPercent: Math.max(0, Math.min(100, snapshot.currentPercent + offset)),
        forecastPercent: snapshot.forecastPercent,
        trend: snapshot.trend,
        updatedAt: snapshot.updatedAt
      });
    }
    return result;
  }

  private async fetchList<T>(path: string, fallback: T[]): Promise<T[]> {
    for (let index = 0; index < API_BASE_URLS.length; index++) {
      const request = http.createHttp();
      try {
        const response = await request.request(`${API_BASE_URLS[index]}${path}`, {
          method: http.RequestMethod.GET,
          header: {
            'Content-Type': 'application/json'
          },
          readTimeout: 3000,
          connectTimeout: 3000
        });
        const raw = typeof response.result === 'string' ? response.result : JSON.stringify(response.result);
        const envelope = JSON.parse(raw) as ApiEnvelope;
        if (envelope.code === 0) {
          return envelope.data as T[];
        }
      } catch (error) {
        continue;
      }
    }
    return fallback;
  }

  private crowdLevelFromPercent(percent: number): string {
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
}
