package scenicnav_server

import std.database.sql.*
import std.collection.*
import mysql.cdbc.*

/**
 * MySQL 仓储。先覆盖游客端首页依赖的读接口，后续下单、预约等写接口
 * 可以继续在这里扩展为事务操作。
 */
public class ScenicDatabase {
    private let connectionUrl: String
    private let username: String
    private let password: String
    private let database: String

    public init(connectionUrl: String, username: String, password: String, database: String) {
        this.connectionUrl = connectionUrl
        this.username = username
        this.password = password
        this.database = database
    }

    public static func local(): ScenicDatabase {
        return ScenicDatabase("mysql://127.0.0.1:3306", "scenicnav", "scenicnav", "scenicnav")
    }

    public func healthJson(): String {
        let connection = this.connect()
        let statement = connection.prepareStatement("select 1")
        let result = statement.query()
        if (result.next()) {
            return "{\"status\":\"UP\",\"service\":\"scenicnav-server\",\"database\":\"UP\"}"
        }
        return "{\"status\":\"DEGRADED\",\"service\":\"scenicnav-server\",\"database\":\"EMPTY_RESULT\"}"
    }

    public func ticketProductsJson(): String {
        let connection = this.connect()
        let statement = connection.prepareStatement(
            "select p.id, p.name, p.price_fen, p.description, coalesce(sum(s.total_stock - s.sold_stock), 0) remaining, " +
            "date_format(min(timestamp(s.visit_date, s.start_time)), '%Y-%m-%d %H:%i') start_at, " +
            "date_format(min(timestamp(s.visit_date, s.end_time)), '%Y-%m-%d %H:%i') end_at " +
            "from ticket_products p left join ticket_slots s on p.id = s.ticket_product_id " +
            "where p.enabled = 1 group by p.id, p.name, p.price_fen, p.description order by p.price_fen"
        )
        let result = statement.query()
        var rows = ArrayList<String>()
        while (result.next()) {
            rows.add(
                "{\"id\":\"${escapeJson(result.get<String>(1))}\"," +
                "\"name\":\"${escapeJson(result.get<String>(2))}\"," +
                "\"price\":${result.get<Int32>(3)}," +
                "\"description\":\"${escapeJson(result.get<String>(4))}\"," +
                "\"remaining\":${result.get<Int64>(5)}," +
                "\"startAt\":\"${escapeJson(result.get<String>(6))}\"," +
                "\"endAt\":\"${escapeJson(result.get<String>(7))}\"}"
            )
        }
        return "[${String.join(rows.toArray(), delimiter: ",")}]"
    }

    public func demoAccountsJson(): String {
        let connection = this.connect()
        let statement = connection.prepareStatement(
            "select u.account, u.nickname, u.password_hash, u.points, r.code, r.name " +
            "from users u join user_roles ur on u.id = ur.user_id join roles r on r.id = ur.role_id " +
            "order by u.account"
        )
        let result = statement.query()
        var rows = ArrayList<String>()
        while (result.next()) {
            rows.add(
                "{\"account\":\"${escapeJson(result.get<String>(1))}\"," +
                "\"nickname\":\"${escapeJson(result.get<String>(2))}\"," +
                "\"passwordHash\":\"${escapeJson(result.get<String>(3))}\"," +
                "\"points\":${result.get<Int32>(4)}," +
                "\"roleCode\":\"${escapeJson(result.get<String>(5))}\"," +
                "\"roleName\":\"${escapeJson(result.get<String>(6))}\"}"
            )
        }
        return "[${String.join(rows.toArray(), delimiter: ",")}]"
    }

    public func scenicSpotsJson(): String {
        let connection = this.connect()
        let statement = connection.prepareStatement(
            "select id, name, subtitle, crowd_percent, updated_at from scenic_spots order by name"
        )
        let result = statement.query()
        var rows = ArrayList<String>()
        while (result.next()) {
            rows.add(
                "{\"id\":\"${escapeJson(result.get<String>(1))}\"," +
                "\"name\":\"${escapeJson(result.get<String>(2))}\"," +
                "\"subtitle\":\"${escapeJson(result.get<String>(3))}\"," +
                "\"crowdPercent\":${result.get<Int32>(4)}," +
                "\"updatedAt\":\"${escapeJson(result.get<String>(5))}\"}"
            )
        }
        return "[${String.join(rows.toArray(), delimiter: ",")}]"
    }

    public func guideRoutesJson(): String {
        let connection = this.connect()
        let statement = connection.prepareStatement(
            "select id, title, duration_minutes, distance_meters, tags, spot_ids from guide_routes order by duration_minutes"
        )
        let result = statement.query()
        var rows = ArrayList<String>()
        while (result.next()) {
            rows.add(
                "{\"id\":\"${escapeJson(result.get<String>(1))}\"," +
                "\"title\":\"${escapeJson(result.get<String>(2))}\"," +
                "\"durationMinutes\":${result.get<Int32>(3)}," +
                "\"distanceMeters\":${result.get<Int32>(4)}," +
                "\"tags\":${result.get<String>(5)}," +
                "\"spotIds\":${result.get<String>(6)}}"
            )
        }
        return "[${String.join(rows.toArray(), delimiter: ",")}]"
    }

