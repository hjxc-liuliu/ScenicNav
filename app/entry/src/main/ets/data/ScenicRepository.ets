import {
  ApiResponse,
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
 * MVP 的本地模拟仓储。将来切换真实服务时，只替换本类中的实现，页面无需改动。
 */
export class ScenicRepository {
  async login(account: string, password: string): Promise<ApiResponse<string>> {
    const allowed = account === 'tourist' && password === '123456';
    const response: ApiResponse<string> = {
      code: allowed ? 0 : 401,
      message: allowed ? '登录成功' : '演示账号为 tourist / 123456',
      data: allowed ? 'mock-token-tourist-001' : '',
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
}
