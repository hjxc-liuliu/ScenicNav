if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    viewModel?: ScenicViewModel;
    tickets?: TicketProduct[];
    spots?: ScenicSpot[];
    routes?: RecommendedRoute[];
    projects?: ProjectReservation[];
    merchants?: MerchantItem[];
    products?: MallProduct[];
    activeTab?: string;
    account?: string;
    password?: string;
    loggedIn?: boolean;
    notice?: string;
    ticketIndex?: number;
    selectedRouteId?: string;
    selectedSpotId?: string;
    selectedMerchantCategory?: string;
    mapExpanded?: boolean;
    navigationActive?: boolean;
    navigationStep?: number;
    ticketOrder?: TicketOrder | undefined;
    projectBookings?: string[];
    mallOrders?: string[];
    feedbackContent?: string;
    points?: number;
    sharedToday?: boolean;
    serviceDraft?: string;
    serviceMessages?: ChatMessage[];
    followUpRating?: number;
    followUpCompleted?: boolean;
    historyRecords?: VisitorHistoryRecord[];
}
import { DEMO_CHAT_MESSAGES, DEMO_HISTORY_RECORDS } from "@bundle:com.scenicnav.tourism/entry/ets/common/Models";
import type { ChatMessage, MallProduct, MerchantItem, ProjectReservation, RecommendedRoute, ScenicSpot, TicketOrder, TicketProduct, VisitorHistoryRecord } from "@bundle:com.scenicnav.tourism/entry/ets/common/Models";
import { ScenicViewModel } from "@bundle:com.scenicnav.tourism/entry/ets/viewmodel/ScenicViewModel";
const TAB_ITEMS: string[] = ['首页', '导览', '预约', '商城', '我的'];
const TAB_ICONS: string[] = ['⌂', '⌖', '◷', '◈', '◉'];
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.viewModel = new ScenicViewModel();
        this.tickets = this.viewModel.repository.tickets();
        this.spots = this.viewModel.repository.spots();
        this.routes = this.viewModel.repository.routes();
        this.projects = this.viewModel.repository.projects();
        this.merchants = this.viewModel.repository.merchants();
        this.products = this.viewModel.repository.products();
        this.__activeTab = new ObservedPropertySimplePU('首页', this, "activeTab");
        this.__account = new ObservedPropertySimplePU('tourist', this, "account");
        this.__password = new ObservedPropertySimplePU('123456', this, "password");
        this.__loggedIn = new ObservedPropertySimplePU(false, this, "loggedIn");
        this.__notice = new ObservedPropertySimplePU('使用演示账号 tourist / 123456 登录，体验完整预约闭环。', this, "notice");
        this.__ticketIndex = new ObservedPropertySimplePU(0, this, "ticketIndex");
        this.__selectedRouteId = new ObservedPropertySimplePU('family', this, "selectedRouteId");
        this.__selectedSpotId = new ObservedPropertySimplePU('waterfall', this, "selectedSpotId");
        this.__selectedMerchantCategory = new ObservedPropertySimplePU('全部', this, "selectedMerchantCategory");
        this.__mapExpanded = new ObservedPropertySimplePU(false, this, "mapExpanded");
        this.__navigationActive = new ObservedPropertySimplePU(false, this, "navigationActive");
        this.__navigationStep = new ObservedPropertySimplePU(0, this, "navigationStep");
        this.__ticketOrder = new ObservedPropertyObjectPU(undefined, this, "ticketOrder");
        this.__projectBookings = new ObservedPropertyObjectPU([], this, "projectBookings");
        this.__mallOrders = new ObservedPropertyObjectPU([], this, "mallOrders");
        this.__feedbackContent = new ObservedPropertySimplePU('', this, "feedbackContent");
        this.__points = new ObservedPropertySimplePU(320, this, "points");
        this.__sharedToday = new ObservedPropertySimplePU(false, this, "sharedToday");
        this.__serviceDraft = new ObservedPropertySimplePU('', this, "serviceDraft");
        this.__serviceMessages = new ObservedPropertyObjectPU(DEMO_CHAT_MESSAGES, this, "serviceMessages");
        this.__followUpRating = new ObservedPropertySimplePU(0, this, "followUpRating");
        this.__followUpCompleted = new ObservedPropertySimplePU(false, this, "followUpCompleted");
        this.__historyRecords = new ObservedPropertyObjectPU(DEMO_HISTORY_RECORDS, this, "historyRecords");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.viewModel !== undefined) {
            this.viewModel = params.viewModel;
        }
        if (params.tickets !== undefined) {
            this.tickets = params.tickets;
        }
        if (params.spots !== undefined) {
            this.spots = params.spots;
        }
        if (params.routes !== undefined) {
            this.routes = params.routes;
        }
        if (params.projects !== undefined) {
            this.projects = params.projects;
        }
        if (params.merchants !== undefined) {
            this.merchants = params.merchants;
        }
        if (params.products !== undefined) {
            this.products = params.products;
        }
        if (params.activeTab !== undefined) {
            this.activeTab = params.activeTab;
        }
        if (params.account !== undefined) {
            this.account = params.account;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.loggedIn !== undefined) {
            this.loggedIn = params.loggedIn;
        }
        if (params.notice !== undefined) {
            this.notice = params.notice;
        }
        if (params.ticketIndex !== undefined) {
            this.ticketIndex = params.ticketIndex;
        }
        if (params.selectedRouteId !== undefined) {
            this.selectedRouteId = params.selectedRouteId;
        }
        if (params.selectedSpotId !== undefined) {
            this.selectedSpotId = params.selectedSpotId;
        }
        if (params.selectedMerchantCategory !== undefined) {
            this.selectedMerchantCategory = params.selectedMerchantCategory;
        }
        if (params.mapExpanded !== undefined) {
            this.mapExpanded = params.mapExpanded;
        }
        if (params.navigationActive !== undefined) {
            this.navigationActive = params.navigationActive;
        }
        if (params.navigationStep !== undefined) {
            this.navigationStep = params.navigationStep;
        }
        if (params.ticketOrder !== undefined) {
            this.ticketOrder = params.ticketOrder;
        }
        if (params.projectBookings !== undefined) {
            this.projectBookings = params.projectBookings;
        }
        if (params.mallOrders !== undefined) {
            this.mallOrders = params.mallOrders;
        }
        if (params.feedbackContent !== undefined) {
            this.feedbackContent = params.feedbackContent;
        }
        if (params.points !== undefined) {
            this.points = params.points;
        }
        if (params.sharedToday !== undefined) {
            this.sharedToday = params.sharedToday;
        }
        if (params.serviceDraft !== undefined) {
            this.serviceDraft = params.serviceDraft;
        }
        if (params.serviceMessages !== undefined) {
            this.serviceMessages = params.serviceMessages;
        }
        if (params.followUpRating !== undefined) {
            this.followUpRating = params.followUpRating;
        }
        if (params.followUpCompleted !== undefined) {
            this.followUpCompleted = params.followUpCompleted;
        }
        if (params.historyRecords !== undefined) {
            this.historyRecords = params.historyRecords;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__activeTab.purgeDependencyOnElmtId(rmElmtId);
        this.__account.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__loggedIn.purgeDependencyOnElmtId(rmElmtId);
        this.__notice.purgeDependencyOnElmtId(rmElmtId);
        this.__ticketIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedRouteId.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedSpotId.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedMerchantCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__mapExpanded.purgeDependencyOnElmtId(rmElmtId);
        this.__navigationActive.purgeDependencyOnElmtId(rmElmtId);
        this.__navigationStep.purgeDependencyOnElmtId(rmElmtId);
        this.__ticketOrder.purgeDependencyOnElmtId(rmElmtId);
        this.__projectBookings.purgeDependencyOnElmtId(rmElmtId);
        this.__mallOrders.purgeDependencyOnElmtId(rmElmtId);
        this.__feedbackContent.purgeDependencyOnElmtId(rmElmtId);
        this.__points.purgeDependencyOnElmtId(rmElmtId);
        this.__sharedToday.purgeDependencyOnElmtId(rmElmtId);
        this.__serviceDraft.purgeDependencyOnElmtId(rmElmtId);
        this.__serviceMessages.purgeDependencyOnElmtId(rmElmtId);
        this.__followUpRating.purgeDependencyOnElmtId(rmElmtId);
        this.__followUpCompleted.purgeDependencyOnElmtId(rmElmtId);
        this.__historyRecords.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__activeTab.aboutToBeDeleted();
        this.__account.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__loggedIn.aboutToBeDeleted();
        this.__notice.aboutToBeDeleted();
        this.__ticketIndex.aboutToBeDeleted();
        this.__selectedRouteId.aboutToBeDeleted();
        this.__selectedSpotId.aboutToBeDeleted();
        this.__selectedMerchantCategory.aboutToBeDeleted();
        this.__mapExpanded.aboutToBeDeleted();
        this.__navigationActive.aboutToBeDeleted();
        this.__navigationStep.aboutToBeDeleted();
        this.__ticketOrder.aboutToBeDeleted();
        this.__projectBookings.aboutToBeDeleted();
        this.__mallOrders.aboutToBeDeleted();
        this.__feedbackContent.aboutToBeDeleted();
        this.__points.aboutToBeDeleted();
        this.__sharedToday.aboutToBeDeleted();
        this.__serviceDraft.aboutToBeDeleted();
        this.__serviceMessages.aboutToBeDeleted();
        this.__followUpRating.aboutToBeDeleted();
        this.__followUpCompleted.aboutToBeDeleted();
        this.__historyRecords.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private readonly viewModel: ScenicViewModel;
    private readonly tickets: TicketProduct[];
    private readonly spots: ScenicSpot[];
    private readonly routes: RecommendedRoute[];
    private readonly projects: ProjectReservation[];
    private readonly merchants: MerchantItem[];
    private readonly products: MallProduct[];
    private __activeTab: ObservedPropertySimplePU<string>;
    get activeTab() {
        return this.__activeTab.get();
    }
    set activeTab(newValue: string) {
        this.__activeTab.set(newValue);
    }
    private __account: ObservedPropertySimplePU<string>;
    get account() {
        return this.__account.get();
    }
    set account(newValue: string) {
        this.__account.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __loggedIn: ObservedPropertySimplePU<boolean>;
    get loggedIn() {
        return this.__loggedIn.get();
    }
    set loggedIn(newValue: boolean) {
        this.__loggedIn.set(newValue);
    }
    private __notice: ObservedPropertySimplePU<string>;
    get notice() {
        return this.__notice.get();
    }
    set notice(newValue: string) {
        this.__notice.set(newValue);
    }
    private __ticketIndex: ObservedPropertySimplePU<number>;
    get ticketIndex() {
        return this.__ticketIndex.get();
    }
    set ticketIndex(newValue: number) {
        this.__ticketIndex.set(newValue);
    }
    private __selectedRouteId: ObservedPropertySimplePU<string>;
    get selectedRouteId() {
        return this.__selectedRouteId.get();
    }
    set selectedRouteId(newValue: string) {
        this.__selectedRouteId.set(newValue);
    }
    private __selectedSpotId: ObservedPropertySimplePU<string>;
    get selectedSpotId() {
        return this.__selectedSpotId.get();
    }
    set selectedSpotId(newValue: string) {
        this.__selectedSpotId.set(newValue);
    }
    private __selectedMerchantCategory: ObservedPropertySimplePU<string>;
    get selectedMerchantCategory() {
        return this.__selectedMerchantCategory.get();
    }
    set selectedMerchantCategory(newValue: string) {
        this.__selectedMerchantCategory.set(newValue);
    }
    private __mapExpanded: ObservedPropertySimplePU<boolean>;
    get mapExpanded() {
        return this.__mapExpanded.get();
    }
    set mapExpanded(newValue: boolean) {
        this.__mapExpanded.set(newValue);
    }
    private __navigationActive: ObservedPropertySimplePU<boolean>;
    get navigationActive() {
        return this.__navigationActive.get();
    }
    set navigationActive(newValue: boolean) {
        this.__navigationActive.set(newValue);
    }
    private __navigationStep: ObservedPropertySimplePU<number>;
    get navigationStep() {
        return this.__navigationStep.get();
    }
    set navigationStep(newValue: number) {
        this.__navigationStep.set(newValue);
    }
    private __ticketOrder: ObservedPropertyObjectPU<TicketOrder | undefined>;
    get ticketOrder() {
        return this.__ticketOrder.get();
    }
    set ticketOrder(newValue: TicketOrder | undefined) {
        this.__ticketOrder.set(newValue);
    }
    private __projectBookings: ObservedPropertyObjectPU<string[]>;
    get projectBookings() {
        return this.__projectBookings.get();
    }
    set projectBookings(newValue: string[]) {
        this.__projectBookings.set(newValue);
    }
    private __mallOrders: ObservedPropertyObjectPU<string[]>;
    get mallOrders() {
        return this.__mallOrders.get();
    }
    set mallOrders(newValue: string[]) {
        this.__mallOrders.set(newValue);
    }
    private __feedbackContent: ObservedPropertySimplePU<string>;
    get feedbackContent() {
        return this.__feedbackContent.get();
    }
    set feedbackContent(newValue: string) {
        this.__feedbackContent.set(newValue);
    }
    private __points: ObservedPropertySimplePU<number>;
    get points() {
        return this.__points.get();
    }
    set points(newValue: number) {
        this.__points.set(newValue);
    }
    private __sharedToday: ObservedPropertySimplePU<boolean>;
    get sharedToday() {
        return this.__sharedToday.get();
    }
    set sharedToday(newValue: boolean) {
        this.__sharedToday.set(newValue);
    }
    private __serviceDraft: ObservedPropertySimplePU<string>;
    get serviceDraft() {
        return this.__serviceDraft.get();
    }
    set serviceDraft(newValue: string) {
        this.__serviceDraft.set(newValue);
    }
    private __serviceMessages: ObservedPropertyObjectPU<ChatMessage[]>;
    get serviceMessages() {
        return this.__serviceMessages.get();
    }
    set serviceMessages(newValue: ChatMessage[]) {
        this.__serviceMessages.set(newValue);
    }
    private __followUpRating: ObservedPropertySimplePU<number>;
    get followUpRating() {
        return this.__followUpRating.get();
    }
    set followUpRating(newValue: number) {
        this.__followUpRating.set(newValue);
    }
    private __followUpCompleted: ObservedPropertySimplePU<boolean>;
    get followUpCompleted() {
        return this.__followUpCompleted.get();
    }
    set followUpCompleted(newValue: boolean) {
        this.__followUpCompleted.set(newValue);
    }
    private __historyRecords: ObservedPropertyObjectPU<VisitorHistoryRecord[]>;
    get historyRecords() {
        return this.__historyRecords.get();
    }
    set historyRecords(newValue: VisitorHistoryRecord[]) {
        this.__historyRecords.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(55:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F4F8F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loggedIn) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.application.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.loginPage.bind(this)();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    loginPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 18 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(69:5)", "entry");
            Column.width('100%');
            Column.padding({ left: 24, right: 24, top: 96 });
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(70:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.width('100%');
            Column.margin({ bottom: 18 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('山水智游');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(71:9)", "entry");
            Text.fontSize(34);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#176B43');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('把风景装进口袋，把时间留给山水');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(75:9)", "entry");
            Text.fontSize(15);
            Text.fontColor('#6A7A70');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(83:7)", "entry");
            Column.width('100%');
            Column.padding(20);
            Column.backgroundColor(Color.White);
            Column.borderRadius(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('演示登录');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(84:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.account, placeholder: '账号' });
            TextInput.debugLine("entry/src/main/ets/pages/Index.ets(87:9)", "entry");
            TextInput.onChange((value: string) => this.account = value);
            TextInput.backgroundColor(Color.White);
            TextInput.borderRadius(12);
            TextInput.height(50);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.password, placeholder: '密码' });
            TextInput.debugLine("entry/src/main/ets/pages/Index.ets(92:9)", "entry");
            TextInput.onChange((value: string) => this.password = value);
            TextInput.backgroundColor(Color.White);
            TextInput.borderRadius(12);
            TextInput.height(50);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('进入景区');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(97:9)", "entry");
            Button.width('100%');
            Button.height(48);
            Button.backgroundColor('#176B43');
            Button.fontColor(Color.White);
            Button.borderRadius(24);
            Button.onClick(() => this.performLogin());
        }, Button);
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.notice);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(110:7)", "entry");
            Text.fontSize(13);
            Text.fontColor('#66766C');
            Text.lineHeight(20);
            Text.width('100%');
        }, Text);
        Text.pop();
        Column.pop();
    }
    private performLogin(): void {
        this.viewModel.repository.login(this.account, this.password).then((result) => {
            this.notice = result.message;
            if (result.code === 0) {
                this.loggedIn = true;
            }
        });
    }
    application(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(132:5)", "entry");
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.topBar.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.notice.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.notice);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(135:9)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#1B6E47');
                        Text.backgroundColor('#E1F5E8');
                        Text.borderRadius(8);
                        Text.padding({ top: 7, bottom: 7, left: 10, right: 10 });
                        Text.width('92%');
                        Text.margin({ top: 6 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/Index.ets(144:7)", "entry");
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(145:9)", "entry");
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 14, bottom: 16 });
        }, Column);
        this.pageContent.bind(this)();
        Column.pop();
        Scroll.pop();
        this.bottomNavigation.bind(this)();
        Column.pop();
    }
    topBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(160:5)", "entry");
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 14, bottom: 10 });
            Row.alignItems(VerticalAlign.Center);
            Row.backgroundColor('#F4F8F5');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(161:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.activeTab === '首页' ? '早上好，旅行者' : this.activeTab);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(162:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#193528');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.activeTab === '首页' ? '云栖山水景区 · 22℃' : '云栖山水景区');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(166:9)", "entry");
            Text.fontSize(12);
            Text.fontColor('#758379');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('◌');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(172:7)", "entry");
            Text.fontSize(28);
            Text.fontColor('#176B43');
            Text.width(42);
            Text.height(42);
            Text.textAlign(TextAlign.Center);
            Text.padding({ top: 6 });
            Text.backgroundColor('#E1F3E7');
            Text.borderRadius(21);
        }, Text);
        Text.pop();
        Row.pop();
    }
    pageContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.activeTab === '首页') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.homePage.bind(this)();
                });
            }
            else if (this.activeTab === '导览') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.guidePage.bind(this)();
                });
            }
            else if (this.activeTab === '预约') {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.reservationPage.bind(this)();
                });
            }
            else if (this.activeTab === '商城') {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.mallPage.bind(this)();
                });
            }
            else if (this.activeTab === '客服') {
                this.ifElseBranchUpdateFunction(4, () => {
                    this.customerServicePage.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(5, () => {
                    this.profilePage.bind(this)();
                });
            }
        }, If);
        If.pop();
    }
    homePage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 18 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(207:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(208:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.width('100%');
            Column.padding(20);
            Column.borderRadius(20);
            Column.backgroundColor('#176B43');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('此刻的云栖，适合出发');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(209:9)", "entry");
            Text.fontSize(23);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('人流舒适 · 飞瀑观景台有微雾彩虹');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(213:9)", "entry");
            Text.fontSize(14);
            Text.fontColor('#EAF9EF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(216:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('今日余票 376');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(217:11)", "entry");
            Text.fontSize(12);
            Text.fontColor('#165E3D');
            Text.backgroundColor('#D7F4DF');
            Text.padding({ left: 10, right: 10, top: 6, bottom: 6 });
            Text.borderRadius(14);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('拥堵指数 低');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(223:11)", "entry");
            Text.fontSize(12);
            Text.fontColor('#165E3D');
            Text.backgroundColor('#D7F4DF');
            Text.padding({ left: 10, right: 10, top: 6, bottom: 6 });
            Text.borderRadius(14);
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        this.sectionHeading.bind(this)('分时门票', '可退改 · 入园二维码');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const ticket = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(239:9)", "entry");
                    Row.width('100%');
                    Row.padding(16);
                    Row.backgroundColor(Color.White);
                    Row.borderRadius(16);
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 5 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(240:11)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(ticket.name);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(241:13)", "entry");
                    Text.fontSize(17);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#203128');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(ticket.description);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(245:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#78857C');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`剩余 ${ticket.remaining} 张`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(248:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(ticket.remaining < 50 ? '#C3621F' : '#26724B');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 8 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(254:11)", "entry");
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.viewModel.formatPrice(ticket.price));
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(255:13)", "entry");
                    Text.fontSize(18);
                    Text.fontWeight(FontWeight.Bold);
                    Text.fontColor('#D85D27');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(index === this.ticketIndex ? '已选择' : '选择');
                    Button.debugLine("entry/src/main/ets/pages/Index.ets(259:13)", "entry");
                    Button.fontSize(12);
                    Button.height(30);
                    Button.backgroundColor(index === this.ticketIndex ? '#176B43' : '#E5F2E9');
                    Button.fontColor(index === this.ticketIndex ? Color.White : '#176B43');
                    Button.borderRadius(15);
                    Button.onClick(() => {
                        this.ticketIndex = index;
                        this.notice = `已选择 ${ticket.name}`;
                    });
                }, Button);
                Button.pop();
                Column.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.tickets, forEachItemGenFunction, (ticket: TicketProduct) => ticket.id, true, false);
        }, ForEach);
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(`预订 ${this.tickets[this.ticketIndex].name} · ${this.viewModel.formatPrice(this.tickets[this.ticketIndex].price)}`);
            Button.debugLine("entry/src/main/ets/pages/Index.ets(277:7)", "entry");
            Button.width('100%');
            Button.height(48);
            Button.backgroundColor('#176B43');
            Button.fontColor(Color.White);
            Button.borderRadius(24);
            Button.onClick(() => this.bookTicket());
        }, Button);
        Button.pop();
        this.sectionHeading.bind(this)('今日推荐', '为你避开人群');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(286:7)", "entry");
            Row.width('100%');
        }, Row);
        this.quickAction.bind(this)('⌖', '智能导览', '规划路线', '导览');
        this.quickAction.bind(this)('◷', '项目预约', '减少等待', '预约');
        this.quickAction.bind(this)('▣', '餐宿特惠', '住玩组合', '商城');
        Row.pop();
        Column.pop();
    }
    sectionHeading(title: string, subtitle: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(298:5)", "entry");
            Row.width('100%');
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(299:7)", "entry");
            Text.fontSize(19);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#22332A');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(subtitle);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(303:7)", "entry");
            Text.fontSize(12);
            Text.fontColor('#839087');
            Text.margin({ left: 8, top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Index.ets(307:7)", "entry");
        }, Blank);
        Blank.pop();
        Row.pop();
    }
    quickAction(icon: string, title: string, caption: string, target: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 7 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(315:5)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.padding(14);
            Column.layoutWeight(1);
            Column.backgroundColor(Color.White);
            Column.borderRadius(14);
            Column.onClick(() => this.activeTab = target);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(icon);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(316:7)", "entry");
            Text.fontSize(25);
            Text.fontColor('#176B43');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(319:7)", "entry");
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#24362B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(caption);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(323:7)", "entry");
            Text.fontSize(11);
            Text.fontColor('#839087');
        }, Text);
        Text.pop();
        Column.pop();
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
    guidePage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 18 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(349:5)", "entry");
            Column.width('100%');
        }, Column);
        this.sectionHeading.bind(this)('实时导览', '当前位置：云杉栈道入口');
        this.interactiveMap.bind(this)();
        this.sectionHeading.bind(this)('个性路线', '按兴趣和时间推荐');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const route = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 9 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(355:9)", "entry");
                    Column.width('100%');
                    Column.padding(16);
                    Column.backgroundColor(Color.White);
                    Column.borderRadius(16);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(356:11)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 4 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(357:13)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(route.title);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(358:15)", "entry");
                    Text.fontSize(17);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#24362B');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${route.duration} · ${route.distance}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(362:15)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#718077');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(route.id === this.selectedRouteId ? '使用中' : '选择');
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(368:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(route.id === this.selectedRouteId ? Color.White : '#176B43');
                    Text.backgroundColor(route.id === this.selectedRouteId ? '#176B43' : '#E5F2E9');
                    Text.padding({ left: 11, right: 11, top: 6, bottom: 6 });
                    Text.borderRadius(14);
                    Text.onClick(() => {
                        this.selectedRouteId = route.id;
                        this.navigationActive = false;
                        this.navigationStep = 0;
                        this.notice = `已为你规划 ${route.title}，全程 ${route.duration}。`;
                    });
                }, Text);
                Text.pop();
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(route.spots.join('  →  '));
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(381:11)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#5B6E61');
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.routes, forEachItemGenFunction, (route: RecommendedRoute) => route.id, false, false);
        }, ForEach);
        ForEach.pop();
        this.sectionHeading.bind(this)('景点人流', '点击查看讲解');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const spot = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(393:9)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 4 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(394:11)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(spot.name);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(395:13)", "entry");
                    Text.fontSize(16);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#24362B');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${spot.subtitle} · ${spot.audioMinutes} 分钟讲解`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(399:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#718077');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(spot.crowdLevel);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(405:11)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(spot.crowdPercent > 70 ? '#C3621F' : '#28764C');
                }, Text);
                Text.pop();
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.crowdAdvice(spot));
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(409:9)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(spot.crowdPercent > 70 ? '#B55825' : '#4A7560');
                    Text.margin({ top: 8 });
                    Text.width('100%');
                    Text.padding(15);
                    Text.backgroundColor(spot.id === this.selectedSpotId ? '#E9F7EE' : Color.White);
                    Text.borderRadius(15);
                    Text.onClick(() => {
                        this.selectedSpotId = spot.id;
                        this.notice = `正在播放《${spot.name}》的 ${spot.audioMinutes} 分钟图文讲解（演示）。`;
                        this.addHistory('导览', spot.name, `播放 ${spot.audioMinutes} 分钟图文讲解`);
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.spots, forEachItemGenFunction, (spot: ScenicSpot) => spot.id, false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
    }
    interactiveMap(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(429:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopStart });
            Stack.debugLine("entry/src/main/ets/pages/Index.ets(430:7)", "entry");
            Stack.width('100%');
            Stack.height(this.mapExpanded ? 500 : 280);
            Stack.borderRadius(20);
            Stack.onClick(() => {
                this.mapExpanded = !this.mapExpanded;
                this.notice = this.mapExpanded ? '地图已放大，可查看当前路线和实时定位。' : '地图已收起。';
            });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.selectedRouteId === 'family') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777225, "type": 20000, params: [], "bundleName": "com.scenicnav.tourism", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/Index.ets(432:11)", "entry");
                        Image.width('100%');
                        Image.height(this.mapExpanded ? 500 : 280);
                        Image.objectFit(ImageFit.Cover);
                    }, Image);
                });
            }
            else if (this.selectedRouteId === 'culture') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.scenicnav.tourism", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/Index.ets(437:11)", "entry");
                        Image.width('100%');
                        Image.height(this.mapExpanded ? 500 : 280);
                        Image.objectFit(ImageFit.Cover);
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777224, "type": 20000, params: [], "bundleName": "com.scenicnav.tourism", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/Index.ets(442:11)", "entry");
                        Image.width('100%');
                        Image.height(this.mapExpanded ? 500 : 280);
                        Image.objectFit(ImageFit.Cover);
                    }, Image);
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.mapExpanded ? '⌟ 点击地图收起' : '⤢ 点击地图放大');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(447:9)", "entry");
            Text.fontSize(12);
            Text.fontColor('#1C6442');
            Text.backgroundColor('#F5FFF7');
            Text.padding({ left: 10, right: 10, top: 7, bottom: 7 });
            Text.borderRadius(16);
            Text.position({ x: 16, y: 16 });
        }, Text);
        Text.pop();
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(463:7)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.navigationActive ? '重新规划' : '开始导航');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(464:9)", "entry");
            Button.layoutWeight(1);
            Button.height(42);
            Button.backgroundColor('#176B43');
            Button.fontColor(Color.White);
            Button.borderRadius(21);
            Button.onClick(() => this.startNavigation());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.mapExpanded ? '缩小地图' : '放大地图');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(471:9)", "entry");
            Button.layoutWeight(1);
            Button.height(42);
            Button.backgroundColor('#E5F2E9');
            Button.fontColor('#176B43');
            Button.borderRadius(21);
            Button.onClick(() => this.mapExpanded = !this.mapExpanded);
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.navigationActive) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 7 });
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(480:9)", "entry");
                        Column.width('100%');
                        Column.padding(14);
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius(14);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`正在导航 · ${this.currentRoute().title}`);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(481:11)", "entry");
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#176B43');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.navigationInstruction());
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(485:11)", "entry");
                        Text.fontSize(13);
                        Text.lineHeight(20);
                        Text.fontColor('#466154');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.navigationStep + 1 >= this.currentRoute().spots.length ? '完成导航' : '到达下一站');
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(489:11)", "entry");
                        Button.width('100%');
                        Button.height(36);
                        Button.fontSize(13);
                        Button.backgroundColor('#F1F7F3');
                        Button.fontColor('#176B43');
                        Button.borderRadius(18);
                        Button.onClick(() => this.nextNavigationStep());
                    }, Button);
                    Button.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
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
    reservationPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 18 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(552:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 7 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(553:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('预约排队，让等待变得可预期');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(554:9)", "entry");
            Text.fontSize(21);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#214231');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('临近时段将在“我的”页显示应用内提醒。');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(558:9)", "entry");
            Text.fontSize(13);
            Text.fontColor('#728077');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const project = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 11 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(566:9)", "entry");
                    Column.width('100%');
                    Column.padding(17);
                    Column.backgroundColor(Color.White);
                    Column.borderRadius(17);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(567:11)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 4 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(568:13)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(project.name);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(569:15)", "entry");
                    Text.fontSize(18);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#24362B');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${project.startTime} 入场 · 预计等待 ${project.waitMinutes} 分钟`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(573:15)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#6F7F75');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`余 ${project.remaining}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(579:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(project.remaining < 10 ? '#C3621F' : '#28764C');
                }, Text);
                Text.pop();
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create({ space: 10 });
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(583:11)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(this.projectBookings.indexOf(project.id) >= 0 ? '已预约' : '预约时段');
                    Button.debugLine("entry/src/main/ets/pages/Index.ets(584:13)", "entry");
                    Button.layoutWeight(1);
                    Button.height(38);
                    Button.fontSize(13);
                    Button.backgroundColor(this.projectBookings.indexOf(project.id) >= 0 ? '#E2F2E8' : '#176B43');
                    Button.fontColor(this.projectBookings.indexOf(project.id) >= 0 ? '#176B43' : Color.White);
                    Button.borderRadius(19);
                    Button.onClick(() => this.bookProject(project));
                }, Button);
                Button.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(`快速通行 ￥${project.fastPassPrice}`);
                    Button.debugLine("entry/src/main/ets/pages/Index.ets(592:13)", "entry");
                    Button.layoutWeight(1);
                    Button.height(38);
                    Button.fontSize(13);
                    Button.backgroundColor('#FFF0E7');
                    Button.fontColor('#C85C28');
                    Button.borderRadius(19);
                    Button.onClick(() => {
                        this.notice = `已模拟购买 ${project.name} 快速通行服务。`;
                        this.projectBookings = [...this.projectBookings, project.id];
                        this.addHistory('预约', project.name, '已购买快速通行服务');
                    });
                }, Button);
                Button.pop();
                Row.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.projects, forEachItemGenFunction, (project: ProjectReservation) => project.id, false, false);
        }, ForEach);
        ForEach.pop();
        this.sectionHeading.bind(this)('餐饮住宿', '好评商家与住玩套餐');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(613:7)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const category = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(category);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(615:11)", "entry");
                    Text.fontSize(13);
                    Text.fontColor(this.selectedMerchantCategory === category ? Color.White : '#41735A');
                    Text.backgroundColor(this.selectedMerchantCategory === category ? '#176B43' : '#E5F2E9');
                    Text.padding({ left: 13, right: 13, top: 7, bottom: 7 });
                    Text.borderRadius(16);
                    Text.onClick(() => this.selectedMerchantCategory = category);
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, ['全部', '住宿', '餐饮'], forEachItemGenFunction, (category: string) => category, false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const merchant = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.selectedMerchantCategory === '全部' || this.selectedMerchantCategory === merchant.category) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.debugLine("entry/src/main/ets/pages/Index.ets(626:11)", "entry");
                                Row.width('100%');
                                Row.padding(15);
                                Row.backgroundColor(Color.White);
                                Row.borderRadius(15);
                                Row.margin({ top: 8 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create({ space: 5 });
                                Column.debugLine("entry/src/main/ets/pages/Index.ets(627:13)", "entry");
                                Column.alignItems(HorizontalAlign.Start);
                                Column.layoutWeight(1);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`${merchant.category} · ${merchant.name}`);
                                Text.debugLine("entry/src/main/ets/pages/Index.ets(628:15)", "entry");
                                Text.fontSize(16);
                                Text.fontWeight(FontWeight.Medium);
                                Text.fontColor('#24362B');
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(merchant.description);
                                Text.debugLine("entry/src/main/ets/pages/Index.ets(632:15)", "entry");
                                Text.fontSize(12);
                                Text.fontColor('#6F7F75');
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`★ ${merchant.rating}`);
                                Text.debugLine("entry/src/main/ets/pages/Index.ets(635:15)", "entry");
                                Text.fontSize(12);
                                Text.fontColor('#C77C20');
                            }, Text);
                            Text.pop();
                            Column.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel('预订');
                                Button.debugLine("entry/src/main/ets/pages/Index.ets(641:13)", "entry");
                                Button.fontSize(12);
                                Button.height(34);
                                Button.backgroundColor('#E5F2E9');
                                Button.fontColor('#176B43');
                                Button.borderRadius(17);
                                Button.onClick(() => this.notice = `${merchant.name} 已生成模拟预订单。`);
                            }, Button);
                            Button.pop();
                            Row.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
            };
            this.forEachUpdateFunction(elmtId, this.merchants, forEachItemGenFunction, (merchant: MerchantItem) => merchant.id, false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
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
    mallPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 18 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(672:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 7 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(673:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('景区好物，寄一份山水回家');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(674:9)", "entry");
            Text.fontSize(21);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#214231');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`当前积分 ${this.points} · 分享游玩照片可额外获得 20 积分`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(678:9)", "entry");
            Text.fontSize(13);
            Text.fontColor('#6F7F75');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const product = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(686:9)", "entry");
                    Row.width('100%');
                    Row.padding(16);
                    Row.backgroundColor(Color.White);
                    Row.borderRadius(16);
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 6 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(687:11)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(product.name);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(688:13)", "entry");
                    Text.fontSize(17);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#24362B');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(product.description);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(692:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#6F7F75');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${this.viewModel.formatPrice(product.price)} · 送 ${product.points} 积分`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(695:13)", "entry");
                    Text.fontSize(13);
                    Text.fontColor('#C85C28');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(this.mallOrders.indexOf(product.id) >= 0 ? '已下单' : '加入订单');
                    Button.debugLine("entry/src/main/ets/pages/Index.ets(701:11)", "entry");
                    Button.fontSize(12);
                    Button.height(35);
                    Button.backgroundColor(this.mallOrders.indexOf(product.id) >= 0 ? '#E2F2E8' : '#176B43');
                    Button.fontColor(this.mallOrders.indexOf(product.id) >= 0 ? '#176B43' : Color.White);
                    Button.borderRadius(17);
                    Button.onClick(() => this.buyProduct(product));
                }, Button);
                Button.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.products, forEachItemGenFunction, (product: MallProduct) => product.id, false, false);
        }, ForEach);
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.sharedToday ? '今日分享已获得 20 积分' : '模拟分享游玩照片，获得 20 积分');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(715:7)", "entry");
            Button.width('100%');
            Button.height(44);
            Button.backgroundColor(this.sharedToday ? '#E2F2E8' : '#FFF0E7');
            Button.fontColor(this.sharedToday ? '#176B43' : '#C85C28');
            Button.borderRadius(22);
            Button.onClick(() => this.shareJourney());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 7 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(723:7)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('限时住玩组合');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(724:9)", "entry");
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#24362B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('云栖山居酒店 + 成人全日票，两人套餐 ￥888');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(728:9)", "entry");
            Text.fontSize(13);
            Text.fontColor('#6F7F75');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('生成组合预订单');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(731:9)", "entry");
            Button.height(36);
            Button.backgroundColor('#E5F2E9');
            Button.fontColor('#176B43');
            Button.borderRadius(18);
            Button.onClick(() => this.notice = '住玩组合模拟订单已生成，可在“我的”页查看。');
        }, Button);
        Button.pop();
        Column.pop();
        Column.pop();
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
    profilePage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 18 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(770:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 12 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(771:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('旅');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(772:9)", "entry");
            Text.fontSize(20);
            Text.fontColor(Color.White);
            Text.textAlign(TextAlign.Center);
            Text.width(50);
            Text.height(50);
            Text.padding({ top: 13 });
            Text.backgroundColor('#176B43');
            Text.borderRadius(25);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(781:9)", "entry");
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('旅行者 tourist');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(782:11)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#24362B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`云栖会员 · ${this.points} 积分`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(786:11)", "entry");
            Text.fontSize(13);
            Text.fontColor('#718077');
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.ticketOrder) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 10 });
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(795:9)", "entry");
                        Column.width('100%');
                        Column.padding(17);
                        Column.backgroundColor(Color.White);
                        Column.borderRadius(17);
                    }, Column);
                    this.sectionHeading.bind(this)('我的电子票', this.ticketOrder.status);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.ticketOrder.ticketName);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(797:11)", "entry");
                        Text.fontSize(17);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#24362B');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.ticketOrder.visitDate);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(801:11)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#6F7F75');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('▣ ▦ ▣ ▤ ▦ ▣\n▦ ▣ ▤ ▣ ▦ ▤\n▣ ▤ ▦ ▣ ▤ ▦');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(804:11)", "entry");
                        Text.fontSize(22);
                        Text.fontColor('#203128');
                        Text.lineHeight(28);
                        Text.padding(12);
                        Text.backgroundColor('#F2F5F3');
                        Text.borderRadius(8);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('验票码：' + this.ticketOrder.qrPayload);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(811:11)", "entry");
                        Text.fontSize(9);
                        Text.fontColor('#7B887F');
                        Text.maxLines(1);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.debugLine("entry/src/main/ets/pages/Index.ets(815:11)", "entry");
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('退改电子票');
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(816:13)", "entry");
                        Button.layoutWeight(1);
                        Button.height(36);
                        Button.backgroundColor('#FFF0E7');
                        Button.fontColor('#C85C28');
                        Button.borderRadius(18);
                        Button.onClick(() => {
                            this.ticketOrder = undefined;
                            this.notice = '电子票已模拟退改，库存已释放。';
                            this.addHistory('票务', '电子票退改', '库存已释放，等待退款处理');
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('模拟闸机验票');
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(827:13)", "entry");
                        Button.layoutWeight(1);
                        Button.height(36);
                        Button.backgroundColor('#E5F2E9');
                        Button.fontColor('#176B43');
                        Button.borderRadius(18);
                        Button.onClick(() => this.notice = '验票成功，欢迎入园！');
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('还没有电子票，去首页开启一段山水之旅。');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(841:9)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#738078');
                        Text.width('100%');
                        Text.padding(16);
                        Text.backgroundColor(Color.White);
                        Text.borderRadius(15);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        this.sectionHeading.bind(this)('预约提醒', `${this.projectBookings.length} 项待体验`);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.projectBookings.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无预约项目。');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(852:9)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#738078');
                        Text.width('100%');
                        Text.padding(15);
                        Text.backgroundColor(Color.White);
                        Text.borderRadius(15);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const id = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`已预约：${this.projectName(id)}，请提前 10 分钟到场。`);
                                Text.debugLine("entry/src/main/ets/pages/Index.ets(861:11)", "entry");
                                Text.fontSize(13);
                                Text.fontColor('#286C49');
                                Text.width('100%');
                                Text.padding(14);
                                Text.backgroundColor('#E9F7EE');
                                Text.borderRadius(14);
                                Text.margin({ top: 7 });
                            }, Text);
                            Text.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.projectBookings, forEachItemGenFunction, (id: string) => id, false, false);
                    }, ForEach);
                    ForEach.pop();
                });
            }
        }, If);
        If.pop();
        this.sectionHeading.bind(this)('游客历史记录', `${this.historyRecords.length} 条记录`);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const record = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create({ space: 10 });
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(874:9)", "entry");
                    Row.width('100%');
                    Row.padding(13);
                    Row.backgroundColor(Color.White);
                    Row.borderRadius(13);
                    Row.margin({ top: 7 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(record.type);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(875:11)", "entry");
                    Text.fontSize(11);
                    Text.fontColor('#176B43');
                    Text.backgroundColor('#E5F2E9');
                    Text.padding({ left: 8, right: 8, top: 5, bottom: 5 });
                    Text.borderRadius(10);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 3 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(881:11)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(record.title);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(882:13)", "entry");
                    Text.fontSize(14);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#2A3A31');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${record.detail} · ${record.time}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(886:13)", "entry");
                    Text.fontSize(11);
                    Text.fontColor('#79867E');
                }, Text);
                Text.pop();
                Column.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.historyRecords, forEachItemGenFunction, (record: VisitorHistoryRecord) => record.id, false, false);
        }, ForEach);
        ForEach.pop();
        this.sectionHeading.bind(this)('客服与意见反馈', '在线解答 · 定期回访');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(901:7)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('客服小云在线：可咨询电子票、排队、路线与餐宿；客服工作台会同步游客反馈。');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(902:9)", "entry");
            Text.fontSize(13);
            Text.lineHeight(19);
            Text.fontColor('#596B60');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('打开在线客服 / 客服工作台');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(906:9)", "entry");
            Button.width('100%');
            Button.height(40);
            Button.backgroundColor('#E5F2E9');
            Button.fontColor('#176B43');
            Button.borderRadius(20);
            Button.onClick(() => this.activeTab = '客服');
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.feedbackContent, placeholder: '请输入建议、意见或投诉内容' });
            TextInput.debugLine("entry/src/main/ets/pages/Index.ets(913:9)", "entry");
            TextInput.onChange((value: string) => this.feedbackContent = value);
            TextInput.height(48);
            TextInput.backgroundColor('#F3F6F4');
            TextInput.borderRadius(10);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('提交反馈');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(918:9)", "entry");
            Button.width('100%');
            Button.height(38);
            Button.backgroundColor('#176B43');
            Button.fontColor(Color.White);
            Button.borderRadius(19);
            Button.onClick(() => this.submitFeedback());
        }, Button);
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('退出演示账号');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(931:7)", "entry");
            Button.width('100%');
            Button.height(42);
            Button.backgroundColor('#EDF2EF');
            Button.fontColor('#5A6D60');
            Button.borderRadius(21);
            Button.onClick(() => {
                this.loggedIn = false;
                this.notice = '已退出演示账号。';
            });
        }, Button);
        Button.pop();
        Column.pop();
    }
    customerServicePage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(947:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(948:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('‹ 返回我的');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(949:9)", "entry");
            Text.fontSize(14);
            Text.fontColor('#176B43');
            Text.onClick(() => this.activeTab = '我的');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Index.ets(953:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('在线');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(954:9)", "entry");
            Text.fontSize(12);
            Text.fontColor('#176B43');
            Text.backgroundColor('#E5F2E9');
            Text.padding({ left: 9, right: 9, top: 5, bottom: 5 });
            Text.borderRadius(12);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 5 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(963:7)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('客服工作台');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(964:9)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#24362B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('模拟实时会话 · 游客消息会立即得到客服答复');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(968:9)", "entry");
            Text.fontSize(13);
            Text.fontColor('#718077');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 9 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(975:7)", "entry");
            Column.width('100%');
            Column.padding(14);
            Column.backgroundColor('#EEF5F0');
            Column.borderRadius(17);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const message = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 3 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(977:11)", "entry");
                    Column.alignItems(message.sender === '游客' ? HorizontalAlign.End : HorizontalAlign.Start);
                    Column.width('100%');
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${message.sender} · ${message.time}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(978:13)", "entry");
                    Text.fontSize(11);
                    Text.fontColor('#78857C');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(message.content);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(981:13)", "entry");
                    Text.fontSize(14);
                    Text.lineHeight(20);
                    Text.fontColor(message.sender === '游客' ? Color.White : '#2A3A31');
                    Text.backgroundColor(message.sender === '游客' ? '#176B43' : '#FFFFFF');
                    Text.padding(12);
                    Text.borderRadius(13);
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.serviceMessages, forEachItemGenFunction, (message: ChatMessage) => message.id, false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(998:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.serviceDraft, placeholder: '输入咨询内容，例如“文化馆人多吗？”' });
            TextInput.debugLine("entry/src/main/ets/pages/Index.ets(999:9)", "entry");
            TextInput.onChange((value: string) => this.serviceDraft = value);
            TextInput.layoutWeight(1);
            TextInput.height(44);
            TextInput.backgroundColor(Color.White);
            TextInput.borderRadius(12);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('发送');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1005:9)", "entry");
            Button.height(44);
            Button.backgroundColor('#176B43');
            Button.fontColor(Color.White);
            Button.borderRadius(12);
            Button.onClick(() => this.sendServiceMessage(this.serviceDraft));
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(1014:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('文化馆拥堵？');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1015:9)", "entry");
            Button.fontSize(12);
            Button.backgroundColor('#E5F2E9');
            Button.fontColor('#176B43');
            Button.borderRadius(15);
            Button.onClick(() => this.sendServiceMessage('文化馆现在拥堵吗？'));
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('如何退票？');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1021:9)", "entry");
            Button.fontSize(12);
            Button.backgroundColor('#E5F2E9');
            Button.fontColor('#176B43');
            Button.borderRadius(15);
            Button.onClick(() => this.sendServiceMessage('电子票如何退改？'));
        }, Button);
        Button.pop();
        Row.pop();
        this.sectionHeading.bind(this)('旅行回访', '定期收集体验反馈');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1031:7)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.followUpCompleted ? '感谢你的回访评价，客服已将建议纳入景区服务优化记录。' : '本次游览体验如何？你的评价将帮助景区优化路线、排队和服务。');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1032:9)", "entry");
            Text.fontSize(13);
            Text.lineHeight(19);
            Text.fontColor('#596B60');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 9 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(1036:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const score = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('★');
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1038:13)", "entry");
                    Text.fontSize(28);
                    Text.fontColor(score <= this.followUpRating ? '#F2AE36' : '#D8E1DA');
                    Text.onClick(() => this.followUpRating = score);
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, [1, 2, 3, 4, 5], forEachItemGenFunction, (score: number) => score.toString(), false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.followUpCompleted ? '回访已提交' : '提交回访评价');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1044:9)", "entry");
            Button.width('100%');
            Button.height(38);
            Button.backgroundColor(this.followUpCompleted ? '#E5F2E9' : '#176B43');
            Button.fontColor(this.followUpCompleted ? '#176B43' : Color.White);
            Button.borderRadius(19);
            Button.onClick(() => this.submitFollowUp());
        }, Button);
        Button.pop();
        Column.pop();
        Column.pop();
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
    bottomNavigation(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(1143:5)", "entry");
            Row.width('100%');
            Row.height(64);
            Row.padding({ top: 6, bottom: 6 });
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const tab = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 3 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(1145:9)", "entry");
                    Column.layoutWeight(1);
                    Column.height(52);
                    Column.alignItems(HorizontalAlign.Center);
                    Column.justifyContent(FlexAlign.Center);
                    Column.onClick(() => this.activeTab = tab);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(TAB_ICONS[index]);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1146:11)", "entry");
                    Text.fontSize(20);
                    Text.fontColor(this.activeTab === tab ? '#176B43' : '#829087');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tab);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1149:11)", "entry");
                    Text.fontSize(11);
                    Text.fontColor(this.activeTab === tab ? '#176B43' : '#829087');
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, TAB_ITEMS, forEachItemGenFunction, (tab: string) => tab, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.scenicnav.tourism", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
