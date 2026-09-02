import type { RecommendedRoute, TicketProduct } from '../common/Models';
import { ScenicRepository } from "@bundle:com.scenicnav.tourism/entry/ets/data/ScenicRepository";
export class ScenicViewModel {
    readonly repository: ScenicRepository = new ScenicRepository();
    formatPrice(price: number): string {
        return `￥${price.toFixed(2)}`;
    }
    canBook(ticket: TicketProduct): boolean {
        return ticket.remaining > 0;
    }
    recommendRoute(preference: string): RecommendedRoute {
        const routes = this.repository.routes();
        for (let index = 0; index < routes.length; index++) {
            if (routes[index].tags.indexOf(preference) >= 0) {
                return routes[index];
            }
        }
        return routes[0];
    }
    estimatedWait(queueSize: number, serviceRatePerMinute: number): number {
        if (serviceRatePerMinute <= 0) {
            return 0;
        }
        return Math.ceil(queueSize / serviceRatePerMinute);
    }
}
