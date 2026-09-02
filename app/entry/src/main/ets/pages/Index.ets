import {
  ChatMessage,
  DEMO_CHAT_MESSAGES,
  DEMO_HISTORY_RECORDS,
  MallProduct,
  MerchantItem,
  ProjectReservation,
  RecommendedRoute,
  ScenicSpot,
  TicketOrder,
  TicketProduct,
  VisitorHistoryRecord
} from '../common/Models';
import { ScenicViewModel } from '../viewmodel/ScenicViewModel';

const TAB_ITEMS: string[] = ['首页', '导览', '预约', '商城', '我的'];
const TAB_ICONS: string[] = ['⌂', '⌖', '◷', '◈', '◉'];

@Entry
@Component
struct Index {
  private readonly viewModel: ScenicViewModel = new ScenicViewModel();
  private readonly tickets: TicketProduct[] = this.viewModel.repository.tickets();
  private readonly spots: ScenicSpot[] = this.viewModel.repository.spots();
  private readonly routes: RecommendedRoute[] = this.viewModel.repository.routes();
  private readonly projects: ProjectReservation[] = this.viewModel.repository.projects();
  private readonly merchants: MerchantItem[] = this.viewModel.repository.merchants();
  private readonly products: MallProduct[] = this.viewModel.repository.products();

