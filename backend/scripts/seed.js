const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Listing = require('../models/Listing');
const seedData = require('../data/seedData');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB Atlas
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    console.log('Cleared existing data');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      seedData.users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    // Create users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log('Created users');

    // Create listings with host and ownerId references
    const listingsWithHosts = seedData.listings.map((listing, index) => ({
      ...listing,
      host: createdUsers[0]._id, // Assign all listings to the first user (John Doe)
      ownerId: createdUsers[0]._id, // Use ObjectId, not email
    }));

    const createdListings = await Listing.insertMany(listingsWithHosts);
    console.log('Created listings');
    
    // Log the first listing to verify coordinates
    console.log('First listing location:', createdListings[0].location);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 