const { db } = require('../db/database');
const { broadcast } = require('../websocket');
const { startOrderSimulation } = require('../services/telemetryService');

// Virajpet Locality Nodes & Topography Map
const VIRAJPEE_LOCALITIES = {
  clock_tower: { name: 'Clock Tower Circle (Gadiyara Kambha)', lat: 12.2015, lng: 75.8034 },
  college_rd: { name: 'College Road / Kaveri Layout', lat: 12.2045, lng: 75.8058 },
  malabar_rd: { name: 'Malabar Road (Meenupet Area)', lat: 12.1985, lng: 75.8012 },
  meenupet: { name: 'Meenupet Colony', lat: 12.1960, lng: 75.7990 },
  arji: { name: 'Arji Village Road', lat: 12.1850, lng: 75.8150 },
  bittangala: { name: 'Bittangala Junction & Estates', lat: 12.1720, lng: 75.8350 },
  gonikoppal_rd: { name: 'Gonikoppal Highway Road', lat: 12.1600, lng: 75.8500 }
};

const PACKAGE_TYPES = {
  document: { name: 'Town Legal Document / Bank Cheque', baseRate: 40.0, maxWeightKg: 0.5 },
  tiffin: { name: 'Hot Tiffin Carrier / Estate Lunch', baseRate: 60.0, maxWeightKg: 2.5 },
  coffee_parcel: { name: 'Estate Coffee & Spices Parcel', baseRate: 90.0, maxWeightKg: 4.0 },
  custom: { name: 'Custom Virajpet Town Parcel', baseRate: 50.0, maxWeightKg: 5.0 }
};

/**
 * Controller for Town Courier & Parcel Logistics
 */
