import axios from 'axios';
import type { AuthResponse, Booking, Listing, SearchFilters, User } from '../types';

const API_URL = 'https://stayfinder-backend-5wmn.onrender.com';

interface Notification {
  _id: string;
  type: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedListing?: {
    _id: string;
    title: string;
    images: string[];
  };
  relatedBooking?: {
    _id: string;
    checkIn: string;
    checkOut: string;
    status: string;
  };
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    hasToken: !!token,
    headers: config.headers
  });
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Instead of using window.location.href, we'll let the AuthContext handle the redirect
      // The AuthContext will detect the missing token and redirect appropriately
    }
    return Promise.reject(error);
  }
);

interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Auth API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; isHost: boolean }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/auth/profile', data);
    return response.data;
  },
};

// Listings API
export const listingsAPI = {
  getListings: async (filters?: SearchFilters): Promise<ApiResponse<Listing[]>> => {
    const queryParams = new URLSearchParams();
    if (filters?.location) queryParams.append('location', filters.location);
    if (filters?.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters?.minRating) queryParams.append('minRating', filters.minRating);
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);

    const response = await api.get('/listings', { params: queryParams });
    return response.data;
  },

  getListing: async (id: string): Promise<ApiResponse<Listing>> => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  getOwnerListings: async (): Promise<ApiResponse<Listing[]>> => {
    const response = await api.get('/listings/owner/listings');
    return response.data;
  },

  createListing: async (listing: Omit<Listing, '_id' | 'ownerId' | 'rating' | 'reviews' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Listing>> => {
    const response = await api.post('/listings', listing);
    return response.data;
  },

  updateListing: async (id: string, listing: Partial<Listing>): Promise<ApiResponse<Listing>> => {
    const response = await api.put(`/listings/${id}`, listing);
    return response.data;
  },

  deleteListing: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },

  addReview: async (id: string, data: { rating: number; comment: string }): Promise<Listing> => {
    try {
      console.log('API: Adding review for listing:', id, 'with data:', data);
      const response = await api.post<ApiResponse<Listing>>(`/listings/${id}/reviews`, data);
      console.log('API: Review response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('API: Error adding review:', error);
      if (error instanceof Error) {
        console.error('API: Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      throw error;
    }
  },
};

// Bookings API
export const bookingsAPI = {
  createBooking: async (data: {
    listingId: string;
    checkIn: string;
    checkOut: string;
    numberOfGuests: number;
    specialRequests?: string;
    totalPrice: number;
  }): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  getUserBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings/user');
    return response.data;
  },

  getHostBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings/host');
    return response.data;
  },

  getListingBookings: async (listingId: string): Promise<Booking[]> => {
    const response = await api.get<Booking[]>(`/bookings/listing/${listingId}`);
    return response.data;
  },

  updateBookingStatus: async (id: string, status: Booking['status']): Promise<Booking> => {
    const response = await api.patch<Booking>(`/bookings/${id}/status`, { status });
    return response.data;
  },

  cancelBooking: async (id: string): Promise<Booking> => {
    const response = await api.delete<{ data: Booking }>(`/bookings/${id}`);
    return response.data.data;
  },
};

// Notification API
export const notificationAPI = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications');
    return response.data.data;
  },
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await api.get<ApiResponse<{ count: number }>>('/notifications/unread');
    return response.data.data;
  },
  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },
  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  }
};

export default api; 
