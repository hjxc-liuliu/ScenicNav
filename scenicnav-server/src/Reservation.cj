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