    public func projectsJson(): String {
        let connection = this.connect()
        let statement = connection.prepareStatement(
            "select ps.id, p.id, p.name, p.description, date_format(ps.start_at, '%H:%i') start_time, " +
            "date_format(ps.end_at, '%H:%i') end_time, date_format(ps.start_at, '%Y-%m-%d %H:%i') start_at, " +
            "date_format(ps.end_at, '%Y-%m-%d %H:%i') end_at, ps.capacity, ps.reserved_count, p.fast_pass_price_fen, " +
            "ps.fast_pass_capacity, ps.fast_pass_reserved_count " +
            "from project_slots ps join projects p on ps.project_id = p.id where p.enabled = 1 order by ps.start_at"
        )
        let result = statement.query()
        var rows = ArrayList<String>()
        while (result.next()) {
            let capacity = result.get<Int32>(9)
            let reserved = result.get<Int32>(10)
            let fastPassCapacity = result.get<Int32>(12)
            let fastPassReserved = result.get<Int32>(13)
            rows.add(
                "{\"slotId\":\"${escapeJson(result.get<String>(1))}\"," +
                "\"projectId\":\"${escapeJson(result.get<String>(2))}\"," +
                "\"name\":\"${escapeJson(result.get<String>(3))}\"," +
                "\"description\":\"${escapeJson(result.get<String>(4))}\"," +
                "\"startTime\":\"${escapeJson(result.get<String>(5))}\"," +
                "\"endTime\":\"${escapeJson(result.get<String>(6))}\"," +
                "\"startAt\":\"${escapeJson(result.get<String>(7))}\"," +
                "\"endAt\":\"${escapeJson(result.get<String>(8))}\"," +
                "\"capacity\":${capacity}," +
                "\"remaining\":${capacity - reserved}," +
                "\"fastPassPrice\":${result.get<Int32>(11)}," +
                "\"fastPassCapacity\":${fastPassCapacity}," +
                "\"fastPassRemaining\":${fastPassCapacity - fastPassReserved}}"
            )
        }
        return "[${String.join(rows.toArray(), delimiter: ",")}]"
    }

    public func merchantsJson(): String {
        let connection = this.connect()
        let statement = connection.prepareStatement(
            "select m.id, m.merchant_type, m.name, m.rating, m.price_text, m.description, " +
            "date_format(min(s.start_at), '%Y-%m-%d %H:%i') booking_start_at, " +
            "date_format(max(s.end_at), '%Y-%m-%d %H:%i') booking_end_at " +
            "from merchants m left join merchant_booking_slots s on m.id = s.merchant_id " +
            "where m.enabled = 1 group by m.id, m.merchant_type, m.name, m.rating, m.price_text, m.description order by m.rating desc"
        )
        let result = statement.query()
        var rows = ArrayList<String>()
        while (result.next()) {
            rows.add(
                "{\"id\":\"${escapeJson(result.get<String>(1))}\"," +
                "\"category\":\"${escapeJson(result.get<String>(2))}\"," +
                "\"name\":\"${escapeJson(result.get<String>(3))}\"," +
                "\"rating\":${result.get<Float64>(4)}," +
                "\"priceText\":\"${escapeJson(result.get<String>(5))}\"," +
                "\"description\":\"${escapeJson(result.get<String>(6))}\"," +
                "\"bookingStartAt\":\"${escapeJson(result.get<String>(7))}\"," +
                "\"bookingEndAt\":\"${escapeJson(result.get<String>(8))}\"}"
            )
        }
        return "[${String.join(rows.toArray(), delimiter: ",")}]"
    }

    public func mallProductsJson(): String {
        let connection = this.connect()
        let statement = connection.prepareStatement(
            "select id, name, price_fen, points_reward, stock, description from mall_products where enabled = 1 order by price_fen"
        )
        let result = statement.query()
        var rows = ArrayList<String>()
        while (result.next()) {
            rows.add(
                "{\"id\":\"${escapeJson(result.get<String>(1))}\"," +
                "\"name\":\"${escapeJson(result.get<String>(2))}\"," +
                "\"price\":${result.get<Int32>(3)}," +
                "\"points\":${result.get<Int32>(4)}," +
                "\"stock\":${result.get<Int32>(5)}," +
                "\"description\":\"${escapeJson(result.get<String>(6))}\"}"
            )
        }
        return "[${String.join(rows.toArray(), delimiter: ",")}]"
    }

    private func connect(): Connection {
        let driver = DriverManager.getDriver("mysql").getOrThrow()
        let usernameProperty = ("username", this.username)
        let passwordProperty = ("password", this.password)
        let databaseProperty = ("database", this.database)
        let dataSource = driver.open(this.connectionUrl, [usernameProperty, passwordProperty, databaseProperty])
        return dataSource.connect()
    }
}

public func escapeJson(value: String): String {
    return value
        .replace("\\", "\\\\")
        .replace("\"", "\\\"")
        .replace("\n", "\\n")
        .replace("\r", "\\r")
}
