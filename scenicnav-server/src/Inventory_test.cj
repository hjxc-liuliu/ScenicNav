package scenicnav_server

import std.unittest.*
import std.unittest.testmacro.*

@Test
class InventoryTests {
    @TestCase
    func reserveIsIdempotentAndNeverOversells(): Unit {
        let inventory = TicketInventory(2)
        @Assert(inventory.reserve("request-1", 1), true)
        @Assert(inventory.available(), 1)
        @Assert(inventory.reserve("request-1", 1), true)
        @Assert(inventory.available(), 1)
        @Assert(inventory.reserve("request-2", 2), false)
        @Assert(inventory.available(), 1)
    }

    @TestCase
    func cancelledReservationReleasesSlot(): Unit {
        let slot = ReservationSlot("rafting", "10:30", 1)
        @Assert(slot.reserve("booking-1"), true)
        @Assert(slot.available(), 0)
        slot.cancel()
        @Assert(slot.available(), 1)
    }

    @TestCase
    func scheduleBlocksOverlapsAndAllowsCancellation(): Unit {
        let schedule = BookingSchedule()
        @Assert(schedule.reserve("hotel-1", 840, 2160), true)
        @Assert(schedule.reserve("hotel-2", 900, 2100), false)
        @Assert(schedule.reserve("ticket-at-checkout", 2160, 2220), true)
        @Assert(schedule.cancel("hotel-1"), true)
        @Assert(schedule.reserve("hotel-2", 900, 2100), true)
    }

    @TestCase
    func priceUsesFenToAvoidFloatRounding(): Unit {
        @Assert(TicketPricing.total(12800, 2), 25600)
        @Assert(TicketPricing.total(-1, 2), 0)
    }
}
