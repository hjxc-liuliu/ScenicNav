package scenicnav

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
    func priceUsesFenToAvoidFloatRounding(): Unit {
        @Assert(TicketPricing.total(12800, 2), 25600)
        @Assert(TicketPricing.total(-1, 2), 0)
    }
}
