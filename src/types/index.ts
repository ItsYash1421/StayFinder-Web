export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'host' | 'admin';
  phone?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  owner: User;
  rating: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  listing: Listing;
  user: User;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
} 