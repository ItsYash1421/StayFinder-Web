import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsAPI } from '../api/api';
import type { Listing } from '../types';
import MapView from '../components/Map/MapView';

// Default center for India
const INDIA_CENTER: [number, number] = [20.5937, 78.9629];

// Indian states with their coordinates
const INDIAN_STATES = [
  { name: 'Maharashtra', coordinates: [19.7515, 75.7139] as [number, number] },
  { name: 'Delhi', coordinates: [28.7041, 77.1025] as [number, number] },
  { name: 'Karnataka', coordinates: [15.3173, 75.7139] as [number, number] },
  { name: 'Telangana', coordinates: [17.3850, 78.4867] as [number, number] },
  { name: 'Tamil Nadu', coordinates: [13.0827, 80.2707] as [number, number] },
  { name: 'West Bengal', coordinates: [22.5726, 88.3639] as [number, number] },
  { name: 'Gujarat', coordinates: [23.0225, 72.5714] as [number, number] },
  { name: 'Rajasthan', coordinates: [26.9124, 75.7873] as [number, number] },
  { name: 'Uttar Pradesh', coordinates: [26.8467, 80.9462] as [number, number] }
];

const MapViewPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>(INDIA_CENTER);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await listingsAPI.getListings();
        console.log('Fetched listings:', response.data);
        setListings(response.data);
      } catch (err) {
        setError('Failed to load listings');
        console.error('Error loading listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleMarkerClick = (listing: Listing) => {
    navigate(`/listings/${listing._id}`);
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    if (state) {
      const stateData = INDIAN_STATES.find(s => s.name === state);
      if (stateData) {
        setMapCenter(stateData.coordinates);
      }
    } else {
      setMapCenter(INDIA_CENTER);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // If the query matches a state name, center the map there
    const stateData = INDIAN_STATES.find(s => 
      s.name.toLowerCase().includes(query.toLowerCase())
    );
    if (stateData) {
      setMapCenter(stateData.coordinates);
      setSelectedState(stateData.name);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesState = !selectedState || listing.location.state === selectedState;
    const matchesSearch = !searchQuery || 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesSearch;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Map</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-2 md:px-0 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-sm">Explore Stays Across India</h1>
          <p className="text-lg text-gray-600">Find your next stay by searching or browsing the interactive map below.</p>
        </div>
        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-2xl shadow-lg px-6 py-4 border border-gray-100">
          <div className="flex-1 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by city, state, or property name..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm"
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
            >
              <option value="">All States</option>
              {INDIAN_STATES.map(state => (
                <option key={state.name} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="hidden md:inline-flex items-center px-4 py-2 ml-2 rounded-full bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => { setMapCenter(INDIA_CENTER); setSelectedState(''); setSearchQuery(''); }}
            title="Reset Map View"
          >
            <span className="material-icons mr-2">refresh</span> Reset View
          </button>
        </div>
        {/* Results Count */}
        <div className="mb-4 text-blue-700 font-medium text-center md:text-left">
          Showing <span className="font-bold">{filteredListings.length}</span> properties
          {selectedState && <span> in <span className="font-semibold">{selectedState}</span></span>}
          {searchQuery && <span> matching <span className="font-semibold">"{searchQuery}"</span></span>}
        </div>
        {/* Map View Card */}
        <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <MapView
            listings={filteredListings}
            center={mapCenter}
            zoom={selectedState ? 8 : 5}
            onMarkerClick={handleMarkerClick}
          />
          {/* Floating Reset Button for mobile */}
          <button
            className="md:hidden absolute top-4 right-4 z-10 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            onClick={() => { setMapCenter(INDIA_CENTER); setSelectedState(''); setSearchQuery(''); }}
            title="Reset Map View"
          >
            <span className="material-icons">refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapViewPage; 