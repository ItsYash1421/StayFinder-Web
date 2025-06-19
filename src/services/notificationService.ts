import api from './api';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  bookingId?: string;
  listingId?: string;
  listing?: {
    id: string;
    title: string;
    images: string[];
  };
  booking?: {
    id: string;
    checkIn: string;
    checkOut: string;
    status: string;
  };
}

export interface UnreadCount {
  count: number;
}

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await api.get('/notifications/');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read/`);
    return response.data.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllAsRead = async (): Promise<void> => {
  try {
    await api.put('/notifications/read-all/');
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const getUnreadCount = async (): Promise<UnreadCount> => {
  try {
    const response = await api.get('/notifications/unread-count/');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
}; 