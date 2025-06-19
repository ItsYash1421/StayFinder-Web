import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listingsAPI } from '../api/api';
import type { Listing, SearchFilters } from '../types';
import { showToast } from '../utils/toast';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sortBy: 'newest'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 15;
  const totalPages = Math.ceil(listings.length / listingsPerPage);
  const startIndex = (currentPage - 1) * listingsPerPage;
  const endIndex = startIndex + listingsPerPage;
  const currentListings = listings.slice(startIndex, endIndex);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listingsAPI.getListings(filters);
      setListings(response.data || []);
    } catch (err) {
      setError('Failed to load listings');
      showToast('Failed to load listings', 'error');
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadListings();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      sortBy: e.target.value as 'newest' | 'price_asc' | 'price_desc' | 'rating',
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-900">Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-sm tracking-tight">Find Your Perfect Stay</h1>
            <p className="text-2xl mb-8 text-blue-100">Discover unique accommodations around the world</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="w-full flex justify-center -mt-12 z-10 relative">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="col-span-2">
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  id="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  name="location"
                  placeholder="e.g. Mumbai, Delhi, Goa..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="minPrice" className="block text-sm font-semibold text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  id="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  name="minPrice"
                  placeholder="Min"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-semibold text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  id="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  name="maxPrice"
                  placeholder="Max"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="minRating" className="block text-sm font-semibold text-gray-700 mb-1">Min Rating</label>
                <select
                  id="minRating"
                  value={filters.minRating}
                  onChange={handleFilterChange}
                  name="minRating"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm"
                >
                  <option value="">Any</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Star</option>
                </select>
              </div>
              <div>
                <label htmlFor="sortBy" className="block text-sm font-semibold text-gray-700 mb-1">Sort By</label>
                <select
                  id="sortBy"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  name="sortBy"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-2 rounded-full bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <span className="flex items-center justify-center">
                  <span className="material-icons align-middle mr-2">search</span>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-4 text-blue-700 font-medium text-center md:text-left">
        Showing <span className="font-bold">{listings.length}</span> properties
        {filters.location && <span> in <span className="font-semibold">{filters.location}</span></span>}
        {filters.minPrice && <span> from <span className="font-semibold">₹{filters.minPrice}</span></span>}
        {filters.maxPrice && <span> to <span className="font-semibold">₹{filters.maxPrice}</span></span>}
        {filters.minRating && <span> with <span className="font-semibold">{filters.minRating}★+</span></span>}
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentListings.map((listing) => (
            <div
              key={listing._id}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-90 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Link
                    to={`/listings/${listing._id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {listing.title}
                  </h3>
                  <div className="flex items-center">
                    <span className="material-icons text-yellow-400 text-sm">star</span>
                    <span className="text-sm font-medium text-gray-600 ml-1">
                      {listing.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {`${listing.location.address}, ${listing.location.city}, ${listing.location.state}`}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    ₹{listing.pricePerNight.toLocaleString()}
                    <span className="text-sm font-normal text-gray-500">/night</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    {listing.bedrooms} beds • {listing.bathrooms} baths
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition-all duration-200`}
            >
              <span className="material-icons text-xl">Left</span>
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-all duration-200`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition-all duration-200`}
            >
              <span className="material-icons text-xl">Next</span>
            </button>
          </div>
        )}

        {/* No Results Message */}
        {listings.length === 0 && (
          <div className="text-center py-12">
            <span className="material-icons text-6xl text-gray-400 mb-4">search_off</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      {!user?.role && (
        <div className="bg-white py-12 mt-8 rounded-2xl shadow-lg max-w-4xl mx-auto text-center border border-blue-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Become a Host
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Share your space and earn extra income
          </p>
          <Link
            to="/register"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;