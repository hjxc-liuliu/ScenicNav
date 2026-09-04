import {
  http
} from '@kit.NetworkKit';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import {
  AI_API_KEY,
  AI_BASE_URL,
  AI_MODEL
} from '../config/AiConfig';
import {
  AdminOrderRecord,
  BookingAddon,
  BookingRecord,
  CartItem,
  ChatMessage,
  CrowdSnapshot,
  DEMO_ADMIN_ORDERS,
  DEMO_CHAT_MESSAGES,
  DEMO_FACILITIES,
  DEMO_HISTORY_RECORDS,
  MallProduct,
  MerchantItem,
  ProjectReservation,
  ItineraryPlan,
  ItineraryProfile,
  RecommendedRoute,
  ScenicFacility,
  ScenicSpot,
  TicketProduct,
  VisitorHistoryRecord
} from '../common/Models';
import { ScenicViewModel } from '../viewmodel/ScenicViewModel';

const TAB_ITEMS: string[] = ['首页', '导览', '预约', '商城', '我的'];
const TAB_ICONS: string[] = ['⌂', '⌖', '◷', '◈', '◉'];
const ADMIN_TAB_ITEMS: string[] = ['概览', '设施', '票务', '预约', '服务'];
const ADMIN_TAB_ICONS: string[] = ['▦', '⌘', '▣', '◷', '◉'];
const ITINERARY_DURATIONS: number[] = [120, 240, 360];
const ITINERARY_INTERESTS: string[] = ['亲子', '文化', '自然', '摄影', '休闲'];

interface DeepSeekMessage {
  role: string;
  content: string;
}

interface DeepSeekThinking {
  type: string;
}

interface DeepSeekRequestBody {
  model: string;
  messages: DeepSeekMessage[];
  stream: boolean;
  thinking: DeepSeekThinking;
  max_tokens: number;
}

interface ItineraryPlanCardParameter {
  plan: ItineraryPlan;
}

@CustomDialog
struct CancelBookingDialog {
  controller?: CustomDialogController;
  bookingTitle: string = '';
  bookingType: string = '';
  bookingTimeRange: string = '';
  cancellationRule: string = '';
  onKeep: () => void = () => {};
  onConfirm: () => void = () => {};

  build() {
    Column({ space: 14 }) {
      Row({ space: 11 }) {
        Text('◷')
          .fontSize(22)
          .fontColor('#176B43')
          .width(38)
          .height(38)
          .textAlign(TextAlign.Center)
          .padding({ top: 6 })
          .backgroundColor('#E5F2E9')
          .borderRadius(19)
        Column({ space: 3 }) {
          Text('确认取消预约')
            .fontSize(19)
            .fontWeight(FontWeight.Bold)
            .fontColor(Color.White)
          Text('取消后将释放对应时段库存')
            .fontSize(12)
            .fontColor('#D9EFE1')
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
      }
      .width('100%')
      .padding(16)
      .backgroundColor('#176B43')
      .borderRadius(16)

      Column({ space: 5 }) {
        Text(this.bookingTitle)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor('#24362B')
        Text(this.bookingTimeRange)
          .fontSize(12)
          .fontColor('#587064')
        Text(`${this.bookingType} · 已确认`)
          .fontSize(12)
          .fontColor('#28764C')
      }
      .alignItems(HorizontalAlign.Start)
      .width('100%')
      .padding(14)
      .backgroundColor('#E5F2E9')
      .borderRadius(14)

      Row({ space: 9 }) {
        Text('!')
          .fontSize(14)
          .fontWeight(FontWeight.Bold)
          .fontColor('#C85C28')
          .width(22)
          .height(22)
          .textAlign(TextAlign.Center)
          .padding({ top: 2 })
          .backgroundColor('#FFE0CB')
          .borderRadius(11)
        Text(`${this.cancellationRule}，取消后库存会实时释放。`)
          .fontSize(12)
          .lineHeight(18)
          .fontColor('#9A592D')
          .layoutWeight(1)
      }
      .width('100%')
      .alignItems(VerticalAlign.Top)
      .padding(12)
      .backgroundColor('#FFF0E7')
      .borderRadius(12)

      Row({ space: 10 }) {
        Button('暂不取消')
          .layoutWeight(1)
          .height(44)
          .fontSize(14)
          .fontColor('#176B43')
          .backgroundColor('#E5F2E9')
          .borderRadius(22)
          .onClick(() => this.onKeep())
        Button('确认取消')
          .layoutWeight(1)
          .height(44)
          .fontSize(14)
          .fontColor(Color.White)
          .backgroundColor('#C85C28')
          .borderRadius(22)
          .onClick(() => this.onConfirm())
      }
      .width('100%')
    }
    .width('86%')
    .padding(12)
    .backgroundColor('#F4F8F5')
    .borderRadius(20)
    .shadow({ radius: 22, color: '#33000000', offsetX: 0, offsetY: 10 })
  }
}

@CustomDialog
struct BookingConflictDialog {
  controller?: CustomDialogController;
  existingTitle: string = '';
  existingTimeRange: string = '';
  candidateTitle: string = '';
  candidateTimeRange: string = '';
  conflictNote: string = '';
  onViewBookings: () => void = () => {};
  onReplace: () => void = () => {};

  build() {
    Column({ space: 14 }) {
      Row({ space: 11 }) {
        Text('!')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#C85C28')
          .width(38)
          .height(38)
          .textAlign(TextAlign.Center)
          .padding({ top: 7 })
          .backgroundColor('#FFF0E7')
          .borderRadius(19)
        Column({ space: 3 }) {
          Text('预约时间冲突')
            .fontSize(19)
            .fontWeight(FontWeight.Bold)
            .fontColor(Color.White)
          Text('请先处理已有行程，再确认本次预约')
            .fontSize(12)
            .fontColor('#D9EFE1')
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
      }
      .width('100%')
      .padding(16)
      .backgroundColor('#176B43')
      .borderRadius(16)

      Column({ space: 5 }) {
        Text('已有预约')
          .fontSize(12)
          .fontColor('#28764C')
        Text(this.existingTitle)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor('#24362B')
        Text(this.existingTimeRange)
          .fontSize(12)
          .fontColor('#587064')
      }
      .alignItems(HorizontalAlign.Start)
      .width('100%')
      .padding(14)
      .backgroundColor('#E5F2E9')
      .borderRadius(14)

      Column({ space: 5 }) {
        Text('本次选择')
          .fontSize(12)
          .fontColor('#B96A35')
        Text(this.candidateTitle)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor('#24362B')
        Text(this.candidateTimeRange)
          .fontSize(12)
          .fontColor('#9A592D')
      }
      .alignItems(HorizontalAlign.Start)
      .width('100%')
      .padding(14)
      .backgroundColor('#FFF0E7')
      .borderRadius(14)

      Text(this.conflictNote)
        .fontSize(12)
        .lineHeight(18)
        .fontColor('#6F7F75')
        .width('100%')

      Row({ space: 10 }) {
        Button('查看已有预约')
          .layoutWeight(1)
          .height(44)
          .fontSize(13)
          .fontColor('#176B43')
          .backgroundColor('#E5F2E9')
          .borderRadius(22)
          .onClick(() => this.onViewBookings())
        Button('取消冲突项并继续')
          .layoutWeight(1)
          .height(44)
          .fontSize(13)
          .fontColor(Color.White)
          .backgroundColor('#C85C28')
          .borderRadius(22)
          .onClick(() => this.onReplace())
      }
      .width('100%')
    }
    .width('86%')
    .padding(12)
    .backgroundColor('#F4F8F5')
    .borderRadius(20)
    .shadow({ radius: 22, color: '#33000000', offsetX: 0, offsetY: 10 })
  }
}

@Entry
@Component
struct Index {
  private readonly viewModel: ScenicViewModel = new ScenicViewModel();
  private readonly facilities: ScenicFacility[] = DEMO_FACILITIES;
  private readonly adminOrders: AdminOrderRecord[] = DEMO_ADMIN_ORDERS;

  @State private tickets: TicketProduct[] = this.viewModel.repository.tickets();
  @State private spots: ScenicSpot[] = this.viewModel.repository.spots();
  @State private routes: RecommendedRoute[] = this.viewModel.repository.routes();
  @State private projects: ProjectReservation[] = this.viewModel.repository.projects();
  @State private merchants: MerchantItem[] = this.viewModel.repository.merchants();
  @State private products: MallProduct[] = this.viewModel.repository.products();
  @State private activeTab: string = '首页';
  @State private account: string = '';
  @State private password: string = '';
  @State private loggedIn: boolean = false;
  @State private userRole: string = '游客';
  @State @Watch('onNoticeChanged') private notice: string = '欢迎使用山水智游，请登录账号。';
  @State private ticketIndex: number = 0;
  @State private ticketCardRevision: number = 0;
  @State private selectedRouteId: string = 'family';
  @State private selectedSpotId: string = 'sudi';
  @State private homePhotoIndex: number = 0;
  @State private crowdSnapshots: CrowdSnapshot[] = this.viewModel.repository.crowdSnapshots();
  @State private crowdScenario: string = '常态';
  @State private itineraryDurationMinutes: number = 240;
  @State private selectedInterestTags: string[] = ['文化'];
  @State private activeItinerary: ItineraryPlan | undefined = undefined;
  @State private originalItinerary: ItineraryPlan | undefined = undefined;
  @State private rerouteExplanation: string = '';
  @State private autoAvoidCongestion: boolean = true;
  @State private rerouteAdoptions: number = 0;
  @State private selectedMerchantCategory: string = '全部';
  @State private bookings: BookingRecord[] = [];
  @State private adminActiveTab: string = '概览';
  @State private mapExpanded: boolean = false;
  @State private navigationActive: boolean = false;
  @State private navigationStep: number = 0;
  @State private cartItems: CartItem[] = [];
  @State private mallCartOpen: boolean = false;
  @State private deliveryRecipient: string = '';
  @State private deliveryPhone: string = '';
  @State private deliveryAddress: string = '';
  @State private ticketInventoryDelta: number[] = [0, 0, 0];
  @State private ticketPausedIds: string[] = [];
  @State private projectInventoryDelta: number[] = [0, 0, 0, 0];
  @State private projectFastPassInventoryDelta: number[] = [0, 0, 0, 0];
  @State private queueRefreshCount: number = 0;
  @State private projectQueueReleaseCounts: number[] = [0, 0, 0, 0];
  @State private facilityStatuses: string[] = ['关注中', '正常', '正常', '繁忙', '正常', '正常'];
  @State private remindedProjectIds: string[] = [];
  @State private feedbackHandled: boolean = false;
  private cancelBookingDialogController: CustomDialogController | null = null;
  private bookingConflictDialogController: CustomDialogController | null = null;
  @State private latestFeedback: string = '游客反馈：希望断桥高峰时增加分流提示。';
  @State private feedbackContent: string = '';
  @State private feedbackReplyDraft: string = '';
  @State private feedbackReply: string = '';
  @State private points: number = 320;
  @State private sharedToday: boolean = false;
  @State private journeyPhotoUri: string = '';
  @State private journeyPhotoCaption: string = '';
  @State private aiAnswering: boolean = false;
  @State private assistantTyping: boolean = false;
  @State private assistantDraft: string = '';
  @State private humanServiceRequested: boolean = false;
  @State private lastServiceQuestion: string = '';
  @State private serviceDraft: string = '';
  @State private serviceMessages: ChatMessage[] = DEMO_CHAT_MESSAGES;
  @State private followUpRating: number = 0;
  @State private followUpCompleted: boolean = false;
  @State private historyRecords: VisitorHistoryRecord[] = DEMO_HISTORY_RECORDS;
  @State private historyPageType: string = '';
  @State private selectedHistoryRecordId: string = '';
  private crowdTimerId: number = -1;
  private homePhotoTimerId: number = -1;
  private noticeTimerId: number = -1;

  aboutToAppear(): void {
    this.loadRemoteData();
    this.refreshCrowdData();
    this.crowdTimerId = setInterval(() => {
      this.refreshCrowdData();
    }, 4000);
    this.homePhotoTimerId = setInterval(() => {
      this.nextHomePhoto();
    }, 3500);
  }

  private async loadRemoteData(): Promise<void> {
    this.notice = '正在从景区数据库同步数据...';
    const backendAvailable = await this.viewModel.repository.backendAvailable();
    this.tickets = await this.viewModel.repository.loadTickets();
    this.spots = await this.viewModel.repository.loadSpots();
    this.routes = await this.viewModel.repository.loadRoutes();
    this.projects = await this.viewModel.repository.loadProjects();
    this.merchants = await this.viewModel.repository.loadMerchants();
    this.products = await this.viewModel.repository.loadProducts();
    this.ticketIndex = Math.min(this.ticketIndex, Math.max(0, this.tickets.length - 1));
    if (this.tickets.length > 0 && this.spots.length > 0 && this.routes.length > 0 && this.projects.length > 0 &&
      this.merchants.length > 0 && this.products.length > 0) {
      this.notice = '后端已连接，景区数据库数据已同步。';
    } else if (backendAvailable) {
      this.notice = '后端已连接，数据库未初始化时可使用演示账号登录。';
    } else {
      this.notice = '当前为离线演示模式，可直接使用演示账号登录。';
    }
  }

  aboutToDisappear(): void {
    if (this.crowdTimerId >= 0) {
      clearInterval(this.crowdTimerId);
      this.crowdTimerId = -1;
    }
    if (this.homePhotoTimerId >= 0) {
      clearInterval(this.homePhotoTimerId);
      this.homePhotoTimerId = -1;
    }
    if (this.noticeTimerId >= 0) {
      clearTimeout(this.noticeTimerId);
      this.noticeTimerId = -1;
    }
  }

  private onNoticeChanged(): void {
    if (this.noticeTimerId >= 0) {
      clearTimeout(this.noticeTimerId);
      this.noticeTimerId = -1;
    }
    if (this.notice.length === 0) {
      return;
    }
    this.noticeTimerId = setTimeout(() => {
      this.notice = '';
      this.noticeTimerId = -1;
    }, 3200);
  }

