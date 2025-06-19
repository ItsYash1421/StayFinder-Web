const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const notificationController = require('./notificationController');

const bookingController = {
  // Create a new booking
  createBooking: async (req, res) => {
    try {
      const { listingId, checkIn, checkOut, numberOfGuests, specialRequests, totalPrice } = req.body;
      const userId = req.user._id;

      // Check if listing exists
      const listing = await Listing.findById(listingId).populate('ownerId', 'name email');
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      // Check if dates are valid
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (checkInDate >= checkOutDate) {
        return res.status(400).json({ message: 'Check-out date must be after check-in date' });
      }

      // Create booking
      const booking = new Booking({
        listing: listingId,
        guest: userId,
        host: listing.ownerId._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        numberOfGuests: numberOfGuests || 1,
        specialRequests: specialRequests || '',
        totalPrice: totalPrice || listing.pricePerNight,
        status: 'pending'
      });

      await booking.save();

      // Create notification for host
      await notificationController.createBookingNotification(
        'pending',
        booking,
        listing,
        userId
      );

      res.status(201).json({ data: booking });
    } catch (error) {
      console.error('Error in createBooking:', error);
      res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
  },

  // Get all bookings for a user
  getUserBookings: async (req, res) => {
    try {
      const userId = req.user._id;
      const bookings = await Booking.find({ guest: userId })
        .populate('listing')
        .populate('guest', 'name email')
        .populate('host', 'name email')
        .sort({ createdAt: -1 });

      res.json(bookings);
    } catch (error) {
      console.error('Error in getUserBookings:', error);
      res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
  },

  // Get all bookings for a listing (host only)
  getListingBookings: async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.listingId);
      
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      // Check if user is the owner
      if (listing.owner.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized to view these bookings' });
      }

      const bookings = await Booking.find({ listing: req.params.listingId })
        .populate('user', 'name email profilePicture')
        .sort({ createdAt: -1 });
      
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
  },

  // Update booking status
  updateBookingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user._id;

      const booking = await Booking.findById(id)
        .populate('guest', 'name email')
        .populate('host', 'name email')
        .populate('listing', 'title');

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Verify the user is the host of the listing
      if (booking.host._id.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this booking' });
      }

      // Validate status transition
      const validTransitions = {
        pending: ['confirmed', 'rejected'],
        confirmed: ['completed', 'cancelled'],
        rejected: [],
        completed: [],
        cancelled: []
      };

      if (!validTransitions[booking.status].includes(status)) {
        return res.status(400).json({ 
          message: `Invalid status transition from ${booking.status} to ${status}` 
        });
      }

      // Update booking status
      booking.status = status;
      await booking.save();

      // Create notification for the guest
      await notificationController.createBookingNotification(
        status,
        booking,
        booking.listing,
        userId
      );

      res.json({ data: booking });
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({ message: 'Error updating booking status', error: error.message });
    }
  },

  // Cancel a booking
  cancelBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const booking = await Booking.findById(id)
        .populate('guest', 'name email')
        .populate('host', 'name email')
        .populate('listing', 'title');

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if the user is either the guest or the host
      const isGuest = booking.guest && booking.guest._id.toString() === userId.toString();
      const isHost = booking.host && booking.host._id.toString() === userId.toString();

      if (!isGuest && !isHost) {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }

      // Update booking status to cancelled
      booking.status = 'cancelled';
      await booking.save();

      // Create notification for the other party
      await notificationController.createBookingNotification(
        'cancelled',
        booking,
        booking.listing,
        userId
      );

      res.json({ message: 'Booking cancelled successfully', data: booking });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ message: 'Error cancelling booking', error: error.message });
    }
  },

  // Get all bookings for a host (bookings for their listings)
  getHostBookings: async (req, res) => {
    try {
      const userId = req.user._id;
      const bookings = await Booking.find({ host: userId })
        .populate('listing')
        .populate('guest', 'name email')
        .populate('host', 'name email')
        .sort({ createdAt: -1 });

      res.json(bookings);
    } catch (error) {
      console.error('Error in getHostBookings:', error);
      res.status(500).json({ message: 'Error fetching host bookings', error: error.message });
    }
  },

  deleteBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findById(id)
        .populate('listing')
        .populate('guest', 'name email')
        .populate('host', 'name email');

      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if user is authorized to delete the booking
      if (booking.guest._id.toString() !== req.user._id.toString() && 
          booking.host._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this booking' });
      }

      // Create notification for the other party
      const notificationRecipient = booking.guest._id.toString() === req.user._id.toString() 
        ? booking.host._id 
        : booking.guest._id;

      await notificationController.createBookingNotification(
        'cancelled',
        booking,
        booking.listing,
        notificationRecipient
      );

      // Delete the booking
      await Booking.findByIdAndDelete(id);

      res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ message: 'Error deleting booking', error: error.message });
    }
  }
};

module.exports = bookingController;