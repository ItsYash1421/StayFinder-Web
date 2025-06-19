import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import type { Listing } from '../../types';

// Fix for default marker icon
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapViewProps {
  listings: Listing[];
  center: [number, number];
  zoom?: number;
  onMarkerClick?: (listing: Listing) => void;
}

const MapView: React.FC<MapViewProps> = ({
  listings,
  center,
  zoom = 5,
  onMarkerClick
}) => {
  const handleMarkerClick = (listing: Listing) => {
    if (onMarkerClick) {
      onMarkerClick(listing);
    }
  };

  // Filter out listings without valid coordinates
  const validListings = listings.filter(listing => 
    listing.location?.coordinates?.coordinates?.length === 2
  );

  // If no valid listings, show a message
  if (validListings.length === 0) {
    return (
      <div className="h-[500px] w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Listings Available</h3>
          <p className="text-gray-600">There are no listings with valid location data to display on the map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validListings.map((listing) => {
          const coords = listing.location.coordinates?.coordinates;
          if (!coords || coords.length !== 2) return null;
          const leafletCoords: [number, number] = [coords[1], coords[0]]; // [lat, lng]
          return (
            <Marker
              key={listing._id}
              position={leafletCoords}
              icon={customIcon}
              eventHandlers={{
                click: () => handleMarkerClick(listing)
              }}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="p-2">
                    <h3 className="font-semibold text-lg">{listing.title}</h3>
                    <p className="text-gray-600">₹{listing.pricePerNight}/night</p>
                    <p className="text-sm text-gray-500">
                      {listing.location.city}, {listing.location.state}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {listing.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView; 