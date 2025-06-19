// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'host' | 'admin';
  phone?: string;
  bio?: string;
  avatar?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

// Location Types
export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

// Review Types
export interface Review {
  _id: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
}

// Listing Types
export interface Listing {
  _id: string;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  price: number;
  pricePerNight: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  images: string[];
  amenities: string[];
  rating: number;
  reviews: Review[];
  ownerId: User;
  availableFrom: string;
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export interface Booking {
  _id: string;
  listing: Listing;
  guest: User;
  host: User;
  checkIn: string;
  checkOut: string;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export type AuthResponse = {
  user: User;
  token: string;
};

// Search Types
export interface SearchFilters {
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating';
}

export interface Notification {
  _id: string;
  recipient: User;
  sender: User;
  type: 'booking_request' | 'booking_confirmed' | 'booking_cancelled' | 'booking_completed' | 'review';
  message: string;
  read: boolean;
  relatedListing?: Listing;
  relatedBooking?: Booking;
  createdAt: string;
}