  @State private activeTab: string = '首页';
  @State private account: string = 'tourist';
  @State private password: string = '123456';
  @State private loggedIn: boolean = false;
  @State private notice: string = '使用演示账号 tourist / 123456 登录，体验完整预约闭环。';
  @State private ticketIndex: number = 0;
  @State private selectedRouteId: string = 'family';
  @State private selectedSpotId: string = 'waterfall';
  @State private selectedMerchantCategory: string = '全部';
  @State private mapExpanded: boolean = false;
  @State private navigationActive: boolean = false;
  @State private navigationStep: number = 0;
  @State private ticketOrder: TicketOrder | undefined = undefined;
  @State private projectBookings: string[] = [];
  @State private mallOrders: string[] = [];
  @State private feedbackContent: string = '';
  @State private points: number = 320;
  @State private sharedToday: boolean = false;
  @State private serviceDraft: string = '';
  @State private serviceMessages: ChatMessage[] = DEMO_CHAT_MESSAGES;
  @State private followUpRating: number = 0;
  @State private followUpCompleted: boolean = false;
  @State private historyRecords: VisitorHistoryRecord[] = DEMO_HISTORY_RECORDS;

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
    Column({ space: 18 }) {
      Column({ space: 8 }) {
        Text('山水智游')
          .fontSize(34)
          .fontWeight(FontWeight.Bold)
          .fontColor('#176B43')
        Text('把风景装进口袋，把时间留给山水')
          .fontSize(15)
          .fontColor('#6A7A70')
      }
      .alignItems(HorizontalAlign.Start)
      .width('100%')
      .margin({ bottom: 18 })

      Column({ space: 14 }) {
        Text('演示登录')
          .fontSize(20)
          .fontWeight(FontWeight.Medium)
        TextInput({ text: this.account, placeholder: '账号' })
          .onChange((value: string) => this.account = value)
          .backgroundColor(Color.White)
          .borderRadius(12)
          .height(50)
        TextInput({ text: this.password, placeholder: '密码' })
          .onChange((value: string) => this.password = value)
          .backgroundColor(Color.White)
          .borderRadius(12)
          .height(50)
        Button('进入景区')
          .width('100%')
          .height(48)
          .backgroundColor('#176B43')
          .fontColor(Color.White)
          .borderRadius(24)
          .onClick(() => this.performLogin())
      }
      .width('100%')
      .padding(20)
      .backgroundColor(Color.White)
      .borderRadius(20)

      Text(this.notice)
        .fontSize(13)
        .fontColor('#66766C')
        .lineHeight(20)
        .width('100%')
    }
    .width('100%')
    .padding({ left: 24, right: 24, top: 96 })
    .alignItems(HorizontalAlign.Center)
  }

  private performLogin(): void {
    this.viewModel.repository.login(this.account, this.password).then((result) => {
      this.notice = result.message;
      if (result.code === 0) {
        this.loggedIn = true;
      }
    });
  }

  @Builder
  application() {
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
  }

  @Builder
  topBar() {
    Row() {
      Column({ space: 2 }) {
        Text(this.activeTab === '首页' ? '早上好，旅行者' : this.activeTab)
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#193528')
        Text(this.activeTab === '首页' ? '云栖山水景区 · 22℃' : '云栖山水景区')
          .fontSize(12)
          .fontColor('#758379')
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
      Text('◌')
        .fontSize(28)
        .fontColor('#176B43')
        .width(42)
        .height(42)
        .textAlign(TextAlign.Center)
        .padding({ top: 6 })
        .backgroundColor('#E1F3E7')
        .borderRadius(21)
    }
    .width('100%')
    .padding({ left: 20, right: 20, top: 14, bottom: 10 })
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
      Column({ space: 10 }) {
        Text('此刻的云栖，适合出发')
          .fontSize(23)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)
        Text('人流舒适 · 飞瀑观景台有微雾彩虹')
          .fontSize(14)
          .fontColor('#EAF9EF')
        Row({ space: 8 }) {
          Text('今日余票 376')
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
      }
      .alignItems(HorizontalAlign.Start)
      .width('100%')
      .padding(20)
      .borderRadius(20)
      .backgroundColor('#176B43')

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
            Text(`剩余 ${ticket.remaining} 张`)
              .fontSize(12)
              .fontColor(ticket.remaining < 50 ? '#C3621F' : '#26724B')
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          Column({ space: 8 }) {
            Text(this.viewModel.formatPrice(ticket.price))
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor('#D85D27')
            Button(index === this.ticketIndex ? '已选择' : '选择')
              .fontSize(12)
              .height(30)
              .backgroundColor(index === this.ticketIndex ? '#176B43' : '#E5F2E9')
              .fontColor(index === this.ticketIndex ? Color.White : '#176B43')
              .borderRadius(15)
              .onClick(() => {
                this.ticketIndex = index;
                this.notice = `已选择 ${ticket.name}`;
              })
          }
        }
        .width('100%')
        .padding(16)
        .backgroundColor(Color.White)
        .borderRadius(16)
      }, (ticket: TicketProduct) => ticket.id)

      Button(`预订 ${this.tickets[this.ticketIndex].name} · ${this.viewModel.formatPrice(this.tickets[this.ticketIndex].price)}`)
        .width('100%')
        .height(48)
        .backgroundColor('#176B43')
        .fontColor(Color.White)
        .borderRadius(24)
        .onClick(() => this.bookTicket())

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

  private bookTicket(): void {
    const ticket = this.tickets[this.ticketIndex];
    if (!this.viewModel.canBook(ticket)) {
      this.notice = '该票种已售罄，请选择其他票种。';
      return;
    }
    this.ticketOrder = this.viewModel.repository.createTicketOrder(ticket, '2026-09-03 09:00-10:00');
    this.notice = '模拟支付成功，电子票二维码已生成。';
    this.addHistory('票务', ticket.name, '已支付，电子票已生成');
    this.activeTab = '我的';
  }

  @Builder
  guidePage() {
    Column({ space: 18 }) {
      this.sectionHeading('实时导览', '当前位置：云杉栈道入口')
      this.interactiveMap()

      this.sectionHeading('个性路线', '按兴趣和时间推荐')
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

      this.sectionHeading('景点人流', '点击查看讲解')
      ForEach(this.spots, (spot: ScenicSpot) => {
        Row() {
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
          Text(spot.crowdLevel)
            .fontSize(12)
            .fontColor(spot.crowdPercent > 70 ? '#C3621F' : '#28764C')
        }
        Text(this.crowdAdvice(spot))
          .fontSize(12)
          .fontColor(spot.crowdPercent > 70 ? '#B55825' : '#4A7560')
          .margin({ top: 8 })
        .width('100%')
        .padding(15)
        .backgroundColor(spot.id === this.selectedSpotId ? '#E9F7EE' : Color.White)
        .borderRadius(15)
        .onClick(() => {
          this.selectedSpotId = spot.id;
          this.notice = `正在播放《${spot.name}》的 ${spot.audioMinutes} 分钟图文讲解（演示）。`;
          this.addHistory('导览', spot.name, `播放 ${spot.audioMinutes} 分钟图文讲解`);
        })
      }, (spot: ScenicSpot) => spot.id)
    }
    .width('100%')
  }

  @Builder
  interactiveMap() {
    Column({ space: 10 }) {
      Stack({ alignContent: Alignment.TopStart }) {
        if (this.selectedRouteId === 'family') {
          Image($r('app.media.map_family'))
            .width('100%')
            .height(this.mapExpanded ? 500 : 280)
            .objectFit(ImageFit.Cover)
        } else if (this.selectedRouteId === 'culture') {
          Image($r('app.media.map_culture'))
            .width('100%')
            .height(this.mapExpanded ? 500 : 280)
            .objectFit(ImageFit.Cover)
        } else {
          Image($r('app.media.map_leisure'))
            .width('100%')
            .height(this.mapExpanded ? 500 : 280)
            .objectFit(ImageFit.Cover)
        }
        Text(this.mapExpanded ? '⌟ 点击地图收起' : '⤢ 点击地图放大')
          .fontSize(12)
          .fontColor('#1C6442')
          .backgroundColor('#F5FFF7')
          .padding({ left: 10, right: 10, top: 7, bottom: 7 })
          .borderRadius(16)
          .position({ x: 16, y: 16 })
      }
      .width('100%')
      .height(this.mapExpanded ? 500 : 280)
      .borderRadius(20)
      .onClick(() => {
        this.mapExpanded = !this.mapExpanded;
        this.notice = this.mapExpanded ? '地图已放大，可查看当前路线和实时定位。' : '地图已收起。';
      })

      Row({ space: 10 }) {
        Button(this.navigationActive ? '重新规划' : '开始导航')
          .layoutWeight(1)
          .height(42)
          .backgroundColor('#176B43')
          .fontColor(Color.White)
          .borderRadius(21)
          .onClick(() => this.startNavigation())
        Button(this.mapExpanded ? '缩小地图' : '放大地图')
          .layoutWeight(1)
          .height(42)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(21)
          .onClick(() => this.mapExpanded = !this.mapExpanded)
      }
      if (this.navigationActive) {
        Column({ space: 7 }) {
          Text(`正在导航 · ${this.currentRoute().title}`)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .fontColor('#176B43')
          Text(this.navigationInstruction())
            .fontSize(13)
            .lineHeight(20)
            .fontColor('#466154')
          Button(this.navigationStep + 1 >= this.currentRoute().spots.length ? '完成导航' : '到达下一站')
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

  private currentRoute(): RecommendedRoute {
    for (let index = 0; index < this.routes.length; index++) {
      if (this.routes[index].id === this.selectedRouteId) {
        return this.routes[index];
      }
    }
    return this.routes[0];
  }

  private navigationInstruction(): string {
    const route = this.currentRoute();
    const destination = route.spots[this.navigationStep];
    return `从模拟定位点出发，沿景区步道前往「${destination}」。系统已避开山居文化馆的高人流区域。`;
  }

  private startNavigation(): void {
    const route = this.currentRoute();
    this.navigationActive = true;
    this.navigationStep = 0;
    this.mapExpanded = true;
    this.notice = `已开始 ${route.title} 导航，路线已显示在地图上。`;
    this.addHistory('导航', route.title, `开始${route.duration}游览导航`);
  }

  private nextNavigationStep(): void {
    const route = this.currentRoute();
    if (this.navigationStep + 1 >= route.spots.length) {
      this.navigationActive = false;
      this.notice = `${route.title} 已完成，已保存到游客历史记录。`;
      this.addHistory('导航', route.title, '完成路线导航');
      return;
    }
    this.navigationStep += 1;
    this.notice = `已到达 ${route.spots[this.navigationStep - 1]}，继续前往下一站。`;
  }

  private crowdAdvice(spot: ScenicSpot): string {
    if (spot.crowdPercent > 70) {
      return '避拥建议：先游云杉栈道，14:30 后再前往此处。';
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
        Text('临近时段将在“我的”页显示应用内提醒。')
          .fontSize(13)
          .fontColor('#728077')
      }
      .alignItems(HorizontalAlign.Start)
      .width('100%')

      ForEach(this.projects, (project: ProjectReservation) => {
        Column({ space: 11 }) {
          Row() {
            Column({ space: 4 }) {
              Text(project.name)
                .fontSize(18)
                .fontWeight(FontWeight.Medium)
                .fontColor('#24362B')
              Text(`${project.startTime} 入场 · 预计等待 ${project.waitMinutes} 分钟`)
                .fontSize(12)
                .fontColor('#6F7F75')
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)
            Text(`余 ${project.remaining}`)
              .fontSize(12)
              .fontColor(project.remaining < 10 ? '#C3621F' : '#28764C')
          }
          Row({ space: 10 }) {
            Button(this.projectBookings.indexOf(project.id) >= 0 ? '已预约' : '预约时段')
              .layoutWeight(1)
              .height(38)
              .fontSize(13)
              .backgroundColor(this.projectBookings.indexOf(project.id) >= 0 ? '#E2F2E8' : '#176B43')
              .fontColor(this.projectBookings.indexOf(project.id) >= 0 ? '#176B43' : Color.White)
              .borderRadius(19)
              .onClick(() => this.bookProject(project))
            Button(`快速通行 ￥${project.fastPassPrice}`)
              .layoutWeight(1)
              .height(38)
              .fontSize(13)
              .backgroundColor('#FFF0E7')
              .fontColor('#C85C28')
              .borderRadius(19)
              .onClick(() => {
                this.notice = `已模拟购买 ${project.name} 快速通行服务。`;
                this.projectBookings = [...this.projectBookings, project.id];
                this.addHistory('预约', project.name, '已购买快速通行服务');
              })
          }
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
          Row() {
            Column({ space: 5 }) {
              Text(`${merchant.category} · ${merchant.name}`)
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .fontColor('#24362B')
              Text(merchant.description)
                .fontSize(12)
                .fontColor('#6F7F75')
              Text(`★ ${merchant.rating}`)
                .fontSize(12)
                .fontColor('#C77C20')
            }
            .alignItems(HorizontalAlign.Start)
            .layoutWeight(1)
            Button('预订')
              .fontSize(12)
              .height(34)
              .backgroundColor('#E5F2E9')
              .fontColor('#176B43')
              .borderRadius(17)
              .onClick(() => this.notice = `${merchant.name} 已生成模拟预订单。`)
          }
          .width('100%')
          .padding(15)
          .backgroundColor(Color.White)
          .borderRadius(15)
          .margin({ top: 8 })
        }
      }, (merchant: MerchantItem) => merchant.id)
    }
    .width('100%')
  }

  private bookProject(project: ProjectReservation): void {
    if (this.projectBookings.indexOf(project.id) >= 0) {
      this.notice = `${project.name} 已预约，请在 ${project.startTime} 前到场。`;
      return;
    }
    this.projectBookings = [...this.projectBookings, project.id];
    this.notice = `${project.name} 预约成功，预计等待 ${project.waitMinutes} 分钟。`;
    this.addHistory('预约', project.name, `${project.startTime} 时段预约成功`);
  }

  @Builder
  mallPage() {
    Column({ space: 18 }) {
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
      .width('100%')

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
          Button(this.mallOrders.indexOf(product.id) >= 0 ? '已下单' : '加入订单')
            .fontSize(12)
            .height(35)
            .backgroundColor(this.mallOrders.indexOf(product.id) >= 0 ? '#E2F2E8' : '#176B43')
            .fontColor(this.mallOrders.indexOf(product.id) >= 0 ? '#176B43' : Color.White)
            .borderRadius(17)
            .onClick(() => this.buyProduct(product))
        }
        .width('100%')
        .padding(16)
        .backgroundColor(Color.White)
        .borderRadius(16)
      }, (product: MallProduct) => product.id)

      Button(this.sharedToday ? '今日分享已获得 20 积分' : '模拟分享游玩照片，获得 20 积分')
        .width('100%')
        .height(44)
        .backgroundColor(this.sharedToday ? '#E2F2E8' : '#FFF0E7')
        .fontColor(this.sharedToday ? '#176B43' : '#C85C28')
        .borderRadius(22)
        .onClick(() => this.shareJourney())

      Column({ space: 7 }) {
        Text('限时住玩组合')
          .fontSize(17)
          .fontWeight(FontWeight.Medium)
          .fontColor('#24362B')
        Text('云栖山居酒店 + 成人全日票，两人套餐 ￥888')
          .fontSize(13)
          .fontColor('#6F7F75')
        Button('生成组合预订单')
          .height(36)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(18)
          .onClick(() => this.notice = '住玩组合模拟订单已生成，可在“我的”页查看。')
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Color.White)
      .borderRadius(16)
    }
    .width('100%')
  }

  private buyProduct(product: MallProduct): void {
    if (this.mallOrders.indexOf(product.id) >= 0) {
      this.notice = `${product.name} 已在订单中，支持邮寄到家。`;
      return;
    }
    this.mallOrders = [...this.mallOrders, product.id];
    this.points += product.points;
    this.notice = `${product.name} 模拟下单成功，获得 ${product.points} 积分。`;
    this.addHistory('商城', product.name, '已生成邮寄订单');
  }

  private shareJourney(): void {
    if (this.sharedToday) {
      this.notice = '今天已经分享过了，明天再来记录新的风景吧。';
      return;
    }
    this.sharedToday = true;
    this.points += 20;
    this.notice = '模拟分享成功，已获得 20 积分。';
    this.addHistory('互动', '游玩照片分享', '获得 20 积分');
  }

  @Builder
  profilePage() {
    Column({ space: 18 }) {
      Row({ space: 12 }) {
        Text('旅')
          .fontSize(20)
          .fontColor(Color.White)
          .textAlign(TextAlign.Center)
          .width(50)
          .height(50)
          .padding({ top: 13 })
          .backgroundColor('#176B43')
          .borderRadius(25)
        Column({ space: 4 }) {
          Text('旅行者 tourist')
            .fontSize(18)
            .fontWeight(FontWeight.Medium)
            .fontColor('#24362B')
          Text(`云栖会员 · ${this.points} 积分`) 
            .fontSize(13)
            .fontColor('#718077')
        }
        .alignItems(HorizontalAlign.Start)
      }
      .width('100%')

      if (this.ticketOrder) {
        Column({ space: 10 }) {
          this.sectionHeading('我的电子票', this.ticketOrder.status)
          Text(this.ticketOrder.ticketName)
            .fontSize(17)
            .fontWeight(FontWeight.Medium)
            .fontColor('#24362B')
          Text(this.ticketOrder.visitDate)
            .fontSize(13)
            .fontColor('#6F7F75')
          Text('▣ ▦ ▣ ▤ ▦ ▣\n▦ ▣ ▤ ▣ ▦ ▤\n▣ ▤ ▦ ▣ ▤ ▦')
            .fontSize(22)
            .fontColor('#203128')
            .lineHeight(28)
            .padding(12)
            .backgroundColor('#F2F5F3')
            .borderRadius(8)
          Text('验票码：' + this.ticketOrder.qrPayload)
            .fontSize(9)
            .fontColor('#7B887F')
            .maxLines(1)
          Row({ space: 10 }) {
            Button('退改电子票')
              .layoutWeight(1)
              .height(36)
              .backgroundColor('#FFF0E7')
              .fontColor('#C85C28')
              .borderRadius(18)
              .onClick(() => {
                this.ticketOrder = undefined;
                this.notice = '电子票已模拟退改，库存已释放。';
                this.addHistory('票务', '电子票退改', '库存已释放，等待退款处理');
              })
            Button('模拟闸机验票')
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
      } else {
        Text('还没有电子票，去首页开启一段山水之旅。')
          .fontSize(14)
          .fontColor('#738078')
          .width('100%')
          .padding(16)
          .backgroundColor(Color.White)
          .borderRadius(15)
      }

      this.sectionHeading('预约提醒', `${this.projectBookings.length} 项待体验`)
      if (this.projectBookings.length === 0) {
        Text('暂无预约项目。')
          .fontSize(13)
          .fontColor('#738078')
          .width('100%')
          .padding(15)
          .backgroundColor(Color.White)
          .borderRadius(15)
      } else {
        ForEach(this.projectBookings, (id: string) => {
          Text(`已预约：${this.projectName(id)}，请提前 10 分钟到场。`)
            .fontSize(13)
            .fontColor('#286C49')
            .width('100%')
            .padding(14)
            .backgroundColor('#E9F7EE')
            .borderRadius(14)
            .margin({ top: 7 })
        }, (id: string) => id)
      }

      this.sectionHeading('游客历史记录', `${this.historyRecords.length} 条记录`)
      ForEach(this.historyRecords, (record: VisitorHistoryRecord) => {
        Row({ space: 10 }) {
          Text(record.type)
            .fontSize(11)
            .fontColor('#176B43')
            .backgroundColor('#E5F2E9')
            .padding({ left: 8, right: 8, top: 5, bottom: 5 })
            .borderRadius(10)
          Column({ space: 3 }) {
            Text(record.title)
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor('#2A3A31')
            Text(`${record.detail} · ${record.time}`)
              .fontSize(11)
              .fontColor('#79867E')
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
        }
        .width('100%')
        .padding(13)
        .backgroundColor(Color.White)
        .borderRadius(13)
        .margin({ top: 7 })
      }, (record: VisitorHistoryRecord) => record.id)

      this.sectionHeading('客服与意见反馈', '在线解答 · 定期回访')
      Column({ space: 10 }) {
        Text('客服小云在线：可咨询电子票、排队、路线与餐宿；客服工作台会同步游客反馈。')
          .fontSize(13)
          .lineHeight(19)
          .fontColor('#596B60')
        Button('打开在线客服 / 客服工作台')
          .width('100%')
          .height(40)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(20)
          .onClick(() => this.activeTab = '客服')
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
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Color.White)
      .borderRadius(16)

      Button('退出演示账号')
        .width('100%')
        .height(42)
        .backgroundColor('#EDF2EF')
        .fontColor('#5A6D60')
        .borderRadius(21)
        .onClick(() => {
          this.loggedIn = false;
          this.notice = '已退出演示账号。';
        })
    }
    .width('100%')
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
        Text('在线')
          .fontSize(12)
          .fontColor('#176B43')
          .backgroundColor('#E5F2E9')
          .padding({ left: 9, right: 9, top: 5, bottom: 5 })
          .borderRadius(12)
      }
      .width('100%')

      Column({ space: 5 }) {
        Text('客服工作台')
          .fontSize(22)
          .fontWeight(FontWeight.Bold)
          .fontColor('#24362B')
        Text('模拟实时会话 · 游客消息会立即得到客服答复')
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
      }
      .width('100%')
      .padding(14)
      .backgroundColor('#EEF5F0')
      .borderRadius(17)

      Row({ space: 8 }) {
        TextInput({ text: this.serviceDraft, placeholder: '输入咨询内容，例如“文化馆人多吗？”' })
          .onChange((value: string) => this.serviceDraft = value)
          .layoutWeight(1)
          .height(44)
          .backgroundColor(Color.White)
          .borderRadius(12)
        Button('发送')
          .height(44)
          .backgroundColor('#176B43')
          .fontColor(Color.White)
          .borderRadius(12)
          .onClick(() => this.sendServiceMessage(this.serviceDraft))
      }
      .width('100%')

      Row({ space: 8 }) {
        Button('文化馆拥堵？')
          .fontSize(12)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(15)
          .onClick(() => this.sendServiceMessage('文化馆现在拥堵吗？'))
        Button('如何退票？')
          .fontSize(12)
          .backgroundColor('#E5F2E9')
          .fontColor('#176B43')
          .borderRadius(15)
          .onClick(() => this.sendServiceMessage('电子票如何退改？'))
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
    this.addHistory('反馈', '游客意见反馈', this.feedbackContent);
    this.feedbackContent = '';
  }

  private sendServiceMessage(content: string): void {
    const question = content.trim();
    if (question.length === 0) {
      this.notice = '请输入需要咨询的问题。';
      return;
    }
    const visitorMessage: ChatMessage = {
      id: `visitor-${Date.now()}`,
      sender: '游客',
      content: question,
      time: '刚刚'
    };
    const agentMessage: ChatMessage = {
      id: `agent-${Date.now()}`,
      sender: '客服小云',
      content: this.serviceReply(question),
      time: '刚刚'
    };
    this.serviceMessages = [...this.serviceMessages, visitorMessage, agentMessage];
    this.serviceDraft = '';
    this.notice = '客服小云已实时回复你的问题。';
    this.addHistory('客服', '在线咨询', question);
  }

  private serviceReply(question: string): string {
    if (question.indexOf('人') >= 0 || question.indexOf('拥') >= 0) {
      return '山居文化馆当前拥挤度为 81%，建议先按轻松漫步线前往云杉栈道，14:30 后再去文化馆。';
    }
    if (question.indexOf('退') >= 0 || question.indexOf('票') >= 0) {
      return '电子票可在未入园前在“我的”页点击“退改电子票”办理，系统会自动释放对应时段库存。';
    }
    if (question.indexOf('预约') >= 0 || question.indexOf('排队') >= 0) {
      return '项目预约成功后会显示预计等待时间；到场前 10 分钟会产生应用内提醒。';
    }
    return '已收到你的问题。客服小云建议你先查看导览页的人流提示；如需人工协助，反馈会自动转交客服队列。';
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
  bottomNavigation() {
    Row() {
      ForEach(TAB_ITEMS, (tab: string, index: number) => {
        Column({ space: 3 }) {
          Text(TAB_ICONS[index])
            .fontSize(20)
            .fontColor(this.activeTab === tab ? '#176B43' : '#829087')
          Text(tab)
            .fontSize(11)
            .fontColor(this.activeTab === tab ? '#176B43' : '#829087')
        }
        .layoutWeight(1)
        .height(52)
        .alignItems(HorizontalAlign.Center)
        .justifyContent(FlexAlign.Center)
        .onClick(() => this.activeTab = tab)
      }, (tab: string) => tab)
    }
    .width('100%')
    .height(64)
    .padding({ top: 6, bottom: 6 })
    .backgroundColor(Color.White)
  }
}
