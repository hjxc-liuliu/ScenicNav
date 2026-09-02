package scenicnav

import std.collection.*

/**
 * 票务库存领域对象。生产环境由 Redis 原子脚本实现同样的扣减语义，
 * 本对象用于服务逻辑和单元测试，确保幂等、不可超卖、可释放三项不变式。
 */
public class TicketInventory {
    private var stock: Int64
    private let idempotencyKeys: ArrayList<String> = ArrayList<String>()

    public init(stock: Int64) {
        this.stock = stock
    }

    public func available(): Int64 {
        return this.stock
    }

    public func reserve(idempotencyKey: String, quantity: Int64): Bool {
        if (this.hasKey(idempotencyKey)) {
            return true
        }
        if (quantity <= 0 || this.stock < quantity) {
            return false
        }
        this.stock -= quantity
        this.idempotencyKeys.add(idempotencyKey)
        return true
    }

    public func release(quantity: Int64): Unit {
        if (quantity > 0) {
            this.stock += quantity
        }
    }

    private func hasKey(key: String): Bool {
        for (storedKey in this.idempotencyKeys) {
            if (storedKey == key) {
                return true
            }
        }
        return false
    }
}

public class TicketPricing {
    public static func total(unitPriceFen: Int64, quantity: Int64): Int64 {
        if (unitPriceFen < 0 || quantity < 0) {
            return 0
        }
        return unitPriceFen * quantity
    }
}

