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
    interestTags: string[];
    stayMinutes: number;
}
export interface RecommendedRoute {
    id: string;
    title: string;
    duration: string;
    distance: string;
    tags: string[];
    spots: string[];
}
export interface CrowdSnapshot {
    spotId: string;
    currentPercent: number;
    forecastPercent: number;
    trend: string;
    updatedAt: string;
}
export interface ItineraryProfile {
    durationMinutes: number;
    interestTags: string[];
}
export interface ItineraryPlan {
    id: string;
    title: string;
    spotIds: string[];
    durationMinutes: number;
    comfortScore: number;
    avoidedSpotNames: string[];
    savedWaitMinutes: number;
    explanation: string;
    generatedAt: string;
}
export interface ItineraryReplanResult {
    plan: ItineraryPlan;
    changed: boolean;
    reason: string;
}
export interface ProjectReservation {
    id: string;
    name: string;
    category: string;
    venue: string;
    startTime: string;
    waitMinutes: number;
    queueSize: number;
    remaining: number;
    capacity: number;
    reminderMinutes: number;
    fastPassPrice: number;
}
export interface ProjectBooking {
    projectId: string;
    fastPass: boolean;
    reminderEnabled: boolean;
    status: string;
}
export interface ScenicFacility {
    id: string;
    name: string;
    type: string;
    area: string;
    status: string;
    usage: string;
    description: string;
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
export interface AdminOrderRecord {
    id: string;
    visitor: string;
    item: string;
    amount: number;
    status: string;
    time: string;
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
    { id: 'boat', name: '西湖环湖游船票', price: 55, remaining: 128, description: '花港码头登船，含湖上讲解（演示）' },
    { id: 'leifeng', name: '雷峰塔参观票', price: 40, remaining: 76, description: '分时入塔，含电子验票码（演示）' },
    { id: 'premium', name: '西湖优享联票', price: 128, remaining: 36, description: '游船、讲解与快速通行权益组合（演示）' }
];
export const DEMO_SPOTS: ScenicSpot[] = [
    { id: 'broken_bridge', name: '断桥残雪', subtitle: '白堤东端的经典湖景点位', crowdLevel: '较拥挤', crowdPercent: 86, x: 76, y: 12, audioMinutes: 5, interestTags: ['文化', '摄影'], stayMinutes: 32 },
    { id: 'solitary_hill', name: '孤山', subtitle: '西湖中最大的天然岛屿', crowdLevel: '适中', crowdPercent: 58, x: 50, y: 25, audioMinutes: 6, interestTags: ['文化', '摄影', '休闲'], stayMinutes: 36 },
    { id: 'quyuan', name: '曲院风荷', subtitle: '北山西侧的荷风景观', crowdLevel: '畅通', crowdPercent: 35, x: 7, y: 34, audioMinutes: 4, interestTags: ['自然', '摄影', '亲子'], stayMinutes: 30 },
    { id: 'sudi', name: '苏堤春晓', subtitle: '贯穿湖面的长堤慢行线', crowdLevel: '适中', crowdPercent: 61, x: 31, y: 49, audioMinutes: 7, interestTags: ['休闲', '自然', '文化'], stayMinutes: 38 },
    { id: 'flower_harbor', name: '花港观鱼', subtitle: '南端园林与亲子游览区', crowdLevel: '畅通', crowdPercent: 42, x: 11, y: 75, audioMinutes: 5, interestTags: ['亲子', '自然', '摄影'], stayMinutes: 34 },
    { id: 'leifeng_pagoda', name: '雷峰塔', subtitle: '夕照山上的南岸地标', crowdLevel: '繁忙', crowdPercent: 74, x: 69, y: 73, audioMinutes: 8, interestTags: ['文化', '摄影'], stayMinutes: 42 }
];
export const DEMO_ROUTES: RecommendedRoute[] = [
    { id: 'family', title: '亲子自然线', duration: '2.5 小时', distance: '3.6 km', tags: ['亲子', '平缓'], spots: ['曲院风荷', '苏堤春晓', '花港观鱼'] },
    { id: 'culture', title: '湖畔人文线', duration: '3 小时', distance: '4.1 km', tags: ['人文', '讲解'], spots: ['断桥残雪', '白堤', '平湖秋月', '孤山'] },
    { id: 'leisure', title: '南山慢游线', duration: '1.8 小时', distance: '2.8 km', tags: ['休闲', '避拥'], spots: ['柳浪闻莺', '雷峰塔', '花港观鱼'] }
];
export const DEMO_PROJECTS: ProjectReservation[] = [
    { id: 'boat', name: '西湖环湖游船', category: '游船', venue: '花港码头', startTime: '10:30', waitMinutes: 28, queueSize: 46, remaining: 18, capacity: 60, reminderMinutes: 15, fastPassPrice: 18 },
    { id: 'night_show', name: '西湖夜游沉浸演出', category: '演出', venue: '湖滨演示舞台', startTime: '19:30', waitMinutes: 16, queueSize: 23, remaining: 56, capacity: 120, reminderMinutes: 30, fastPassPrice: 28 },
    { id: 'nature_class', name: '花港亲子自然课堂', category: '亲子活动', venue: '花港观鱼草坪', startTime: '14:20', waitMinutes: 12, queueSize: 15, remaining: 9, capacity: 30, reminderMinutes: 10, fastPassPrice: 12 },
    { id: 'tower_tour', name: '雷峰塔深度讲解团', category: '讲解', venue: '雷峰塔东侧集合点', startTime: '15:40', waitMinutes: 34, queueSize: 42, remaining: 14, capacity: 35, reminderMinutes: 15, fastPassPrice: 20 }
];
export const DEMO_FACILITIES: ScenicFacility[] = [
    { id: 'monitor', name: '断桥客流监测点', type: '客流设施', area: '白堤东端', status: '关注中', usage: '86% 客流热度', description: '高峰期自动触发分流提示' },
    { id: 'shuttle', name: '苏堤观光接驳站', type: '交通设施', area: '苏堤北口', status: '正常', usage: '下一班 8 分钟', description: '无障碍与亲子优先候车位' },
    { id: 'service', name: '花港亲子服务站', type: '服务设施', area: '花港观鱼', status: '正常', usage: '服务中 12 人', description: '母婴室、饮水、失物招领' },
    { id: 'tower_entry', name: '雷峰塔讲解集合点', type: '活动设施', area: '雷峰塔东侧', status: '繁忙', usage: '队列 42 人', description: '讲解团核验与快速通行核验' },
    { id: 'visitor_center', name: '湖滨游客服务中心', type: '服务设施', area: '湖滨三公园', status: '正常', usage: '满意度 4.8', description: '咨询、投诉受理与寄存服务' },
    { id: 'toilet', name: '花港东门公厕', type: '基础设施', area: '花港观鱼', status: '正常', usage: '空闲 6 位', description: '无障碍与母婴设施已开放' }
];
export const DEMO_MERCHANTS: MerchantItem[] = [
    { id: 'hotel', name: '湖畔精品酒店', category: '住宿', priceText: '￥468 起 / 晚', rating: 4.8, description: '步行可达湖滨，含双早（演示商家）' },
    { id: 'homestay', name: '南山慢屋民宿', category: '住宿', priceText: '￥328 起 / 晚', rating: 4.7, description: '南山路周边，提供亲子房型（演示商家）' },
    { id: 'restaurant', name: '西湖味道餐厅', category: '餐饮', priceText: '￥88 起 / 人', rating: 4.9, description: '杭帮菜套餐，支持到店核销（演示商家）' }
];
export const DEMO_PRODUCTS: MallProduct[] = [
    { id: 'tea', name: '西湖龙井礼盒', price: 128, points: 128, description: '西湖主题文创礼盒，支持邮寄到家（演示）' },
    { id: 'bookmark', name: '雷峰塔金属书签', price: 32, points: 32, description: '西湖十景系列文创' },
    { id: 'bag', name: '西湖十景帆布包', price: 69, points: 69, description: '轻便环保，适合旅行收纳' },
    { id: 'postcard', name: '断桥残雪明信片套装', price: 24, points: 24, description: '含四张景区主题明信片' }
];
export const DEMO_ADMIN_ORDERS: AdminOrderRecord[] = [
    { id: 'A2026090201', visitor: '游客 186****0901', item: '西湖环湖游船票', amount: 55, status: '已支付', time: '09:12' },
    { id: 'A2026090202', visitor: '游客 137****2058', item: '雷峰塔深度讲解团 + 快速通行', amount: 60, status: '待入场', time: '09:18' },
    { id: 'A2026090203', visitor: '游客 139****6670', item: '西湖优享联票', amount: 128, status: '已支付', time: '09:26' },
    { id: 'A2026090204', visitor: '游客 158****8316', item: '花港亲子自然课堂', amount: 0, status: '待提醒', time: '09:33' }
];
export const DEMO_CHAT_MESSAGES: ChatMessage[] = [
    { id: 'chat-1', sender: '客服小湖', content: '您好，我是西湖景区在线客服。电子票、预约排队和路线问题都可以问我。', time: '09:20' },
    { id: 'chat-2', sender: '游客', content: '断桥人多吗？', time: '09:21' },
    { id: 'chat-3', sender: '客服小湖', content: '断桥当前热度为 86%，建议先走南山慢游线，避开上午高峰，15:00 后再前往断桥。', time: '09:21' }
];
export const DEMO_HISTORY_RECORDS: VisitorHistoryRecord[] = [
    { id: 'history-1', type: '导览', title: '苏堤春晓', detail: '完成 7 分钟图文讲解', time: '今天 09:06' },
    { id: 'history-2', type: '路线', title: '亲子自然线', detail: '已生成 2.5 小时游览方案', time: '今天 09:02' },
    { id: 'history-3', type: '预约', title: '西湖环湖游船', detail: '查看了 10:30 时段余位', time: '昨天 16:18' },
    { id: 'history-4', type: '商城', title: '雷峰塔金属书签', detail: '浏览过景区文创商品', time: '昨天 16:10' }
];
