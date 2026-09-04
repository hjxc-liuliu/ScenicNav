package scenicnav_server

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

func failure(message: String, traceId: String): String {
    return "{\"code\":500,\"message\":\"${escapeJson(message)}\",\"data\":{},\"traceId\":\"${traceId}\"}"
}

func respondDb(context: HttpContext, traceId: String, loader: () -> String, fallback: String): Unit {
    try {
        respond(context, loader(), traceId)
    } catch (error: Exception) {
        respond(context, fallback, "${traceId}-demo")
    }
}

func demoAccountsFallbackJson(): String {
    return "[" +
        "{\"account\":\"tourist\",\"nickname\":\"旅行者\",\"passwordHash\":\"demo-password-123456\",\"points\":320,\"roleCode\":\"TOURIST\",\"roleName\":\"游客\"}," +
        "{\"account\":\"admin\",\"nickname\":\"景区管理员\",\"passwordHash\":\"demo-password-123456\",\"points\":0,\"roleCode\":\"ADMIN\",\"roleName\":\"管理员\"}" +
        "]"
}

func demoTicketsJson(): String {
    return "[" +
        "{\"id\":\"boat\",\"name\":\"西湖环湖游船票\",\"price\":5500,\"remaining\":128,\"description\":\"花港码头登船，含湖上讲解\",\"startAt\":\"2026-09-03 09:00\",\"endAt\":\"2026-09-03 10:00\"}," +
        "{\"id\":\"leifeng\",\"name\":\"雷峰塔参观票\",\"price\":4000,\"remaining\":76,\"description\":\"分时入塔，含电子验票码\",\"startAt\":\"2026-09-03 15:10\",\"endAt\":\"2026-09-03 16:10\"}," +
        "{\"id\":\"premium\",\"name\":\"西湖优享联票\",\"price\":12800,\"remaining\":36,\"description\":\"游船、讲解与快速通行权益组合\",\"startAt\":\"2026-09-03 19:00\",\"endAt\":\"2026-09-03 21:10\"}" +
        "]"
}

func demoSpotsJson(): String {
    return "[" +
        "{\"id\":\"broken_bridge\",\"name\":\"断桥残雪\",\"subtitle\":\"白堤东端的经典湖景点位\",\"crowdPercent\":86,\"updatedAt\":\"刚刚\"}," +
        "{\"id\":\"solitary_hill\",\"name\":\"孤山\",\"subtitle\":\"西湖中最大的天然岛屿\",\"crowdPercent\":58,\"updatedAt\":\"刚刚\"}," +
        "{\"id\":\"quyuan\",\"name\":\"曲院风荷\",\"subtitle\":\"北山西侧的荷风景观\",\"crowdPercent\":35,\"updatedAt\":\"刚刚\"}," +
        "{\"id\":\"sudi\",\"name\":\"苏堤春晓\",\"subtitle\":\"贯穿湖面的长堤慢行线\",\"crowdPercent\":61,\"updatedAt\":\"刚刚\"}," +
        "{\"id\":\"flower_harbor\",\"name\":\"花港观鱼\",\"subtitle\":\"南端园林与亲子游览区\",\"crowdPercent\":42,\"updatedAt\":\"刚刚\"}," +
        "{\"id\":\"leifeng_pagoda\",\"name\":\"雷峰塔\",\"subtitle\":\"夕照山上的南岸地标\",\"crowdPercent\":74,\"updatedAt\":\"刚刚\"}" +
        "]"
}

func demoRoutesJson(): String {
    return "[" +
        "{\"id\":\"family\",\"title\":\"亲子自然线\",\"durationMinutes\":150,\"distanceMeters\":3600,\"tags\":[\"亲子\",\"平缓\"],\"spotIds\":[\"曲院风荷\",\"苏堤春晓\",\"花港观鱼\"]}," +
        "{\"id\":\"culture\",\"title\":\"湖畔人文线\",\"durationMinutes\":180,\"distanceMeters\":4100,\"tags\":[\"人文\",\"讲解\"],\"spotIds\":[\"断桥残雪\",\"白堤\",\"平湖秋月\",\"孤山\"]}," +
        "{\"id\":\"leisure\",\"title\":\"南山慢游线\",\"durationMinutes\":108,\"distanceMeters\":2800,\"tags\":[\"休闲\",\"避拥\"],\"spotIds\":[\"柳浪闻莺\",\"雷峰塔\",\"花港观鱼\"]}" +
        "]"
}

