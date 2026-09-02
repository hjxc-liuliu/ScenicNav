export interface TicketProduct {
  id: string;
  name: string;
  price: number;
  remaining: number;
  description: string;
}

export interface ScenicSpot {
  id: string;
  name: string;
  subtitle: string;
  crowdLevel: string;
  crowdPercent: number;
  x: number;
  y: number;
  audioMinutes: number;
}

export interface RecommendedRoute {
  id: string;
  title: string;
  duration: string;
  distance: string;
  tags: string[];
  spots: string[];
}

export interface ProjectReservation {
  id: string;
  name: string;
  startTime: string;
  waitMinutes: number;
  remaining: number;
  fastPassPrice: number;
}

export interface MerchantItem {
  id: string;
  name: string;
  category: string;
  priceText: string;
  rating: number;
  description: string;
}

export interface MallProduct {
  id: string;
  name: string;
  price: number;
  points: number;
  description: string;
}

export interface TicketOrder {
  id: string;
  ticketName: string;
  visitDate: string;
  totalPrice: number;
  status: string;
  qrPayload: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  time: string;
}

export interface VisitorHistoryRecord {
  id: string;
  type: string;
  title: string;
  detail: string;
  time: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  traceId: string;
}

export const DEMO_TICKETS: TicketProduct[] = [
  { id: 'adult', name: '成人全日票', price: 128, remaining: 256, description: '含核心景点与观光接驳' },
  { id: 'student', name: '学生优惠票', price: 78, remaining: 88, description: '入园时出示有效学生证' },
  { id: 'family', name: '亲子家庭套票', price: 298, remaining: 32, description: '两大一小，含儿童互动体验' }
];

export const DEMO_SPOTS: ScenicSpot[] = [
  { id: 'gate', name: '云栖主入口', subtitle: '电子票扫码入园', crowdLevel: '畅通', crowdPercent: 20, x: 28, y: 190, audioMinutes: 2 },
  { id: 'waterfall', name: '飞瀑观景台', subtitle: '落差 68 米的瀑布群', crowdLevel: '适中', crowdPercent: 52, x: 170, y: 76, audioMinutes: 4 },
  { id: 'forest', name: '云杉栈道', subtitle: '森林慢行与吸氧体验', crowdLevel: '畅通', crowdPercent: 31, x: 258, y: 144, audioMinutes: 5 },
  { id: 'culture', name: '山居文化馆', subtitle: '本地民俗与非遗展示', crowdLevel: '较拥挤', crowdPercent: 81, x: 110, y: 218, audioMinutes: 6 }
];

export const DEMO_ROUTES: RecommendedRoute[] = [
  { id: 'family', title: '亲子探索线', duration: '2.5 小时', distance: '3.2 km', tags: ['亲子', '平缓'], spots: ['云杉栈道', '山居文化馆', '自然课堂'] },
  { id: 'culture', title: '文化探秘线', duration: '3 小时', distance: '4.6 km', tags: ['人文', '讲解'], spots: ['山居文化馆', '古驿道', '飞瀑观景台'] },
  { id: 'leisure', title: '轻松漫步线', duration: '1.5 小时', distance: '2.1 km', tags: ['休闲', '避拥'], spots: ['云栖主入口', '云杉栈道', '湖畔茶舍'] }
];

export const DEMO_PROJECTS: ProjectReservation[] = [
  { id: 'rafting', name: '峡谷漂流', startTime: '10:30', waitMinutes: 35, remaining: 12, fastPassPrice: 30 },
  { id: 'show', name: '《山水云歌》实景演出', startTime: '14:00', waitMinutes: 20, remaining: 46, fastPassPrice: 20 },
  { id: 'ropeway', name: '高山索道', startTime: '15:20', waitMinutes: 48, remaining: 8, fastPassPrice: 25 }
];

export const DEMO_MERCHANTS: MerchantItem[] = [
  { id: 'hotel', name: '云栖山居酒店', category: '住宿', priceText: '￥468 起 / 晚', rating: 4.8, description: '步行 5 分钟至景区入口，含双早' },
  { id: 'homestay', name: '溪畔慢屋民宿', category: '住宿', priceText: '￥288 起 / 晚', rating: 4.7, description: '山景露台与亲子房型' },
  { id: 'restaurant', name: '山野食集', category: '餐饮', priceText: '￥68 起 / 人', rating: 4.9, description: '本地时令食材，支持到店核销' }
];

export const DEMO_PRODUCTS: MallProduct[] = [
  { id: 'tea', name: '云雾红茶礼盒', price: 99, points: 99, description: '景区联名，支持邮寄到家' },
  { id: 'bookmark', name: '飞瀑金属书签', price: 29, points: 29, description: '文创限定款' },
  { id: 'bag', name: '山水帆布包', price: 59, points: 59, description: '环保材质，轻便耐用' }
];

export const DEMO_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'chat-1', sender: '客服小云', content: '您好，我是云栖景区在线客服。电子票、预约和路线问题都可以问我。', time: '09:20' },
  { id: 'chat-2', sender: '游客', content: '文化馆人多吗？', time: '09:21' },
  { id: 'chat-3', sender: '客服小云', content: '当前文化馆拥挤度为 81%，建议先游云杉栈道，14:30 后再前往文化馆。', time: '09:21' }
];

export const DEMO_HISTORY_RECORDS: VisitorHistoryRecord[] = [
  { id: 'history-1', type: '导览', title: '飞瀑观景台', detail: '完成 4 分钟语音讲解', time: '今天 09:06' },
  { id: 'history-2', type: '路线', title: '亲子探索线', detail: '已生成 2.5 小时游览方案', time: '今天 09:02' },
  { id: 'history-3', type: '商城', title: '飞瀑金属书签', detail: '浏览过景区文创商品', time: '昨天 16:18' }
];
