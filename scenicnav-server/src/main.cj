package scenicnav

import stdx.net.http.*
import stdx.log.*

func success(data: String, traceId: String): String {
    return "{\"code\":0,\"message\":\"ok\",\"data\":${data},\"traceId\":\"${traceId}\"}"
}

func respond(context: HttpContext, data: String, traceId: String): Unit {
    context.responseBuilder
        .header("Content-Type", "application/json; charset=utf-8")
        .header("Access-Control-Allow-Origin", "*")
        .body(success(data, traceId))
}

func registerRoutes(server: Server): Unit {
    server.distributor.register("/health", { context =>
        respond(context, "{\"status\":\"UP\",\"service\":\"scenicnav-server\"}", "health-001")
    })
    server.distributor.register("/api/v1/auth/login", { context =>
        // 正式部署时替换为密码哈希校验、JWT 签发和角色权限控制。
        respond(context, "{\"accessToken\":\"scenicnav-token-tourist-001\",\"user\":{\"id\":\"u-001\",\"nickname\":\"旅行者\"}}", "auth-001")
    })
    server.distributor.register("/api/v1/tickets", { context =>
        respond(context, "[{\"id\":\"adult\",\"name\":\"成人全日票\",\"price\":12800,\"remaining\":256},{\"id\":\"student\",\"name\":\"学生优惠票\",\"price\":7800,\"remaining\":88},{\"id\":\"family\",\"name\":\"亲子家庭套票\",\"price\":29800,\"remaining\":32}]", "ticket-list-001")
    })
    server.distributor.register("/api/v1/orders/tickets", { context =>
        respond(context, "{\"id\":\"T-20260903-001\",\"status\":\"PAID\",\"qrPayload\":\"SCENICNAV|adult|2026-09-03\"}", "ticket-order-001")
    })
    server.distributor.register("/api/v1/orders/tickets/T-20260903-001/cancel", { context =>
        respond(context, "{\"id\":\"T-20260903-001\",\"status\":\"CANCELLED\",\"stockReleased\":true}", "ticket-cancel-001")
    })
    server.distributor.register("/api/v1/guide/spots", { context =>
        respond(context, "[{\"id\":\"waterfall\",\"name\":\"飞瀑观景台\",\"crowdLevel\":\"适中\",\"crowdPercent\":52},{\"id\":\"forest\",\"name\":\"云杉栈道\",\"crowdLevel\":\"畅通\",\"crowdPercent\":31}]", "guide-spots-001")
    })
    server.distributor.register("/api/v1/guide/routes", { context =>
        respond(context, "[{\"id\":\"family\",\"title\":\"亲子探索线\",\"duration\":\"2.5 小时\"},{\"id\":\"leisure\",\"title\":\"轻松漫步线\",\"duration\":\"1.5 小时\"}]", "guide-routes-001")
    })
    server.distributor.register("/api/v1/reservations/projects", { context =>
        respond(context, "[{\"id\":\"rafting\",\"name\":\"峡谷漂流\",\"startTime\":\"10:30\",\"waitMinutes\":35,\"remaining\":12},{\"id\":\"show\",\"name\":\"山水云歌实景演出\",\"startTime\":\"14:00\",\"waitMinutes\":20,\"remaining\":46}]", "project-list-001")
    })
    server.distributor.register("/api/v1/merchants", { context =>
        respond(context, "[{\"id\":\"hotel\",\"name\":\"云栖山居酒店\",\"category\":\"住宿\",\"rating\":4.8},{\"id\":\"restaurant\",\"name\":\"山野食集\",\"category\":\"餐饮\",\"rating\":4.9}]", "merchant-list-001")
    })
    server.distributor.register("/api/v1/mall/products", { context =>
        respond(context, "[{\"id\":\"tea\",\"name\":\"云雾红茶礼盒\",\"price\":9900,\"points\":99},{\"id\":\"bookmark\",\"name\":\"飞瀑金属书签\",\"price\":2900,\"points\":29}]", "mall-list-001")
    })
    server.distributor.register("/api/v1/mall/orders", { context =>
        respond(context, "{\"id\":\"M-20260903-001\",\"status\":\"PAID\",\"pointsGranted\":99}", "mall-order-001")
    })
    server.distributor.register("/api/v1/points/share", { context =>
        respond(context, "{\"pointsGranted\":20,\"balance\":340}", "points-share-001")
    })
    server.distributor.register("/api/v1/feedback", { context =>
        respond(context, "{\"id\":\"F-20260903-001\",\"status\":\"TRANSFERRED\"}", "feedback-001")
    })
}

main() {
    let server = ServerBuilder()
        .addr("0.0.0.0")
        .port(8080)
        .build()
    server.logger.level = LogLevel.INFO
    registerRoutes(server)
    println("ScenicNav API listening at http://127.0.0.1:8080")
    server.serve()
}