const courierController = {
  /**
   * POST /api/courier/quote
   * Calculate exact fare for route and package type
   */
  calculateFare: (req, res, next) => {
    try {
      const { origin = 'clock_tower', dest = 'malabar_rd', packageType = 'document' } = req.body;

      const pkg = PACKAGE_TYPES[packageType] || PACKAGE_TYPES.document;
      const base = pkg.baseRate;

      let multiplier = 1.0;
      if (origin !== dest) {
        if (origin === 'gonikoppal_rd' || dest === 'gonikoppal_rd' || origin === 'bittangala' || dest === 'bittangala') {
          multiplier = 1.45;
        } else if (origin === 'arji' || dest === 'arji') {
          multiplier = 1.35;
        } else {
          multiplier = 1.25;
        }
      }

      const calculatedFare = Math.round(base * multiplier);
      const originLoc = VIRAJPEE_LOCALITIES[origin] || { name: origin };
      const destLoc = VIRAJPEE_LOCALITIES[dest] || { name: dest };

      res.json({
        success: true,
        data: {
          packageType,
          packageName: pkg.name,
          baseRate: base,
          distanceMultiplier: multiplier,
          fare: calculatedFare,
          currency: '₹',
          origin: { id: origin, name: originLoc.name },
          destination: { id: dest, name: destLoc.name },
          estimatedPickupMinutes: 5,
          estimatedTransitMinutes: multiplier > 1.3 ? 25 : 15
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/courier/book
   * Book town courier dispatch
   */
  bookCourier: (req, res, next) => {
    try {
      const {
        origin = 'clock_tower',
        dest = 'malabar_rd',
        packageType = 'document',
        senderName = 'Falah Abdulla',
        senderPhone = '+91 98452 71098',
        recipientName = 'Recipient',
        recipientPhone = '+91 98452 00000',
        instructions = ''
      } = req.body;

      const pkg = PACKAGE_TYPES[packageType] || PACKAGE_TYPES.document;
      const base = pkg.baseRate;

      let multiplier = 1.0;
      if (origin !== dest) {
        if (origin === 'gonikoppal_rd' || dest === 'gonikoppal_rd' || origin === 'bittangala' || dest === 'bittangala') {
          multiplier = 1.45;
        } else {
          multiplier = 1.25;
        }
      }

      const fare = Math.round(base * multiplier);
      const originName = VIRAJPEE_LOCALITIES[origin]?.name || origin;
      const destName = VIRAJPEE_LOCALITIES[dest]?.name || dest;

      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const bookingNumber = `CR-${randomDigits}`;
      const bookingId = `cr_${Date.now()}_${randomDigits}`;
      const userId = 'user_falah';

      db.prepare(`
        INSERT INTO courier_bookings (
          id, booking_number, user_id, package_type, package_name,
          origin_id, origin_name, dest_id, dest_name, fare, status,
          rider_name, rider_phone, rider_vehicle, eta_minutes
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, 'ASSIGNED',
          'Mohammed Suhail', '+91 98452 33412', 'TVS iQube Electric', 15
        )
      `).run(
        bookingId, bookingNumber, userId, packageType, pkg.name,
        origin, originName, dest, destName, fare
      );

      // Broadcast booking to dispatch
      broadcast('new_courier_booking', {
        type: 'new_courier_dispatched',
        bookingNumber,
        origin: originName,
        destination: destName,
        fare,
        riderName: 'Mohammed Suhail',
        timestamp: new Date().toISOString()
      });

      // Start live telemetry simulation for courier
      startOrderSimulation(bookingNumber);

      res.status(201).json({
        success: true,
        message: `Courier Booking #${bookingNumber} dispatched successfully!`,
        data: {
          bookingId,
          bookingNumber,
          status: 'ASSIGNED',
          package: {
            type: packageType,
            name: pkg.name
          },
          route: {
            pickup: originName,
            dropoff: destName
          },
          fare,
          currency: '₹',
          rider: {
            name: 'Mohammed Suhail',
            phone: '+91 98452 33412',
            vehicle: 'TVS iQube Electric',
            etaPickupMinutes: 5
          },
          trackingChannel: `courier:${bookingNumber}`
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/courier/:idOrNumber
   */
  getBookingById: (req, res, next) => {
    try {
      const { id } = req.params;
      const booking = db.prepare('SELECT * FROM courier_bookings WHERE id = ? OR booking_number = ?').get(id, id.toUpperCase());

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'BookingNotFound',
          message: `Courier booking '${id}' was not found.`
        });
      }

      res.json({
        success: true,
        data: {
          id: booking.id,
          bookingNumber: booking.booking_number,
          packageType: booking.package_type,
          packageName: booking.package_name,
          origin: { id: booking.origin_id, name: booking.origin_name },
          destination: { id: booking.dest_id, name: booking.dest_name },
          fare: booking.fare,
          status: booking.status,
          rider: {
            name: booking.rider_name,
            phone: booking.rider_phone,
            vehicle: booking.rider_vehicle
          },
          etaMinutes: booking.eta_minutes,
          createdAt: booking.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/courier/localities
   */
  getLocalities: (req, res) => {
    const list = Object.entries(VIRAJPEE_LOCALITIES).map(([id, loc]) => ({
      id,
      name: loc.name,
      lat: loc.lat,
      lng: loc.lng
    }));

    res.json({
      success: true,
      data: list
    });
  },

  /**
   * GET /api/courier
   * List all courier bookings with status filter and pagination
   */
  getAllBookings: (req, res, next) => {
    try {
      const { status, limit = 20, offset = 0 } = req.query;
      let sql = 'SELECT * FROM courier_bookings WHERE 1=1';
      const params = {};

      if (status) {
        sql += ' AND status = @status';
        params.status = status.toUpperCase();
      }

      sql += ' ORDER BY created_at DESC LIMIT @limit OFFSET @offset';
      params.limit = parseInt(limit, 10) || 20;
      params.offset = parseInt(offset, 10) || 0;

      const rows = db.prepare(sql).all(params);
      const total = db.prepare('SELECT count(*) as c FROM courier_bookings').get().c;

      res.json({
        success: true,
        total,
        count: rows.length,
        data: rows.map(b => ({
          id: b.id,
          bookingNumber: b.booking_number,
          packageType: b.package_type,
          packageName: b.package_name,
          origin: { id: b.origin_id, name: b.origin_name },
          destination: { id: b.dest_id, name: b.dest_name },
          fare: b.fare,
          status: b.status,
          rider: {
            name: b.rider_name,
            phone: b.rider_phone,
            vehicle: b.rider_vehicle
          },
          etaMinutes: b.eta_minutes,
          createdAt: b.created_at
        }))
      });
    } catch (e) {
      next(e);
    }
  },

  /**
   * PATCH /api/courier/:id/status
   * Update courier booking status
   */
  updateBookingStatus: (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['ASSIGNED', 'PICKED_UP', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'];
      if (!status || !validStatuses.includes(status.toUpperCase())) {
        return res.status(400).json({
          success: false,
          error: 'InvalidStatus',
          message: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }

      const booking = db.prepare('SELECT * FROM courier_bookings WHERE id = ? OR booking_number = ?').get(id, id.toUpperCase());
      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'BookingNotFound',
          message: `Booking '${id}' was not found.`
        });
      }

      const newStatus = status.toUpperCase();
      db.prepare(`UPDATE courier_bookings SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(newStatus, booking.id);

      broadcast(`courier:${booking.booking_number}`, {
        type: 'order_status_update',
        orderNumber: booking.booking_number,
        status: newStatus,
        message: `Courier #${booking.booking_number} status updated to ${newStatus}`,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: `Courier #${booking.booking_number} updated to ${newStatus}`,
        data: {
          bookingNumber: booking.booking_number,
          status: newStatus
        }
      });
    } catch (e) {
      next(e);
    }
  }
};

module.exports = courierController;
