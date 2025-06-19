const mongoose = require('mongoose');
const Listing = require('../models/Listing');
require('dotenv').config();

const updateListingPrices = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all listings
    const listings = await Listing.find({});
    console.log(`Found ${listings.length} total listings`);

    // Update each listing with a random price between 50 and 500
    for (const listing of listings) {
      try {
        const price = Math.floor(Math.random() * (500 - 50 + 1)) + 50;
        
        // Update using findOneAndUpdate to bypass validation
        await Listing.findOneAndUpdate(
          { _id: listing._id },
          { $set: { price: price } },
          { new: true }
        );
        
        console.log(`Updated listing ${listing._id} with price $${price}`);
      } catch (error) {
        console.error(`Error updating listing ${listing._id}:`, error.message);
      }
    }

    console.log('Successfully updated all listing prices');
  } catch (error) {
    console.error('Error updating listing prices:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
updateListingPrices(); 