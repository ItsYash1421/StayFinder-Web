import React from 'react';
import { Listing } from '../../types';
import ListingCard from './ListingCard';

interface ListingsListProps {
  listings: Listing[];
  onListingClick?: (listing: Listing) => void;
}

const ListingsList: React.FC<ListingsListProps> = ({ listings, onListingClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing._id}
          listing={listing}
          onClick={() => onListingClick?.(listing)}
        />
      ))}
    </div>
  );
};

export default ListingsList; 