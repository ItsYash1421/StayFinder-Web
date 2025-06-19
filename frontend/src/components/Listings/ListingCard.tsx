import React from 'react';
import { Listing } from '../../types';
import StarRating from '../../components/StarRating';

interface ListingCardProps {
  listing: Listing;
  onClick?: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative h-48">
        <img
          src={listing.images[0] || '/placeholder-image.jpg'}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
        <p className="text-gray-600 text-sm mt-1">{
          `${listing.location.address}, ${listing.location.city}, ${listing.location.state}, ${listing.location.country}`
        }</p>
        <div className="mt-2 flex items-center">
          <StarRating rating={listing.rating} size="sm" readonly />
          <span className="text-sm text-gray-600 ml-2">({listing.reviews.length})</span>
        </div>
        <p className="text-lg font-bold text-blue-600 mt-2">${listing.price}/night</p>
      </div>
    </div>
  );
};

export default ListingCard; 