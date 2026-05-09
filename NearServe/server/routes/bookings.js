const express = require('express');
const { createBooking, getUserBookings, getProviderBookings, updateBookingStatus } = require('../controllers/bookingController');
const { authMiddleware, providerOnly } = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, createBooking);
router.get('/my', authMiddleware, getUserBookings);
router.get('/provider', authMiddleware, providerOnly, getProviderBookings);
router.patch('/:id/status', authMiddleware, providerOnly, updateBookingStatus);

module.exports = router;
