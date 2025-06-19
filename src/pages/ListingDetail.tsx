import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listingsAPI, bookingsAPI } from '../api/api';
import { Listing, Review } from '../types';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDates, setBookingDates] = useState({
    checkIn: '',
    checkOut: '',
  });
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchListing();
  }, [id]);

    const fetchListing = async () => {
      try {
      const response = await listingsAPI.getListing(id!);
        setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('Failed to load listing details');
      } finally {
        setLoading(false);
      }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to book a property');
      navigate('/login');
      return;
    }

    if (!listing) {
      toast.error('Listing information not available');
      return;
    }

    try {
      const totalPrice = listing.pricePerNight * Math.ceil(
        (new Date(bookingDates.checkOut).getTime() - new Date(bookingDates.checkIn).getTime()) / (1000 * 60 * 60 * 24)
      );

      await bookingsAPI.createBooking({
        listingId: id!,
        checkIn: bookingDates.checkIn,
        checkOut: bookingDates.checkOut,
        numberOfGuests,
        totalPrice,
      });
      toast.success('Booking request sent successfully');
      setBookingDates({ checkIn: '', checkOut: '' });
      setNumberOfGuests(1);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to leave a review');
      navigate('/login');
      return;
    }

    try {
      const response = await listingsAPI.addReview(id!, reviewForm);
      await fetchListing(); // Refresh the listing to get the updated reviews
      setReviewForm({ rating: 0, comment: '' });
      setShowReviewForm(false);
      toast.success('Review submitted successfully');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const formatLocation = (location: Listing['location']) => {
    if (!location) return 'Location not specified';
    
    const parts = [
      location.address,
      location.city,
      location.state,
      location.country
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  };

  const handleImageError = (imageUrl: string) => {
    setImageError(prev => ({ ...prev, [imageUrl]: true }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Listing not found</h2>
            <button
              onClick={() => navigate('/')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <div className="mb-8">
          {listing.images && listing.images.length > 0 ? (
            <>
              <div className="h-[500px] rounded-lg overflow-hidden bg-gray-100 mb-4">
                {!imageError[listing.images[0]] ? (
                  <img
                    src={listing.images[0]}
            alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(listing.images[0])}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">Image not available</span>
                  </div>
                )}
              </div>
              {listing.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {listing.images.slice(1).map((image, index) => (
                    <div key={index} className="h-32 rounded-lg overflow-hidden bg-gray-100">
                      {!imageError[image] ? (
                        <img
                          src={image}
                          alt={`${listing.title} ${index + 2}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={() => handleImageError(image)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-sm">Image not available</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="h-[500px] rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No images available</span>
            </div>
          )}
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
                    <p className="mt-2 text-gray-600">{formatLocation(listing.location)}</p>
                  </div>
                  <div className="flex items-center">
                    <StarRating rating={listing.rating || 0} readonly />
                    <span className="ml-2 text-gray-600">({listing.reviews?.length || 0} reviews)</span>
                  </div>
          </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="ml-2 text-gray-600">{listing.type || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="ml-2 text-gray-600">Up to {listing.maxGuests || 0} guests</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    <span className="ml-2 text-gray-600">{listing.bedrooms || 0} bedrooms</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="ml-2 text-gray-600">
                      Available from {listing.availableFrom ? format(new Date(listing.availableFrom), 'MMM d, yyyy') : 'Not specified'}
                    </span>
                  </div>
          </div>

                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-900">Description</h2>
                  <p className="mt-4 text-gray-600 whitespace-pre-line">{listing.description || 'No description available'}</p>
          </div>

          {/* Amenities */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {listing.amenities && listing.amenities.length > 0 ? (
                      listing.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="ml-2 text-gray-600">{amenity}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No amenities listed</p>
                    )}
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-12">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                    {user && (
                      <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Write a Review
                      </button>
                    )}
                  </div>

                  {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className="mt-6 bg-gray-50 p-6 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Rating</label>
                          <StarRating
                            rating={reviewForm.rating}
                            onRatingChange={(rating: number) => setReviewForm((prev) => ({ ...prev, rating }))}
                          />
                        </div>
                        <div>
                          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                            Comment
                          </label>
                          <textarea
                            id="comment"
                            rows={4}
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Submit Review
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  <div className="mt-6 space-y-6">
                    {listing.reviews && listing.reviews.length > 0 ? (
                      listing.reviews.map((review) => (
                        <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between">
              <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-lg font-medium text-gray-600">
                                  {review.user?.name?.[0]?.toUpperCase() || review.user?.email?.[0]?.toUpperCase() || 'A'}
                                </span>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-sm font-medium text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                </p>
                              </div>
                            </div>
                            <StarRating rating={review.rating} readonly />
                          </div>
                          <p className="mt-4 text-gray-600">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No reviews yet</p>
                    )}
              </div>
              </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden sticky top-8">
              <div className="p-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold text-gray-900">${listing.pricePerNight || 0}</span>
                  <span className="text-gray-600">per night</span>
        </div>

                <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                <div>
                      <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">
                        Check-in
                      </label>
                  <input
                    type="date"
                        id="checkIn"
                    value={bookingDates.checkIn}
                        onChange={(e) => setBookingDates((prev) => ({ ...prev, checkIn: e.target.value }))}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                      <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">
                        Check-out
                      </label>
                  <input
                    type="date"
                        id="checkOut"
                    value={bookingDates.checkOut}
                        onChange={(e) => setBookingDates((prev) => ({ ...prev, checkOut: e.target.value }))}
                        min={bookingDates.checkIn || format(new Date(), 'yyyy-MM-dd')}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                  </div>

                <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
                      Number of Guests
                    </label>
                    <select
                      id="guests"
                      value={numberOfGuests}
                      onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    >
                      {[...Array(listing.maxGuests)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${listing.pricePerNight || 0} x nights</span>
                      <span>
                        {bookingDates.checkIn && bookingDates.checkOut
                          ? Math.ceil(
                              (new Date(bookingDates.checkOut).getTime() - new Date(bookingDates.checkIn).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          : 0}{' '}
                        nights
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Service fee</span>
                      <span>
                        $
                        {bookingDates.checkIn && bookingDates.checkOut
                          ? Math.round(
                              (listing.pricePerNight || 0) *
                                Math.ceil(
                                  (new Date(bookingDates.checkOut).getTime() - new Date(bookingDates.checkIn).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                ) *
                                0.1
                            )
                          : 0}
                      </span>
                </div>
                    <div className="flex justify-between font-medium text-gray-900 mt-4 pt-4 border-t border-gray-200">
                      <span>Total</span>
                      <span>
                        $
                        {bookingDates.checkIn && bookingDates.checkOut
                          ? Math.round(
                              (listing.pricePerNight || 0) *
                                Math.ceil(
                                  (new Date(bookingDates.checkOut).getTime() - new Date(bookingDates.checkIn).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                ) *
                                1.1
                            )
                          : 0}
                      </span>
                </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Book Now
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>You won't be charged yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail; 