func demoProjectsJson(): String {
    return "[" +
        "{\"slotId\":\"ps-boat-1030\",\"projectId\":\"boat\",\"name\":\"西湖环湖游船\",\"description\":\"游船\",\"startTime\":\"10:30\",\"endTime\":\"11:30\",\"startAt\":\"2026-09-03 10:30\",\"endAt\":\"2026-09-03 11:30\",\"capacity\":60,\"remaining\":18,\"fastPassPrice\":1800,\"fastPassCapacity\":12,\"fastPassRemaining\":8}," +
        "{\"slotId\":\"ps-show-1930\",\"projectId\":\"night_show\",\"name\":\"西湖夜游沉浸演出\",\"description\":\"演出\",\"startTime\":\"19:30\",\"endTime\":\"21:00\",\"startAt\":\"2026-09-03 19:30\",\"endAt\":\"2026-09-03 21:00\",\"capacity\":120,\"remaining\":56,\"fastPassPrice\":2800,\"fastPassCapacity\":24,\"fastPassRemaining\":20}," +
        "{\"slotId\":\"ps-class-1420\",\"projectId\":\"nature_class\",\"name\":\"花港亲子自然课堂\",\"description\":\"亲子活动\",\"startTime\":\"14:20\",\"endTime\":\"15:20\",\"startAt\":\"2026-09-03 14:20\",\"endAt\":\"2026-09-03 15:20\",\"capacity\":30,\"remaining\":9,\"fastPassPrice\":1200,\"fastPassCapacity\":6,\"fastPassRemaining\":4}," +
        "{\"slotId\":\"ps-tower-1540\",\"projectId\":\"tower_tour\",\"name\":\"雷峰塔深度讲解团\",\"description\":\"讲解\",\"startTime\":\"15:40\",\"endTime\":\"16:50\",\"startAt\":\"2026-09-03 15:40\",\"endAt\":\"2026-09-03 16:50\",\"capacity\":35,\"remaining\":14,\"fastPassPrice\":2000,\"fastPassCapacity\":8,\"fastPassRemaining\":6}" +
        "]"
}

func demoMerchantsJson(): String {
    return "[" +
        "{\"id\":\"hotel\",\"category\":\"HOTEL\",\"name\":\"湖畔精品酒店\",\"rating\":4.8,\"priceText\":\"￥468 起 / 晚\",\"description\":\"步行可达湖滨，含双早\",\"bookingStartAt\":\"2026-09-03 14:00\",\"bookingEndAt\":\"2026-09-04 12:00\"}," +
        "{\"id\":\"homestay\",\"category\":\"HOTEL\",\"name\":\"南山慢屋民宿\",\"rating\":4.7,\"priceText\":\"￥328 起 / 晚\",\"description\":\"南山路周边，提供亲子房型\",\"bookingStartAt\":\"2026-09-03 14:00\",\"bookingEndAt\":\"2026-09-04 12:00\"}," +
        "{\"id\":\"restaurant\",\"category\":\"RESTAURANT\",\"name\":\"西湖味道餐厅\",\"rating\":4.9,\"priceText\":\"￥88 起 / 人\",\"description\":\"杭帮菜套餐，支持到店核销\",\"bookingStartAt\":\"2026-09-03 12:00\",\"bookingEndAt\":\"2026-09-03 13:00\"}" +
        "]"
}

func demoProductsJson(): String {
    return "[" +
        "{\"id\":\"tea\",\"name\":\"西湖龙井礼盒\",\"price\":12800,\"points\":128,\"description\":\"西湖主题文创礼盒，支持邮寄到家\"}," +
        "{\"id\":\"bookmark\",\"name\":\"雷峰塔金属书签\",\"price\":3200,\"points\":32,\"description\":\"西湖十景系列文创\"}," +
        "{\"id\":\"bag\",\"name\":\"西湖十景帆布包\",\"price\":6900,\"points\":69,\"description\":\"轻便环保，适合旅行收纳\"}," +
        "{\"id\":\"postcard\",\"name\":\"断桥残雪明信片套装\",\"price\":2400,\"points\":24,\"description\":\"含四张景区主题明信片\"}" +
        "]"
}

