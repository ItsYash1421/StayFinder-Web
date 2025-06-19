import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingsAPI } from '../api/api';
import type { Booking } from '../types';

const UserBookings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadBookings();
  }, [user, navigate]);

  const loadBookings = async () => {
    try {
      console.log('Loading user bookings...');
      console.log('Current user:', user);
      console.log('Token exists:', !!localStorage.getItem('token'));
      
      const response = await bookingsAPI.getUserBookings();
      console.log('Received bookings:', {
        count: response.length,
        bookings: response.map(b => ({
          id: b._id,
          listing: b.listing ? {
            id: b.listing._id,
            title: b.listing.title
          } : null,
          status: b.status,
          checkIn: b.checkIn,
          checkOut: b.checkOut
        }))
      });
      
      if (!Array.isArray(response)) {
        console.error('Invalid response format:', response);
        showToast('Invalid response from server', 'error');
        return;
      }
      
      setBookings(response);
      setError(null);
    } catch (err) {
      console.error('Error loading bookings:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load bookings';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingsAPI.cancelBooking(bookingId);
      showToast('Booking cancelled successfully', 'success');
      loadBookings(); // Reload bookings after cancellation
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking';
      showToast(errorMessage, 'error');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your bookings</h2>
            <Link to="/login" className="text-blue-600 hover:text-blue-500">
              Go to login page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-900">Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Bookings</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadBookings}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-500"
            >
              Browse available listings
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {booking.listing?.title || 'Listing not available'}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Host: {booking.host?.name || 'Unknown'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Check-in</p>
                    <p className="text-gray-900">{new Date(booking.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-out</p>
                    <p className="text-gray-900">{new Date(booking.checkOut).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Guests</p>
                    <p className="text-gray-900">{booking.numberOfGuests}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="text-gray-900">₹{booking.totalPrice}</p>
                  </div>
                </div>
                {booking.status === 'pending' && (
                  <div className="mt-4 space-y-2">
                    <p className="text-yellow-600 text-sm">
                      Your booking is pending host approval. You'll be notified once the host confirms your booking.
                    </p>
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="text-red-600 hover:text-red-500 text-sm font-medium"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
                {booking.status === 'confirmed' && (
                  <div className="mt-4">
                    <p className="text-green-600 text-sm">
                      Your booking has been confirmed by the host. Enjoy your stay!
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;