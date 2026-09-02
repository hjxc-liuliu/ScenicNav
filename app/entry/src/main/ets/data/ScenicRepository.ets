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

/**
 * 景区数据仓储。正式部署时在本类中接入真实 REST API，页面层无需改动。
 */
export class ScenicRepository {
  private crowdScenario: string = '常态';
  private crowdTick: number = 0;

  async login(account: string, password: string): Promise<ApiResponse<string>> {
    const allowed = (account === 'tourist' || account === 'admin') && password === '123456';
    const role = account === 'admin' ? 'admin' : 'tourist';
    const response: ApiResponse<string> = {
      code: allowed ? 0 : 401,
      message: allowed ? (role === 'admin' ? '管理员登录成功' : '游客登录成功') : '账号或密码不正确',
      data: allowed ? `mock-token-${role}-001` : '',
      traceId: 'login-demo-001'
    };
    return Promise.resolve<ApiResponse<string>>(response);
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
}
