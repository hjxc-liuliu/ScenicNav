package scenicnav_server

import std.collection.*

/** 项目预约服务，重复请求返回已有预约，时段无余量时拒绝创建。 */
public class ReservationSlot {
    public let projectId: String
    public let startTime: String
    private var remaining: Int64
    private let bookingKeys: ArrayList<String> = ArrayList<String>()

    public init(projectId: String, startTime: String, remaining: Int64) {
        this.projectId = projectId
        this.startTime = startTime
        this.remaining = remaining
    }

    public func reserve(idempotencyKey: String): Bool {
        for (key in this.bookingKeys) {
            if (key == idempotencyKey) {
                return true
            }
        }
        if (this.remaining <= 0) {
            return false
        }
        this.remaining -= 1
        this.bookingKeys.add(idempotencyKey)
        return true
    }

    public func cancel(): Unit {
        this.remaining += 1
    }

    public func available(): Int64 {
        return this.remaining
    }
}

/**
 * 单个游客的行程占用段。时间使用统一时区转换后的分钟值；相邻时段不冲突，
 * 即 [start, end) 与 [end, nextEnd) 可连续预约。
 */
public class BookingWindow {
    public let bookingId: String
    public let startMinute: Int64
    public let endMinute: Int64
    private var active: Bool = true

    public init(bookingId: String, startMinute: Int64, endMinute: Int64) {
        this.bookingId = bookingId
        this.startMinute = startMinute
        this.endMinute = endMinute
    }

    public func conflicts(candidateStartMinute: Int64, candidateEndMinute: Int64): Bool {
        return this.active && this.startMinute < candidateEndMinute && candidateStartMinute < this.endMinute
    }

    public func cancel(): Bool {
        if (!this.active) {
            return false
        }
        this.active = false
        return true
    }
}

/**
 * 预约创建前和提交时均应调用该审查器；线上实现需在数据库事务内加锁后再次审查。
 */
public class BookingSchedule {
    private let windows: ArrayList<BookingWindow> = ArrayList<BookingWindow>()

    public func reserve(bookingId: String, startMinute: Int64, endMinute: Int64): Bool {
        if (startMinute >= endMinute) {
            return false
        }
        for (window in this.windows) {
            if (window.bookingId == bookingId) {
                return true
            }
            if (window.conflicts(startMinute, endMinute)) {
                return false
            }
        }
        this.windows.add(BookingWindow(bookingId, startMinute, endMinute))
        return true
    }

    public func cancel(bookingId: String): Bool {
        for (window in this.windows) {
            if (window.bookingId == bookingId) {
                return window.cancel()
            }
        }
        return false
    }
}