  build() {
    Column() {
      if (this.loggedIn) {
        this.application()
      } else {
        this.loginPage()
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F4F8F5')
  }

  @Builder
  loginPage() {
    Column() {
      Stack({ alignContent: Alignment.BottomStart }) {
        Image($r('app.media.west_lake_hero'))
          .width('100%')
          .height(310)
          .objectFit(ImageFit.Cover)
        Column()
          .width('100%')
          .height(310)
          .backgroundColor('#55000000')
        Column({ space: 12 }) {
          Text('山水智游')
            .fontSize(38)
            .fontWeight(FontWeight.Bold)
            .fontColor(Color.White)
          Text('西湖一日，从容启程')
            .fontSize(17)
            .fontColor('#F0F8F1')
          Row({ space: 8 }) {
            this.loginFeatureTag('雷峰塔')
            this.loginFeatureTag('游船')
            this.loginFeatureTag('柳岸')
          }
          .width('100%')
        }
        .alignItems(HorizontalAlign.Start)
        .width('100%')
        .padding({ left: 24, right: 24, bottom: 30 })
      }
      .width('100%')

      Column({ space: 14 }) {
        Column({ space: 5 }) {
          Text('欢迎来到杭州西湖')
            .fontSize(21)
            .fontWeight(FontWeight.Bold)
            .fontColor('#24362B')
          Text('智能导览、分时预约、贴心咨询一站开启')
            .fontSize(13)
            .fontColor('#718077')
        }
        .alignItems(HorizontalAlign.Start)
        .width('100%')
        Row({ space: 8 }) {
          this.loginMetric('22℃', '湖滨舒适')
          this.loginMetric('240', '今日余位')
          this.loginMetric('低', '拥堵指数')
        }
        .width('100%')
        TextInput({ text: this.account, placeholder: '账号' })
          .onChange((value: string) => this.account = value)
          .backgroundColor('#F3F6F4')
          .borderRadius(12)
          .height(50)
        TextInput({ text: this.password, placeholder: '密码' })
          .onChange((value: string) => this.password = value)
          .backgroundColor('#F3F6F4')
          .borderRadius(12)
          .height(50)
        Button('进入景区')
          .width('100%')
          .height(48)
          .backgroundColor('#176B43')
          .fontColor(Color.White)
          .borderRadius(24)
          .onClick(() => this.performLogin())
        Text('请使用景区游客账号或管理员账号登录')
          .fontSize(11)
          .fontColor('#7A887F')
          .width('100%')
          .textAlign(TextAlign.Center)
      }
      .width('100%')
      .padding(20)
      .backgroundColor(Color.White)
      .borderRadius(20)
      .margin({ left: 18, right: 18, top: -24 })
      .shadow({ radius: 18, color: '#26000000', offsetX: 0, offsetY: 8 })

      Text(this.notice)
        .fontSize(13)
        .fontColor('#66766C')
        .lineHeight(20)
        .width('90%')
        .margin({ top: 14 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F4F8F5')
    .alignItems(HorizontalAlign.Center)
  }

  @Builder
  loginFeatureTag(label: string) {
    Text(label)
      .fontSize(12)
      .fontColor(Color.White)
      .backgroundColor('#4DFFFFFF')
      .padding({ left: 11, right: 11, top: 6, bottom: 6 })
      .borderRadius(14)
  }

  @Builder
  loginMetric(value: string, label: string) {
    Column({ space: 3 }) {
      Text(value)
        .fontSize(17)
        .fontWeight(FontWeight.Bold)
        .fontColor('#176B43')
      Text(label)
        .fontSize(10)
        .fontColor('#718077')
    }
    .layoutWeight(1)
    .height(55)
    .alignItems(HorizontalAlign.Center)
    .justifyContent(FlexAlign.Center)
    .backgroundColor('#F1F8F3')
    .borderRadius(13)
  }

  private performLogin(): void {
    this.viewModel.repository.login(this.account, this.password).then((result) => {
      this.notice = result.message;
      if (result.code === 0) {
        this.userRole = this.account === 'admin' ? '管理员' : '游客';
        this.activeTab = '首页';
        this.adminActiveTab = '概览';
        this.loggedIn = true;
        return;
      }
      AlertDialog.show({
        title: '登录失败',
        message: '账号或密码不正确，请检查后重新输入。',
        primaryButton: {
          value: '重新输入',
          action: () => {}
        }
      });
    });
  }

  @Builder
  application() {
    if (this.userRole === '管理员') {
      this.adminApplication()
    } else {
      Stack({ alignContent: Alignment.BottomEnd }) {
        Column() {
          this.topBar()
          if (this.notice.length > 0) {
            Text(this.notice)
              .fontSize(12)
              .fontColor('#1B6E47')
              .backgroundColor('#E1F5E8')
              .borderRadius(8)
              .padding({ top: 7, bottom: 7, left: 10, right: 10 })
              .width('92%')
              .margin({ top: 6 })
          }
          Scroll() {
            Column() {
              this.pageContent()
            }
            .width('100%')
            .padding({ left: 16, right: 16, top: 14, bottom: 16 })
          }
          .layoutWeight(1)
          this.bottomNavigation()
        }
        .width('100%')
        .height('100%')
        this.globalAiButton()
      }
      .width('100%')
      .height('100%')
    }
  }

  @Builder
  globalAiButton() {
    if (this.activeTab !== '客服') {
      Column({ space: 1 }) {
        Text(this.aiAnswering ? '...' : '?')
          .fontSize(22)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)
          .textAlign(TextAlign.Center)
          .width(48)
          .height(29)
          .padding({ top: 4 })
        Text('咨询')
          .fontSize(10)
          .fontColor(Color.White)
          .textAlign(TextAlign.Center)
          .width(48)
          .height(16)
      }
      .width(56)
      .height(56)
      .alignItems(HorizontalAlign.Center)
      .justifyContent(FlexAlign.Center)
      .backgroundColor(this.aiAnswering ? '#9B6422' : '#1E6C55')
      .borderRadius(28)
      .shadow({ radius: 14, color: '#33000000', offsetX: 0, offsetY: 4 })
      .margin({ right: 18, bottom: 124 })
      .onClick(() => this.activeTab = '客服')
    }
  }

  @Builder
  topBar() {
    Row() {
      Column({ space: 2 }) {
        Text(this.activeTab === '首页' ? '早上好，旅行者' : this.activeTab)
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#193528')
        Text(this.activeTab === '首页' ? '杭州西湖景区 · 22℃' : '杭州西湖景区')
          .fontSize(12)
          .fontColor('#758379')
      }
      .alignItems(HorizontalAlign.Start)
      .justifyContent(FlexAlign.Center)
      .height(46)
      .layoutWeight(1)
      Column({ space: 0 }) {
        Text('⌖')
          .fontSize(20)
          .fontColor('#176B43')
          .width(42)
          .height(23)
          .textAlign(TextAlign.Center)
        Text('实时')
          .fontSize(9)
          .fontColor('#176B43')
          .width(42)
          .height(13)
          .textAlign(TextAlign.Center)
      }
        .width(46)
        .height(46)
        .alignItems(HorizontalAlign.Center)
        .justifyContent(FlexAlign.Center)
        .backgroundColor('#E1F3E7')
        .borderRadius(23)
    }
    .width('100%')
    .height(68)
    .padding({ left: 20, right: 20, top: 10, bottom: 12 })
    .alignItems(VerticalAlign.Center)
    .backgroundColor('#F4F8F5')
  }

  @Builder
  pageContent() {
    if (this.activeTab === '首页') {
      this.homePage()
    } else if (this.activeTab === '导览') {
      this.guidePage()
    } else if (this.activeTab === '预约') {
      this.reservationPage()
    } else if (this.activeTab === '商城') {
      this.mallPage()
    } else if (this.activeTab === '客服') {
      this.customerServicePage()
    } else {
      this.profilePage()
    }
  }

  @Builder
  homePage() {
    Column({ space: 18 }) {
      this.homePhotoCarousel()

      this.sectionHeading('分时门票', '可退改 · 入园二维码')
      ForEach(this.tickets, (ticket: TicketProduct, index: number) => {
        Row() {
          Column({ space: 5 }) {
            Text(ticket.name)
              .fontSize(17)
              .fontWeight(FontWeight.Medium)
              .fontColor('#203128')
            Text(ticket.description)
              .fontSize(12)
              .fontColor('#78857C')
            Text(`${this.timeOf(ticket.startAt)} 入场 · 预计 ${this.timeOf(ticket.endAt)} 结束`)
              .fontSize(12)
              .fontColor('#6F7F75')
            Text(this.isTicketPaused(ticket.id) ? '当前已暂停售卖' : `剩余 ${this.ticketRemaining(ticket, index)} 张`)
              .fontSize(12)
              .fontColor(this.isTicketPaused(ticket.id) || this.ticketRemaining(ticket, index) < 50 ? '#C3621F' : '#26724B')
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          Column({ space: 8 }) {
            Text(this.viewModel.formatPrice(ticket.price))
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor('#D85D27')
            Button(this.hasActiveBooking('TICKET', ticket.id) ? '已选择' : '选择预订')
              .fontSize(12)
              .height(30)
              .backgroundColor(this.hasActiveBooking('TICKET', ticket.id) ? '#176B43' : '#E5F2E9')
              .fontColor(this.hasActiveBooking('TICKET', ticket.id) ? Color.White : '#176B43')
              .borderRadius(15)
              .onClick(() => this.selectAndBookTicket(index))
          }
        }
        .width('100%')
        .padding(16)
        .backgroundColor(Color.White)
        .borderRadius(16)
        .onClick(() => this.cancelTicketFromCard(index))
      }, (ticket: TicketProduct) => `${ticket.id}-${this.ticketCardRevision}`)

      if (this.tickets.length > 0) {
        if (this.hasActiveBooking('TICKET', this.tickets[this.ticketIndex].id)) {
          Button(`取消 ${this.tickets[this.ticketIndex].name}`)
            .width('100%')
            .height(48)
            .backgroundColor('#FFF0E7')
            .fontColor('#C85C28')
            .borderRadius(24)
            .onClick(() => this.toggleTicketBooking())
        } else {
          Text('点击票卡“选择预订”后将直接生成电子票。')
            .fontSize(12)
            .fontColor('#718077')
            .width('100%')
            .textAlign(TextAlign.Center)
        }
      } else {
        Text('票务数据未从后端返回')
          .fontSize(13)
          .fontColor('#C3621F')
          .width('100%')
          .textAlign(TextAlign.Center)
          .padding(12)
          .backgroundColor('#FFF3E8')
          .borderRadius(12)
      }

      this.sectionHeading('今日推荐', '为你避开人群')
      Row({ space: 10 }) {
        this.quickAction('⌖', '智能导览', '规划路线', '导览')
        this.quickAction('◷', '项目预约', '减少等待', '预约')
        this.quickAction('▣', '餐宿特惠', '住玩组合', '商城')
      }
      .width('100%')
    }
    .width('100%')
  }

  @Builder
  homePhotoCarousel() {
    Stack({ alignContent: Alignment.BottomStart }) {
      this.homePhotoImage()
      Column()
        .width('100%')
        .height(210)
        .backgroundColor('#52000000')
      Column({ space: 10 }) {
        Text(this.homePhotoTitle())
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)
        Text(this.homePhotoCaption())
          .fontSize(14)
          .lineHeight(20)
          .fontColor('#F2F8F1')
          .width('100%')
        Row({ space: 8 }) {
          Text('今日余位 240')
            .fontSize(12)
            .fontColor('#165E3D')
            .backgroundColor('#D7F4DF')
            .padding({ left: 10, right: 10, top: 6, bottom: 6 })
            .borderRadius(14)
          Text('拥堵指数 低')
            .fontSize(12)
            .fontColor('#165E3D')
            .backgroundColor('#D7F4DF')
            .padding({ left: 10, right: 10, top: 6, bottom: 6 })
            .borderRadius(14)
        }
        Row({ space: 6 }) {
          this.homePhotoDot(0)
          this.homePhotoDot(1)
          this.homePhotoDot(2)
          this.homePhotoDot(3)
        }
      }
      .alignItems(HorizontalAlign.Start)
      .width('100%')
      .padding({ left: 18, right: 18, bottom: 17 })
    }
    .width('100%')
    .height(210)
    .borderRadius(20)
    .backgroundColor('#176B43')
    .onClick(() => this.activeTab = '导览')
  }

  @Builder
  homePhotoImage() {
    if (this.homePhotoIndex === 0) {
      Image($r('app.media.home_leifeng_boats'))
        .width('100%')
        .height(210)
        .objectFit(ImageFit.Cover)
    } else if (this.homePhotoIndex === 1) {
      Image($r('app.media.home_broken_bridge'))
        .width('100%')
        .height(210)
        .objectFit(ImageFit.Cover)
    } else if (this.homePhotoIndex === 2) {
      Image($r('app.media.home_su_causeway'))
        .width('100%')
        .height(210)
        .objectFit(ImageFit.Cover)
    } else {
      Image($r('app.media.west_lake_hero'))
        .width('100%')
        .height(210)
        .objectFit(ImageFit.Cover)
    }
  }

  @Builder
  homePhotoDot(index: number) {
    Text('')
      .width(this.homePhotoIndex === index ? 18 : 7)
      .height(7)
      .backgroundColor(this.homePhotoIndex === index ? Color.White : '#88FFFFFF')
      .borderRadius(4)
      .onClick(() => this.homePhotoIndex = index)
  }

  private nextHomePhoto(): void {
    this.homePhotoIndex = (this.homePhotoIndex + 1) % 4;
  }

  private homePhotoTitle(): string {
    if (this.homePhotoIndex === 0) {
      return '雷峰塔与西湖游船';
    }
    if (this.homePhotoIndex === 1) {
      return '断桥残雪';
    }
    if (this.homePhotoIndex === 2) {
      return '苏堤春晓';
    }
    return '湖上风光';
  }

  private homePhotoCaption(): string {
    if (this.homePhotoIndex === 0) {
      return '湖面游船缓行，远处雷峰塔与山色相映。';
    }
    if (this.homePhotoIndex === 1) {
      return '白堤东端经典景观，适合清晨错峰游览。';
    }
    if (this.homePhotoIndex === 2) {
      return '长堤贯湖，柳岸花明，是步行导览的舒适路线。';
    }
    return '柳影、湖光与塔影交织，开启今日西湖行程。';
  }

  @Builder
  sectionHeading(title: string, subtitle: string) {
    Row() {
      Text(title)
        .fontSize(19)
        .fontWeight(FontWeight.Bold)
        .fontColor('#22332A')
      Text(subtitle)
        .fontSize(12)
        .fontColor('#839087')
        .margin({ left: 8, top: 4 })
      Blank()
    }
    .width('100%')
    .alignItems(VerticalAlign.Center)
  }

  @Builder
  quickAction(icon: string, title: string, caption: string, target: string) {
    Column({ space: 7 }) {
      Text(icon)
        .fontSize(25)
        .fontColor('#176B43')
      Text(title)
        .fontSize(14)
        .fontWeight(FontWeight.Medium)
        .fontColor('#24362B')
      Text(caption)
        .fontSize(11)
        .fontColor('#839087')
    }
    .alignItems(HorizontalAlign.Start)
    .padding(14)
    .layoutWeight(1)
    .backgroundColor(Color.White)
    .borderRadius(14)
    .onClick(() => this.activeTab = target)
  }

  private toggleTicketBooking(): void {
    const ticket = this.tickets[this.ticketIndex];
    const existing = this.findActiveBooking('TICKET', ticket.id);
    if (existing !== undefined) {
      this.showCancelBookingDialog(existing);
      return;
    }
    if (!this.viewModel.canBook(ticket) || this.ticketRemaining(ticket, this.ticketIndex) <= 0 || this.isTicketPaused(ticket.id)) {
      this.notice = '该票种已售罄，请选择其他票种。';
      return;
    }
    this.requestBooking(this.createBooking('TICKET', ticket.id, ticket.name, ticket.startAt, ticket.endAt, false, false));
  }

  private selectAndBookTicket(index: number): void {
    this.ticketIndex = index;
    const ticket = this.tickets[index];
    const existing = this.findActiveBooking('TICKET', ticket.id);
    if (existing !== undefined) {
      this.showCancelBookingDialog(existing);
      return;
    }
    this.toggleTicketBooking();
  }

  private cancelTicketFromCard(index: number): void {
    const ticket = this.tickets[index];
    const existing = this.findActiveBooking('TICKET', ticket.id);
    if (existing !== undefined) {
      this.ticketIndex = index;
      this.showCancelBookingDialog(existing);
    }
  }

  private createBooking(
    kind: string,
    resourceId: string,
    title: string,
    startAt: string,
    endAt: string,
    fastPass: boolean,
    reminderEnabled: boolean
  ): BookingRecord {
    const addons: BookingAddon[] = [];
    if (fastPass) {
      addons.push({ type: 'FAST_PASS', name: '快速通行券', price: this.projectFastPassPrice(resourceId), status: '已开通' });
    }
    return {
      id: `B${Date.now()}`,
      kind: kind,
      resourceId: resourceId,
      title: title,
      startAt: startAt,
      endAt: endAt,
      status: '已确认',
      cancellableUntil: kind === 'HOTEL' ? '入住日前 18:00' : '入场前可取消',
      reminderEnabled: reminderEnabled,
      addons: addons,
      qrPayload: kind === 'TICKET' ? `SCENICNAV|${resourceId}|${startAt}|${Date.now()}` : ''
    };
  }

  private requestBooking(candidate: BookingRecord): void {
    if (!this.canReserveBooking(candidate)) {
      return;
    }
    const conflicts = this.scheduleConflicts(candidate);
    if (conflicts.length === 0) {
      this.confirmBooking(candidate);
      return;
    }
    const conflict = conflicts[0];
    this.showBookingConflictDialog(candidate, conflict, conflicts.length);
  }

  private canReserveBooking(candidate: BookingRecord): boolean {
    if (candidate.kind === 'TICKET') {
      const index = this.ticketIndexById(candidate.resourceId);
      if (index < 0 || this.ticketRemaining(this.tickets[index], index) <= 0 || this.isTicketPaused(candidate.resourceId)) {
        this.notice = '该门票时段已无余量，请选择其他时段。';
        return false;
      }
      return true;
    }
    if (candidate.kind === 'PROJECT') {
      const index = this.projectIndex(candidate.resourceId);
      const project = this.projects[index];
      if (this.projectRemaining(project, index) <= 0) {
        this.notice = `${candidate.title} 当前时段已约满，请选择其他时段。`;
        return false;
      }
      if (this.bookingHasFastPass(candidate) && this.projectFastPassRemaining(project, index) <= 0) {
        this.notice = `${candidate.title} 的快速通行名额已用完，可预约普通队列。`;
        return false;
      }
    }
    return true;
  }

  private confirmBooking(booking: BookingRecord): void {
    if (booking.kind === 'TICKET') {
      this.adjustTicketInventory(this.ticketIndexById(booking.resourceId), -1);
    } else if (booking.kind === 'PROJECT') {
      const projectIndex = this.projectIndex(booking.resourceId);
      this.adjustProjectInventory(projectIndex, -1);
      if (this.bookingHasFastPass(booking)) {
        this.adjustProjectFastPassInventory(projectIndex, -1);
      }
    }
    this.bookings = [...this.bookings, booking];
    if (booking.kind === 'TICKET') {
      this.ticketCardRevision = this.ticketCardRevision + 1;
      this.notice = `${booking.title} 预订成功，电子票已生成。`;
      this.addHistory('票务', booking.title, `${this.bookingTimeRange(booking)} · 电子票已生成`);
    } else if (booking.kind === 'PROJECT') {
      this.notice = `${booking.title} 预约成功${this.bookingHasFastPass(booking) ? '，快速通行已开通。' : '。'}`;
      this.addHistory('预约', booking.title, `${this.bookingTimeRange(booking)} 时段已确认`);
    } else {
      this.notice = `${booking.title} 预订成功，已为你保留 ${this.bookingTimeRange(booking)}。`;
      this.addHistory(booking.kind === 'HOTEL' ? '住宿' : '餐饮', booking.title, `${this.bookingTimeRange(booking)} 已确认`);
    }
  }

  private replaceConflictingBookings(candidate: BookingRecord, conflicts: BookingRecord[]): void {
    for (let index = 0; index < conflicts.length; index++) {
      this.cancelBooking(conflicts[index], false);
    }
    this.confirmBooking(candidate);
    this.notice = `已取消 ${conflicts.length} 项冲突预约，并确认 ${candidate.title}。`;
  }

  private showBookingConflictDialog(candidate: BookingRecord, conflict: BookingRecord, conflictCount: number): void {
    if (this.bookingConflictDialogController !== null) {
      return;
    }
    const conflictNote = conflictCount > 1
      ? `本次选择还与另外 ${conflictCount - 1} 项已确认行程重叠。`
      : '两个预约的时间重叠，不能同时确认。';
    this.bookingConflictDialogController = new CustomDialogController({
      builder: BookingConflictDialog({
        existingTitle: conflict.title,
        existingTimeRange: this.bookingTimeRange(conflict),
        candidateTitle: candidate.title,
        candidateTimeRange: this.bookingTimeRange(candidate),
        conflictNote: conflictNote,
        onViewBookings: () => {
          this.closeBookingConflictDialog();
          this.activeTab = '我的';
        },
        onReplace: () => {
          this.closeBookingConflictDialog();
          this.replaceConflictingBookings(candidate, this.scheduleConflicts(candidate));
        }
      }),
      autoCancel: false,
      alignment: DialogAlignment.Center,
      customStyle: true,
      maskColor: '#52000000'
    });
    this.bookingConflictDialogController.open();
  }

  private closeBookingConflictDialog(): void {
    if (this.bookingConflictDialogController !== null) {
      this.bookingConflictDialogController.close();
      this.bookingConflictDialogController = null;
    }
  }

  private showCancelBookingDialog(booking: BookingRecord): void {
    if (this.cancelBookingDialogController !== null) {
      return;
    }
    this.cancelBookingDialogController = new CustomDialogController({
      builder: CancelBookingDialog({
        bookingTitle: booking.title,
        bookingType: this.bookingKindLabel(booking.kind),
        bookingTimeRange: this.bookingTimeRange(booking),
        cancellationRule: booking.cancellableUntil,
        onKeep: () => {
          this.closeCancelBookingDialog();
          this.notice = '已保留当前预约。';
        },
        onConfirm: () => {
          this.closeCancelBookingDialog();
          this.cancelBooking(booking, true);
        }
      }),
      autoCancel: false,
      alignment: DialogAlignment.Center,
      customStyle: true,
      maskColor: '#52000000'
    });
    this.cancelBookingDialogController.open();
  }

  private closeCancelBookingDialog(): void {
    if (this.cancelBookingDialogController !== null) {
      this.cancelBookingDialogController.close();
      this.cancelBookingDialogController = null;
    }
  }

  private cancelBooking(booking: BookingRecord, showNotice: boolean): void {
    if (booking.status !== '已确认') {
      return;
    }
    const nextBookings: BookingRecord[] = [];
    for (let index = 0; index < this.bookings.length; index++) {
      const current = this.bookings[index];
      if (current.id === booking.id) {
        nextBookings.push({
          id: current.id,
          kind: current.kind,
          resourceId: current.resourceId,
          title: current.title,
          startAt: current.startAt,
          endAt: current.endAt,
          status: '已取消',
          cancellableUntil: current.cancellableUntil,
          reminderEnabled: false,
          addons: current.addons,
          qrPayload: current.qrPayload
        });
      } else {
        nextBookings.push(current);
      }
    }
    this.bookings = nextBookings;
    if (booking.kind === 'TICKET') {
      this.adjustTicketInventory(this.ticketIndexById(booking.resourceId), 1);
      this.ticketCardRevision = this.ticketCardRevision + 1;
    } else if (booking.kind === 'PROJECT') {
      const projectIndex = this.projectIndex(booking.resourceId);
      this.adjustProjectInventory(projectIndex, 1);
      if (this.bookingHasFastPass(booking)) {
        this.adjustProjectFastPassInventory(projectIndex, 1);
      }
      this.removeProjectReminder(booking.resourceId);
    }
    this.addHistory('预约', booking.title, '预约已取消，时段库存已释放');
    if (showNotice) {
      this.notice = `${booking.title} 已取消，库存已释放。`;
    }
  }

  private findActiveBooking(kind: string, resourceId: string): BookingRecord | undefined {
    for (let index = 0; index < this.bookings.length; index++) {
      const booking = this.bookings[index];
      if (booking.kind === kind && booking.resourceId === resourceId && booking.status === '已确认') {
        return booking;
      }
    }
    return undefined;
  }

  private hasActiveBooking(kind: string, resourceId: string): boolean {
    return this.findActiveBooking(kind, resourceId) !== undefined;
  }

  private activeBookings(kind: string): BookingRecord[] {
    const result: BookingRecord[] = [];
    for (let index = 0; index < this.bookings.length; index++) {
      if (this.bookings[index].kind === kind && this.bookings[index].status === '已确认') {
        result.push(this.bookings[index]);
      }
    }
    return result;
  }

  private scheduledBookings(): BookingRecord[] {
    const result: BookingRecord[] = [];
    for (let index = 0; index < this.bookings.length; index++) {
      const booking = this.bookings[index];
      if (booking.kind !== 'TICKET' && booking.status === '已确认') {
        result.push(booking);
      }
    }
    return result;
  }

  private bookingKindLabel(kind: string): string {
    if (kind === 'PROJECT') {
      return '项目预约';
    }
    if (kind === 'HOTEL') {
      return '酒店';
    }
    if (kind === 'RESTAURANT') {
      return '餐饮';
    }
    return '门票';
  }

  private scheduleConflicts(candidate: BookingRecord): BookingRecord[] {
    const result: BookingRecord[] = [];
    for (let index = 0; index < this.bookings.length; index++) {
      const booking = this.bookings[index];
      if (booking.status === '已确认' && this.shouldCompareBookingTime(booking, candidate)
        && booking.startAt < candidate.endAt && candidate.startAt < booking.endAt) {
        result.push(booking);
      }
    }
    return result;
  }

  private shouldCompareBookingTime(first: BookingRecord, second: BookingRecord): boolean {
    const firstIsHotel = first.kind === 'HOTEL';
    const secondIsHotel = second.kind === 'HOTEL';
    const firstIsScenicActivity = first.kind === 'TICKET' || first.kind === 'PROJECT';
    const secondIsScenicActivity = second.kind === 'TICKET' || second.kind === 'PROJECT';
    return !(firstIsHotel && secondIsScenicActivity) && !(secondIsHotel && firstIsScenicActivity);
  }

  private bookingHasFastPass(booking: BookingRecord): boolean {
    for (let index = 0; index < booking.addons.length; index++) {
      if (booking.addons[index].type === 'FAST_PASS' && booking.addons[index].status === '已开通') {
        return true;
      }
    }
    return false;
  }

  private ticketIndexById(ticketId: string): number {
    for (let index = 0; index < this.tickets.length; index++) {
      if (this.tickets[index].id === ticketId) {
        return index;
      }
    }
    return -1;
  }

  private bookingTimeRange(booking: BookingRecord): string {
    return `${this.displayDateTime(booking.startAt)} 至 ${this.displayDateTime(booking.endAt)}`;
  }

  private displayDateTime(value: string): string {
    return value.length >= 16 ? `${value.substring(5, 10)} ${value.substring(11, 16)}` : value;
  }

  private timeOf(value: string): string {
    return value.length >= 16 ? value.substring(11, 16) : value;
  }

  @Builder
  guidePage() {
    Column({ space: 18 }) {
      this.sectionHeading('动态错峰游览助手', '实时客流数据 · 每 4 秒更新')
      this.itineraryPlanner()

      this.sectionHeading('实时热力导览', `当前位置：苏堤北口 · ${this.crowdScenario}`)
      this.interactiveMap()

      this.sectionHeading('经典主题路线', '保留原有路线，一键切换')
      ForEach(this.routes, (route: RecommendedRoute) => {
        Column({ space: 9 }) {
          Row() {
            Column({ space: 4 }) {
              Text(route.title)
                .fontSize(17)
                .fontWeight(FontWeight.Medium)
                .fontColor('#24362B')
              Text(`${route.duration} · ${route.distance}`)
                .fontSize(12)
                .fontColor('#718077')
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)
            Text(route.id === this.selectedRouteId ? '使用中' : '选择')
              .fontSize(12)
              .fontColor(route.id === this.selectedRouteId ? Color.White : '#176B43')
              .backgroundColor(route.id === this.selectedRouteId ? '#176B43' : '#E5F2E9')
              .padding({ left: 11, right: 11, top: 6, bottom: 6 })
              .borderRadius(14)
              .onClick(() => {
                this.selectedRouteId = route.id;
                this.activeItinerary = undefined;
                this.originalItinerary = undefined;
                this.rerouteExplanation = '';
                this.navigationActive = false;
                this.navigationStep = 0;
                this.notice = `已为你规划 ${route.title}，全程 ${route.duration}。`;
              })
          }
          Text(route.spots.join('  →  '))
            .fontSize(12)
            .fontColor('#5B6E61')
        }
        .width('100%')
        .padding(16)
        .backgroundColor(Color.White)
        .borderRadius(16)
      }, (route: RecommendedRoute) => route.id)

      this.sectionHeading('景点人流', '实时热度 + 15 分钟预测')
      ForEach(this.spots, (spot: ScenicSpot) => {
        Column({ space: 10 }) {
          Row({ space: 11 }) {
            this.spotImage(spot)
            Column({ space: 4 }) {
              Text(spot.name)
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .fontColor('#24362B')
              Text(`${spot.subtitle} · ${spot.audioMinutes} 分钟讲解`)
                .fontSize(12)
                .fontColor('#718077')
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)
            Text(`${this.crowdLevel(spot)} ${this.currentCrowdPercent(spot)}%`)
              .fontSize(12)
              .fontColor(this.crowdColor(spot))
          }
          Text(`${this.crowdTrend(spot)} · 15 分钟预测 ${this.currentForecastPercent(spot)}% · ${this.crowdAdvice(spot)}`)
            .fontSize(12)
            .fontColor(this.crowdColor(spot))
        }
        .width('100%')
        .padding(15)
        .backgroundColor(spot.id === this.selectedSpotId ? '#E9F7EE' : Color.White)
        .borderRadius(15)
        .onClick(() => {
          this.selectMapSpot(spot);
        })
      }, (spot: ScenicSpot) => spot.id)
    }
    .width('100%')
  }

  @Builder
  itineraryPlanner() {
    Column({ space: 12 }) {
      Text('用时偏好')
        .fontSize(14)
        .fontWeight(FontWeight.Medium)
        .fontColor('#264534')
      Row({ space: 8 }) {
        Text('2 小时')
          .fontSize(12)
          .fontColor(this.itineraryDurationMinutes === 120 ? Color.White : '#176B43')
          .backgroundColor(this.itineraryDurationMinutes === 120 ? '#176B43' : '#E5F2E9')
          .padding({ left: 14, right: 14, top: 7, bottom: 7 })
          .borderRadius(16)
          .onClick(() => this.itineraryDurationMinutes = 120)
        Text('4 小时')
          .fontSize(12)
          .fontColor(this.itineraryDurationMinutes === 240 ? Color.White : '#176B43')
          .backgroundColor(this.itineraryDurationMinutes === 240 ? '#176B43' : '#E5F2E9')
          .padding({ left: 14, right: 14, top: 7, bottom: 7 })
          .borderRadius(16)
          .onClick(() => this.itineraryDurationMinutes = 240)
        Text('6 小时')
          .fontSize(12)
          .fontColor(this.itineraryDurationMinutes === 360 ? Color.White : '#176B43')
          .backgroundColor(this.itineraryDurationMinutes === 360 ? '#176B43' : '#E5F2E9')
          .padding({ left: 14, right: 14, top: 7, bottom: 7 })
          .borderRadius(16)
          .onClick(() => this.itineraryDurationMinutes = 360)
      }
      .width('100%')

      Text('兴趣标签（至少选择一项）')
        .fontSize(14)
        .fontWeight(FontWeight.Medium)
        .fontColor('#264534')
      Row({ space: 7 }) {
        this.itineraryInterestTag('亲子')
        this.itineraryInterestTag('文化')
        this.itineraryInterestTag('自然')
      }
      .width('100%')
      Row({ space: 7 }) {
        this.itineraryInterestTag('摄影')
        this.itineraryInterestTag('休闲')
      }
      .width('100%')

      Button('生成我的错峰行程')
        .width('100%')
        .height(42)
        .fontSize(14)
        .backgroundColor('#176B43')
        .fontColor(Color.White)
        .borderRadius(21)
        .onClick(() => this.generatePersonalItinerary())

      if (this.activeItinerary !== undefined) {
        this.itineraryPlanCard({ plan: this.activeItinerary })
      }
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Color.White)
    .borderRadius(18)
  }

  @Builder
  itineraryInterestTag(tag: string) {
    Text(tag)
      .fontSize(12)
      .fontColor(this.hasSelectedInterest(tag) ? Color.White : '#176B43')
      .backgroundColor(this.hasSelectedInterest(tag) ? '#176B43' : '#E5F2E9')
      .padding({ left: 14, right: 14, top: 7, bottom: 7 })
      .borderRadius(16)
      .onClick(() => this.toggleInterestTag(tag))
  }

  @Builder
  itineraryPlanCard($$: ItineraryPlanCardParameter) {
    Column({ space: 9 }) {
      Row() {
        Column({ space: 3 }) {
          Text($$.plan.title)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor('#174D33')
          Text(this.itinerarySpotNames($$.plan))
            .fontSize(12)
            .lineHeight(18)
            .fontColor('#5D7164')
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
        Text(`舒适度 ${$$.plan.comfortScore}`)
          .fontSize(12)
          .fontColor('#176B43')
          .backgroundColor('#E5F2E9')
          .padding({ left: 8, right: 8, top: 5, bottom: 5 })
          .borderRadius(12)
      }
      Text(`预计 ${$$.plan.durationMinutes} 分钟 · 已避拥节省约 ${$$.plan.savedWaitMinutes} 分钟`)
        .fontSize(12)
        .fontColor('#5D7164')
      Text($$.plan.explanation)
        .fontSize(12)
        .lineHeight(19)
        .fontColor('#B05B28')
      if (this.rerouteExplanation.length > 0) {
        Text(`自动绕行：${this.rerouteExplanation}`)
          .fontSize(12)
          .lineHeight(19)
          .fontColor('#A44A35')
          .backgroundColor('#FFF1E8')
          .padding(9)
          .borderRadius(10)
      }
      if (this.originalItinerary !== undefined && this.rerouteExplanation.length > 0) {
        Button('恢复原路线并暂停自动绕行')
          .width('100%')
          .height(34)
          .fontSize(12)
          .backgroundColor('#F1F7F3')
          .fontColor('#176B43')
          .borderRadius(17)
          .onClick(() => this.restoreOriginalItinerary())
      }
    }
    .width('100%')
    .padding(13)
    .backgroundColor('#F3FAF5')
    .borderRadius(14)
  }

  @Builder
  interactiveMap() {
    Column({ space: 10 }) {
      Row({ space: 6 }) {
        Text(`实时客流 · ${this.crowdScenario} · ${this.crowdUpdatedAt()}`)
          .fontSize(11)
          .fontColor('#557066')
          .layoutWeight(1)
        Text('绿 畅通  黄 适中  橙 拥挤  红 严重')
          .fontSize(10)
          .fontColor('#66796D')
      }
      .width('100%')
      Stack({ alignContent: Alignment.TopStart }) {
        this.routeMapImage()
        ForEach(this.spots, (spot: ScenicSpot) => {
          this.mapSpotMarker(spot)
        }, (spot: ScenicSpot) => spot.id)
        Text(this.mapExpanded ? '热力已展开 · 点击景点切换' : '点击热力点查看预测与讲解')
          .fontSize(12)
          .fontColor('#1C6442')
          .backgroundColor('#F5FFF7')
          .padding({ left: 10, right: 10, top: 7, bottom: 7 })
          .borderRadius(16)
          .position({ x: 16, y: 16 })
      }
      .width('100%')
      .height(260)
      .borderRadius(20)
      .backgroundColor('#DCEFE2')

      Row({ space: 10 }) {
        Button(this.navigationActive ? '重新规划' : '开始导航')
          .layoutWeight(1)
          .height(42)
          .backgroundColor('#176B43')
          .fontColor(Color.White)
          .borderRadius(21)
          .onClick(() => this.startNavigation())
        Button(this.mapExpanded ? '收起地图详情' : '展开地图详情')
          .layoutWeight(1)
          .height(42)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(21)
          .onClick(() => this.toggleMapDetails())
      }
      if (this.mapExpanded) {
        this.mapSpotDetails()
      }
      if (this.navigationActive) {
        Column({ space: 7 }) {
          Text(`正在导航 · ${this.currentNavigationTitle()}`)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .fontColor('#176B43')
          Text(this.navigationInstruction())
            .fontSize(13)
            .lineHeight(20)
            .fontColor('#466154')
          Button(this.navigationStep + 1 >= this.currentNavigationSpotIds().length ? '完成导航' : '到达下一站')
            .width('100%')
            .height(36)
            .fontSize(13)
            .backgroundColor('#F1F7F3')
            .fontColor('#176B43')
            .borderRadius(18)
            .onClick(() => this.nextNavigationStep())
        }
        .width('100%')
        .padding(14)
        .backgroundColor('#FFFFFF')
        .borderRadius(14)
      }
    }
    .width('100%')
  }

  @Builder
  routeMapImage() {
    if (this.selectedRouteId === 'family') {
      Image($r('app.media.map_family'))
        .width('100%')
        .height(260)
        .objectFit(ImageFit.Contain)
    } else if (this.selectedRouteId === 'culture') {
      Image($r('app.media.map_culture'))
        .width('100%')
        .height(260)
        .objectFit(ImageFit.Contain)
    } else {
      Image($r('app.media.map_leisure'))
        .width('100%')
        .height(260)
        .objectFit(ImageFit.Contain)
    }
  }

  @Builder
  spotImage(spot: ScenicSpot) {
    if (spot.imageName === 'spot_broken_bridge') {
      Image($r('app.media.spot_broken_bridge'))
        .width(86)
        .height(58)
        .objectFit(ImageFit.Cover)
        .borderRadius(10)
    } else if (spot.imageName === 'spot_solitary_hill') {
      Image($r('app.media.spot_solitary_hill'))
        .width(86)
        .height(58)
        .objectFit(ImageFit.Cover)
        .borderRadius(10)
    } else if (spot.imageName === 'spot_quyuan') {
      Image($r('app.media.spot_quyuan'))
        .width(86)
        .height(58)
        .objectFit(ImageFit.Cover)
        .borderRadius(10)
    } else if (spot.imageName === 'spot_sudi') {
      Image($r('app.media.spot_sudi'))
        .width(86)
        .height(58)
        .objectFit(ImageFit.Cover)
        .borderRadius(10)
    } else if (spot.imageName === 'spot_flower_harbor') {
      Image($r('app.media.spot_flower_harbor'))
        .width(86)
        .height(58)
        .objectFit(ImageFit.Cover)
        .borderRadius(10)
    } else {
      Image($r('app.media.spot_leifeng_pagoda'))
        .width(86)
        .height(58)
        .objectFit(ImageFit.Cover)
        .borderRadius(10)
    }
  }

  @Builder
  mapSpotMarker(spot: ScenicSpot) {
    Column({ space: 1 }) {
      Stack({ alignContent: Alignment.Center }) {
        Text('●')
          .fontSize(this.selectedSpotId === spot.id ? 40 : 34)
          .fontColor(this.crowdColor(spot))
          .opacity(0.24)
        Text('●')
          .fontSize(this.selectedSpotId === spot.id ? 22 : 18)
          .fontColor(this.crowdColor(spot))
        if (this.itineraryStopNumber(spot.id) > 0) {
          Text(`${this.itineraryStopNumber(spot.id)}`)
            .fontSize(10)
            .fontWeight(FontWeight.Bold)
            .fontColor(Color.White)
            .margin({ top: 1 })
        }
      }
      .width(38)
      .height(32)
      Text(spot.name)
        .fontSize(this.mapExpanded ? 11 : 9)
        .fontWeight(this.selectedSpotId === spot.id ? FontWeight.Bold : FontWeight.Regular)
        .fontColor('#244C3A')
        .backgroundColor(this.selectedSpotId === spot.id ? '#FFF6D9' : '#FFFFFF')
        .padding({ left: 4, right: 4, top: 2, bottom: 2 })
        .borderRadius(5)
    }
    .alignItems(HorizontalAlign.Center)
    .position({ x: `${spot.x}%`, y: `${spot.y}%` })
    .onClick(() => this.selectMapSpot(spot))
  }

  @Builder
  mapSpotDetails() {
    Column({ space: 8 }) {
      this.selectedSpotHeroImage()
      Row({ space: 9 }) {
        Text('●')
          .fontSize(22)
          .fontColor(this.crowdColor(this.currentSelectedSpot()))
        Column({ space: 3 }) {
          Text(this.currentSelectedSpot().name)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor('#244C3A')
          Text(`${this.currentSelectedSpot().subtitle} · 当前${this.crowdLevel(this.currentSelectedSpot())} ${this.currentCrowdPercent(this.currentSelectedSpot())}%`)
            .fontSize(12)
            .fontColor('#63776B')
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
      }
      Text(this.crowdAdvice(this.currentSelectedSpot()))
        .fontSize(12)
        .fontColor(this.crowdColor(this.currentSelectedSpot()))
      Text(`${this.crowdTrend(this.currentSelectedSpot())} · 15 分钟预测 ${this.currentForecastPercent(this.currentSelectedSpot())}%`)
        .fontSize(12)
        .fontColor('#63776B')
      Button(`播放 ${this.currentSelectedSpot().audioMinutes} 分钟图文讲解`)
        .width('100%')
        .height(34)
        .fontSize(12)
        .backgroundColor('#E5F2E9')
        .fontColor('#176B43')
        .borderRadius(17)
        .onClick(() => this.playSpotAudio(this.currentSelectedSpot()))
    }
    .width('100%')
    .padding(14)
    .backgroundColor(Color.White)
    .borderRadius(15)
  }

  @Builder
  selectedSpotHeroImage() {
    if (this.currentSelectedSpot().imageName === 'spot_broken_bridge') {
      Image($r('app.media.spot_broken_bridge'))
        .width('100%')
        .height(132)
        .objectFit(ImageFit.Cover)
        .borderRadius(13)
    } else if (this.currentSelectedSpot().imageName === 'spot_solitary_hill') {
      Image($r('app.media.spot_solitary_hill'))
        .width('100%')
        .height(132)
        .objectFit(ImageFit.Cover)
        .borderRadius(13)
    } else if (this.currentSelectedSpot().imageName === 'spot_quyuan') {
      Image($r('app.media.spot_quyuan'))
        .width('100%')
        .height(132)
        .objectFit(ImageFit.Cover)
        .borderRadius(13)
    } else if (this.currentSelectedSpot().imageName === 'spot_sudi') {
      Image($r('app.media.spot_sudi'))
        .width('100%')
        .height(132)
        .objectFit(ImageFit.Cover)
        .borderRadius(13)
    } else if (this.currentSelectedSpot().imageName === 'spot_flower_harbor') {
      Image($r('app.media.spot_flower_harbor'))
        .width('100%')
        .height(132)
        .objectFit(ImageFit.Cover)
        .borderRadius(13)
    } else {
      Image($r('app.media.spot_leifeng_pagoda'))
        .width('100%')
        .height(132)
        .objectFit(ImageFit.Cover)
        .borderRadius(13)
    }
  }

  private currentSelectedSpot(): ScenicSpot {
    for (let index = 0; index < this.spots.length; index++) {
      if (this.spots[index].id === this.selectedSpotId) {
        return this.spots[index];
      }
    }
    return this.spots[0];
  }

  private selectMapSpot(spot: ScenicSpot): void {
    this.selectedSpotId = spot.id;
    this.mapExpanded = true;
    this.notice = `已在地图中定位 ${spot.name}，可查看人流提示和图文讲解。`;
  }

  private playSpotAudio(spot: ScenicSpot): void {
    this.notice = `正在播放《${spot.name}》的 ${spot.audioMinutes} 分钟图文讲解。`;
    this.addHistory('导览', spot.name, `播放 ${spot.audioMinutes} 分钟图文讲解`);
  }

  private toggleMapDetails(): void {
    this.mapExpanded = !this.mapExpanded;
    this.notice = this.mapExpanded ? '地图详情已展开，点击任一景点标记可切换讲解和人流提示。' : '地图详情已收起。';
  }

  private currentItineraryProfile(): ItineraryProfile {
    return {
      durationMinutes: this.itineraryDurationMinutes,
      interestTags: this.selectedInterestTags
    };
  }

  private generatePersonalItinerary(): void {
    if (this.selectedInterestTags.length === 0) {
      this.notice = '请至少选择一个兴趣标签后再生成行程。';
      return;
    }
    const plan = this.viewModel.generateItinerary(this.currentItineraryProfile(), this.spots, this.crowdSnapshots);
    if (plan.spotIds.length === 0) {
      this.notice = '当前时长不足以安排景点，请选择更长的游玩时长。';
      return;
    }
    this.activeItinerary = plan;
    this.originalItinerary = this.copyItinerary(plan);
    this.rerouteExplanation = '';
    this.autoAvoidCongestion = true;
    this.navigationActive = false;
    this.navigationStep = 0;
    this.selectedRouteId = this.mapRouteForInterest();
    this.notice = `已生成 ${plan.title}，舒适度 ${plan.comfortScore}，可开始导航。`;
    this.addHistory('路线', plan.title, `生成 ${plan.durationMinutes} 分钟动态错峰行程`);
  }

  private restoreOriginalItinerary(): void {
    if (this.originalItinerary === undefined) {
      return;
    }
    this.activeItinerary = this.copyItinerary(this.originalItinerary);
    this.rerouteExplanation = '';
    this.autoAvoidCongestion = false;
    this.notice = '已恢复原路线，并暂停自动绕行；你仍会持续看到客流预警。';
  }

  private copyItinerary(plan: ItineraryPlan): ItineraryPlan {
    const spotIds: string[] = [];
    const avoidedSpotNames: string[] = [];
    for (let index = 0; index < plan.spotIds.length; index++) {
      spotIds.push(plan.spotIds[index]);
    }
    for (let index = 0; index < plan.avoidedSpotNames.length; index++) {
      avoidedSpotNames.push(plan.avoidedSpotNames[index]);
    }
    return {
      id: plan.id,
      title: plan.title,
      spotIds: spotIds,
      durationMinutes: plan.durationMinutes,
      comfortScore: plan.comfortScore,
      avoidedSpotNames: avoidedSpotNames,
      savedWaitMinutes: plan.savedWaitMinutes,
      explanation: plan.explanation,
      generatedAt: plan.generatedAt
    };
  }

  private mapRouteForInterest(): string {
    if (this.selectedInterestTags.indexOf('文化') >= 0 || this.selectedInterestTags.indexOf('摄影') >= 0) {
      return 'culture';
    }
    if (this.selectedInterestTags.indexOf('亲子') >= 0 || this.selectedInterestTags.indexOf('自然') >= 0) {
      return 'family';
    }
    return 'leisure';
  }

  private toggleInterestTag(tag: string): void {
    const nextTags: string[] = [];
    const selected = this.hasSelectedInterest(tag);
    for (let index = 0; index < this.selectedInterestTags.length; index++) {
      if (this.selectedInterestTags[index] !== tag) {
        nextTags.push(this.selectedInterestTags[index]);
      }
    }
    if (!selected) {
      nextTags.push(tag);
    }
    if (nextTags.length === 0) {
      this.notice = '至少保留一个兴趣标签，才能生成个性化行程。';
      return;
    }
    this.selectedInterestTags = nextTags;
  }

  private hasSelectedInterest(tag: string): boolean {
    return this.selectedInterestTags.indexOf(tag) >= 0;
  }

  private refreshCrowdData(): void {
    this.crowdSnapshots = this.viewModel.repository.refreshCrowdSnapshots();
    this.crowdScenario = this.viewModel.repository.currentCrowdScenario();
    if (this.activeItinerary === undefined || !this.autoAvoidCongestion) {
      return;
    }
    const completedCount = this.navigationActive ? this.navigationStep : 0;
    const result = this.viewModel.replanItinerary(
      this.activeItinerary,
      completedCount,
      this.currentItineraryProfile(),
      this.spots,
      this.crowdSnapshots
    );
    if (!result.changed) {
      return;
    }
    this.activeItinerary = result.plan;
    this.rerouteExplanation = result.reason;
    this.rerouteAdoptions = this.rerouteAdoptions + 1;
    this.notice = `${result.reason} 已自动更新未到达行程。`;
  }

  private selectCrowdScenario(scenario: string): void {
    const adoptionBefore = this.rerouteAdoptions;
    this.viewModel.repository.setCrowdScenario(scenario);
    this.refreshCrowdData();
    if (adoptionBefore === this.rerouteAdoptions) {
      this.notice = `已切换为“${scenario}”场景，游客端热力图将在下一次刷新中同步。`;
    }
  }

  private currentCrowd(spot: ScenicSpot): CrowdSnapshot {
    return this.viewModel.crowdForSpot(spot, this.crowdSnapshots);
  }

  private currentCrowdPercent(spot: ScenicSpot): number {
    return this.currentCrowd(spot).currentPercent;
  }

  private currentForecastPercent(spot: ScenicSpot): number {
    return this.currentCrowd(spot).forecastPercent;
  }

  private crowdLevel(spot: ScenicSpot): string {
    return this.viewModel.crowdLevel(this.currentCrowdPercent(spot));
  }

  private crowdColor(spot: ScenicSpot): string {
    return this.viewModel.heatColor(this.currentCrowdPercent(spot));
  }

  private crowdTrend(spot: ScenicSpot): string {
    const trend = this.currentCrowd(spot).trend;
    if (trend === '上升') {
      return '↑ 热度上升';
    }
    if (trend === '下降') {
      return '↓ 热度下降';
    }
    return '→ 热度平稳';
  }

  private crowdUpdatedAt(): string {
    if (this.crowdSnapshots.length === 0) {
      return '未更新';
    }
    return this.crowdSnapshots[0].updatedAt;
  }

  private itineraryStopNumber(spotId: string): number {
    if (this.activeItinerary === undefined) {
      return 0;
    }
    for (let index = 0; index < this.activeItinerary.spotIds.length; index++) {
      if (this.activeItinerary.spotIds[index] === spotId) {
        return index + 1;
      }
    }
    return 0;
  }

  private itinerarySpotNames(plan: ItineraryPlan): string {
    const names: string[] = [];
    for (let index = 0; index < plan.spotIds.length; index++) {
      for (let spotIndex = 0; spotIndex < this.spots.length; spotIndex++) {
        if (this.spots[spotIndex].id === plan.spotIds[index]) {
          names.push(`${index + 1}.${this.spots[spotIndex].name}`);
          break;
        }
      }
    }
    return names.join('  →  ');
  }

  private highCrowdSpotCount(): number {
    let count = 0;
    for (let index = 0; index < this.spots.length; index++) {
      if (this.currentForecastPercent(this.spots[index]) > 70) {
        count = count + 1;
      }
    }
    return count;
  }

  private diversionMetric(): string {
    return `${126 + this.highCrowdSpotCount() * 37 + this.rerouteAdoptions}`;
  }

  private operationAlert(): string {
    if (this.crowdScenario === '断桥高峰') {
      return '断桥残雪预测热度已超过 90%：系统正将未到达游客分流至曲院风荷、花港观鱼等低热度区域。';
    }
    if (this.crowdScenario === '雷峰塔高峰') {
      return '雷峰塔预测热度已超过 90%：建议先游湖区景点，待客流回落后再进入南岸地标区域。';
    }
    return '景区客流总体平稳：错峰助手持续监测 15 分钟预测，并会在风险升高时自动推荐绕行。';
  }

  private currentRoute(): RecommendedRoute {
    for (let index = 0; index < this.routes.length; index++) {
      if (this.routes[index].id === this.selectedRouteId) {
        return this.routes[index];
      }
    }
    return this.routes[0];
  }

  private currentNavigationSpotIds(): string[] {
    if (this.activeItinerary !== undefined) {
      return this.activeItinerary.spotIds;
    }
    return this.currentRoute().spots;
  }

  private currentNavigationTitle(): string {
    if (this.activeItinerary !== undefined) {
      return this.activeItinerary.title;
    }
    return this.currentRoute().title;
  }

  private currentNavigationDuration(): string {
    if (this.activeItinerary !== undefined) {
      return `${this.activeItinerary.durationMinutes} 分钟`;
    }
    return this.currentRoute().duration;
  }

  private navigationInstruction(): string {
    const destinations = this.currentNavigationSpotIds();
    const destination = destinations[this.navigationStep];
    return `从苏堤北口出发，沿西湖步道前往「${destination}」。系统会持续检查未到达景点的 15 分钟客流预测。`;
  }

  private startNavigation(): void {
    this.navigationActive = true;
    this.navigationStep = 0;
    this.mapExpanded = true;
    this.notice = `已开始 ${this.currentNavigationTitle()} 导航，路线已显示在地图上。`;
    this.addHistory('导航', this.currentNavigationTitle(), `开始${this.currentNavigationDuration()}游览导航`);
  }

  private nextNavigationStep(): void {
    const destinations = this.currentNavigationSpotIds();
    if (this.navigationStep + 1 >= destinations.length) {
      this.navigationActive = false;
      this.notice = `${this.currentNavigationTitle()} 已完成，已保存到游客历史记录。`;
      this.addHistory('导航', this.currentNavigationTitle(), '完成路线导航');
      return;
    }
    this.navigationStep += 1;
    this.notice = `已到达 ${destinations[this.navigationStep - 1]}，继续前往下一站。`;
  }

  private crowdAdvice(spot: ScenicSpot): string {
    if (this.currentForecastPercent(spot) > 70) {
      return '预测高峰：错峰助手会优先推荐低热度替代景点。';
    }
    return '人流舒适：可按当前路线正常前往。';
  }

  @Builder
  reservationPage() {
    Column({ space: 18 }) {
      Column({ space: 7 }) {
        Text('预约排队，让等待变得可预期')
          .fontSize(21)
          .fontWeight(FontWeight.Bold)
          .fontColor('#214231')
        Text(`当前运营时钟 ${this.simulatedClock()} · 临近时段会在“我的”页显示应用内提醒。`)
          .fontSize(13)
          .fontColor('#728077')
      }
      .alignItems(HorizontalAlign.Start)
      .width('100%')

      Button('刷新实时排队数据')
        .width('100%')
        .height(40)
        .backgroundColor('#E5F2E9')
        .fontColor('#176B43')
        .borderRadius(20)
        .onClick(() => this.refreshQueues())

      ForEach(this.projects, (project: ProjectReservation, index: number) => {
        Column({ space: 11 }) {
          Row() {
            Column({ space: 4 }) {
              Text(project.name)
                .fontSize(18)
                .fontWeight(FontWeight.Medium)
                .fontColor('#24362B')
              Text(`${project.category} · ${project.venue}`)
                .fontSize(12)
                .fontColor('#6F7F75')
              Text(`${project.startTime} 入场 · 预计 ${project.endTime} 结束 · 前方约 ${this.projectQueueSize(project)} 人`)
                .fontSize(12)
                .fontColor('#6F7F75')
              Text(`节目约 ${this.durationMinutes(project.startAt, project.endAt)} 分钟 · 预计等待 ${this.projectWaitMinutes(project)} 分钟`)
                .fontSize(12)
                .fontColor('#6F7F75')
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)
            Text(`余 ${this.projectRemaining(project, index)}/${project.capacity}`)
              .fontSize(12)
              .fontColor(this.projectRemaining(project, index) < 10 ? '#C3621F' : '#28764C')
          }
          Row({ space: 10 }) {
            Button(this.hasProjectBooking(project.id) ? '取消预约' : '预约时段')
              .layoutWeight(1)
              .height(38)
              .fontSize(13)
              .backgroundColor(this.hasProjectBooking(project.id) ? '#E2F2E8' : '#176B43')
              .fontColor(this.hasProjectBooking(project.id) ? '#176B43' : Color.White)
              .borderRadius(19)
              .onClick(() => this.toggleProjectBooking(project))
            Button(this.hasFastPass(project.id) ? '取消快速通行' : (this.hasProjectBooking(project.id) ? `升级快速通行 ￥${project.fastPassPrice}` : `预约并开通 ￥${project.fastPassPrice}`))
              .layoutWeight(1)
              .height(38)
              .fontSize(13)
              .backgroundColor('#FFF0E7')
              .fontColor('#C85C28')
              .borderRadius(19)
              .onClick(() => this.toggleProjectFastPass(project))
          }
          Text(this.hasProjectBooking(project.id)
            ? `已确认 ${project.startTime}–${project.endTime}${this.hasFastPass(project.id) ? ' · 已启用快速核验通道' : ` · 入场前 ${project.reminderMinutes} 分钟提醒`}`
            : `快速通行余 ${this.projectFastPassRemaining(project, index)}/${project.fastPassCapacity}，与预约时段绑定。`)
            .fontSize(12)
            .fontColor(this.hasProjectBooking(project.id) ? '#28764C' : '#8A715D')
        }
        .width('100%')
        .padding(17)
        .backgroundColor(Color.White)
        .borderRadius(17)
      }, (project: ProjectReservation) => project.id)

      this.sectionHeading('餐饮住宿', '好评商家与住玩套餐')
      Row({ space: 8 }) {
        ForEach(['全部', '住宿', '餐饮'], (category: string) => {
          Text(category)
            .fontSize(13)
            .fontColor(this.selectedMerchantCategory === category ? Color.White : '#41735A')
            .backgroundColor(this.selectedMerchantCategory === category ? '#176B43' : '#E5F2E9')
            .padding({ left: 13, right: 13, top: 7, bottom: 7 })
            .borderRadius(16)
            .onClick(() => this.selectedMerchantCategory = category)
        }, (category: string) => category)
      }
      ForEach(this.merchants, (merchant: MerchantItem) => {
        if (this.selectedMerchantCategory === '全部' || this.selectedMerchantCategory === merchant.category) {
          this.merchantCard(merchant)
        }
      }, (merchant: MerchantItem) => merchant.id)
    }
    .width('100%')
  }

  @Builder
  merchantCard(merchant: MerchantItem) {
    Column({ space: 9 }) {
      Row({ space: 10 }) {
        Column({ space: 4 }) {
          Text(`${merchant.category} · ${merchant.name}`)
            .fontSize(17)
            .fontWeight(FontWeight.Medium)
            .fontColor('#24362B')
          Text(merchant.description)
            .fontSize(12)
            .fontColor('#6F7F75')
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
        Text(merchant.priceText)
          .fontSize(13)
          .fontWeight(FontWeight.Medium)
          .fontColor('#C85C28')
      }
      .width('100%')

      Column({ space: 3 }) {
        Text(merchant.offerTitle)
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .fontColor('#365446')
        Text(merchant.offerDetails)
          .fontSize(12)
          .lineHeight(18)
          .fontColor('#6F7F75')
        Text(merchant.category === '住宿'
          ? `本次入住：${this.displayDateTime(merchant.bookingStartAt)} 至 ${this.displayDateTime(merchant.bookingEndAt)}`
          : `本次到店：${this.displayDateTime(merchant.bookingStartAt)}–${this.timeOf(merchant.bookingEndAt)}`)
          .fontSize(12)
          .fontColor('#6F7F75')
      }
      .width('100%')
      .alignItems(HorizontalAlign.Start)
      .padding(10)
      .backgroundColor('#F3F8F4')
      .borderRadius(11)

      Row({ space: 6 }) {
        ForEach(merchant.facilities, (facility: string) => {
          Text(facility)
            .fontSize(11)
            .fontColor('#41735A')
            .backgroundColor('#E5F2E9')
            .padding({ left: 8, right: 8, top: 5, bottom: 5 })
            .borderRadius(11)
        }, (facility: string) => facility)
      }
      .width('100%')

      Column({ space: 3 }) {
        Text(`★ ${merchant.rating} · ${merchant.reviewCount} 条真实评价 · ${merchant.reviewTime}`)
          .fontSize(12)
          .fontColor('#C77C20')
        Text(merchant.latestReview)
          .fontSize(12)
          .lineHeight(18)
          .fontColor('#5A6E61')
      }
      .width('100%')
      .alignItems(HorizontalAlign.Start)

      Row({ space: 10 }) {
        Button(this.hasMerchantBooking(merchant.id) ? '取消预订' : (merchant.category === '住宿' ? '预订客房' : '预订餐位'))
          .layoutWeight(1)
          .height(36)
          .fontSize(12)
          .backgroundColor(this.hasMerchantBooking(merchant.id) ? '#E2F2E8' : '#176B43')
          .fontColor(this.hasMerchantBooking(merchant.id) ? '#176B43' : Color.White)
          .borderRadius(18)
          .onClick(() => this.toggleMerchantBooking(merchant))
        Button('查看评价')
          .layoutWeight(1)
          .height(36)
          .fontSize(12)
          .backgroundColor('#FFF4E6')
          .fontColor('#B66A28')
          .borderRadius(18)
          .onClick(() => this.notice = `${merchant.name} 当前评分 ${merchant.rating}，已有 ${merchant.reviewCount} 条游客评价。`)
      }
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Color.White)
    .borderRadius(16)
    .margin({ top: 8 })
  }

  private hasMerchantBooking(merchantId: string): boolean {
    return this.hasActiveBooking(this.merchantBookingKind(merchantId), merchantId);
  }

  private merchantBookingKind(merchantId: string): string {
    for (let index = 0; index < this.merchants.length; index++) {
      if (this.merchants[index].id === merchantId) {
        return this.merchants[index].category === '住宿' ? 'HOTEL' : 'RESTAURANT';
      }
    }
    return 'RESTAURANT';
  }

  private toggleMerchantBooking(merchant: MerchantItem): void {
    const kind = merchant.category === '住宿' ? 'HOTEL' : 'RESTAURANT';
    const existing = this.findActiveBooking(kind, merchant.id);
    if (existing !== undefined) {
      this.showCancelBookingDialog(existing);
      return;
    }
    this.requestBooking(this.createBooking(kind, merchant.id, merchant.name, merchant.bookingStartAt, merchant.bookingEndAt, false, false));
  }

  private toggleProjectBooking(project: ProjectReservation): void {
    const existing = this.findActiveBooking('PROJECT', project.id);
    if (existing !== undefined) {
      this.showCancelBookingDialog(existing);
      return;
    }
    this.requestBooking(this.createBooking('PROJECT', project.id, project.name, project.startAt, project.endAt, false, true));
  }

  private toggleProjectFastPass(project: ProjectReservation): void {
    const existing = this.findActiveBooking('PROJECT', project.id);
    if (existing === undefined) {
      this.requestBooking(this.createBooking('PROJECT', project.id, project.name, project.startAt, project.endAt, true, true));
      return;
    }
    if (this.bookingHasFastPass(existing)) {
      this.showDowngradeFastPassDialog(existing);
      return;
    }
    const index = this.projectIndex(project.id);
    if (this.projectFastPassRemaining(project, index) <= 0) {
      this.notice = `${project.name} 的快速通行名额已用完。`;
      return;
    }
    AlertDialog.show({
      title: '升级快速通行',
      message: `为“${project.name}”开通快速通行券（￥${project.fastPassPrice}），原预约时段 ${project.startTime}–${project.endTime} 保持不变。`,
      primaryButton: { value: '暂不升级', action: () => this.notice = '已保留普通预约。' },
      secondaryButton: { value: '确认升级', action: () => this.upgradeFastPass(existing, project) }
    });
  }

  private upgradeFastPass(booking: BookingRecord, project: ProjectReservation): void {
    const addons: BookingAddon[] = [];
    for (let addonIndex = 0; addonIndex < booking.addons.length; addonIndex++) {
      addons.push(booking.addons[addonIndex]);
    }
    addons.push({ type: 'FAST_PASS', name: '快速通行券', price: project.fastPassPrice, status: '已开通' });
    this.replaceBookingAddons(booking, addons);
    this.adjustProjectFastPassInventory(this.projectIndex(project.id), -1);
    this.notice = `${project.name} 已升级快速通行，预约时段保持 ${project.startTime}–${project.endTime}。`;
    this.addHistory('预约', project.name, `已升级 ￥${project.fastPassPrice} 快速通行服务`);
  }

  private showDowngradeFastPassDialog(booking: BookingRecord): void {
    AlertDialog.show({
      title: '取消快速通行',
      message: `将取消“${booking.title}”的快速通行权益，保留原预约 ${this.bookingTimeRange(booking)}。`,
      primaryButton: { value: '保留权益', action: () => this.notice = '快速通行权益仍然有效。' },
      secondaryButton: { value: '确认取消', action: () => this.downgradeFastPass(booking) }
    });
  }

  private downgradeFastPass(booking: BookingRecord): void {
    const addons: BookingAddon[] = [];
    for (let addonIndex = 0; addonIndex < booking.addons.length; addonIndex++) {
      const addon = booking.addons[addonIndex];
      if (addon.type !== 'FAST_PASS') {
        addons.push(addon);
      }
    }
    this.replaceBookingAddons(booking, addons);
    this.adjustProjectFastPassInventory(this.projectIndex(booking.resourceId), 1);
    this.notice = `${booking.title} 的快速通行已取消，普通预约仍然有效。`;
    this.addHistory('预约', booking.title, '快速通行已取消，保留普通预约');
  }

  private replaceBookingAddons(booking: BookingRecord, addons: BookingAddon[]): void {
    const nextBookings: BookingRecord[] = [];
    for (let index = 0; index < this.bookings.length; index++) {
      const current = this.bookings[index];
      if (current.id === booking.id) {
        nextBookings.push({
          id: current.id,
          kind: current.kind,
          resourceId: current.resourceId,
          title: current.title,
          startAt: current.startAt,
          endAt: current.endAt,
          status: current.status,
          cancellableUntil: current.cancellableUntil,
          reminderEnabled: current.reminderEnabled,
          addons: addons,
          qrPayload: current.qrPayload
        });
      } else {
        nextBookings.push(current);
      }
    }
    this.bookings = nextBookings;
  }

  private ticketRemaining(ticket: TicketProduct, index: number): number {
    return ticket.remaining + this.ticketInventoryDelta[index];
  }

  private isTicketPaused(ticketId: string): boolean {
    return this.ticketPausedIds.indexOf(ticketId) >= 0;
  }

  private adjustTicketInventory(index: number, amount: number): void {
    const nextInventory: number[] = [];
    for (let inventoryIndex = 0; inventoryIndex < this.ticketInventoryDelta.length; inventoryIndex++) {
      nextInventory.push(inventoryIndex === index ? this.ticketInventoryDelta[inventoryIndex] + amount : this.ticketInventoryDelta[inventoryIndex]);
    }
    this.ticketInventoryDelta = nextInventory;
  }

  private projectIndex(projectId: string): number {
    for (let index = 0; index < this.projects.length; index++) {
      if (this.projects[index].id === projectId) {
        return index;
      }
    }
    return 0;
  }

  private projectRemaining(project: ProjectReservation, index: number): number {
    return project.remaining + this.projectInventoryDelta[index];
  }

  private projectFastPassRemaining(project: ProjectReservation, index: number): number {
    return project.fastPassRemaining + this.projectFastPassInventoryDelta[index];
  }

  private projectFastPassPrice(projectId: string): number {
    return this.projects[this.projectIndex(projectId)].fastPassPrice;
  }

  private durationMinutes(startAt: string, endAt: string): number {
    const startHour = Number(startAt.substring(11, 13));
    const startMinute = Number(startAt.substring(14, 16));
    const endHour = Number(endAt.substring(11, 13));
    const endMinute = Number(endAt.substring(14, 16));
    return (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  }

  private projectWaitMinutes(project: ProjectReservation): number {
    const refreshedMinutes = (this.queueRefreshCount % 4) * 3;
    const releasedMinutes = this.projectQueueReleaseCount(project) * 3;
    return Math.max(5, project.waitMinutes - refreshedMinutes - releasedMinutes);
  }

  private projectQueueSize(project: ProjectReservation): number {
    const refreshedVisitors = (this.queueRefreshCount % 4) * 7;
    const releasedVisitors = this.projectQueueReleaseCount(project) * 7;
    return Math.max(3, project.queueSize - refreshedVisitors - releasedVisitors);
  }

  private projectQueueReleaseCount(project: ProjectReservation): number {
    return this.projectQueueReleaseCounts[this.projectIndex(project.id)];
  }

  private simulatedClock(): string {
    const minute = 5 + this.queueRefreshCount * 3;
    return `10:${minute < 10 ? '0' : ''}${minute}`;
  }

  private hasProjectBooking(projectId: string): boolean {
    return this.hasActiveBooking('PROJECT', projectId);
  }

  private hasFastPass(projectId: string): boolean {
    const booking = this.findActiveBooking('PROJECT', projectId);
    return booking !== undefined && this.bookingHasFastPass(booking);
  }

  private adjustProjectInventory(index: number, amount: number): void {
    const nextInventory: number[] = [];
    for (let inventoryIndex = 0; inventoryIndex < this.projectInventoryDelta.length; inventoryIndex++) {
      nextInventory.push(inventoryIndex === index ? this.projectInventoryDelta[inventoryIndex] + amount : this.projectInventoryDelta[inventoryIndex]);
    }
    this.projectInventoryDelta = nextInventory;
  }

  private adjustProjectFastPassInventory(index: number, amount: number): void {
    const nextInventory: number[] = [];
    for (let inventoryIndex = 0; inventoryIndex < this.projectFastPassInventoryDelta.length; inventoryIndex++) {
      nextInventory.push(inventoryIndex === index ? this.projectFastPassInventoryDelta[inventoryIndex] + amount : this.projectFastPassInventoryDelta[inventoryIndex]);
    }
    this.projectFastPassInventoryDelta = nextInventory;
  }

  private refreshQueues(): void {
    this.queueRefreshCount = this.queueRefreshCount + 1;
    this.notice = `已刷新 ${this.simulatedClock()} 的排队数据，部分项目已完成放行。`;
    this.addHistory('预约', '排队数据刷新', '查看各项目最新等待时间');
  }

  private triggerProjectReminder(booking: BookingRecord): void {
    if (this.remindedProjectIds.indexOf(booking.resourceId) >= 0) {
      this.notice = `${booking.title} 的到场提醒已发送。`;
      return;
    }
    this.remindedProjectIds = [...this.remindedProjectIds, booking.resourceId];
    this.notice = `到场提醒：请在 ${booking.title} 开始前前往集合点${this.bookingHasFastPass(booking) ? '，快速核验通道已开启。' : '。'}`;
    this.addHistory('提醒', booking.title, '已发送应用内到场提醒');
  }

  private removeProjectReminder(projectId: string): void {
    const nextIds: string[] = [];
    for (let index = 0; index < this.remindedProjectIds.length; index++) {
      if (this.remindedProjectIds[index] !== projectId) {
        nextIds.push(this.remindedProjectIds[index]);
      }
    }
    this.remindedProjectIds = nextIds;
  }

  @Builder
  mallPage() {
    if (this.mallCartOpen) {
      this.shoppingCartPage()
    } else {
      Column({ space: 18 }) {
      Row({ space: 12 }) {
        Column({ space: 7 }) {
          Text('景区好物，寄一份山水回家')
            .fontSize(21)
            .fontWeight(FontWeight.Bold)
            .fontColor('#214231')
          Text(`当前积分 ${this.points} · 分享游玩照片可额外获得 20 积分`)
            .fontSize(13)
            .fontColor('#6F7F75')
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
        Button(`购物车 ${this.cartItemCount()} 件`)
          .height(36)
          .fontSize(12)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(18)
          .onClick(() => this.mallCartOpen = true)
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)

      ForEach(this.products, (product: MallProduct) => {
        Row() {
          Column({ space: 6 }) {
            Text(product.name)
              .fontSize(17)
              .fontWeight(FontWeight.Medium)
              .fontColor('#24362B')
            Text(product.description)
              .fontSize(12)
              .fontColor('#6F7F75')
            Text(`${this.viewModel.formatPrice(product.price)} · 送 ${product.points} 积分`)
              .fontSize(13)
              .fontColor('#C85C28')
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          Button(this.cartQuantity(product.id) > 0 ? `已选 ${this.cartQuantity(product.id)}` : '加入购物车')
            .fontSize(12)
            .height(35)
            .backgroundColor(this.cartQuantity(product.id) > 0 ? '#E2F2E8' : '#176B43')
            .fontColor(this.cartQuantity(product.id) > 0 ? '#176B43' : Color.White)
            .borderRadius(17)
            .onClick(() => this.buyProduct(product))
        }
        .width('100%')
        .padding(16)
        .backgroundColor(Color.White)
        .borderRadius(16)
      }, (product: MallProduct) => product.id)

      Column({ space: 7 }) {
        Text('限时住玩组合')
          .fontSize(17)
          .fontWeight(FontWeight.Medium)
          .fontColor('#24362B')
        Text('湖畔精品酒店 + 西湖环湖游船票，两人套餐 ￥888')
          .fontSize(13)
          .fontColor('#6F7F75')
        Button('生成组合预订单')
          .height(36)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(18)
          .onClick(() => this.notice = '住玩组合订单已生成，可在“我的”页查看。')
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Color.White)
      .borderRadius(16)
    }
    .width('100%')
    }
  }

  @Builder
  shoppingCartPage() {
    Column({ space: 16 }) {
      Row() {
        Column({ space: 5 }) {
          Text('购物车')
            .fontSize(22)
            .fontWeight(FontWeight.Bold)
            .fontColor('#214231')
          Text(`已选 ${this.cartItemCount()} 件景区好物`)
            .fontSize(13)
            .fontColor('#6F7F75')
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
        Button('继续选购')
          .height(34)
          .fontSize(12)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(17)
          .onClick(() => this.mallCartOpen = false)
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)

      if (this.cartItems.length === 0) {
        Text('购物车还是空的，去挑一件喜欢的景区文创吧。')
          .fontSize(14)
          .fontColor('#738078')
          .width('100%')
          .padding(18)
          .backgroundColor(Color.White)
          .borderRadius(16)
      } else {
        ForEach(this.cartItems, (item: CartItem) => {
          Row({ space: 10 }) {
            Column({ space: 5 }) {
              Text(this.productForCartItem(item).name)
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .fontColor('#24362B')
              Text(this.productForCartItem(item).description)
                .fontSize(12)
                .fontColor('#6F7F75')
              Text(`${this.viewModel.formatPrice(this.productForCartItem(item).price)} × ${item.quantity}`)
                .fontSize(14)
                .fontColor('#C85C28')
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)
            Column({ space: 6 }) {
              Row({ space: 7 }) {
                Text('-')
                  .width(28)
                  .height(28)
                  .lineHeight(28)
                  .textAlign(TextAlign.Center)
                  .fontSize(18)
                  .fontWeight(FontWeight.Bold)
                  .backgroundColor('#E5F2E9')
                  .fontColor('#176B43')
                  .borderRadius(14)
                  .onClick(() => this.adjustCartQuantity(item.productId, -1))
                Text(`${item.quantity}`)
                  .fontSize(14)
                  .fontWeight(FontWeight.Medium)
                  .fontColor('#24362B')
                  .width(20)
                  .textAlign(TextAlign.Center)
                Text('+')
                  .width(28)
                  .height(28)
                  .lineHeight(28)
                  .textAlign(TextAlign.Center)
                  .fontSize(18)
                  .fontWeight(FontWeight.Bold)
                  .backgroundColor('#176B43')
                  .fontColor(Color.White)
                  .borderRadius(14)
                  .onClick(() => this.adjustCartQuantity(item.productId, 1))
              }
              Button('移除')
                .height(26)
                .fontSize(11)
                .backgroundColor('#FFF0E7')
                .fontColor('#C85C28')
                .borderRadius(13)
                .onClick(() => this.removeCartItem(item.productId))
            }
            .alignItems(HorizontalAlign.End)
          }
          .width('100%')
          .padding(16)
          .backgroundColor(Color.White)
          .borderRadius(16)
        }, (item: CartItem) => item.productId)

        Column({ space: 9 }) {
          Text('收货信息')
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor('#24362B')
          TextInput({ text: this.deliveryRecipient, placeholder: '收货人姓名' })
            .onChange((value: string) => this.deliveryRecipient = value)
            .height(42)
            .backgroundColor(Color.White)
            .borderRadius(10)
          TextInput({ text: this.deliveryPhone, placeholder: '联系电话' })
            .onChange((value: string) => this.deliveryPhone = value)
            .height(42)
            .backgroundColor(Color.White)
            .borderRadius(10)
          TextInput({ text: this.deliveryAddress, placeholder: '详细收货地址' })
            .onChange((value: string) => this.deliveryAddress = value)
            .height(42)
            .backgroundColor(Color.White)
            .borderRadius(10)
        }
        .width('100%')
        .padding(14)
        .backgroundColor('#F7F9F7')
        .borderRadius(15)

        Column({ space: 9 }) {
          Row() {
            Text('合计')
              .fontSize(15)
              .fontColor('#52665A')
              .layoutWeight(1)
            Text(this.viewModel.formatPrice(this.cartTotalPrice()))
              .fontSize(21)
              .fontWeight(FontWeight.Bold)
              .fontColor('#C85C28')
          }
          .width('100%')
          Text(`共 ${this.cartItemCount()} 件 · 结算后获得 ${this.cartEarnedPoints()} 积分`)
            .fontSize(12)
            .fontColor('#657A6B')
          Button('提交订单并结算')
            .width('100%')
            .height(42)
            .fontSize(14)
            .backgroundColor('#176B43')
            .fontColor(Color.White)
            .borderRadius(21)
            .onClick(() => this.checkoutCart())
        }
        .width('100%')
        .padding(16)
        .backgroundColor('#F1F8F3')
        .borderRadius(16)
      }
      }
      .width('100%')
  }

  private buyProduct(product: MallProduct): void {
    this.adjustCartQuantity(product.id, 1);
    this.notice = `${product.name} 已加入购物车，请在购物车中统一结算。`;
  }

  private cartQuantity(productId: string): number {
    for (let index = 0; index < this.cartItems.length; index++) {
      if (this.cartItems[index].productId === productId) {
        return this.cartItems[index].quantity;
      }
    }
    return 0;
  }

  private adjustCartQuantity(productId: string, amount: number): void {
    const nextCartItems: CartItem[] = [];
    let updated = false;
    for (let index = 0; index < this.cartItems.length; index++) {
      const item = this.cartItems[index];
      if (item.productId === productId) {
        const nextQuantity = item.quantity + amount;
        if (nextQuantity > 0) {
          nextCartItems.push({ productId: item.productId, quantity: nextQuantity });
        }
        updated = true;
      } else {
        nextCartItems.push({ productId: item.productId, quantity: item.quantity });
      }
    }
    if (!updated && amount > 0) {
      nextCartItems.push({ productId: productId, quantity: amount });
    }
    this.cartItems = nextCartItems;
  }

  private removeCartItem(productId: string): void {
    this.adjustCartQuantity(productId, -this.cartQuantity(productId));
    this.notice = '商品已从购物车移除。';
  }

  private productForCartItem(item: CartItem): MallProduct {
    for (let index = 0; index < this.products.length; index++) {
      if (this.products[index].id === item.productId) {
        return this.products[index];
      }
    }
    return this.products[0];
  }

  private cartItemCount(): number {
    let count = 0;
    for (let index = 0; index < this.cartItems.length; index++) {
      count = count + this.cartItems[index].quantity;
    }
    return count;
  }

  private cartTotalPrice(): number {
    let total = 0;
    for (let index = 0; index < this.cartItems.length; index++) {
      const item = this.cartItems[index];
      total = total + this.productForCartItem(item).price * item.quantity;
    }
    return total;
  }

  private cartEarnedPoints(): number {
    let points = 0;
    for (let index = 0; index < this.cartItems.length; index++) {
      const item = this.cartItems[index];
      points = points + this.productForCartItem(item).points * item.quantity;
    }
    return points;
  }

  private checkoutCart(): void {
    if (this.cartItems.length === 0) {
      this.notice = '购物车为空，暂不能结算。';
      return;
    }
    if (this.deliveryRecipient.trim().length === 0 || this.deliveryPhone.trim().length < 7 || this.deliveryAddress.trim().length === 0) {
      this.notice = '请完整填写收货人、联系电话和详细地址后再提交订单。';
      return;
    }
    const itemNames: string[] = [];
    for (let index = 0; index < this.cartItems.length; index++) {
      const item = this.cartItems[index];
      itemNames.push(`${this.productForCartItem(item).name} ×${item.quantity}`);
    }
    const earnedPoints = this.cartEarnedPoints();
    const totalPrice = this.cartTotalPrice();
    this.points = this.points + earnedPoints;
    this.addHistory('购物', `景区文创订单 · ${this.cartItemCount()} 件`, `${itemNames.join('、')} · 共 ${this.viewModel.formatPrice(totalPrice)} · 寄往 ${this.deliveryAddress}`);
    this.cartItems = [];
    this.mallCartOpen = false;
    this.notice = `订单已提交，共 ${this.viewModel.formatPrice(totalPrice)}，将寄送至 ${this.deliveryRecipient}。获得 ${earnedPoints} 积分。`;
  }

  private selectJourneyPhoto(): void {
    const options = new photoAccessHelper.PhotoSelectOptions();
    options.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
    options.maxSelectNumber = 1;
    const picker = new photoAccessHelper.PhotoViewPicker();
    picker.select(options).then((result) => {
      if (result.photoUris.length === 0) {
        this.notice = '未选择照片，可再次打开相册选择。';
        return;
      }
      this.journeyPhotoUri = result.photoUris[0];
      this.notice = '游玩照片已选择，填写感想后即可发布分享。';
    }).catch(() => {
      this.notice = '暂时无法打开系统相册，请稍后再试。';
    });
  }

  private shareJourney(): void {
    if (this.sharedToday) {
      this.notice = '今天已经分享过了，明天再来记录新的风景吧。';
      return;
    }
    if (this.journeyPhotoUri.length === 0) {
      this.notice = '请先从系统相册选择一张游玩照片。';
      return;
    }
    this.sharedToday = true;
    this.points += 20;
    this.notice = '分享成功，已获得 20 积分。';
    this.addHistory('互动', '游玩照片分享', this.journeyPhotoCaption.trim().length > 0 ? `${this.journeyPhotoCaption} · 获得 20 积分` : '已分享游玩照片 · 获得 20 积分');
  }

  @Builder
  profilePage() {
    if (this.selectedHistoryRecordId.length > 0) {
      this.historyRecordDetailPage()
    } else if (this.historyPageType.length > 0) {
      this.historyRecordListPage()
    } else {
      this.profileOverviewPage()
    }
  }

  @Builder
  profileOverviewPage() {
    Column({ space: 18 }) {
      Row({ space: 12 }) {
        Text('旅')
          .fontSize(20)
          .fontColor(Color.White)
          .textAlign(TextAlign.Center)
          .width(50)
          .height(50)
          .lineHeight(50)
          .backgroundColor('#176B43')
          .borderRadius(25)
        Column({ space: 4 }) {
          Text('旅行者')
            .fontSize(18)
            .fontWeight(FontWeight.Medium)
            .fontColor('#24362B')
          Text(`西湖会员 · ${this.points} 积分`)
            .fontSize(13)
            .fontColor('#718077')
        }
        .alignItems(HorizontalAlign.Start)
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)

      Column({ space: 10 }) {
        Row() {
          Column({ space: 4 }) {
            Text('小湖助手')
              .fontSize(17)
              .fontWeight(FontWeight.Medium)
              .fontColor('#24362B')
            Text('问景点、人流、路线、票务和预约')
              .fontSize(12)
              .fontColor('#718077')
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          Text('?')
            .fontSize(13)
            .fontWeight(FontWeight.Bold)
            .fontColor(Color.White)
            .textAlign(TextAlign.Center)
            .width(38)
            .height(38)
            .lineHeight(38)
            .backgroundColor('#176B43')
            .borderRadius(19)
        }
        .alignItems(VerticalAlign.Center)
        Button('打开小湖助手')
          .width('100%')
          .height(40)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(20)
          .onClick(() => this.activeTab = '客服')
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Color.White)
      .borderRadius(16)

      Column({ space: 10 }) {
        Row() {
          Column({ space: 4 }) {
            Text('分享我的游玩照片')
              .fontSize(17)
              .fontWeight(FontWeight.Medium)
              .fontColor('#24362B')
            Text(this.journeyPhotoUri.length > 0 ? '照片已选择，可添加感想后分享给其他游客。' : '从系统相册选择一张西湖游玩照片，分享可获得 20 积分。')
              .fontSize(12)
              .lineHeight(18)
              .fontColor('#718077')
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          Text('▧')
            .fontSize(22)
            .fontColor('#176B43')
            .width(34)
            .height(34)
            .lineHeight(34)
            .textAlign(TextAlign.Center)
            .backgroundColor('#E5F2E9')
            .borderRadius(17)
        }
        .width('100%')
        .alignItems(VerticalAlign.Center)
        if (this.journeyPhotoUri.length > 0) {
          Image(this.journeyPhotoUri)
            .width('100%')
            .height(150)
            .objectFit(ImageFit.Cover)
            .borderRadius(13)
          TextInput({ text: this.journeyPhotoCaption, placeholder: '写下此刻的游玩感想（可选）' })
            .onChange((value: string) => this.journeyPhotoCaption = value)
            .height(42)
            .backgroundColor('#F3F6F4')
            .borderRadius(10)
        }
        Row({ space: 10 }) {
          Button(this.journeyPhotoUri.length > 0 ? '重新选择照片' : '选择游玩照片')
            .layoutWeight(1)
            .height(38)
            .fontSize(12)
            .backgroundColor('#E5F2E9')
            .fontColor('#176B43')
            .borderRadius(19)
            .onClick(() => this.selectJourneyPhoto())
          Button(this.sharedToday ? '今日已分享' : '发布分享 +20 积分')
            .layoutWeight(1)
            .height(38)
            .fontSize(12)
            .backgroundColor(this.sharedToday ? '#E2F2E8' : '#176B43')
            .fontColor(this.sharedToday ? '#176B43' : Color.White)
            .borderRadius(19)
            .onClick(() => this.shareJourney())
        }
        .width('100%')
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Color.White)
      .borderRadius(16)

      if (this.activeBookings('TICKET').length > 0) {
        this.sectionHeading('我的电子票', `${this.activeBookings('TICKET').length} 张待使用`)
        ForEach(this.activeBookings('TICKET'), (booking: BookingRecord) => {
        Column({ space: 10 }) {
          Text(booking.title)
            .fontSize(17)
            .fontWeight(FontWeight.Medium)
            .fontColor('#24362B')
          Text(`${this.bookingTimeRange(booking)} · ${booking.status}`)
            .fontSize(13)
            .fontColor('#6F7F75')
          Text('▣ ▦ ▣ ▤ ▦ ▣\n▦ ▣ ▤ ▣ ▦ ▤\n▣ ▤ ▦ ▣ ▤ ▦')
            .fontSize(22)
            .fontColor('#203128')
            .lineHeight(28)
            .padding(12)
            .backgroundColor('#F2F5F3')
            .borderRadius(8)
          Text('验票码：' + booking.qrPayload)
            .fontSize(9)
            .fontColor('#7B887F')
            .maxLines(1)
          Row({ space: 10 }) {
            Button('取消电子票')
              .layoutWeight(1)
              .height(36)
              .backgroundColor('#FFF0E7')
              .fontColor('#C85C28')
              .borderRadius(18)
              .onClick(() => this.showCancelBookingDialog(booking))
            Button('闸机验票')
              .layoutWeight(1)
              .height(36)
              .backgroundColor('#E5F2E9')
              .fontColor('#176B43')
              .borderRadius(18)
              .onClick(() => this.notice = '验票成功，欢迎入园！')
          }
        }
        .width('100%')
        .padding(17)
        .backgroundColor(Color.White)
        .borderRadius(17)
        .margin({ top: 7 })
        }, (booking: BookingRecord) => booking.id)
      } else {
        Text('还没有电子票，去首页开启一段山水之旅。')
          .fontSize(14)
          .fontColor('#738078')
          .width('100%')
          .padding(16)
          .backgroundColor(Color.White)
          .borderRadius(15)
      }

      this.sectionHeading('我的预约', `${this.scheduledBookings().length} 项待使用`)
      if (this.scheduledBookings().length === 0) {
        Text('暂无酒店、餐饮或项目预约。')
          .fontSize(13)
          .fontColor('#738078')
          .width('100%')
          .padding(15)
          .backgroundColor(Color.White)
          .borderRadius(15)
      } else {
        ForEach(this.scheduledBookings(), (booking: BookingRecord) => {
          Column({ space: 7 }) {
            Text(`${this.bookingKindLabel(booking.kind)}：${booking.title}${this.bookingHasFastPass(booking) ? ' · 快速通行' : ''}`)
              .fontSize(13)
              .fontColor('#286C49')
            Text(`${this.bookingTimeRange(booking)} · ${booking.status}`)
              .fontSize(12)
              .fontColor('#657A6B')
            if (booking.kind === 'PROJECT') {
              Text(this.remindedProjectIds.indexOf(booking.resourceId) >= 0 ? '到场提醒已发送' : '可发送到场提醒')
                .fontSize(12)
                .fontColor('#657A6B')
            } else {
              Text(`${booking.cancellableUntil} · 取消后释放库存`)
                .fontSize(12)
                .fontColor('#657A6B')
            }
            Row({ space: 8 }) {
              if (booking.kind === 'PROJECT') {
                Button(this.remindedProjectIds.indexOf(booking.resourceId) >= 0 ? '提醒已发送' : '发送提醒')
                  .layoutWeight(1)
                  .height(32)
                  .fontSize(12)
                  .backgroundColor('#F1F7F3')
                  .fontColor('#176B43')
                  .borderRadius(16)
                  .onClick(() => this.triggerProjectReminder(booking))
                if (this.bookingHasFastPass(booking)) {
                  Button('取消快速通行')
                    .layoutWeight(1)
                    .height(32)
                    .fontSize(12)
                    .backgroundColor('#FFF4E6')
                    .fontColor('#B66A28')
                    .borderRadius(16)
                    .onClick(() => this.showDowngradeFastPassDialog(booking))
                }
              }
              Button('取消预约')
                .layoutWeight(1)
                .height(32)
                .fontSize(12)
                .backgroundColor('#FFF0E7')
                .fontColor('#C85C28')
                .borderRadius(16)
                .onClick(() => this.showCancelBookingDialog(booking))
            }
            .width('100%')
          }
          .alignItems(HorizontalAlign.Start)
          .width('100%')
          .padding(14)
          .backgroundColor('#E9F7EE')
          .borderRadius(14)
          .margin({ top: 7 })
        }, (booking: BookingRecord) => booking.id)
      }

      this.profileHistorySummary()

      this.sectionHeading('意见反馈', '自动分类 · 定期回访')
      Column({ space: 10 }) {
        Text('提交建议、意见或投诉后，管理端服务页会同步看到最新反馈。')
          .fontSize(13)
          .lineHeight(19)
          .fontColor('#596B60')
        TextInput({ text: this.feedbackContent, placeholder: '请输入建议、意见或投诉内容' })
          .onChange((value: string) => this.feedbackContent = value)
          .height(48)
          .backgroundColor('#F3F6F4')
          .borderRadius(10)
        Button('提交反馈')
          .width('100%')
          .height(38)
          .backgroundColor('#176B43')
          .fontColor(Color.White)
          .borderRadius(19)
          .onClick(() => this.submitFeedback())
        if (this.feedbackReply.length > 0) {
          Column({ space: 5 }) {
            Text('景区客服回复')
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor('#286C49')
            Text(this.feedbackReply)
              .fontSize(13)
              .lineHeight(19)
              .fontColor('#4E6558')
          }
          .width('100%')
          .padding(12)
          .backgroundColor('#E9F7EE')
          .borderRadius(12)
        }
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Color.White)
      .borderRadius(16)

      Button('退出账号')
        .width('100%')
        .height(42)
        .backgroundColor('#EDF2EF')
        .fontColor('#5A6D60')
        .borderRadius(21)
        .onClick(() => {
          this.loggedIn = false;
          this.notice = '已退出账号。';
        })
    }
    .width('100%')
  }

  @Builder
  profileHistorySummary() {
    Column({ space: 10 }) {
      this.sectionHeading('我的记录', `${this.historyRecords.length} 条记录`)
      Row({ space: 10 }) {
        this.historyCategoryCard('购物记录', '#C85C28')
        this.historyCategoryCard('游玩记录', '#176B43')
      }
      .width('100%')
    }
    .width('100%')
  }

  @Builder
  historyCategoryCard(category: string, color: string) {
    Column({ space: 6 }) {
      Text(category)
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor('#24362B')
      Text(`${this.historyRecordsByCategory(category).length} 条`)
        .fontSize(21)
        .fontWeight(FontWeight.Bold)
        .fontColor(color)
      Text(this.latestHistoryTitle(category))
        .fontSize(11)
        .fontColor('#718077')
        .maxLines(1)
      Text('查看专属记录 ›')
        .fontSize(12)
        .fontColor(color)
    }
    .layoutWeight(1)
    .alignItems(HorizontalAlign.Start)
    .padding(14)
    .backgroundColor(Color.White)
    .borderRadius(15)
    .onClick(() => this.historyPageType = category)
  }

  @Builder
  historyRecordListPage() {
    Column({ space: 15 }) {
      Row() {
        Column({ space: 5 }) {
          Text(this.historyPageType)
            .fontSize(22)
            .fontWeight(FontWeight.Bold)
            .fontColor('#24362B')
          Text('点击任一记录查看详情')
            .fontSize(13)
            .fontColor('#718077')
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
        Button('返回个人中心')
          .height(34)
          .fontSize(12)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(17)
          .onClick(() => this.historyPageType = '')
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)

      if (this.historyRecordsByCategory(this.historyPageType).length === 0) {
        Text('暂无记录，完成游览或商城结算后会同步显示在这里。')
          .fontSize(14)
          .fontColor('#738078')
          .width('100%')
          .padding(18)
          .backgroundColor(Color.White)
          .borderRadius(16)
      } else {
        ForEach(this.historyRecordsByCategory(this.historyPageType), (record: VisitorHistoryRecord) => {
          Row({ space: 10 }) {
            Text(record.type)
              .fontSize(11)
              .fontColor(this.historyPageType === '购物记录' ? '#C85C28' : '#176B43')
              .backgroundColor(this.historyPageType === '购物记录' ? '#FFF0E7' : '#E5F2E9')
              .padding({ left: 8, right: 8, top: 5, bottom: 5 })
              .borderRadius(10)
            Column({ space: 3 }) {
              Text(record.title)
                .fontSize(15)
                .fontWeight(FontWeight.Medium)
                .fontColor('#2A3A31')
              Text(`${record.detail} · ${record.time}`)
                .fontSize(11)
                .fontColor('#79867E')
                .maxLines(1)
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)
            Text('›')
              .fontSize(22)
              .fontColor('#829087')
          }
          .width('100%')
          .padding(14)
          .backgroundColor(Color.White)
          .borderRadius(14)
          .onClick(() => this.openHistoryRecord(record))
        }, (record: VisitorHistoryRecord) => record.id)
      }
    }
    .width('100%')
  }

  @Builder
  historyRecordDetailPage() {
    Column({ space: 15 }) {
      Row() {
        Column({ space: 5 }) {
          Text('记录详情')
            .fontSize(22)
            .fontWeight(FontWeight.Bold)
            .fontColor('#24362B')
          Text(this.historyPageType)
            .fontSize(13)
            .fontColor('#718077')
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
        Button('返回列表')
          .height(34)
          .fontSize(12)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(17)
          .onClick(() => this.selectedHistoryRecordId = '')
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)

      Column({ space: 12 }) {
        Text(this.selectedHistoryRecord().type)
          .fontSize(12)
          .fontColor(this.historyPageType === '购物记录' ? '#C85C28' : '#176B43')
          .backgroundColor(this.historyPageType === '购物记录' ? '#FFF0E7' : '#E5F2E9')
          .padding({ left: 10, right: 10, top: 6, bottom: 6 })
          .borderRadius(12)
        Text(this.selectedHistoryRecord().title)
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#24362B')
        Text(this.selectedHistoryRecord().detail)
          .fontSize(14)
          .lineHeight(22)
          .fontColor('#52665A')
        Text(`记录时间：${this.selectedHistoryRecord().time}`)
          .fontSize(12)
          .fontColor('#79867E')
      }
      .width('100%')
      .alignItems(HorizontalAlign.Start)
      .padding(18)
      .backgroundColor(Color.White)
      .borderRadius(17)
    }
    .width('100%')
  }

  private historyRecordsByCategory(category: string): VisitorHistoryRecord[] {
    const records: VisitorHistoryRecord[] = [];
    for (let index = 0; index < this.historyRecords.length; index++) {
      const record = this.historyRecords[index];
      const isShopping = record.type === '购物' || record.type === '商城';
      if ((category === '购物记录' && isShopping) || (category === '游玩记录' && !isShopping)) {
        records.push(record);
      }
    }
    return records;
  }

  private latestHistoryTitle(category: string): string {
    const records = this.historyRecordsByCategory(category);
    if (records.length === 0) {
      return '暂无记录';
    }
    return records[0].title;
  }

  private openHistoryRecord(record: VisitorHistoryRecord): void {
    this.selectedHistoryRecordId = record.id;
  }

  private selectedHistoryRecord(): VisitorHistoryRecord {
    for (let index = 0; index < this.historyRecords.length; index++) {
      if (this.historyRecords[index].id === this.selectedHistoryRecordId) {
        return this.historyRecords[index];
      }
    }
    return this.historyRecords[0];
  }

  @Builder
  customerServicePage() {
    Column({ space: 16 }) {
      Row() {
        Text('‹ 返回我的')
          .fontSize(14)
          .fontColor('#176B43')
          .onClick(() => this.activeTab = '我的')
        Blank()
        Text(this.humanServiceRequested ? '已转人工' : (this.aiAnswering ? '回复中' : '在线'))
          .fontSize(12)
          .fontColor(this.humanServiceRequested ? '#3F5A91' : (this.aiAnswering ? '#9B6422' : '#176B43'))
          .backgroundColor(this.humanServiceRequested ? '#E8EDF8' : (this.aiAnswering ? '#FFF2D9' : '#E5F2E9'))
          .padding({ left: 9, right: 9, top: 5, bottom: 5 })
          .borderRadius(12)
      }
      .width('100%')

      Column({ space: 5 }) {
        Text('小湖助手')
          .fontSize(22)
          .fontWeight(FontWeight.Bold)
          .fontColor('#24362B')
        Text(this.aiAnswering ? '正在为你整理答案...' : '可咨询景点、人流、路线、票务和预约')
          .fontSize(13)
          .fontColor('#718077')
      }
      .width('100%')
      .alignItems(HorizontalAlign.Start)

      Column({ space: 9 }) {
        ForEach(this.serviceMessages, (message: ChatMessage) => {
          Column({ space: 3 }) {
            Text(`${message.sender} · ${message.time}`)
              .fontSize(11)
              .fontColor('#78857C')
            Text(message.content)
              .fontSize(14)
              .lineHeight(20)
              .fontColor(message.sender === '游客' ? Color.White : '#2A3A31')
              .backgroundColor(message.sender === '游客' ? '#176B43' : '#FFFFFF')
              .padding(12)
              .borderRadius(13)
          }
          .alignItems(message.sender === '游客' ? HorizontalAlign.End : HorizontalAlign.Start)
          .width('100%')
        }, (message: ChatMessage) => message.id)
        if (this.assistantTyping) {
          Column({ space: 3 }) {
            Text('小湖助手 · 刚刚')
              .fontSize(11)
              .fontColor('#78857C')
            Text('正在输入…')
              .fontSize(14)
              .fontColor('#2A3A31')
              .backgroundColor('#FFFFFF')
              .padding(12)
              .borderRadius(13)
          }
          .alignItems(HorizontalAlign.Start)
          .width('100%')
        } else if (this.assistantDraft.length > 0) {
          Column({ space: 3 }) {
            Text('小湖助手 · 刚刚')
              .fontSize(11)
              .fontColor('#78857C')
            Text(this.assistantDraft)
              .fontSize(14)
              .lineHeight(20)
              .fontColor('#2A3A31')
              .backgroundColor('#FFFFFF')
              .padding(12)
              .borderRadius(13)
          }
          .alignItems(HorizontalAlign.Start)
          .width('100%')
        }
      }
      .width('100%')
      .padding(14)
      .backgroundColor('#EEF5F0')
      .borderRadius(17)

      Row({ space: 8 }) {
        TextInput({ text: this.serviceDraft, placeholder: '输入咨询内容，例如“断桥人多吗？”' })
          .onChange((value: string) => this.serviceDraft = value)
          .layoutWeight(1)
          .height(44)
          .backgroundColor(Color.White)
          .borderRadius(12)
        Text(this.humanServiceRequested ? '已转人工' : '转人工')
          .fontSize(13)
          .fontColor(this.humanServiceRequested ? '#8B98AD' : '#3F5A91')
          .backgroundColor('#E8EDF8')
          .padding({ left: 10, right: 10 })
          .textAlign(TextAlign.Center)
          .height(44)
          .borderRadius(12)
          .onClick(() => this.requestHumanService())
        Button('发送')
          .height(44)
          .backgroundColor(this.aiAnswering ? '#8BA99A' : '#176B43')
          .fontColor(Color.White)
          .borderRadius(12)
          .onClick(() => this.sendServiceMessage(this.serviceDraft))
      }
      .width('100%')

      Row({ space: 8 }) {
        Button('断桥拥堵？')
          .fontSize(12)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(15)
          .onClick(() => this.sendServiceMessage('断桥现在拥堵吗？'))
        Button('如何退票？')
          .fontSize(12)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(15)
          .onClick(() => this.sendServiceMessage('电子票如何退改？'))
        Button('推荐景点')
          .fontSize(12)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(15)
          .onClick(() => this.sendServiceMessage('现在推荐去哪个景点？'))
      }
      .width('100%')

      this.sectionHeading('旅行回访', '定期收集体验反馈')
      Column({ space: 10 }) {
        Text(this.followUpCompleted ? '感谢你的回访评价，客服已将建议纳入景区服务优化记录。' : '本次游览体验如何？你的评价将帮助景区优化路线、排队和服务。')
          .fontSize(13)
          .lineHeight(19)
          .fontColor('#596B60')
        Row({ space: 9 }) {
          ForEach([1, 2, 3, 4, 5], (score: number) => {
            Text('★')
              .fontSize(28)
              .fontColor(score <= this.followUpRating ? '#F2AE36' : '#D8E1DA')
              .onClick(() => this.followUpRating = score)
          }, (score: number) => score.toString())
        }
        Button(this.followUpCompleted ? '回访已提交' : '提交回访评价')
          .width('100%')
          .height(38)
          .backgroundColor(this.followUpCompleted ? '#E5F2E9' : '#176B43')
          .fontColor(this.followUpCompleted ? '#176B43' : Color.White)
          .borderRadius(19)
          .onClick(() => this.submitFollowUp())
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Color.White)
      .borderRadius(16)
    }
    .width('100%')
  }

  private projectName(id: string): string {
    for (let index = 0; index < this.projects.length; index++) {
      if (this.projects[index].id === id) {
        return this.projects[index].name;
      }
    }
    return '景区项目';
  }

  private submitFeedback(): void {
    if (this.feedbackContent.trim().length === 0) {
      this.notice = '请先填写反馈内容。';
      return;
    }
    this.notice = '反馈已自动分类并转交客服，预计 1 个工作日内回复。';
    this.latestFeedback = `游客反馈：${this.feedbackContent}`;
    this.feedbackHandled = false;
    this.feedbackReply = '';
    this.feedbackReplyDraft = '';
    this.addHistory('反馈', '游客意见反馈', this.feedbackContent);
    this.feedbackContent = '';
  }

  private openAdminLogin(): void {
    this.loggedIn = false;
    this.account = 'admin';
    this.password = '';
    this.notice = '已切换至管理端登录，请点击“进入景区”。';
  }

  private async sendServiceMessage(content: string): Promise<void> {
    const question = content.trim();
    if (question.length === 0) {
      this.notice = '请输入需要咨询的问题。';
      return;
    }
    if (this.aiAnswering) {
      this.notice = '小湖助手正在回复上一条问题，请稍等。';
      return;
    }
    const visitorMessage: ChatMessage = {
      id: `visitor-${Date.now()}`,
      sender: '游客',
      content: question,
      time: '刚刚'
    };
    this.serviceMessages = [...this.serviceMessages, visitorMessage];
    this.serviceDraft = '';
    this.lastServiceQuestion = question;
    this.aiAnswering = true;
    this.assistantTyping = true;
    this.notice = '小湖助手正在为你整理答案。';
    this.addHistory('咨询', '小湖助手', question);
    await this.delay(this.thinkDelayMillis());
    let answer: string = '';
    let usedFallback: boolean = false;
    try {
      answer = await this.callLargeModel(question);
    } catch (error) {
      answer = this.serviceReply(question);
      usedFallback = true;
    }
    this.assistantTyping = false;
    await this.typewriteAnswer(answer);
    this.aiAnswering = false;
    this.notice = usedFallback ? '咨询服务繁忙，已先为你提供基础建议。' : '小湖助手已回复你的问题。';
  }

  private thinkDelayMillis(): number {
    return 800 + Math.floor(Math.random() * 700);
  }

  private async typewriteAnswer(answer: string): Promise<void> {
    this.assistantTyping = false;
    this.assistantDraft = '';
    if (answer.length === 0) {
      return;
    }
    let written: number = Math.min(answer.length, 2);
    this.assistantDraft = answer.substring(0, written);
    while (written < answer.length) {
      await this.delay(26);
      written = Math.min(answer.length, written + 2);
      this.assistantDraft = answer.substring(0, written);
    }
    const agentMessage: ChatMessage = {
      id: `agent-${Date.now()}`,
      sender: '小湖助手',
      content: answer,
      time: '刚刚'
    };
    this.serviceMessages = [...this.serviceMessages, agentMessage];
    this.assistantDraft = '';
  }

  private requestHumanService(): void {
    if (this.humanServiceRequested) {
      this.notice = '已转人工客服，请耐心等待回复。';
      return;
    }
    if (this.aiAnswering) {
      this.notice = '请稍候，小湖助手回复完成后再申请转人工。';
      return;
    }
    const topic: string = this.lastServiceQuestion.length > 0 ? this.lastServiceQuestion : '游客需要人工协助';
    const systemMessage: ChatMessage = {
      id: `system-${Date.now()}`,
      sender: '系统',
      content: '已收到您的转人工请求，人工客服正在接入，请稍候。您仍可继续咨询景区问题。',
      time: '刚刚'
    };
    this.humanServiceRequested = true;
    this.serviceMessages = [...this.serviceMessages, systemMessage];
    this.latestFeedback = `游客人工客服请求：${topic}`;
    this.feedbackHandled = false;
    this.addHistory('客服', '转人工客服', topic);
    this.notice = '已为您转接人工客服，管理端将收到您的请求。';
  }

  private delay(millis: number): Promise<void> {
    return new Promise<void>((resolve: () => void) => {
      setTimeout(() => {
        resolve();
      }, millis);
    });
  }

  private async callLargeModel(question: string): Promise<string> {
    if (AI_API_KEY.indexOf('在这里填入') >= 0 || AI_API_KEY.trim().length < 20) {
      return Promise.reject<string>('请先在 AiConfig.ets 中填入 API Key');
    }
    const request = http.createHttp();
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: '你是山水智游 ScenicNav 的景区智能咨询助手，名字叫小湖助手。请用简洁中文回答游客问题，只依据给定景区上下文，不编造真实营业信息。涉及高峰、路线、票务、预约时给出可执行建议。'
      },
      {
        role: 'user',
        content: this.buildAiPrompt(question)
      }
    ];
    const thinking: DeepSeekThinking = {
      type: 'disabled'
    };
    const body: DeepSeekRequestBody = {
      model: AI_MODEL,
      messages,
      stream: false,
      thinking,
      max_tokens: 420
    };
    const response = await request.request(AI_BASE_URL, {
      method: http.RequestMethod.POST,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`
      },
      extraData: JSON.stringify(body),
      expectDataType: http.HttpDataType.STRING
    });
    request.destroy();
    if (response.responseCode < 200 || response.responseCode >= 300) {
      return Promise.reject<string>(`HTTP ${response.responseCode}`);
    }
    return this.extractAiText(`${response.result}`);
  }

  private buildAiPrompt(question: string): string {
    const spotLines: string[] = [];
    for (let index = 0; index < this.spots.length; index++) {
      const spot = this.spots[index];
      spotLines.push(`${spot.name}：${spot.subtitle}，当前热度${this.currentCrowdPercent(spot)}%，15分钟预测${this.currentForecastPercent(spot)}%，建议：${this.crowdAdvice(spot)}`);
    }
    const projectLines: string[] = [];
    for (let index = 0; index < this.projects.length; index++) {
      const project = this.projects[index];
      projectLines.push(`${project.name}：${project.startTime}，余位${this.projectRemaining(project, index)}，预计等待${this.projectWaitMinutes(project)}分钟，快速通行${project.fastPassPrice}元`);
    }
    return `游客问题：${question}\n当前选中景点：${this.currentSelectedSpot().name}\n客流场景：${this.crowdScenario}\n景点实时状态：\n${spotLines.join('\n')}\n可预约项目：\n${projectLines.join('\n')}\n电子票规则：未入园前可在“我的”页退改，取消后释放库存。\n回答要求：80字以内，先直接回答，再给一个下一步建议。`;
  }

  private extractAiText(raw: string): string {
    try {
      const json = JSON.parse(raw) as Record<string, Object>;
      const choices = json['choices'] as Array<Record<string, Object>>;
      if (choices !== undefined && choices.length > 0) {
        const first = choices[0];
        const message = first['message'] as Record<string, Object>;
        if (message !== undefined) {
          const content = message['content'] as string;
          if (content !== undefined && content.length > 0) {
            return content;
          }
        }
      }
    } catch (error) {
      return raw;
    }
    return '我已收到问题，但暂时没有整理出完整答案。请稍后再试或换个问法。';
  }

  private serviceReply(question: string): string {
    const matchedSpot = this.findSpotByQuestion(question);
    if (matchedSpot !== undefined) {
      return `${matchedSpot.name}：${matchedSpot.subtitle}。当前${this.crowdLevel(matchedSpot)}，热度 ${this.currentCrowdPercent(matchedSpot)}%，15 分钟预测 ${this.currentForecastPercent(matchedSpot)}%。${this.crowdAdvice(matchedSpot)}建议预留 ${matchedSpot.stayMinutes} 分钟游览，可在导览页查看图片和图文讲解。`;
    }
    if (question.indexOf('推荐') >= 0 || question.indexOf('去哪') >= 0 || question.indexOf('路线') >= 0) {
      const bestSpot = this.bestLowCrowdSpot();
      return `现在推荐先去${bestSpot.name}，预测热度 ${this.currentForecastPercent(bestSpot)}%，相对舒适。你也可以在导览页生成 ${this.itineraryDurationMinutes / 60} 小时错峰行程，系统会自动避开高峰景点。`;
    }
    if (question.indexOf('人') >= 0 || question.indexOf('拥') >= 0) {
      const spot = this.currentSelectedSpot();
      return `${spot.name}当前${this.crowdLevel(spot)}，热度 ${this.currentCrowdPercent(spot)}%，15 分钟预测 ${this.currentForecastPercent(spot)}%。${this.crowdAdvice(spot)}`;
    }
    if (question.indexOf('退') >= 0 || question.indexOf('票') >= 0) {
      return '电子票可在未入园前在“我的”页点击“退改电子票”办理，系统会自动释放对应时段库存。';
    }
    if (question.indexOf('预约') >= 0 || question.indexOf('排队') >= 0) {
      return '项目预约成功后会显示预计等待时间；到场前会产生应用内提醒，也可购买快速通行券缩短等待。';
    }
    return '已收到你的问题。小湖助手建议你先查看导览页的人流提示和景点图片；如需人工协助，反馈会自动转交客服队列。';
  }

  private findSpotByQuestion(question: string): ScenicSpot | undefined {
    for (let index = 0; index < this.spots.length; index++) {
      if (question.indexOf(this.spots[index].name) >= 0) {
        return this.spots[index];
      }
    }
    if (question.indexOf('断桥') >= 0) {
      return this.spots[0];
    }
    if (question.indexOf('孤山') >= 0) {
      return this.spots[1];
    }
    if (question.indexOf('曲院') >= 0 || question.indexOf('荷') >= 0) {
      return this.spots[2];
    }
    if (question.indexOf('苏堤') >= 0) {
      return this.spots[3];
    }
    if (question.indexOf('花港') >= 0 || question.indexOf('鱼') >= 0) {
      return this.spots[4];
    }
    if (question.indexOf('雷峰') >= 0 || question.indexOf('塔') >= 0) {
      return this.spots[5];
    }
    return undefined;
  }

  private bestLowCrowdSpot(): ScenicSpot {
    let best = this.spots[0];
    for (let index = 1; index < this.spots.length; index++) {
      if (this.currentForecastPercent(this.spots[index]) < this.currentForecastPercent(best)) {
        best = this.spots[index];
      }
    }
    return best;
  }

  private submitFollowUp(): void {
    if (this.followUpCompleted) {
      this.notice = '本次回访已完成，感谢你的支持。';
      return;
    }
    if (this.followUpRating === 0) {
      this.notice = '请先选择本次游览的满意度。';
      return;
    }
    this.followUpCompleted = true;
    this.notice = '回访评价已提交，景区会据此持续优化服务。';
    this.addHistory('回访', '游览满意度评价', `评分 ${this.followUpRating} 星`);
  }

  private addHistory(type: string, title: string, detail: string): void {
    const record: VisitorHistoryRecord = {
      id: `history-${Date.now()}-${this.historyRecords.length}`,
      type,
      title,
      detail,
      time: '刚刚'
    };
    this.historyRecords = [record, ...this.historyRecords];
  }

  @Builder
  adminApplication() {
    Column() {
      this.adminTopBar()
      Text(this.notice)
        .fontSize(12)
        .fontColor('#3F5A91')
        .backgroundColor('#E8EDF8')
        .borderRadius(8)
        .padding({ top: 7, bottom: 7, left: 10, right: 10 })
        .width('92%')
        .margin({ top: 6 })
      Scroll() {
        Column() {
          this.adminPageContent()
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 14, bottom: 16 })
      }
      .layoutWeight(1)
      this.adminBottomNavigation()
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F3F6FB')
  }

  @Builder
  adminTopBar() {
    Row() {
      Column({ space: 2 }) {
        Text('智慧西湖运营中心')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#263B66')
        Text(`管理员 · ${this.adminActiveTab} · 景区运营数据`)
          .fontSize(12)
          .fontColor('#7180A0')
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
      Text('退出')
        .fontSize(12)
        .fontColor('#3F5A91')
        .backgroundColor('#E3EAF8')
        .padding({ left: 11, right: 11, top: 7, bottom: 7 })
        .borderRadius(15)
        .onClick(() => this.exitAdmin())
    }
    .width('100%')
    .padding({ left: 20, right: 20, top: 14, bottom: 10 })
    .alignItems(VerticalAlign.Center)
    .backgroundColor('#F3F6FB')
  }

  @Builder
  adminPageContent() {
    if (this.adminActiveTab === '概览') {
      this.adminOverviewPage()
    } else if (this.adminActiveTab === '设施') {
      this.adminFacilityPage()
    } else if (this.adminActiveTab === '票务') {
      this.adminTicketPage()
    } else if (this.adminActiveTab === '预约') {
      this.adminReservationPage()
    } else {
      this.adminServicePage()
    }
  }

  @Builder
  adminOverviewPage() {
    Column({ space: 16 }) {
      Column({ space: 7 }) {
        Text('今日景区运营概览')
          .fontSize(22)
          .fontWeight(FontWeight.Bold)
          .fontColor('#263B66')
        Text('运营数据会在各业务页面联动更新。')
          .fontSize(13)
          .fontColor('#7180A0')
      }
      .width('100%')
      .alignItems(HorizontalAlign.Start)

      Row({ space: 9 }) {
        this.adminMetric('入园客流', '8,426', '#5B75AF')
        this.adminMetric('采用绕行', this.diversionMetric(), '#247D68')
        this.adminMetric('待处理反馈', this.feedbackHandled ? '0' : '1', '#C57938')
      }
      .width('100%')

      Column({ space: 10 }) {
        Text('客流调度')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#293A5D')
        Text(`当前场景：${this.crowdScenario} · ${this.highCrowdSpotCount()} 个景点处于预测高热风险`)
          .fontSize(12)
          .fontColor('#61708A')
        Row({ space: 7 }) {
          ForEach(this.viewModel.repository.crowdScenarios(), (scenario: string) => {
            Button(scenario)
              .layoutWeight(1)
              .height(34)
              .fontSize(11)
              .backgroundColor(this.crowdScenario === scenario ? '#3F5A91' : '#EEF2FA')
              .fontColor(this.crowdScenario === scenario ? Color.White : '#3F5A91')
              .borderRadius(17)
              .onClick(() => this.selectCrowdScenario(scenario))
          }, (scenario: string) => scenario)
        }
        Text(`调度效果：已向 ${this.diversionMetric()} 位游客下发错峰建议；已生成的个性路线会自动仅重排未到达景点。`)
          .fontSize(12)
          .lineHeight(19)
          .fontColor('#3F5A91')
          .width('100%')
          .padding(11)
          .backgroundColor('#EAF0FC')
          .borderRadius(12)
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Color.White)
      .borderRadius(18)

      Column({ space: 10 }) {
        Text('运营预警')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#293A5D')
        Text(this.operationAlert())
          .fontSize(13)
          .lineHeight(20)
          .fontColor('#8A5A29')
          .width('100%')
          .padding(14)
          .backgroundColor('#FFF4E6')
          .borderRadius(14)
        Text(`雷峰塔讲解集合点当前预计等待 ${this.projectWaitMinutes(this.projects[3])} 分钟，可在“预约”页放行队列。`)
          .fontSize(13)
          .lineHeight(20)
          .fontColor('#3F5A91')
          .width('100%')
          .padding(14)
          .backgroundColor('#EAF0FC')
          .borderRadius(14)
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Color.White)
      .borderRadius(18)

      Text('最新订单')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#293A5D')
        .width('100%')
      ForEach(this.adminOrders, (order: AdminOrderRecord) => {
        Row() {
          Column({ space: 4 }) {
            Text(order.item)
              .fontSize(15)
              .fontWeight(FontWeight.Medium)
              .fontColor('#293A5D')
            Text(`${order.visitor} · ${order.time}`)
              .fontSize(11)
              .fontColor('#7986A0')
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          Column({ space: 3 }) {
            Text(`￥${order.amount}`)
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor('#3F5A91')
            Text(order.status)
              .fontSize(11)
              .fontColor('#28764C')
          }
          .alignItems(HorizontalAlign.End)
        }
        .width('100%')
        .padding(14)
        .backgroundColor(Color.White)
        .borderRadius(14)
        .margin({ top: 7 })
      }, (order: AdminOrderRecord) => order.id)
    }
    .width('100%')
  }

  @Builder
  adminMetric(label: string, value: string, color: string) {
    Column({ space: 6 }) {
      Text(value)
        .fontSize(22)
        .fontWeight(FontWeight.Bold)
        .fontColor(color)
      Text(label)
        .fontSize(12)
        .fontColor('#7986A0')
    }
    .alignItems(HorizontalAlign.Start)
    .layoutWeight(1)
    .padding(13)
    .backgroundColor(Color.White)
    .borderRadius(15)
  }

  @Builder
  adminFacilityPage() {
    Column({ space: 14 }) {
      this.adminSectionHeading('景区设施管理', '设施状态会即时同步到运营页面')
      ForEach(this.facilities, (facility: ScenicFacility, index: number) => {
        Column({ space: 9 }) {
          Row() {
            Column({ space: 4 }) {
              Text(facility.name)
                .fontSize(17)
                .fontWeight(FontWeight.Medium)
                .fontColor('#293A5D')
              Text(`${facility.type} · ${facility.area}`)
                .fontSize(12)
                .fontColor('#7986A0')
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)
            Text(this.facilityStatus(index))
              .fontSize(12)
              .fontColor(this.facilityStatus(index) === '暂停维护' ? '#B65B2A' : '#28764C')
              .backgroundColor(this.facilityStatus(index) === '暂停维护' ? '#FFF0E7' : '#E9F7EE')
              .padding({ left: 9, right: 9, top: 5, bottom: 5 })
              .borderRadius(12)
          }
          Text(`${facility.usage} · ${facility.description}`)
            .fontSize(12)
            .lineHeight(18)
            .fontColor('#61708A')
          Button(this.facilityStatus(index) === '暂停维护' ? '恢复运行' : '设置维护')
            .width('100%')
            .height(34)
            .fontSize(12)
            .backgroundColor('#EEF2FA')
            .fontColor('#3F5A91')
            .borderRadius(17)
            .onClick(() => this.toggleFacilityStatus(index))
        }
        .width('100%')
        .padding(16)
        .backgroundColor(Color.White)
        .borderRadius(16)
      }, (facility: ScenicFacility) => facility.id)
    }
    .width('100%')
  }

  @Builder
  adminTicketPage() {
    Column({ space: 14 }) {
      this.adminSectionHeading('票务与库存管理', '补库存、停售会联动游客端下单状态')
      ForEach(this.tickets, (ticket: TicketProduct, index: number) => {
        Column({ space: 10 }) {
          Row() {
            Column({ space: 4 }) {
              Text(ticket.name)
                .fontSize(17)
                .fontWeight(FontWeight.Medium)
                .fontColor('#293A5D')
              Text(ticket.description)
                .fontSize(12)
                .fontColor('#7986A0')
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)
            Column({ space: 3 }) {
              Text(`余 ${this.ticketRemaining(ticket, index)} 张`)
                .fontSize(14)
                .fontWeight(FontWeight.Medium)
                .fontColor('#3F5A91')
              Text(this.isTicketPaused(ticket.id) ? '已停售' : '售卖中')
                .fontSize(11)
                .fontColor(this.isTicketPaused(ticket.id) ? '#B65B2A' : '#28764C')
            }
            .alignItems(HorizontalAlign.End)
          }
          Row({ space: 9 }) {
            Button('补充 20 张')
              .layoutWeight(1)
              .height(34)
              .fontSize(12)
              .backgroundColor('#E9F7EE')
              .fontColor('#28764C')
              .borderRadius(17)
              .onClick(() => this.adjustTicketInventory(index, 20))
            Button(this.isTicketPaused(ticket.id) ? '恢复售卖' : '暂停售卖')
              .layoutWeight(1)
              .height(34)
              .fontSize(12)
              .backgroundColor('#FFF0E7')
              .fontColor('#B65B2A')
              .borderRadius(17)
              .onClick(() => this.toggleTicketSale(ticket.id, ticket.name))
          }
        }
        .width('100%')
        .padding(16)
        .backgroundColor(Color.White)
        .borderRadius(16)
      }, (ticket: TicketProduct) => ticket.id)
    }
    .width('100%')
  }

  @Builder
  adminReservationPage() {
    Column({ space: 14 }) {
      this.adminSectionHeading('预约队列运营', `当前运营时钟 ${this.simulatedClock()} · 可放行队列和补充余位`)
      ForEach(this.projects, (project: ProjectReservation, index: number) => {
        Column({ space: 10 }) {
          Row() {
            Column({ space: 4 }) {
              Text(project.name)
                .fontSize(17)
                .fontWeight(FontWeight.Medium)
                .fontColor('#293A5D')
              Text(`${project.venue} · ${project.startTime} 入场`)
                .fontSize(12)
                .fontColor('#7986A0')
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)
            Text(`余 ${this.projectRemaining(project, index)}/${project.capacity}`)
              .fontSize(12)
              .fontColor('#3F5A91')
          }
          Text(`普通队列约 ${this.projectQueueSize(project)} 人 · 预计 ${this.projectWaitMinutes(project)} 分钟 · 快速通行券 ￥${project.fastPassPrice}`)
            .fontSize(12)
            .fontColor('#61708A')
          Row({ space: 9 }) {
            Button('放行队列')
              .layoutWeight(1)
              .height(34)
              .fontSize(12)
              .backgroundColor('#E9F7EE')
              .fontColor('#28764C')
              .borderRadius(17)
              .onClick(() => this.dispatchProjectQueue(project))
            Button('补充 10 个余位')
              .layoutWeight(1)
              .height(34)
              .fontSize(12)
              .backgroundColor('#EEF2FA')
              .fontColor('#3F5A91')
              .borderRadius(17)
              .onClick(() => this.restockProject(project, index))
          }
        }
        .width('100%')
        .padding(16)
        .backgroundColor(Color.White)
        .borderRadius(16)
      }, (project: ProjectReservation) => project.id)
    }
    .width('100%')
  }

  @Builder
  adminServicePage() {
    Column({ space: 14 }) {
      this.adminSectionHeading('客服与回访管理', '游客反馈和会话实时同步呈现')
      Column({ space: 8 }) {
        Text('最新游客反馈')
          .fontSize(17)
          .fontWeight(FontWeight.Medium)
          .fontColor('#293A5D')
        Text(this.latestFeedback)
          .fontSize(13)
          .lineHeight(20)
          .fontColor('#61708A')
        Text(this.feedbackHandled ? '处理状态：已回复并归档' : '处理状态：待客服处理')
          .fontSize(12)
          .fontColor(this.feedbackHandled ? '#28764C' : '#B65B2A')
        TextInput({ text: this.feedbackReplyDraft, placeholder: '输入给游客的回复，例如“已增加断桥分流引导”' })
          .onChange((value: string) => this.feedbackReplyDraft = value)
          .height(48)
          .backgroundColor('#F2F5FB')
          .borderRadius(10)
        if (this.feedbackReply.length > 0) {
          Text(`已发送回复：${this.feedbackReply}`)
            .fontSize(12)
            .lineHeight(19)
            .fontColor('#3F5A91')
            .width('100%')
            .padding(10)
            .backgroundColor('#EAF0FC')
            .borderRadius(10)
        }
        Button(this.feedbackHandled ? '更新并发送回复' : '发送回复并归档')
          .width('100%')
          .height(36)
          .fontSize(12)
          .backgroundColor('#3F5A91')
          .fontColor(Color.White)
          .borderRadius(18)
          .onClick(() => this.sendFeedbackReply())
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Color.White)
      .borderRadius(16)

      Column({ space: 8 }) {
        Text('在线会话摘要')
          .fontSize(17)
          .fontWeight(FontWeight.Medium)
          .fontColor('#293A5D')
        Text(`当前共 ${this.serviceMessages.length} 条会话消息，游客端可继续发起实时咨询。`)
          .fontSize(13)
          .lineHeight(20)
          .fontColor('#61708A')
        Button('发起游后回访')
          .width('100%')
          .height(36)
          .fontSize(12)
          .backgroundColor('#EEF2FA')
          .fontColor('#3F5A91')
          .borderRadius(18)
          .onClick(() => this.startAdminFollowUp())
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Color.White)
      .borderRadius(16)
    }
    .width('100%')
  }

  @Builder
  adminSectionHeading(title: string, subtitle: string) {
    Column({ space: 5 }) {
      Text(title)
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor('#293A5D')
      Text(subtitle)
        .fontSize(12)
        .fontColor('#7986A0')
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
  }

  private facilityStatus(index: number): string {
    return this.facilityStatuses[index];
  }

  private toggleFacilityStatus(index: number): void {
    const nextStatuses: string[] = [];
    for (let statusIndex = 0; statusIndex < this.facilityStatuses.length; statusIndex++) {
      if (statusIndex === index) {
        nextStatuses.push(this.facilityStatuses[statusIndex] === '暂停维护' ? '正常' : '暂停维护');
      } else {
        nextStatuses.push(this.facilityStatuses[statusIndex]);
      }
    }
    this.facilityStatuses = nextStatuses;
    this.notice = `${this.facilities[index].name} 已${this.facilityStatuses[index] === '暂停维护' ? '设置为维护状态' : '恢复正常运行'}。`;
  }

  private toggleTicketSale(ticketId: string, ticketName: string): void {
    const isPaused = this.isTicketPaused(ticketId);
    const nextPausedIds: string[] = [];
    for (let index = 0; index < this.ticketPausedIds.length; index++) {
      if (this.ticketPausedIds[index] !== ticketId) {
        nextPausedIds.push(this.ticketPausedIds[index]);
      }
    }
    if (!isPaused) {
      nextPausedIds.push(ticketId);
    }
    this.ticketPausedIds = nextPausedIds;
    this.notice = `${ticketName} 已${isPaused ? '恢复售卖' : '暂停售卖'}，游客端会同步更新。`;
  }

  private dispatchProjectQueue(project: ProjectReservation): void {
    const projectIndex = this.projectIndex(project.id);
    const nextReleaseCounts: number[] = [];
    for (let index = 0; index < this.projectQueueReleaseCounts.length; index++) {
      nextReleaseCounts.push(index === projectIndex ? this.projectQueueReleaseCounts[index] + 1 : this.projectQueueReleaseCounts[index]);
    }
    this.projectQueueReleaseCounts = nextReleaseCounts;
    this.notice = `${project.name} 已放行一批游客，仅该项目的队列和预计等待时间已更新。`;
  }

  private restockProject(project: ProjectReservation, index: number): void {
    const current = this.projectRemaining(project, index);
    const amount = Math.min(10, project.capacity - current);
    if (amount <= 0) {
      this.notice = `${project.name} 当前余位已达到该时段容量上限。`;
      return;
    }
    this.adjustProjectInventory(index, amount);
    this.notice = `${project.name} 已补充 ${amount} 个可预约余位。`;
  }

  private sendFeedbackReply(): void {
    const reply = this.feedbackReplyDraft.trim();
    if (reply.length === 0) {
      this.notice = '请先填写给游客的回复内容。';
      return;
    }
    this.feedbackReply = reply;
    this.feedbackReplyDraft = '';
    this.feedbackHandled = true;
    this.notice = '回复已同步到游客个人中心，反馈已归档。';
  }

  private startAdminFollowUp(): void {
    this.notice = '已向最近完成行程的游客发送回访邀请。';
  }

  private exitAdmin(): void {
    this.loggedIn = false;
    this.userRole = '游客';
    this.account = '';
    this.password = '';
    this.notice = '已退出管理端，可使用游客账号继续体验。';
  }

  @Builder
  adminBottomNavigation() {
    Row() {
      ForEach(ADMIN_TAB_ITEMS, (tab: string, index: number) => {
        Column({ space: 2 }) {
          Text(ADMIN_TAB_ICONS[index])
            .fontSize(21)
            .fontColor(this.adminActiveTab === tab ? '#3F5A91' : '#8793AB')
            .width(26)
            .height(24)
            .textAlign(TextAlign.Center)
          Text(tab)
            .fontSize(11)
            .fontColor(this.adminActiveTab === tab ? '#3F5A91' : '#8793AB')
            .width('100%')
            .height(16)
            .textAlign(TextAlign.Center)
        }
        .layoutWeight(1)
        .height(60)
        .alignItems(HorizontalAlign.Center)
        .justifyContent(FlexAlign.Center)
        .onClick(() => this.adminActiveTab = tab)
      }, (tab: string) => tab)
    }
    .width('100%')
    .height(70)
    .padding({ top: 4, bottom: 6 })
    .alignItems(VerticalAlign.Center)
    .backgroundColor(Color.White)
  }

  @Builder
  bottomNavigation() {
    Row() {
      ForEach(TAB_ITEMS, (tab: string, index: number) => {
        Column({ space: 2 }) {
          Text(TAB_ICONS[index])
            .fontSize(21)
            .fontColor(this.activeTab === tab ? '#176B43' : '#829087')
            .width('100%')
            .height(24)
            .lineHeight(24)
            .textAlign(TextAlign.Center)
          Text(tab)
            .fontSize(11)
            .fontColor(this.activeTab === tab ? '#176B43' : '#829087')
            .width('100%')
            .height(16)
            .lineHeight(16)
            .textAlign(TextAlign.Center)
        }
        .layoutWeight(1)
        .width('100%')
        .height(54)
        .alignItems(HorizontalAlign.Center)
        .justifyContent(FlexAlign.Center)
        .onClick(() => this.activeTab = tab)
      }, (tab: string) => tab)
    }
    .width('92%')
    .height(66)
    .padding({ left: 6, right: 6, top: 6, bottom: 6 })
    .alignItems(VerticalAlign.Center)
    .backgroundColor(Color.White)
    .borderRadius(24)
    .shadow({ radius: 18, color: '#22000000', offsetX: 0, offsetY: 6 })
    .margin({ bottom: 14 })
  }
}
