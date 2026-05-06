const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus,
    mockPayment,
    cancelBooking
} = require('../controllers/bookingController');

const { protect, adminOnly, adminOrManager } = require('../middleware/authMiddleware');

// ── Customer Routes ────────────────────────
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.put('/:id/pay', protect, mockPayment);
router.delete('/:id', protect, cancelBooking);

// ── Admin OR Manager Routes ────────────────
// Manager can view all bookings and update status
router.get('/', protect, adminOrManager, getAllBookings);
router.put('/:id/status', protect, adminOrManager, updateBookingStatus);

module.exports = router;