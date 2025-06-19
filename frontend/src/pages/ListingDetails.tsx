import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listingsAPI, bookingsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import type { Listing } from '../types';

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadListing(id);
    }
    // eslint-disable-next-line
  }, [id]);

  const loadListing = async (listingId: string) => {
    try {
      setLoading(true);
      const response = await listingsAPI.getListing(listingId);
      setListing(response.data);
      setError(null);
    } catch {
      setError('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingMessage(null);
    setBookingError(null);
    if (!user) {
      setBookingError('You must be logged in to book.');
      return;
    }
    if (!checkIn || !checkOut) {
      setBookingError('Please select check-in and check-out dates.');
      return;
    }
    try {
      // Calculate number of nights
      const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)));
      await bookingsAPI.createBooking({
        listingId: id!,
        checkIn,
        checkOut,
        numberOfGuests,
        specialRequests,
        totalPrice: listing ? listing.pricePerNight * nights : 0
      });
      setBookingMessage('Booking successful!');
    } catch (err: any) {
      setBookingError(err?.response?.data?.message || 'Booking failed');
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewMessage(null);
    if (!user) {
      setReviewMessage('You must be logged in to review.');
      return;
    }
    if (!reviewText) {
      setReviewMessage('Please enter a review.');
      return;
    }
    try {
      await listingsAPI.addReview(id!, { rating: reviewRating, comment: reviewText });
      setReviewMessage('Review submitted!');
      setReviewText('');
      setReviewRating(5);
      loadListing(id!);
    } catch (err: any) {
      setReviewMessage(err?.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error || !listing) return <div className="text-center py-8 text-red-600">{error || 'Listing not found'}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Images Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {listing.images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={listing.title}
            className="w-full h-64 object-cover rounded-lg shadow"
          />
        ))}
      </div>

      {/* Main Info */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          <div className="text-gray-600 mb-2">
            {listing.location.address}, {listing.location.city}, {listing.location.state}, {listing.location.country}
          </div>
          <div className="mb-4">
            <span className="text-lg font-semibold text-blue-700">${listing.pricePerNight}</span> / night
          </div>
          <div className="mb-4">
            <span className="mr-4">{listing.bedrooms} bedrooms</span>
            <span className="mr-4">{listing.bathrooms} bathrooms</span>
            <span>{listing.maxGuests} guests</span>
          </div>
          <div className="mb-4">
            <span className="font-semibold">Amenities:</span>
            <ul className="list-disc ml-6">
              {listing.amenities.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <span className="font-semibold">Description:</span>
            <p className="mt-1 text-gray-700">{listing.description}</p>
          </div>
          <div className="mb-4">
            <span className="font-semibold">Host:</span> {typeof listing.ownerId === 'object' && listing.ownerId !== null && 'name' in listing.ownerId ? (listing.ownerId as any).name : (listing.ownerId ? String(listing.ownerId) : 'N/A')}
          </div>
        </div>

        {/* Booking Form */}
        <div className="w-full text-gray-900 md:w-96 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Book this property</h2>
          <form onSubmit={handleBooking} className="space-y-3 text-gray-900">
            <div>
              <label className="block mb-1">Check-in</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Check-out</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Guests</label>
              <input
                type="number"
                min={1}
                max={listing.maxGuests}
                className="w-full border rounded px-3 py-2"
                value={numberOfGuests}
                onChange={e => setNumberOfGuests(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Special Requests</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                value={specialRequests}
                onChange={e => setSpecialRequests(e.target.value)}
                rows={2}
              />
            </div>
            {bookingError && <div className="text-red-600 text-sm">{bookingError}</div>}
            {bookingMessage && <div className="text-green-600 text-sm">{bookingMessage}</div>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          </form>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {listing.reviews.length === 0 && <div className="text-gray-500">No reviews yet.</div>}
        <div className="space-y-4">
          {listing.reviews.map((review, idx) => (
            <div key={idx} className="bg-gray-50 rounded p-4 shadow">
              <div className="flex items-center mb-2">
                <span className="font-semibold mr-2">{review.user?.name || 'User'}</span>
                <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                {/* <span className="ml-2 text-gray-400 text-xs">{new Date(review.date).toLocaleDateString()}</span> */}
              </div>
              <div>{review.comment}</div>
            </div>
          ))}
        </div>
        {/* Add Review */}
        {user && (
          <form onSubmit={handleReview} className="mt-6 bg-white rounded p-4 shadow space-y-3">
            <div>
              <label className="block mb-1">Your Rating</label>
              <select
                className="border rounded px-3 py-2"
                value={reviewRating}
                onChange={e => setReviewRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Your Review</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                rows={2}
                required
              />
            </div>
            {reviewMessage && <div className="text-red-600 text-sm">{reviewMessage}</div>}
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Browse Listings
      </button>
    </div>
  );
};

export default ListingDetails; 