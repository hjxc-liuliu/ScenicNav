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
    facilities?: ScenicFacility[];
    adminOrders?: AdminOrderRecord[];
    activeTab?: string;
    account?: string;
    password?: string;
    loggedIn?: boolean;
    userRole?: string;
    notice?: string;
    ticketIndex?: number;
    selectedRouteId?: string;
    selectedSpotId?: string;
    crowdSnapshots?: CrowdSnapshot[];
    crowdScenario?: string;
    itineraryDurationMinutes?: number;
    selectedInterestTags?: string[];
    activeItinerary?: ItineraryPlan | undefined;
    originalItinerary?: ItineraryPlan | undefined;
    rerouteExplanation?: string;
    autoAvoidCongestion?: boolean;
    rerouteAdoptions?: number;
    selectedMerchantCategory?: string;
    adminActiveTab?: string;
    mapExpanded?: boolean;
    navigationActive?: boolean;
    navigationStep?: number;
    ticketOrder?: TicketOrder | undefined;
    projectBookings?: ProjectBooking[];
    mallOrders?: string[];
    ticketInventoryDelta?: number[];
    ticketPausedIds?: string[];
    projectInventoryDelta?: number[];
    queueRefreshCount?: number;
    facilityStatuses?: string[];
    remindedProjectIds?: string[];
    feedbackHandled?: boolean;
    latestFeedback?: string;
    feedbackContent?: string;
    points?: number;
    sharedToday?: boolean;
    serviceDraft?: string;
    serviceMessages?: ChatMessage[];
    followUpRating?: number;
    followUpCompleted?: boolean;
    historyRecords?: VisitorHistoryRecord[];
    crowdTimerId?: number;
}
import { DEMO_ADMIN_ORDERS, DEMO_CHAT_MESSAGES, DEMO_FACILITIES, DEMO_HISTORY_RECORDS } from "@bundle:com.scenicnav.tourism/entry/ets/common/Models";
import type { AdminOrderRecord, ChatMessage, CrowdSnapshot, MallProduct, MerchantItem, ProjectBooking, ProjectReservation, ItineraryPlan, ItineraryProfile, RecommendedRoute, ScenicFacility, ScenicSpot, TicketOrder, TicketProduct, VisitorHistoryRecord } from "@bundle:com.scenicnav.tourism/entry/ets/common/Models";
import { ScenicViewModel } from "@bundle:com.scenicnav.tourism/entry/ets/viewmodel/ScenicViewModel";
const TAB_ITEMS: string[] = ['首页', '导览', '预约', '商城', '我的'];
const TAB_ICONS: string[] = ['⌂', '⌖', '◷', '◈', '◉'];
const ADMIN_TAB_ITEMS: string[] = ['概览', '设施', '票务', '预约', '服务'];
const ADMIN_TAB_ICONS: string[] = ['▦', '⌘', '▣', '◷', '◉'];
const ITINERARY_DURATIONS: number[] = [120, 240, 360];
const ITINERARY_INTERESTS: string[] = ['亲子', '文化', '自然', '摄影', '休闲'];
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
        this.facilities = DEMO_FACILITIES;
        this.adminOrders = DEMO_ADMIN_ORDERS;
        this.__activeTab = new ObservedPropertySimplePU('首页', this, "activeTab");
        this.__account = new ObservedPropertySimplePU('tourist', this, "account");
        this.__password = new ObservedPropertySimplePU('123456', this, "password");
        this.__loggedIn = new ObservedPropertySimplePU(false, this, "loggedIn");
        this.__userRole = new ObservedPropertySimplePU('游客', this, "userRole");
        this.__notice = new ObservedPropertySimplePU('游客账号 tourist / 123456；管理账号 admin / 123456。', this, "notice");
        this.__ticketIndex = new ObservedPropertySimplePU(0, this, "ticketIndex");
        this.__selectedRouteId = new ObservedPropertySimplePU('family', this, "selectedRouteId");
        this.__selectedSpotId = new ObservedPropertySimplePU('sudi', this, "selectedSpotId");
        this.__crowdSnapshots = new ObservedPropertyObjectPU(this.viewModel.repository.crowdSnapshots(), this, "crowdSnapshots");
        this.__crowdScenario = new ObservedPropertySimplePU('常态', this, "crowdScenario");
        this.__itineraryDurationMinutes = new ObservedPropertySimplePU(240, this, "itineraryDurationMinutes");
        this.__selectedInterestTags = new ObservedPropertyObjectPU(['文化'], this, "selectedInterestTags");
        this.__activeItinerary = new ObservedPropertyObjectPU(undefined, this, "activeItinerary");
        this.__originalItinerary = new ObservedPropertyObjectPU(undefined, this, "originalItinerary");
        this.__rerouteExplanation = new ObservedPropertySimplePU('', this, "rerouteExplanation");
        this.__autoAvoidCongestion = new ObservedPropertySimplePU(true, this, "autoAvoidCongestion");
        this.__rerouteAdoptions = new ObservedPropertySimplePU(0, this, "rerouteAdoptions");
        this.__selectedMerchantCategory = new ObservedPropertySimplePU('全部', this, "selectedMerchantCategory");
        this.__adminActiveTab = new ObservedPropertySimplePU('概览', this, "adminActiveTab");
        this.__mapExpanded = new ObservedPropertySimplePU(false, this, "mapExpanded");
        this.__navigationActive = new ObservedPropertySimplePU(false, this, "navigationActive");
        this.__navigationStep = new ObservedPropertySimplePU(0, this, "navigationStep");
        this.__ticketOrder = new ObservedPropertyObjectPU(undefined, this, "ticketOrder");
        this.__projectBookings = new ObservedPropertyObjectPU([], this, "projectBookings");
        this.__mallOrders = new ObservedPropertyObjectPU([], this, "mallOrders");
        this.__ticketInventoryDelta = new ObservedPropertyObjectPU([0, 0, 0], this, "ticketInventoryDelta");
        this.__ticketPausedIds = new ObservedPropertyObjectPU([], this, "ticketPausedIds");
        this.__projectInventoryDelta = new ObservedPropertyObjectPU([0, 0, 0, 0], this, "projectInventoryDelta");
        this.__queueRefreshCount = new ObservedPropertySimplePU(0, this, "queueRefreshCount");
        this.__facilityStatuses = new ObservedPropertyObjectPU(['关注中', '正常', '正常', '繁忙', '正常', '正常'], this, "facilityStatuses");
        this.__remindedProjectIds = new ObservedPropertyObjectPU([], this, "remindedProjectIds");
        this.__feedbackHandled = new ObservedPropertySimplePU(false, this, "feedbackHandled");
        this.__latestFeedback = new ObservedPropertySimplePU('游客反馈：希望断桥高峰时增加分流提示。', this, "latestFeedback");
        this.__feedbackContent = new ObservedPropertySimplePU('', this, "feedbackContent");
        this.__points = new ObservedPropertySimplePU(320, this, "points");
        this.__sharedToday = new ObservedPropertySimplePU(false, this, "sharedToday");
        this.__serviceDraft = new ObservedPropertySimplePU('', this, "serviceDraft");
        this.__serviceMessages = new ObservedPropertyObjectPU(DEMO_CHAT_MESSAGES, this, "serviceMessages");
        this.__followUpRating = new ObservedPropertySimplePU(0, this, "followUpRating");
        this.__followUpCompleted = new ObservedPropertySimplePU(false, this, "followUpCompleted");
        this.__historyRecords = new ObservedPropertyObjectPU(DEMO_HISTORY_RECORDS, this, "historyRecords");
        this.crowdTimerId = -1;
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
        if (params.facilities !== undefined) {
            this.facilities = params.facilities;
        }
        if (params.adminOrders !== undefined) {
            this.adminOrders = params.adminOrders;
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
        if (params.userRole !== undefined) {
            this.userRole = params.userRole;
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
        if (params.crowdSnapshots !== undefined) {
            this.crowdSnapshots = params.crowdSnapshots;
        }
        if (params.crowdScenario !== undefined) {
            this.crowdScenario = params.crowdScenario;
        }
        if (params.itineraryDurationMinutes !== undefined) {
            this.itineraryDurationMinutes = params.itineraryDurationMinutes;
        }
        if (params.selectedInterestTags !== undefined) {
            this.selectedInterestTags = params.selectedInterestTags;
        }
        if (params.activeItinerary !== undefined) {
            this.activeItinerary = params.activeItinerary;
        }
        if (params.originalItinerary !== undefined) {
            this.originalItinerary = params.originalItinerary;
        }
        if (params.rerouteExplanation !== undefined) {
            this.rerouteExplanation = params.rerouteExplanation;
        }
        if (params.autoAvoidCongestion !== undefined) {
            this.autoAvoidCongestion = params.autoAvoidCongestion;
        }
        if (params.rerouteAdoptions !== undefined) {
            this.rerouteAdoptions = params.rerouteAdoptions;
        }
        if (params.selectedMerchantCategory !== undefined) {
            this.selectedMerchantCategory = params.selectedMerchantCategory;
        }
        if (params.adminActiveTab !== undefined) {
            this.adminActiveTab = params.adminActiveTab;
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
        if (params.ticketInventoryDelta !== undefined) {
            this.ticketInventoryDelta = params.ticketInventoryDelta;
        }
        if (params.ticketPausedIds !== undefined) {
            this.ticketPausedIds = params.ticketPausedIds;
        }
        if (params.projectInventoryDelta !== undefined) {
            this.projectInventoryDelta = params.projectInventoryDelta;
        }
        if (params.queueRefreshCount !== undefined) {
            this.queueRefreshCount = params.queueRefreshCount;
        }
        if (params.facilityStatuses !== undefined) {
            this.facilityStatuses = params.facilityStatuses;
        }
        if (params.remindedProjectIds !== undefined) {
            this.remindedProjectIds = params.remindedProjectIds;
        }
        if (params.feedbackHandled !== undefined) {
            this.feedbackHandled = params.feedbackHandled;
        }
        if (params.latestFeedback !== undefined) {
            this.latestFeedback = params.latestFeedback;
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
        if (params.crowdTimerId !== undefined) {
            this.crowdTimerId = params.crowdTimerId;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__activeTab.purgeDependencyOnElmtId(rmElmtId);
        this.__account.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__loggedIn.purgeDependencyOnElmtId(rmElmtId);
        this.__userRole.purgeDependencyOnElmtId(rmElmtId);
        this.__notice.purgeDependencyOnElmtId(rmElmtId);
        this.__ticketIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedRouteId.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedSpotId.purgeDependencyOnElmtId(rmElmtId);
        this.__crowdSnapshots.purgeDependencyOnElmtId(rmElmtId);
        this.__crowdScenario.purgeDependencyOnElmtId(rmElmtId);
        this.__itineraryDurationMinutes.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedInterestTags.purgeDependencyOnElmtId(rmElmtId);
        this.__activeItinerary.purgeDependencyOnElmtId(rmElmtId);
        this.__originalItinerary.purgeDependencyOnElmtId(rmElmtId);
        this.__rerouteExplanation.purgeDependencyOnElmtId(rmElmtId);
        this.__autoAvoidCongestion.purgeDependencyOnElmtId(rmElmtId);
        this.__rerouteAdoptions.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedMerchantCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__adminActiveTab.purgeDependencyOnElmtId(rmElmtId);
        this.__mapExpanded.purgeDependencyOnElmtId(rmElmtId);
        this.__navigationActive.purgeDependencyOnElmtId(rmElmtId);
        this.__navigationStep.purgeDependencyOnElmtId(rmElmtId);
        this.__ticketOrder.purgeDependencyOnElmtId(rmElmtId);
        this.__projectBookings.purgeDependencyOnElmtId(rmElmtId);
        this.__mallOrders.purgeDependencyOnElmtId(rmElmtId);
        this.__ticketInventoryDelta.purgeDependencyOnElmtId(rmElmtId);
        this.__ticketPausedIds.purgeDependencyOnElmtId(rmElmtId);
        this.__projectInventoryDelta.purgeDependencyOnElmtId(rmElmtId);
        this.__queueRefreshCount.purgeDependencyOnElmtId(rmElmtId);
        this.__facilityStatuses.purgeDependencyOnElmtId(rmElmtId);
        this.__remindedProjectIds.purgeDependencyOnElmtId(rmElmtId);
        this.__feedbackHandled.purgeDependencyOnElmtId(rmElmtId);
        this.__latestFeedback.purgeDependencyOnElmtId(rmElmtId);
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
        this.__userRole.aboutToBeDeleted();
        this.__notice.aboutToBeDeleted();
        this.__ticketIndex.aboutToBeDeleted();
        this.__selectedRouteId.aboutToBeDeleted();
        this.__selectedSpotId.aboutToBeDeleted();
        this.__crowdSnapshots.aboutToBeDeleted();
        this.__crowdScenario.aboutToBeDeleted();
        this.__itineraryDurationMinutes.aboutToBeDeleted();
        this.__selectedInterestTags.aboutToBeDeleted();
        this.__activeItinerary.aboutToBeDeleted();
        this.__originalItinerary.aboutToBeDeleted();
        this.__rerouteExplanation.aboutToBeDeleted();
        this.__autoAvoidCongestion.aboutToBeDeleted();
        this.__rerouteAdoptions.aboutToBeDeleted();
        this.__selectedMerchantCategory.aboutToBeDeleted();
        this.__adminActiveTab.aboutToBeDeleted();
        this.__mapExpanded.aboutToBeDeleted();
        this.__navigationActive.aboutToBeDeleted();
        this.__navigationStep.aboutToBeDeleted();
        this.__ticketOrder.aboutToBeDeleted();
        this.__projectBookings.aboutToBeDeleted();
        this.__mallOrders.aboutToBeDeleted();
        this.__ticketInventoryDelta.aboutToBeDeleted();
        this.__ticketPausedIds.aboutToBeDeleted();
        this.__projectInventoryDelta.aboutToBeDeleted();
        this.__queueRefreshCount.aboutToBeDeleted();
        this.__facilityStatuses.aboutToBeDeleted();
        this.__remindedProjectIds.aboutToBeDeleted();
        this.__feedbackHandled.aboutToBeDeleted();
        this.__latestFeedback.aboutToBeDeleted();
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
    private readonly facilities: ScenicFacility[];
    private readonly adminOrders: AdminOrderRecord[];
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
    private __userRole: ObservedPropertySimplePU<string>;
    get userRole() {
        return this.__userRole.get();
    }
    set userRole(newValue: string) {
        this.__userRole.set(newValue);
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
    private __crowdSnapshots: ObservedPropertyObjectPU<CrowdSnapshot[]>;
    get crowdSnapshots() {
        return this.__crowdSnapshots.get();
    }
    set crowdSnapshots(newValue: CrowdSnapshot[]) {
        this.__crowdSnapshots.set(newValue);
    }
    private __crowdScenario: ObservedPropertySimplePU<string>;
    get crowdScenario() {
        return this.__crowdScenario.get();
    }
    set crowdScenario(newValue: string) {
        this.__crowdScenario.set(newValue);
    }
    private __itineraryDurationMinutes: ObservedPropertySimplePU<number>;
    get itineraryDurationMinutes() {
        return this.__itineraryDurationMinutes.get();
    }
    set itineraryDurationMinutes(newValue: number) {
        this.__itineraryDurationMinutes.set(newValue);
    }
    private __selectedInterestTags: ObservedPropertyObjectPU<string[]>;
    get selectedInterestTags() {
        return this.__selectedInterestTags.get();
    }
    set selectedInterestTags(newValue: string[]) {
        this.__selectedInterestTags.set(newValue);
    }
    private __activeItinerary: ObservedPropertyObjectPU<ItineraryPlan | undefined>;
    get activeItinerary() {
        return this.__activeItinerary.get();
    }
    set activeItinerary(newValue: ItineraryPlan | undefined) {
        this.__activeItinerary.set(newValue);
    }
    private __originalItinerary: ObservedPropertyObjectPU<ItineraryPlan | undefined>;
    get originalItinerary() {
        return this.__originalItinerary.get();
    }
    set originalItinerary(newValue: ItineraryPlan | undefined) {
        this.__originalItinerary.set(newValue);
    }
    private __rerouteExplanation: ObservedPropertySimplePU<string>;
    get rerouteExplanation() {
        return this.__rerouteExplanation.get();
    }
    set rerouteExplanation(newValue: string) {
        this.__rerouteExplanation.set(newValue);
    }
    private __autoAvoidCongestion: ObservedPropertySimplePU<boolean>;
    get autoAvoidCongestion() {
        return this.__autoAvoidCongestion.get();
    }
    set autoAvoidCongestion(newValue: boolean) {
        this.__autoAvoidCongestion.set(newValue);
    }
    private __rerouteAdoptions: ObservedPropertySimplePU<number>;
    get rerouteAdoptions() {
        return this.__rerouteAdoptions.get();
    }
    set rerouteAdoptions(newValue: number) {
        this.__rerouteAdoptions.set(newValue);
    }
    private __selectedMerchantCategory: ObservedPropertySimplePU<string>;
    get selectedMerchantCategory() {
        return this.__selectedMerchantCategory.get();
    }
    set selectedMerchantCategory(newValue: string) {
        this.__selectedMerchantCategory.set(newValue);
    }
    private __adminActiveTab: ObservedPropertySimplePU<string>;
    get adminActiveTab() {
        return this.__adminActiveTab.get();
    }
    set adminActiveTab(newValue: string) {
        this.__adminActiveTab.set(newValue);
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
    private __projectBookings: ObservedPropertyObjectPU<ProjectBooking[]>;
    get projectBookings() {
        return this.__projectBookings.get();
    }
    set projectBookings(newValue: ProjectBooking[]) {
        this.__projectBookings.set(newValue);
    }
    private __mallOrders: ObservedPropertyObjectPU<string[]>;
    get mallOrders() {
        return this.__mallOrders.get();
    }
    set mallOrders(newValue: string[]) {
        this.__mallOrders.set(newValue);
    }
    private __ticketInventoryDelta: ObservedPropertyObjectPU<number[]>;
    get ticketInventoryDelta() {
        return this.__ticketInventoryDelta.get();
    }
    set ticketInventoryDelta(newValue: number[]) {
        this.__ticketInventoryDelta.set(newValue);
    }
    private __ticketPausedIds: ObservedPropertyObjectPU<string[]>;
    get ticketPausedIds() {
        return this.__ticketPausedIds.get();
    }
    set ticketPausedIds(newValue: string[]) {
        this.__ticketPausedIds.set(newValue);
    }
    private __projectInventoryDelta: ObservedPropertyObjectPU<number[]>;
    get projectInventoryDelta() {
        return this.__projectInventoryDelta.get();
    }
    set projectInventoryDelta(newValue: number[]) {
        this.__projectInventoryDelta.set(newValue);
    }
    private __queueRefreshCount: ObservedPropertySimplePU<number>;
    get queueRefreshCount() {
        return this.__queueRefreshCount.get();
    }
    set queueRefreshCount(newValue: number) {
        this.__queueRefreshCount.set(newValue);
    }
    private __facilityStatuses: ObservedPropertyObjectPU<string[]>;
    get facilityStatuses() {
        return this.__facilityStatuses.get();
    }
    set facilityStatuses(newValue: string[]) {
        this.__facilityStatuses.set(newValue);
    }
    private __remindedProjectIds: ObservedPropertyObjectPU<string[]>;
    get remindedProjectIds() {
        return this.__remindedProjectIds.get();
    }
    set remindedProjectIds(newValue: string[]) {
        this.__remindedProjectIds.set(newValue);
    }
    private __feedbackHandled: ObservedPropertySimplePU<boolean>;
    get feedbackHandled() {
        return this.__feedbackHandled.get();
    }
    set feedbackHandled(newValue: boolean) {
        this.__feedbackHandled.set(newValue);
    }
    private __latestFeedback: ObservedPropertySimplePU<string>;
    get latestFeedback() {
        return this.__latestFeedback.get();
    }
    set latestFeedback(newValue: string) {
        this.__latestFeedback.set(newValue);
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
    private crowdTimerId: number;
    aboutToAppear(): void {
        this.refreshCrowdData();
        this.crowdTimerId = setInterval(() => {
            this.refreshCrowdData();
        }, 4000);
    }
    aboutToDisappear(): void {
        if (this.crowdTimerId >= 0) {
            clearInterval(this.crowdTimerId);
            this.crowdTimerId = -1;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(103:5)", "entry");
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
            Column.debugLine("entry/src/main/ets/pages/Index.ets(117:5)", "entry");
            Column.width('100%');
            Column.padding({ left: 24, right: 24, top: 96 });
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(118:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.width('100%');
            Column.margin({ bottom: 18 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('山水智游');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(119:9)", "entry");
            Text.fontSize(34);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#176B43');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('把风景装进口袋，把时间留给山水');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(123:9)", "entry");
            Text.fontSize(15);
            Text.fontColor('#6A7A70');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(131:7)", "entry");
            Column.width('100%');
            Column.padding(20);
            Column.backgroundColor(Color.White);
            Column.borderRadius(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('演示登录');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(132:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('游客端：tourist / 123456；管理端：admin / 123456');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(135:9)", "entry");
            Text.fontSize(12);
            Text.fontColor('#718077');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.account, placeholder: '账号' });
            TextInput.debugLine("entry/src/main/ets/pages/Index.ets(138:9)", "entry");
            TextInput.onChange((value: string) => this.account = value);
            TextInput.backgroundColor(Color.White);
            TextInput.borderRadius(12);
            TextInput.height(50);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.password, placeholder: '密码' });
            TextInput.debugLine("entry/src/main/ets/pages/Index.ets(143:9)", "entry");
            TextInput.onChange((value: string) => this.password = value);
            TextInput.backgroundColor(Color.White);
            TextInput.borderRadius(12);
            TextInput.height(50);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('进入景区');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(148:9)", "entry");
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
            Text.debugLine("entry/src/main/ets/pages/Index.ets(161:7)", "entry");
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
                this.userRole = this.account === 'admin' ? '管理员' : '游客';
                this.activeTab = '首页';
                this.adminActiveTab = '概览';
                this.loggedIn = true;
            }
        });
    }
    application(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.userRole === '管理员') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.adminApplication.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(189:7)", "entry");
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
                                    Text.debugLine("entry/src/main/ets/pages/Index.ets(192:11)", "entry");
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
                        Scroll.debugLine("entry/src/main/ets/pages/Index.ets(201:9)", "entry");
                        Scroll.layoutWeight(1);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(202:11)", "entry");
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16, top: 14, bottom: 16 });
                    }, Column);
                    this.pageContent.bind(this)();
                    Column.pop();
                    Scroll.pop();
                    this.bottomNavigation.bind(this)();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
    }
    topBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(218:5)", "entry");
            Row.width('100%');
            Row.height(68);
            Row.padding({ left: 20, right: 20, top: 10, bottom: 12 });
            Row.alignItems(VerticalAlign.Center);
            Row.backgroundColor('#F4F8F5');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(219:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.justifyContent(FlexAlign.Center);
            Column.height(46);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.activeTab === '首页' ? '早上好，旅行者' : this.activeTab);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(220:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#193528');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.activeTab === '首页' ? '杭州西湖景区 · 22℃' : '杭州西湖景区');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(224:9)", "entry");
            Text.fontSize(12);
            Text.fontColor('#758379');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 0 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(232:7)", "entry");
            Column.width(46);
            Column.height(46);
            Column.alignItems(HorizontalAlign.Center);
            Column.justifyContent(FlexAlign.Center);
            Column.backgroundColor('#E1F3E7');
            Column.borderRadius(23);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('⌖');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(233:9)", "entry");
            Text.fontSize(20);
            Text.fontColor('#176B43');
            Text.width(42);
            Text.height(23);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('实时');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(239:9)", "entry");
            Text.fontSize(9);
            Text.fontColor('#176B43');
            Text.width(42);
            Text.height(13);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        Column.pop();
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
            Column.debugLine("entry/src/main/ets/pages/Index.ets(279:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(280:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.width('100%');
            Column.padding(20);
            Column.borderRadius(20);
            Column.backgroundColor('#176B43');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('此刻的西湖，适合出发');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(281:9)", "entry");
            Text.fontSize(23);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('湖滨舒适 · 断桥热度偏高，推荐南山慢游');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(285:9)", "entry");
            Text.fontSize(14);
            Text.fontColor('#EAF9EF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(288:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('今日余位 240');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(289:11)", "entry");
            Text.fontSize(12);
            Text.fontColor('#165E3D');
            Text.backgroundColor('#D7F4DF');
            Text.padding({ left: 10, right: 10, top: 6, bottom: 6 });
            Text.borderRadius(14);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('拥堵指数 低');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(295:11)", "entry");
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
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(311:9)", "entry");
                    Row.width('100%');
                    Row.padding(16);
                    Row.backgroundColor(Color.White);
                    Row.borderRadius(16);
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 5 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(312:11)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(ticket.name);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(313:13)", "entry");
                    Text.fontSize(17);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#203128');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(ticket.description);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(317:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#78857C');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.isTicketPaused(ticket.id) ? '当前已暂停售卖' : `剩余 ${this.ticketRemaining(ticket, index)} 张`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(320:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(this.isTicketPaused(ticket.id) || this.ticketRemaining(ticket, index) < 50 ? '#C3621F' : '#26724B');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 8 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(326:11)", "entry");
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.viewModel.formatPrice(ticket.price));
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(327:13)", "entry");
                    Text.fontSize(18);
                    Text.fontWeight(FontWeight.Bold);
                    Text.fontColor('#D85D27');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(index === this.ticketIndex ? '已选择' : '选择');
                    Button.debugLine("entry/src/main/ets/pages/Index.ets(331:13)", "entry");
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
            Button.debugLine("entry/src/main/ets/pages/Index.ets(349:7)", "entry");
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
            Row.debugLine("entry/src/main/ets/pages/Index.ets(358:7)", "entry");
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
            Row.debugLine("entry/src/main/ets/pages/Index.ets(370:5)", "entry");
            Row.width('100%');
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(371:7)", "entry");
            Text.fontSize(19);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#22332A');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(subtitle);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(375:7)", "entry");
            Text.fontSize(12);
            Text.fontColor('#839087');
            Text.margin({ left: 8, top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Index.ets(379:7)", "entry");
        }, Blank);
        Blank.pop();
        Row.pop();
    }
    quickAction(icon: string, title: string, caption: string, target: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 7 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(387:5)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.padding(14);
            Column.layoutWeight(1);
            Column.backgroundColor(Color.White);
            Column.borderRadius(14);
            Column.onClick(() => this.activeTab = target);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(icon);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(388:7)", "entry");
            Text.fontSize(25);
            Text.fontColor('#176B43');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(391:7)", "entry");
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#24362B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(caption);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(395:7)", "entry");
            Text.fontSize(11);
            Text.fontColor('#839087');
        }, Text);
        Text.pop();
        Column.pop();
    }
    private bookTicket(): void {
        const ticket = this.tickets[this.ticketIndex];
        if (!this.viewModel.canBook(ticket) || this.ticketRemaining(ticket, this.ticketIndex) <= 0 || this.isTicketPaused(ticket.id)) {
            this.notice = '该票种已售罄，请选择其他票种。';
            return;
        }
        this.ticketOrder = this.viewModel.repository.createTicketOrder(ticket, '2026-09-03 09:00-10:00');
        this.adjustTicketInventory(this.ticketIndex, -1);
        this.notice = '模拟支付成功，电子票二维码已生成。';
        this.addHistory('票务', ticket.name, '已支付，电子票已生成');
        this.activeTab = '我的';
    }
    guidePage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 18 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(422:5)", "entry");
            Column.width('100%');
        }, Column);
        this.sectionHeading.bind(this)('动态错峰游览助手', '本地模拟实时数据 · 每 4 秒更新');
        this.itineraryPlanner.bind(this)();
        this.sectionHeading.bind(this)('实时热力导览', `当前位置：苏堤北口 · ${this.crowdScenario}`);
        this.interactiveMap.bind(this)();
        this.sectionHeading.bind(this)('经典主题路线', '保留原有路线，一键切换');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const route = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 9 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(431:9)", "entry");
                    Column.width('100%');
                    Column.padding(16);
                    Column.backgroundColor(Color.White);
                    Column.borderRadius(16);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(432:11)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 4 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(433:13)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(route.title);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(434:15)", "entry");
                    Text.fontSize(17);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#24362B');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${route.duration} · ${route.distance}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(438:15)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#718077');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(route.id === this.selectedRouteId ? '使用中' : '选择');
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(444:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(route.id === this.selectedRouteId ? Color.White : '#176B43');
                    Text.backgroundColor(route.id === this.selectedRouteId ? '#176B43' : '#E5F2E9');
                    Text.padding({ left: 11, right: 11, top: 6, bottom: 6 });
                    Text.borderRadius(14);
                    Text.onClick(() => {
                        this.selectedRouteId = route.id;
                        this.activeItinerary = undefined;
                        this.originalItinerary = undefined;
                        this.rerouteExplanation = '';
                        this.navigationActive = false;
                        this.navigationStep = 0;
                        this.notice = `已为你规划 ${route.title}，全程 ${route.duration}。`;
                    });
                }, Text);
                Text.pop();
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(route.spots.join('  →  '));
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(460:11)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#5B6E61');
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.routes, forEachItemGenFunction, (route: RecommendedRoute) => route.id, false, false);
        }, ForEach);
        ForEach.pop();
        this.sectionHeading.bind(this)('景点人流', '实时热度 + 15 分钟预测');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const spot = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(472:9)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 4 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(473:11)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(spot.name);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(474:13)", "entry");
                    Text.fontSize(16);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#24362B');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${spot.subtitle} · ${spot.audioMinutes} 分钟讲解`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(478:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#718077');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${this.crowdLevel(spot)} ${this.currentCrowdPercent(spot)}%`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(484:11)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(this.crowdColor(spot));
                }, Text);
                Text.pop();
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${this.crowdTrend(spot)} · 15 分钟预测 ${this.currentForecastPercent(spot)}% · ${this.crowdAdvice(spot)}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(488:9)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(this.crowdColor(spot));
                    Text.margin({ top: 8 });
                    Text.width('100%');
                    Text.padding(15);
                    Text.backgroundColor(spot.id === this.selectedSpotId ? '#E9F7EE' : Color.White);
                    Text.borderRadius(15);
                    Text.onClick(() => {
                        this.selectMapSpot(spot);
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.spots, forEachItemGenFunction, (spot: ScenicSpot) => spot.id, false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
    }
    itineraryPlanner(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(506:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(18);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用时偏好');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(507:7)", "entry");
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#264534');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(511:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const duration = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${duration / 60} 小时`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(513:11)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(this.itineraryDurationMinutes === duration ? Color.White : '#176B43');
                    Text.backgroundColor(this.itineraryDurationMinutes === duration ? '#176B43' : '#E5F2E9');
                    Text.padding({ left: 14, right: 14, top: 7, bottom: 7 });
                    Text.borderRadius(16);
                    Text.onClick(() => this.itineraryDurationMinutes = duration);
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, ITINERARY_DURATIONS, forEachItemGenFunction, (duration: number) => `${duration}`, false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('兴趣标签（至少选择一项）');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(524:7)", "entry");
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#264534');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 7 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(528:7)", "entry");
            Row.width('100%');
        }, Row);
        this.itineraryInterestTag.bind(this)('亲子');
        this.itineraryInterestTag.bind(this)('文化');
        this.itineraryInterestTag.bind(this)('自然');
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 7 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(534:7)", "entry");
            Row.width('100%');
        }, Row);
        this.itineraryInterestTag.bind(this)('摄影');
        this.itineraryInterestTag.bind(this)('休闲');
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('生成我的错峰行程');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(540:7)", "entry");
            Button.width('100%');
            Button.height(42);
            Button.fontSize(14);
            Button.backgroundColor('#176B43');
            Button.fontColor(Color.White);
            Button.borderRadius(21);
            Button.onClick(() => this.generatePersonalItinerary());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.activeItinerary !== undefined) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.itineraryPlanCard.bind(this)(ObservedObject.GetRawObject(this.activeItinerary));
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
    itineraryInterestTag(tag: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(tag);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(561:5)", "entry");
            Text.fontSize(12);
            Text.fontColor(this.hasSelectedInterest(tag) ? Color.White : '#176B43');
            Text.backgroundColor(this.hasSelectedInterest(tag) ? '#176B43' : '#E5F2E9');
            Text.padding({ left: 14, right: 14, top: 7, bottom: 7 });
            Text.borderRadius(16);
            Text.onClick(() => this.toggleInterestTag(tag));
        }, Text);
        Text.pop();
    }
    itineraryPlanCard(plan: ItineraryPlan, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 9 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(572:5)", "entry");
            Column.width('100%');
            Column.padding(13);
            Column.backgroundColor('#F3FAF5');
            Column.borderRadius(14);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(573:7)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 3 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(574:9)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(plan.title);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(575:11)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#174D33');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.itinerarySpotNames(plan));
            Text.debugLine("entry/src/main/ets/pages/Index.ets(579:11)", "entry");
            Text.fontSize(12);
            Text.lineHeight(18);
            Text.fontColor('#5D7164');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`舒适度 ${plan.comfortScore}`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(586:9)", "entry");
            Text.fontSize(12);
            Text.fontColor('#176B43');
            Text.backgroundColor('#E5F2E9');
            Text.padding({ left: 8, right: 8, top: 5, bottom: 5 });
            Text.borderRadius(12);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`预计 ${plan.durationMinutes} 分钟 · 已避拥节省约 ${plan.savedWaitMinutes} 分钟`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(593:7)", "entry");
            Text.fontSize(12);
            Text.fontColor('#5D7164');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(plan.explanation);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(596:7)", "entry");
            Text.fontSize(12);
            Text.lineHeight(19);
            Text.fontColor('#B05B28');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.rerouteExplanation.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`自动绕行：${this.rerouteExplanation}`);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(601:9)", "entry");
                        Text.fontSize(12);
                        Text.lineHeight(19);
                        Text.fontColor('#A44A35');
                        Text.backgroundColor('#FFF1E8');
                        Text.padding(9);
                        Text.borderRadius(10);
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
            If.create();
            if (this.originalItinerary !== undefined && this.rerouteExplanation.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('恢复原路线并暂停自动绕行');
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(610:9)", "entry");
                        Button.width('100%');
                        Button.height(34);
                        Button.fontSize(12);
                        Button.backgroundColor('#F1F7F3');
                        Button.fontColor('#176B43');
                        Button.borderRadius(17);
                        Button.onClick(() => this.restoreOriginalItinerary());
                    }, Button);
                    Button.pop();
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
    interactiveMap(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(628:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 6 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(629:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`本地模拟实时 · ${this.crowdScenario} · ${this.crowdUpdatedAt()}`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(630:9)", "entry");
            Text.fontSize(11);
            Text.fontColor('#557066');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('绿 畅通  黄 适中  橙 拥挤  红 严重');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(634:9)", "entry");
            Text.fontSize(10);
            Text.fontColor('#66796D');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopStart });
            Stack.debugLine("entry/src/main/ets/pages/Index.ets(639:7)", "entry");
            Stack.width('100%');
            Stack.height(260);
            Stack.borderRadius(20);
            Stack.backgroundColor('#DCEFE2');
        }, Stack);
        this.routeMapImage.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const spot = _item;
                this.mapSpotMarker.bind(this)(spot);
            };
            this.forEachUpdateFunction(elmtId, this.spots, forEachItemGenFunction, (spot: ScenicSpot) => spot.id, false, false);
        }, ForEach);
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.mapExpanded ? '热力已展开 · 点击景点切换' : '点击热力点查看预测与讲解');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(644:9)", "entry");
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
            Row.debugLine("entry/src/main/ets/pages/Index.ets(657:7)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.navigationActive ? '重新规划' : '开始导航');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(658:9)", "entry");
            Button.layoutWeight(1);
            Button.height(42);
            Button.backgroundColor('#176B43');
            Button.fontColor(Color.White);
            Button.borderRadius(21);
            Button.onClick(() => this.startNavigation());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.mapExpanded ? '收起地图详情' : '展开地图详情');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(665:9)", "entry");
            Button.layoutWeight(1);
            Button.height(42);
            Button.backgroundColor('#E5F2E9');
            Button.fontColor('#176B43');
            Button.borderRadius(21);
            Button.onClick(() => this.toggleMapDetails());
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.mapExpanded) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.mapSpotDetails.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.navigationActive) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 7 });
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(677:9)", "entry");
                        Column.width('100%');
                        Column.padding(14);
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius(14);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`正在导航 · ${this.currentNavigationTitle()}`);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(678:11)", "entry");
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#176B43');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.navigationInstruction());
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(682:11)", "entry");
                        Text.fontSize(13);
                        Text.lineHeight(20);
                        Text.fontColor('#466154');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel(this.navigationStep + 1 >= this.currentNavigationSpotIds().length ? '完成导航' : '到达下一站');
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(686:11)", "entry");
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
    routeMapImage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.selectedRouteId === 'family') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777225, "type": 20000, params: [], "bundleName": "com.scenicnav.tourism", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/Index.ets(707:7)", "entry");
                        Image.width('100%');
                        Image.height(260);
                        Image.objectFit(ImageFit.Contain);
                    }, Image);
                });
            }
            else if (this.selectedRouteId === 'culture') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.scenicnav.tourism", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/Index.ets(712:7)", "entry");
                        Image.width('100%');
                        Image.height(260);
                        Image.objectFit(ImageFit.Contain);
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777224, "type": 20000, params: [], "bundleName": "com.scenicnav.tourism", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/Index.ets(717:7)", "entry");
                        Image.width('100%');
                        Image.height(260);
                        Image.objectFit(ImageFit.Contain);
                    }, Image);
                });
            }
        }, If);
        If.pop();
    }
    mapSpotMarker(spot: ScenicSpot, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 1 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(726:5)", "entry");
            Column.alignItems(HorizontalAlign.Center);
            Column.position({ x: `${spot.x}%`, y: `${spot.y}%` });
            Column.onClick(() => this.selectMapSpot(spot));
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Center });
            Stack.debugLine("entry/src/main/ets/pages/Index.ets(727:7)", "entry");
            Stack.width(38);
            Stack.height(32);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('●');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(728:9)", "entry");
            Text.fontSize(this.selectedSpotId === spot.id ? 40 : 34);
            Text.fontColor(this.crowdColor(spot));
            Text.opacity(0.24);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('●');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(732:9)", "entry");
            Text.fontSize(this.selectedSpotId === spot.id ? 22 : 18);
            Text.fontColor(this.crowdColor(spot));
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.itineraryStopNumber(spot.id) > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.itineraryStopNumber(spot.id)}`);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(736:11)", "entry");
                        Text.fontSize(10);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Color.White);
                        Text.margin({ top: 1 });
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
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(spot.name);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(745:7)", "entry");
            Text.fontSize(this.mapExpanded ? 11 : 9);
            Text.fontWeight(this.selectedSpotId === spot.id ? FontWeight.Bold : FontWeight.Regular);
            Text.fontColor('#244C3A');
            Text.backgroundColor(this.selectedSpotId === spot.id ? '#FFF6D9' : '#FFFFFF');
            Text.padding({ left: 4, right: 4, top: 2, bottom: 2 });
            Text.borderRadius(5);
        }, Text);
        Text.pop();
        Column.pop();
    }
    mapSpotDetails(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(760:5)", "entry");
            Column.width('100%');
            Column.padding(14);
            Column.backgroundColor(Color.White);
            Column.borderRadius(15);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 9 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(761:7)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('●');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(762:9)", "entry");
            Text.fontSize(22);
            Text.fontColor(this.crowdColor(this.currentSelectedSpot()));
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 3 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(765:9)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.currentSelectedSpot().name);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(766:11)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#244C3A');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.currentSelectedSpot().subtitle} · 当前${this.crowdLevel(this.currentSelectedSpot())} ${this.currentCrowdPercent(this.currentSelectedSpot())}%`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(770:11)", "entry");
            Text.fontSize(12);
            Text.fontColor('#63776B');
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.crowdAdvice(this.currentSelectedSpot()));
            Text.debugLine("entry/src/main/ets/pages/Index.ets(777:7)", "entry");
            Text.fontSize(12);
            Text.fontColor(this.crowdColor(this.currentSelectedSpot()));
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.crowdTrend(this.currentSelectedSpot())} · 15 分钟预测 ${this.currentForecastPercent(this.currentSelectedSpot())}%`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(780:7)", "entry");
            Text.fontSize(12);
            Text.fontColor('#63776B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(`播放 ${this.currentSelectedSpot().audioMinutes} 分钟图文讲解`);
            Button.debugLine("entry/src/main/ets/pages/Index.ets(783:7)", "entry");
            Button.width('100%');
            Button.height(34);
            Button.fontSize(12);
            Button.backgroundColor('#E5F2E9');
            Button.fontColor('#176B43');
            Button.borderRadius(17);
            Button.onClick(() => this.playSpotAudio(this.currentSelectedSpot()));
        }, Button);
        Button.pop();
        Column.pop();
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
        this.notice = `正在播放《${spot.name}》的 ${spot.audioMinutes} 分钟图文讲解（演示）。`;
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
        const result = this.viewModel.replanItinerary(this.activeItinerary, completedCount, this.currentItineraryProfile(), this.spots, this.crowdSnapshots);
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
        return `从苏堤北口模拟定位点出发，沿西湖步道前往「${destination}」。系统会持续检查未到达景点的 15 分钟客流预测。`;
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
    reservationPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 18 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1099:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 7 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1100:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('预约排队，让等待变得可预期');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1101:9)", "entry");
            Text.fontSize(21);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#214231');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`模拟运营时钟 ${this.simulatedClock()} · 临近时段会在“我的”页显示应用内提醒。`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1105:9)", "entry");
            Text.fontSize(13);
            Text.fontColor('#728077');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('刷新实时排队数据');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1112:7)", "entry");
            Button.width('100%');
            Button.height(40);
            Button.backgroundColor('#E5F2E9');
            Button.fontColor('#176B43');
            Button.borderRadius(20);
            Button.onClick(() => this.refreshQueues());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const project = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 11 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(1121:9)", "entry");
                    Column.width('100%');
                    Column.padding(17);
                    Column.backgroundColor(Color.White);
                    Column.borderRadius(17);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(1122:11)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 4 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(1123:13)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(project.name);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1124:15)", "entry");
                    Text.fontSize(18);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#24362B');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${project.category} · ${project.venue}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1128:15)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#6F7F75');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${project.startTime} 入场 · 前方约 ${this.projectQueueSize(project)} 人 · 预计等待 ${this.projectWaitMinutes(project)} 分钟`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1131:15)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#6F7F75');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`余 ${this.projectRemaining(project, index)}/${project.capacity}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1137:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(this.projectRemaining(project, index) < 10 ? '#C3621F' : '#28764C');
                }, Text);
                Text.pop();
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create({ space: 10 });
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(1141:11)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(this.hasProjectBooking(project.id) ? '已预约' : '预约时段');
                    Button.debugLine("entry/src/main/ets/pages/Index.ets(1142:13)", "entry");
                    Button.layoutWeight(1);
                    Button.height(38);
                    Button.fontSize(13);
                    Button.backgroundColor(this.hasProjectBooking(project.id) ? '#E2F2E8' : '#176B43');
                    Button.fontColor(this.hasProjectBooking(project.id) ? '#176B43' : Color.White);
                    Button.borderRadius(19);
                    Button.onClick(() => this.bookProject(project));
                }, Button);
                Button.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(this.hasFastPass(project.id) ? '快速通行券已购' : `快速通行券 ￥${project.fastPassPrice}`);
                    Button.debugLine("entry/src/main/ets/pages/Index.ets(1150:13)", "entry");
                    Button.layoutWeight(1);
                    Button.height(38);
                    Button.fontSize(13);
                    Button.backgroundColor('#FFF0E7');
                    Button.fontColor('#C85C28');
                    Button.borderRadius(19);
                    Button.onClick(() => this.buyFastPass(project));
                }, Button);
                Button.pop();
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.hasProjectBooking(project.id) ? `已设置：入场前 ${project.reminderMinutes} 分钟应用内提醒${this.hasFastPass(project.id) ? ' · 已启用快速核验通道' : ''}` : '可预约普通队列，或购买快速通行券（插队券）缩短等待。');
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1159:11)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(this.hasProjectBooking(project.id) ? '#28764C' : '#8A715D');
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.projects, forEachItemGenFunction, (project: ProjectReservation) => project.id, true, false);
        }, ForEach);
        ForEach.pop();
        this.sectionHeading.bind(this)('餐饮住宿', '好评商家与住玩套餐');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(1170:7)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const category = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(category);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1172:11)", "entry");
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
                                Row.debugLine("entry/src/main/ets/pages/Index.ets(1183:11)", "entry");
                                Row.width('100%');
                                Row.padding(15);
                                Row.backgroundColor(Color.White);
                                Row.borderRadius(15);
                                Row.margin({ top: 8 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create({ space: 5 });
                                Column.debugLine("entry/src/main/ets/pages/Index.ets(1184:13)", "entry");
                                Column.alignItems(HorizontalAlign.Start);
                                Column.layoutWeight(1);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`${merchant.category} · ${merchant.name}`);
                                Text.debugLine("entry/src/main/ets/pages/Index.ets(1185:15)", "entry");
                                Text.fontSize(16);
                                Text.fontWeight(FontWeight.Medium);
                                Text.fontColor('#24362B');
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(merchant.description);
                                Text.debugLine("entry/src/main/ets/pages/Index.ets(1189:15)", "entry");
                                Text.fontSize(12);
                                Text.fontColor('#6F7F75');
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`★ ${merchant.rating}`);
                                Text.debugLine("entry/src/main/ets/pages/Index.ets(1192:15)", "entry");
                                Text.fontSize(12);
                                Text.fontColor('#C77C20');
                            }, Text);
                            Text.pop();
                            Column.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel('预订');
                                Button.debugLine("entry/src/main/ets/pages/Index.ets(1198:13)", "entry");
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
        if (this.hasProjectBooking(project.id)) {
            this.notice = `${project.name} 已预约，请在 ${project.startTime} 前到场。`;
            return;
        }
        const index = this.projectIndex(project.id);
        if (this.projectRemaining(project, index) <= 0) {
            this.notice = `${project.name} 当前时段已约满，请刷新或选择其他项目。`;
            return;
        }
        const booking: ProjectBooking = {
            projectId: project.id,
            fastPass: false,
            reminderEnabled: true,
            status: '已预约'
        };
        this.projectBookings = [...this.projectBookings, booking];
        this.adjustProjectInventory(index, -1);
        this.notice = `${project.name} 预约成功，预计等待 ${this.projectWaitMinutes(project)} 分钟，入场前 ${project.reminderMinutes} 分钟将提醒。`;
        this.addHistory('预约', project.name, `${project.startTime} 时段预约成功`);
    }
    private buyFastPass(project: ProjectReservation): void {
        if (this.hasFastPass(project.id)) {
            this.notice = `${project.name} 的快速通行服务已生效，请走快速核验通道。`;
            return;
        }
        const index = this.projectIndex(project.id);
        if (this.projectRemaining(project, index) <= 0 && !this.hasProjectBooking(project.id)) {
            this.notice = `${project.name} 当前无可用时段，暂无法购买快速通行服务。`;
            return;
        }
        if (this.hasProjectBooking(project.id)) {
            const nextBookings: ProjectBooking[] = [];
            for (let bookingIndex = 0; bookingIndex < this.projectBookings.length; bookingIndex++) {
                const current = this.projectBookings[bookingIndex];
                if (current.projectId === project.id) {
                    const upgraded: ProjectBooking = {
                        projectId: current.projectId,
                        fastPass: true,
                        reminderEnabled: current.reminderEnabled,
                        status: '快速通行已开通'
                    };
                    nextBookings.push(upgraded);
                }
                else {
                    nextBookings.push(current);
                }
            }
            this.projectBookings = nextBookings;
        }
        else {
            const booking: ProjectBooking = {
                projectId: project.id,
                fastPass: true,
                reminderEnabled: true,
                status: '快速通行已开通'
            };
            this.projectBookings = [...this.projectBookings, booking];
            this.adjustProjectInventory(index, -1);
        }
        this.notice = `${project.name} 快速通行模拟支付成功，已保留时段并缩短现场等待。`;
        this.addHistory('预约', project.name, `已购买 ￥${project.fastPassPrice} 快速通行服务`);
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
    private projectWaitMinutes(project: ProjectReservation): number {
        return Math.max(5, project.waitMinutes - (this.queueRefreshCount % 4) * 3);
    }
    private projectQueueSize(project: ProjectReservation): number {
        return Math.max(3, project.queueSize - (this.queueRefreshCount % 4) * 7);
    }
    private simulatedClock(): string {
        const minute = 5 + this.queueRefreshCount * 3;
        return `10:${minute < 10 ? '0' : ''}${minute}`;
    }
    private hasProjectBooking(projectId: string): boolean {
        for (let index = 0; index < this.projectBookings.length; index++) {
            if (this.projectBookings[index].projectId === projectId) {
                return true;
            }
        }
        return false;
    }
    private hasFastPass(projectId: string): boolean {
        for (let index = 0; index < this.projectBookings.length; index++) {
            if (this.projectBookings[index].projectId === projectId && this.projectBookings[index].fastPass) {
                return true;
            }
        }
        return false;
    }
    private adjustProjectInventory(index: number, amount: number): void {
        const nextInventory: number[] = [];
        for (let inventoryIndex = 0; inventoryIndex < this.projectInventoryDelta.length; inventoryIndex++) {
            nextInventory.push(inventoryIndex === index ? this.projectInventoryDelta[inventoryIndex] + amount : this.projectInventoryDelta[inventoryIndex]);
        }
        this.projectInventoryDelta = nextInventory;
    }
    private refreshQueues(): void {
        this.queueRefreshCount = this.queueRefreshCount + 1;
        this.notice = `已刷新 ${this.simulatedClock()} 的排队数据，部分项目已完成放行。`;
        this.addHistory('预约', '排队数据刷新', '查看各项目最新等待时间');
    }
    private triggerProjectReminder(booking: ProjectBooking): void {
        if (this.remindedProjectIds.indexOf(booking.projectId) >= 0) {
            this.notice = `${this.projectName(booking.projectId)} 的到场提醒已发送。`;
            return;
        }
        this.remindedProjectIds = [...this.remindedProjectIds, booking.projectId];
        this.notice = `到场提醒：请在 ${this.projectName(booking.projectId)} 开始前前往集合点${booking.fastPass ? '，快速核验通道已开启。' : '。'}`;
        this.addHistory('提醒', this.projectName(booking.projectId), '已发送应用内到场提醒');
    }
    mallPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 18 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1366:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 7 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1367:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('景区好物，寄一份山水回家');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1368:9)", "entry");
            Text.fontSize(21);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#214231');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`当前积分 ${this.points} · 分享游玩照片可额外获得 20 积分`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1372:9)", "entry");
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
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(1380:9)", "entry");
                    Row.width('100%');
                    Row.padding(16);
                    Row.backgroundColor(Color.White);
                    Row.borderRadius(16);
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 6 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(1381:11)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(product.name);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1382:13)", "entry");
                    Text.fontSize(17);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#24362B');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(product.description);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1386:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#6F7F75');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${this.viewModel.formatPrice(product.price)} · 送 ${product.points} 积分`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1389:13)", "entry");
                    Text.fontSize(13);
                    Text.fontColor('#C85C28');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(this.mallOrders.indexOf(product.id) >= 0 ? '已下单' : '加入订单');
                    Button.debugLine("entry/src/main/ets/pages/Index.ets(1395:11)", "entry");
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
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1409:7)", "entry");
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
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1417:7)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('限时住玩组合');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1418:9)", "entry");
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#24362B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('湖畔精品酒店 + 西湖环湖游船票，两人套餐 ￥888（演示）');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1422:9)", "entry");
            Text.fontSize(13);
            Text.fontColor('#6F7F75');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('生成组合预订单');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1425:9)", "entry");
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
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1464:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 12 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(1465:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('旅');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1466:9)", "entry");
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
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1475:9)", "entry");
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('旅行者 tourist');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1476:11)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#24362B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`西湖会员 · ${this.points} 积分`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1480:11)", "entry");
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
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(1489:9)", "entry");
                        Column.width('100%');
                        Column.padding(17);
                        Column.backgroundColor(Color.White);
                        Column.borderRadius(17);
                    }, Column);
                    this.sectionHeading.bind(this)('我的电子票', this.ticketOrder.status);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.ticketOrder.ticketName);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(1491:11)", "entry");
                        Text.fontSize(17);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#24362B');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.ticketOrder.visitDate);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(1495:11)", "entry");
                        Text.fontSize(13);
                        Text.fontColor('#6F7F75');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('▣ ▦ ▣ ▤ ▦ ▣\n▦ ▣ ▤ ▣ ▦ ▤\n▣ ▤ ▦ ▣ ▤ ▦');
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(1498:11)", "entry");
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
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(1505:11)", "entry");
                        Text.fontSize(9);
                        Text.fontColor('#7B887F');
                        Text.maxLines(1);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.debugLine("entry/src/main/ets/pages/Index.ets(1509:11)", "entry");
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('退改电子票');
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(1510:13)", "entry");
                        Button.layoutWeight(1);
                        Button.height(36);
                        Button.backgroundColor('#FFF0E7');
                        Button.fontColor('#C85C28');
                        Button.borderRadius(18);
                        Button.onClick(() => {
                            this.ticketOrder = undefined;
                            this.adjustTicketInventory(this.ticketIndex, 1);
                            this.notice = '电子票已模拟退改，库存已释放。';
                            this.addHistory('票务', '电子票退改', '库存已释放，等待退款处理');
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('模拟闸机验票');
                        Button.debugLine("entry/src/main/ets/pages/Index.ets(1522:13)", "entry");
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
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(1536:9)", "entry");
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
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(1547:9)", "entry");
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
                            const booking = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create({ space: 7 });
                                Column.debugLine("entry/src/main/ets/pages/Index.ets(1556:11)", "entry");
                                Column.alignItems(HorizontalAlign.Start);
                                Column.width('100%');
                                Column.padding(14);
                                Column.backgroundColor('#E9F7EE');
                                Column.borderRadius(14);
                                Column.margin({ top: 7 });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`已预约：${this.projectName(booking.projectId)} · ${booking.fastPass ? '快速通行' : '普通队列'}`);
                                Text.debugLine("entry/src/main/ets/pages/Index.ets(1557:13)", "entry");
                                Text.fontSize(13);
                                Text.fontColor('#286C49');
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`状态：${booking.status} · 已设置到场提醒${this.remindedProjectIds.indexOf(booking.projectId) >= 0 ? '（已发送）' : ''}`);
                                Text.debugLine("entry/src/main/ets/pages/Index.ets(1560:13)", "entry");
                                Text.fontSize(12);
                                Text.fontColor('#657A6B');
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Button.createWithLabel(this.remindedProjectIds.indexOf(booking.projectId) >= 0 ? '到场提醒已发送' : '模拟发送到场提醒');
                                Button.debugLine("entry/src/main/ets/pages/Index.ets(1563:13)", "entry");
                                Button.height(32);
                                Button.fontSize(12);
                                Button.backgroundColor('#F1F7F3');
                                Button.fontColor('#176B43');
                                Button.borderRadius(16);
                                Button.onClick(() => this.triggerProjectReminder(booking));
                            }, Button);
                            Button.pop();
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.projectBookings, forEachItemGenFunction, (booking: ProjectBooking) => booking.projectId, false, false);
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
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(1582:9)", "entry");
                    Row.width('100%');
                    Row.padding(13);
                    Row.backgroundColor(Color.White);
                    Row.borderRadius(13);
                    Row.margin({ top: 7 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(record.type);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1583:11)", "entry");
                    Text.fontSize(11);
                    Text.fontColor('#176B43');
                    Text.backgroundColor('#E5F2E9');
                    Text.padding({ left: 8, right: 8, top: 5, bottom: 5 });
                    Text.borderRadius(10);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 3 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(1589:11)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(record.title);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1590:13)", "entry");
                    Text.fontSize(14);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#2A3A31');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${record.detail} · ${record.time}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1594:13)", "entry");
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
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1609:7)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('客服小湖在线：可咨询电子票、排队、路线与餐宿；客服工作台会同步游客反馈。');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1610:9)", "entry");
            Text.fontSize(13);
            Text.lineHeight(19);
            Text.fontColor('#596B60');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('打开在线客服 / 客服工作台');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1614:9)", "entry");
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
            TextInput.debugLine("entry/src/main/ets/pages/Index.ets(1621:9)", "entry");
            TextInput.onChange((value: string) => this.feedbackContent = value);
            TextInput.height(48);
            TextInput.backgroundColor('#F3F6F4');
            TextInput.borderRadius(10);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('提交反馈');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1626:9)", "entry");
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
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1639:7)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('景区管理端');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1640:9)", "entry");
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#24362B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('管理票务库存、景区设施、预约队列、订单与游客反馈。');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1644:9)", "entry");
            Text.fontSize(13);
            Text.fontColor('#657A6B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('切换到管理员演示登录');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1647:9)", "entry");
            Button.width('100%');
            Button.height(38);
            Button.backgroundColor('#E8EDF8');
            Button.fontColor('#3F5A91');
            Button.borderRadius(19);
            Button.onClick(() => this.openAdminLogin());
        }, Button);
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('退出演示账号');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1660:7)", "entry");
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
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1676:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(1677:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('‹ 返回我的');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1678:9)", "entry");
            Text.fontSize(14);
            Text.fontColor('#176B43');
            Text.onClick(() => this.activeTab = '我的');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Index.ets(1682:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('在线');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1683:9)", "entry");
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
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1692:7)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('客服工作台');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1693:9)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#24362B');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('模拟实时会话 · 游客消息会立即得到客服答复');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1697:9)", "entry");
            Text.fontSize(13);
            Text.fontColor('#718077');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 9 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1704:7)", "entry");
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
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(1706:11)", "entry");
                    Column.alignItems(message.sender === '游客' ? HorizontalAlign.End : HorizontalAlign.Start);
                    Column.width('100%');
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${message.sender} · ${message.time}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1707:13)", "entry");
                    Text.fontSize(11);
                    Text.fontColor('#78857C');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(message.content);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1710:13)", "entry");
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
            Row.debugLine("entry/src/main/ets/pages/Index.ets(1727:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.serviceDraft, placeholder: '输入咨询内容，例如“断桥人多吗？”' });
            TextInput.debugLine("entry/src/main/ets/pages/Index.ets(1728:9)", "entry");
            TextInput.onChange((value: string) => this.serviceDraft = value);
            TextInput.layoutWeight(1);
            TextInput.height(44);
            TextInput.backgroundColor(Color.White);
            TextInput.borderRadius(12);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('发送');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1734:9)", "entry");
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
            Row.debugLine("entry/src/main/ets/pages/Index.ets(1743:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('断桥拥堵？');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1744:9)", "entry");
            Button.fontSize(12);
            Button.backgroundColor('#E5F2E9');
            Button.fontColor('#176B43');
            Button.borderRadius(15);
            Button.onClick(() => this.sendServiceMessage('断桥现在拥堵吗？'));
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('如何退票？');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1750:9)", "entry");
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
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1760:7)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.followUpCompleted ? '感谢你的回访评价，客服已将建议纳入景区服务优化记录。' : '本次游览体验如何？你的评价将帮助景区优化路线、排队和服务。');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1761:9)", "entry");
            Text.fontSize(13);
            Text.lineHeight(19);
            Text.fontColor('#596B60');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 9 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(1765:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const score = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('★');
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(1767:13)", "entry");
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
            Button.debugLine("entry/src/main/ets/pages/Index.ets(1773:9)", "entry");
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
        this.latestFeedback = `游客反馈：${this.feedbackContent}`;
        this.feedbackHandled = false;
        this.addHistory('反馈', '游客意见反馈', this.feedbackContent);
        this.feedbackContent = '';
    }
    private openAdminLogin(): void {
        this.loggedIn = false;
        this.account = 'admin';
        this.password = '123456';
        this.notice = '已切换至管理端演示登录，请点击“进入景区”。';
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
            sender: '客服小湖',
            content: this.serviceReply(question),
            time: '刚刚'
        };
        this.serviceMessages = [...this.serviceMessages, visitorMessage, agentMessage];
        this.serviceDraft = '';
        this.notice = '客服小湖已实时回复你的问题。';
        this.addHistory('客服', '在线咨询', question);
    }
    private serviceReply(question: string): string {
        if (question.indexOf('人') >= 0 || question.indexOf('拥') >= 0) {
            return '断桥残雪当前热度为 86%，建议先按南山慢游线前往雷峰塔与花港观鱼，15:00 后再前往断桥。';
        }
        if (question.indexOf('退') >= 0 || question.indexOf('票') >= 0) {
            return '电子票可在未入园前在“我的”页点击“退改电子票”办理，系统会自动释放对应时段库存。';
        }
        if (question.indexOf('预约') >= 0 || question.indexOf('排队') >= 0) {
            return '项目预约成功后会显示预计等待时间；到场前会产生应用内提醒，也可购买快速通行券缩短等待。';
        }
        return '已收到你的问题。客服小湖建议你先查看导览页的人流提示；如需人工协助，反馈会自动转交客服队列。';
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
    adminApplication(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1881:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F3F6FB');
        }, Column);
        this.adminTopBar.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.notice);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1883:7)", "entry");
            Text.fontSize(12);
            Text.fontColor('#3F5A91');
            Text.backgroundColor('#E8EDF8');
            Text.borderRadius(8);
            Text.padding({ top: 7, bottom: 7, left: 10, right: 10 });
            Text.width('92%');
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/Index.ets(1891:7)", "entry");
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1892:9)", "entry");
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 14, bottom: 16 });
        }, Column);
        this.adminPageContent.bind(this)();
        Column.pop();
        Scroll.pop();
        this.adminBottomNavigation.bind(this)();
        Column.pop();
    }
    adminTopBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(1908:5)", "entry");
            Row.width('100%');
            Row.padding({ left: 20, right: 20, top: 14, bottom: 10 });
            Row.alignItems(VerticalAlign.Center);
            Row.backgroundColor('#F3F6FB');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 2 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1909:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('智慧西湖运营中心');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1910:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#263B66');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`管理员 · ${this.adminActiveTab} · 本地演示数据`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1914:9)", "entry");
            Text.fontSize(12);
            Text.fontColor('#7180A0');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('退出');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1920:7)", "entry");
            Text.fontSize(12);
            Text.fontColor('#3F5A91');
            Text.backgroundColor('#E3EAF8');
            Text.padding({ left: 11, right: 11, top: 7, bottom: 7 });
            Text.borderRadius(15);
            Text.onClick(() => this.exitAdmin());
        }, Text);
        Text.pop();
        Row.pop();
    }
    adminPageContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.adminActiveTab === '概览') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.adminOverviewPage.bind(this)();
                });
            }
            else if (this.adminActiveTab === '设施') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.adminFacilityPage.bind(this)();
                });
            }
            else if (this.adminActiveTab === '票务') {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.adminTicketPage.bind(this)();
                });
            }
            else if (this.adminActiveTab === '预约') {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.adminReservationPage.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(4, () => {
                    this.adminServicePage.bind(this)();
                });
            }
        }, If);
        If.pop();
    }
    adminOverviewPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1951:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 7 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1952:7)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('今日景区运营概览');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1953:9)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#263B66');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('所有数据均为本地模拟，可在下方页面进行联动操作。');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1957:9)", "entry");
            Text.fontSize(13);
            Text.fontColor('#7180A0');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 9 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(1964:7)", "entry");
            Row.width('100%');
        }, Row);
        this.adminMetric.bind(this)('入园客流', '8,426', '#5B75AF');
        this.adminMetric.bind(this)('采用绕行', this.diversionMetric(), '#247D68');
        this.adminMetric.bind(this)('待处理反馈', this.feedbackHandled ? '0' : '1', '#C57938');
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(1971:7)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(18);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('客流调度演示');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1972:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#293A5D');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`当前场景：${this.crowdScenario} · ${this.highCrowdSpotCount()} 个景点处于预测高热风险`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1976:9)", "entry");
            Text.fontSize(12);
            Text.fontColor('#61708A');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 7 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(1979:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const scenario = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(scenario);
                    Button.debugLine("entry/src/main/ets/pages/Index.ets(1981:13)", "entry");
                    Button.layoutWeight(1);
                    Button.height(34);
                    Button.fontSize(11);
                    Button.backgroundColor(this.crowdScenario === scenario ? '#3F5A91' : '#EEF2FA');
                    Button.fontColor(this.crowdScenario === scenario ? Color.White : '#3F5A91');
                    Button.borderRadius(17);
                    Button.onClick(() => this.selectCrowdScenario(scenario));
                }, Button);
                Button.pop();
            };
            this.forEachUpdateFunction(elmtId, this.viewModel.repository.crowdScenarios(), forEachItemGenFunction, (scenario: string) => scenario, false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`调度效果：已向 ${this.diversionMetric()} 位模拟游客下发错峰建议；已生成的个性路线会自动仅重排未到达景点。`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(1991:9)", "entry");
            Text.fontSize(12);
            Text.lineHeight(19);
            Text.fontColor('#3F5A91');
            Text.width('100%');
            Text.padding(11);
            Text.backgroundColor('#EAF0FC');
            Text.borderRadius(12);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(2005:7)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(18);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('运营预警');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(2006:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#293A5D');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.operationAlert());
            Text.debugLine("entry/src/main/ets/pages/Index.ets(2010:9)", "entry");
            Text.fontSize(13);
            Text.lineHeight(20);
            Text.fontColor('#8A5A29');
            Text.width('100%');
            Text.padding(14);
            Text.backgroundColor('#FFF4E6');
            Text.borderRadius(14);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`雷峰塔讲解集合点当前预计等待 ${this.projectWaitMinutes(this.projects[3])} 分钟，可在“预约”页模拟放行队列。`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(2018:9)", "entry");
            Text.fontSize(13);
            Text.lineHeight(20);
            Text.fontColor('#3F5A91');
            Text.width('100%');
            Text.padding(14);
            Text.backgroundColor('#EAF0FC');
            Text.borderRadius(14);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('最新订单');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(2032:7)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#293A5D');
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const order = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(2038:9)", "entry");
                    Row.width('100%');
                    Row.padding(14);
                    Row.backgroundColor(Color.White);
                    Row.borderRadius(14);
                    Row.margin({ top: 7 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 4 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(2039:11)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(order.item);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2040:13)", "entry");
                    Text.fontSize(15);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#293A5D');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${order.visitor} · ${order.time}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2044:13)", "entry");
                    Text.fontSize(11);
                    Text.fontColor('#7986A0');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 3 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(2050:11)", "entry");
                    Column.alignItems(HorizontalAlign.End);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`￥${order.amount}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2051:13)", "entry");
                    Text.fontSize(14);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#3F5A91');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(order.status);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2055:13)", "entry");
                    Text.fontSize(11);
                    Text.fontColor('#28764C');
                }, Text);
                Text.pop();
                Column.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.adminOrders, forEachItemGenFunction, (order: AdminOrderRecord) => order.id, false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
    }
    adminMetric(label: string, value: string, color: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 6 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(2073:5)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
            Column.padding(13);
            Column.backgroundColor(Color.White);
            Column.borderRadius(15);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(2074:7)", "entry");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(color);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(2078:7)", "entry");
            Text.fontSize(12);
            Text.fontColor('#7986A0');
        }, Text);
        Text.pop();
        Column.pop();
    }
    adminFacilityPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(2091:5)", "entry");
            Column.width('100%');
        }, Column);
        this.adminSectionHeading.bind(this)('景区设施管理', '设施状态会即时保存在本次演示中');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const facility = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 9 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(2094:9)", "entry");
                    Column.width('100%');
                    Column.padding(16);
                    Column.backgroundColor(Color.White);
                    Column.borderRadius(16);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(2095:11)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 4 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(2096:13)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(facility.name);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2097:15)", "entry");
                    Text.fontSize(17);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#293A5D');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${facility.type} · ${facility.area}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2101:15)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#7986A0');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.facilityStatus(index));
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2107:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(this.facilityStatus(index) === '暂停维护' ? '#B65B2A' : '#28764C');
                    Text.backgroundColor(this.facilityStatus(index) === '暂停维护' ? '#FFF0E7' : '#E9F7EE');
                    Text.padding({ left: 9, right: 9, top: 5, bottom: 5 });
                    Text.borderRadius(12);
                }, Text);
                Text.pop();
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${facility.usage} · ${facility.description}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2114:11)", "entry");
                    Text.fontSize(12);
                    Text.lineHeight(18);
                    Text.fontColor('#61708A');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(this.facilityStatus(index) === '暂停维护' ? '恢复运行' : '设置维护');
                    Button.debugLine("entry/src/main/ets/pages/Index.ets(2118:11)", "entry");
                    Button.width('100%');
                    Button.height(34);
                    Button.fontSize(12);
                    Button.backgroundColor('#EEF2FA');
                    Button.fontColor('#3F5A91');
                    Button.borderRadius(17);
                    Button.onClick(() => this.toggleFacilityStatus(index));
                }, Button);
                Button.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.facilities, forEachItemGenFunction, (facility: ScenicFacility) => facility.id, true, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
    }
    adminTicketPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(2138:5)", "entry");
            Column.width('100%');
        }, Column);
        this.adminSectionHeading.bind(this)('票务与库存管理', '补库存、停售会联动游客端下单状态');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const ticket = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 10 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(2141:9)", "entry");
                    Column.width('100%');
                    Column.padding(16);
                    Column.backgroundColor(Color.White);
                    Column.borderRadius(16);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(2142:11)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 4 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(2143:13)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(ticket.name);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2144:15)", "entry");
                    Text.fontSize(17);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#293A5D');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(ticket.description);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2148:15)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#7986A0');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 3 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(2154:13)", "entry");
                    Column.alignItems(HorizontalAlign.End);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`余 ${this.ticketRemaining(ticket, index)} 张`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2155:15)", "entry");
                    Text.fontSize(14);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#3F5A91');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.isTicketPaused(ticket.id) ? '已停售' : '售卖中');
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2159:15)", "entry");
                    Text.fontSize(11);
                    Text.fontColor(this.isTicketPaused(ticket.id) ? '#B65B2A' : '#28764C');
                }, Text);
                Text.pop();
                Column.pop();
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create({ space: 9 });
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(2165:11)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('补充 20 张');
                    Button.debugLine("entry/src/main/ets/pages/Index.ets(2166:13)", "entry");
                    Button.layoutWeight(1);
                    Button.height(34);
                    Button.fontSize(12);
                    Button.backgroundColor('#E9F7EE');
                    Button.fontColor('#28764C');
                    Button.borderRadius(17);
                    Button.onClick(() => this.adjustTicketInventory(index, 20));
                }, Button);
                Button.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(this.isTicketPaused(ticket.id) ? '恢复售卖' : '暂停售卖');
                    Button.debugLine("entry/src/main/ets/pages/Index.ets(2174:13)", "entry");
                    Button.layoutWeight(1);
                    Button.height(34);
                    Button.fontSize(12);
                    Button.backgroundColor('#FFF0E7');
                    Button.fontColor('#B65B2A');
                    Button.borderRadius(17);
                    Button.onClick(() => this.toggleTicketSale(ticket.id, ticket.name));
                }, Button);
                Button.pop();
                Row.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.tickets, forEachItemGenFunction, (ticket: TicketProduct) => ticket.id, true, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
    }
    adminReservationPage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(2195:5)", "entry");
            Column.width('100%');
        }, Column);
        this.adminSectionHeading.bind(this)('预约队列运营', `当前模拟时钟 ${this.simulatedClock()} · 可放行队列和补充余位`);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const project = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 10 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(2198:9)", "entry");
                    Column.width('100%');
                    Column.padding(16);
                    Column.backgroundColor(Color.White);
                    Column.borderRadius(16);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(2199:11)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 4 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(2200:13)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(project.name);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2201:15)", "entry");
                    Text.fontSize(17);
                    Text.fontWeight(FontWeight.Medium);
                    Text.fontColor('#293A5D');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${project.venue} · ${project.startTime} 入场`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2205:15)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#7986A0');
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`余 ${this.projectRemaining(project, index)}/${project.capacity}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2211:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#3F5A91');
                }, Text);
                Text.pop();
                Row.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`普通队列约 ${this.projectQueueSize(project)} 人 · 预计 ${this.projectWaitMinutes(project)} 分钟 · 快速通行券 ￥${project.fastPassPrice}`);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2215:11)", "entry");
                    Text.fontSize(12);
                    Text.fontColor('#61708A');
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create({ space: 9 });
                    Row.debugLine("entry/src/main/ets/pages/Index.ets(2218:11)", "entry");
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('模拟放行队列');
                    Button.debugLine("entry/src/main/ets/pages/Index.ets(2219:13)", "entry");
                    Button.layoutWeight(1);
                    Button.height(34);
                    Button.fontSize(12);
                    Button.backgroundColor('#E9F7EE');
                    Button.fontColor('#28764C');
                    Button.borderRadius(17);
                    Button.onClick(() => this.dispatchProjectQueue(project));
                }, Button);
                Button.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel('补充 10 个余位');
                    Button.debugLine("entry/src/main/ets/pages/Index.ets(2227:13)", "entry");
                    Button.layoutWeight(1);
                    Button.height(34);
                    Button.fontSize(12);
                    Button.backgroundColor('#EEF2FA');
                    Button.fontColor('#3F5A91');
                    Button.borderRadius(17);
                    Button.onClick(() => this.restockProject(project, index));
                }, Button);
                Button.pop();
                Row.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.projects, forEachItemGenFunction, (project: ProjectReservation) => project.id, true, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
    }
    adminServicePage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(2248:5)", "entry");
            Column.width('100%');
        }, Column);
        this.adminSectionHeading.bind(this)('客服与回访管理', '游客反馈和会话在本地演示中同步呈现');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(2250:7)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('最新游客反馈');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(2251:9)", "entry");
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#293A5D');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.latestFeedback);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(2255:9)", "entry");
            Text.fontSize(13);
            Text.lineHeight(20);
            Text.fontColor('#61708A');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.feedbackHandled ? '处理状态：已处理并归档' : '处理状态：待客服处理');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(2259:9)", "entry");
            Text.fontSize(12);
            Text.fontColor(this.feedbackHandled ? '#28764C' : '#B65B2A');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.feedbackHandled ? '反馈已处理' : '标记为已处理');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(2262:9)", "entry");
            Button.width('100%');
            Button.height(36);
            Button.fontSize(12);
            Button.backgroundColor(this.feedbackHandled ? '#E9F7EE' : '#FFF0E7');
            Button.fontColor(this.feedbackHandled ? '#28764C' : '#B65B2A');
            Button.borderRadius(18);
            Button.onClick(() => this.handleLatestFeedback());
        }, Button);
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(2276:7)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('在线会话摘要');
            Text.debugLine("entry/src/main/ets/pages/Index.ets(2277:9)", "entry");
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#293A5D');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`本次演示共 ${this.serviceMessages.length} 条会话消息，游客端可继续发起实时咨询。`);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(2281:9)", "entry");
            Text.fontSize(13);
            Text.lineHeight(20);
            Text.fontColor('#61708A');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('模拟发起游后回访');
            Button.debugLine("entry/src/main/ets/pages/Index.ets(2285:9)", "entry");
            Button.width('100%');
            Button.height(36);
            Button.fontSize(12);
            Button.backgroundColor('#EEF2FA');
            Button.fontColor('#3F5A91');
            Button.borderRadius(18);
            Button.onClick(() => this.startAdminFollowUp());
        }, Button);
        Button.pop();
        Column.pop();
        Column.pop();
    }
    adminSectionHeading(title: string, subtitle: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 5 });
            Column.debugLine("entry/src/main/ets/pages/Index.ets(2304:5)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(2305:7)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#293A5D');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(subtitle);
            Text.debugLine("entry/src/main/ets/pages/Index.ets(2309:7)", "entry");
            Text.fontSize(12);
            Text.fontColor('#7986A0');
        }, Text);
        Text.pop();
        Column.pop();
    }
    private facilityStatus(index: number): string {
        return this.facilityStatuses[index];
    }
    private toggleFacilityStatus(index: number): void {
        const nextStatuses: string[] = [];
        for (let statusIndex = 0; statusIndex < this.facilityStatuses.length; statusIndex++) {
            if (statusIndex === index) {
                nextStatuses.push(this.facilityStatuses[statusIndex] === '暂停维护' ? '正常' : '暂停维护');
            }
            else {
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
        this.queueRefreshCount = this.queueRefreshCount + 1;
        this.notice = `${project.name} 已模拟放行一批游客，预计等待时间已更新。`;
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
    private handleLatestFeedback(): void {
        if (this.feedbackHandled) {
            this.notice = '最新游客反馈已处理并归档。';
            return;
        }
        this.feedbackHandled = true;
        this.notice = '反馈已标记为已处理，并已加入服务优化任务。';
    }
    private startAdminFollowUp(): void {
        this.notice = '已向最近完成行程的游客发送模拟回访邀请。';
    }
    private exitAdmin(): void {
        this.loggedIn = false;
        this.userRole = '游客';
        this.account = 'tourist';
        this.password = '123456';
        this.notice = '已退出管理端，可使用游客账号继续体验。';
    }
    adminBottomNavigation(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(2388:5)", "entry");
            Row.width('100%');
            Row.height(70);
            Row.padding({ top: 4, bottom: 6 });
            Row.alignItems(VerticalAlign.Center);
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const tab = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 2 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(2390:9)", "entry");
                    Column.layoutWeight(1);
                    Column.height(60);
                    Column.alignItems(HorizontalAlign.Center);
                    Column.justifyContent(FlexAlign.Center);
                    Column.onClick(() => this.adminActiveTab = tab);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(ADMIN_TAB_ICONS[index]);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2391:11)", "entry");
                    Text.fontSize(21);
                    Text.fontColor(this.adminActiveTab === tab ? '#3F5A91' : '#8793AB');
                    Text.width(26);
                    Text.height(24);
                    Text.textAlign(TextAlign.Center);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tab);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2397:11)", "entry");
                    Text.fontSize(11);
                    Text.fontColor(this.adminActiveTab === tab ? '#3F5A91' : '#8793AB');
                    Text.width('100%');
                    Text.height(16);
                    Text.textAlign(TextAlign.Center);
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, ADMIN_TAB_ITEMS, forEachItemGenFunction, (tab: string) => tab, true, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
    }
    bottomNavigation(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Index.ets(2420:5)", "entry");
            Row.width('100%');
            Row.height(70);
            Row.padding({ top: 4, bottom: 6 });
            Row.alignItems(VerticalAlign.Center);
            Row.backgroundColor(Color.White);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const tab = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create({ space: 2 });
                    Column.debugLine("entry/src/main/ets/pages/Index.ets(2422:9)", "entry");
                    Column.layoutWeight(1);
                    Column.height(60);
                    Column.alignItems(HorizontalAlign.Center);
                    Column.justifyContent(FlexAlign.Center);
                    Column.onClick(() => this.activeTab = tab);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(TAB_ICONS[index]);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2423:11)", "entry");
                    Text.fontSize(21);
                    Text.fontColor(this.activeTab === tab ? '#176B43' : '#829087');
                    Text.width(26);
                    Text.height(24);
                    Text.textAlign(TextAlign.Center);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tab);
                    Text.debugLine("entry/src/main/ets/pages/Index.ets(2429:11)", "entry");
                    Text.fontSize(11);
                    Text.fontColor(this.activeTab === tab ? '#176B43' : '#829087');
                    Text.width('100%');
                    Text.height(16);
                    Text.textAlign(TextAlign.Center);
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