func registerRoutes(server: Server): Unit {
    let database = ScenicDatabase.local()

    server.distributor.register("/health", { context =>
        respond(context, "{\"status\":\"UP\",\"service\":\"scenicnav-server\",\"mode\":\"demo-ready\"}", "health-001")
    })
    server.distributor.register("/api/v1/auth/login", { context =>
        // 正式部署时替换为密码哈希校验、JWT 签发和角色权限控制。
        respond(context, "{\"accessToken\":\"scenicnav-token-tourist-001\",\"user\":{\"id\":\"u-001\",\"nickname\":\"旅行者\"}}", "auth-001")
    })
    server.distributor.register("/api/v1/users/demo-accounts", { context =>
        try {
            respond(context, database.demoAccountsJson(), "user-demo-list-001")
        } catch (error: Exception) {
            respond(context, demoAccountsFallbackJson(), "user-demo-fallback-001")
        }
    })
    server.distributor.register("/api/v1/tickets", { context =>
        respondDb(context, "ticket-list-001", { => database.ticketProductsJson() }, demoTicketsJson())
    })
    server.distributor.register("/api/v1/orders/tickets", { context =>
        respond(context, "{\"id\":\"T-20260903-001\",\"status\":\"PAID\",\"qrPayload\":\"SCENICNAV|adult|2026-09-03\"}", "ticket-order-001")
    })
    server.distributor.register("/api/v1/orders/tickets/T-20260903-001/cancel", { context =>
        respond(context, "{\"id\":\"T-20260903-001\",\"status\":\"CANCELLED\",\"stockReleased\":true}", "ticket-cancel-001")
    })
    server.distributor.register("/api/v1/bookings/me", { context =>
        respond(context, "[{\"id\":\"B-20260903-001\",\"kind\":\"PROJECT\",\"resourceId\":\"show\",\"startAt\":\"2026-09-03T19:30:00+08:00\",\"endAt\":\"2026-09-03T21:00:00+08:00\",\"status\":\"CONFIRMED\",\"cancellableUntil\":\"2026-09-03T18:30:00+08:00\",\"addons\":[{\"type\":\"FAST_PASS\",\"status\":\"CONFIRMED\",\"priceFen\":2800}]}]", "booking-list-001")
    })
    server.distributor.register("/api/v1/bookings/precheck", { context =>
        respond(context, "{\"conflicts\":[]}", "booking-precheck-001")
    })
    server.distributor.register("/api/v1/bookings", { context =>
        respond(context, "{\"id\":\"B-20260903-002\",\"status\":\"CONFIRMED\",\"stockReserved\":true}", "booking-create-001")
    })
    server.distributor.register("/api/v1/bookings/B-20260903-001/cancel", { context =>
        respond(context, "{\"id\":\"B-20260903-001\",\"status\":\"CANCELLED\",\"stockReleased\":true,\"fastPassReleased\":true}", "booking-cancel-001")
    })
    server.distributor.register("/api/v1/bookings/B-20260903-001/addons/fast-pass", { context =>
        respond(context, "{\"bookingId\":\"B-20260903-001\",\"addon\":{\"type\":\"FAST_PASS\",\"status\":\"CONFIRMED\",\"priceFen\":2800}}", "booking-fast-pass-001")
    })
    server.distributor.register("/api/v1/bookings/replace", { context =>
        respond(context, "{\"id\":\"B-20260903-003\",\"status\":\"CONFIRMED\",\"replacedBookingIds\":[\"B-20260903-001\"]}", "booking-replace-001")
    })
    server.distributor.register("/api/v1/guide/spots", { context =>
        respondDb(context, "guide-spots-001", { => database.scenicSpotsJson() }, demoSpotsJson())
    })
    server.distributor.register("/api/v1/guide/routes", { context =>
        respondDb(context, "guide-routes-001", { => database.guideRoutesJson() }, demoRoutesJson())
    })
    server.distributor.register("/api/v1/reservations/projects", { context =>
        respondDb(context, "project-list-001", { => database.projectsJson() }, demoProjectsJson())
    })
    server.distributor.register("/api/v1/merchants", { context =>
        respondDb(context, "merchant-list-001", { => database.merchantsJson() }, demoMerchantsJson())
    })
    server.distributor.register("/api/v1/mall/products", { context =>
        respondDb(context, "mall-list-001", { => database.mallProductsJson() }, demoProductsJson())
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
