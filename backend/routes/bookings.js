const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middlewares/auth');

// All routes are protected
router.use(auth);

// Create a new booking
router.post('/', bookingController.createBooking);

// Get user's bookings
router.get('/user', bookingController.getUserBookings);

// Get host's bookings
router.get('/host', bookingController.getHostBookings);

// Get bookings for a specific listing
router.get('/listing/:listingId', bookingController.getListingBookings);

// Update booking status
router.patch('/:id/status', bookingController.updateBookingStatus);

// Cancel a booking
router.delete('/:id', bookingController.cancelBooking);

module.exports = router;