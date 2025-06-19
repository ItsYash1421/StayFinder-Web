
const Notification = require('../models/Notification');

// Transform notification data to match frontend expectations
const transformNotification = (notification) => ({
  id: notification._id,
  type: notification.type,
  title: notification.title,
  message: notification.message,
  timestamp: notification.createdAt,
  isRead: notification.read,
  bookingId: notification.relatedBooking?._id,
  listingId: notification.relatedListing?._id,
  listing: notification.relatedListing ? {
    id: notification.relatedListing._id,
    title: notification.relatedListing.title,
    images: notification.relatedListing.images
  } : null,
  booking: notification.relatedBooking ? {
    id: notification.relatedBooking._id,
    checkIn: notification.relatedBooking.checkIn,
    checkOut: notification.relatedBooking.checkOut,
    status: notification.relatedBooking.status
  } : null
});

// Get all notifications for the current user
exports.getNotifications = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated or user ID missing.' });
    }

    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('relatedListing', 'title images')
      .populate('relatedBooking', 'checkIn checkOut status guest host');

    res.json({ data: notifications.map(transformNotification) });
  } catch (error) {
    console.error('Error in getNotifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated or user ID missing.' });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    ).populate('relatedListing', 'title images')
     .populate('relatedBooking', 'checkIn checkOut status guest host');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ data: transformNotification(notification) });
  } catch (error) {
    console.error('Error in markAsRead:', error);
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated or user ID missing.' });
    }

    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error in markAllAsRead:', error);
    res.status(500).json({ message: 'Error marking notifications as read', error: error.message });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated or user ID missing.' });
    }

    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read: false
    });

    res.json({ data: { count } });
  } catch (error) {
    console.error('Error in getUnreadCount:', error);
    res.status(500).json({ message: 'Error getting unread count', error: error.message });
  }
};

// Create a notification (helper function for other controllers)
exports.createNotification = async (data) => {
  try {
    const notification = new Notification({
      recipient: data.recipient,
      type: data.type,
      title: data.title,
      message: data.message,
      relatedListing: data.relatedListing,
      relatedBooking: data.relatedBooking,
      read: false
    });

    return await notification.save();
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Helper function to create booking-related notifications
exports.createBookingNotification = async (type, booking, listing, recipient) => {
  try {
    console.log('Creating notification:', { type, booking, listing, recipient });
    
    let notifications = [];

    switch (type) {
      case 'pending':
        notifications.push({
          recipient: booking.host._id,
          type: 'pending',
          title: 'New Booking Request',
          message: `You have a new booking request for ${listing.title} from ${new Date(booking.checkIn).toLocaleDateString()} to ${new Date(booking.checkOut).toLocaleDateString()}`
        });
        break;

      case 'confirmed':
        notifications.push({
          recipient: booking.guest._id,
          type: 'confirmed',
          title: 'Booking Confirmed',
          message: `Your booking for ${listing.title} has been confirmed for ${new Date(booking.checkIn).toLocaleDateString()} to ${new Date(booking.checkOut).toLocaleDateString()}`
        });
        break;

      case 'rejected':
        notifications.push({
          recipient: booking.guest._id,
          type: 'rejected',
          title: 'Booking Declined',
          message: `Your booking request for ${listing.title} has been declined`
        });
        break;

      case 'completed':
        notifications.push(
          {
            recipient: booking.guest._id,
            type: 'completed',
            title: 'Stay Completed',
            message: `Your stay at ${listing.title} has been completed`
          },
          {
            recipient: booking.host._id,
            type: 'completed',
            title: 'Stay Completed',
            message: `The stay at ${listing.title} has been completed`
          }
        );
        break;

      case 'cancelled':
        const notificationRecipient = recipient.toString() === booking.guest._id.toString() 
          ? booking.host._id 
          : booking.guest._id;
        
        notifications.push({
          recipient: notificationRecipient,
          type: 'cancelled',
          title: 'Booking Cancelled',
          message: `A booking for ${listing.title} has been cancelled`
        });
        break;

      default:
        console.log('Invalid notification type:', type);
        return null;
    }

    console.log('Notifications to create:', notifications);

    // Create all notifications
    const createdNotifications = await Promise.all(
      notifications.map(async (notification) => {
        try {
          const newNotification = new Notification({
            ...notification,
            relatedListing: listing._id,
            relatedBooking: booking._id,
            read: false
          });
          const savedNotification = await newNotification.save();
          console.log('Created notification:', savedNotification);
          return savedNotification;
        } catch (error) {
          console.error('Error creating individual notification:', error);
          return null;
        }
      })
    );

    console.log('Created notifications:', createdNotifications);
    return createdNotifications;
  } catch (error) {
    console.error('Error in createBookingNotification:', error);
    return null;
  }
}; 