require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Listing = require('./models/Listing');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'host',
        phone: '1234567890'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'user',
        phone: '0987654321'
      }
    ]);
    console.log('Created test users');

    // Create test listings
    const listings = await Listing.create([
      {
        title: 'Luxury Beach House',
        description: 'Beautiful beachfront property with stunning ocean views',
        location: {
          address: '123 Beach Road',
          city: 'Miami',
          state: 'Florida',
          country: 'USA',
          coordinates: {
            lat: 25.7617,
            lng: -80.1918
          }
        },
        images: [
          'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6',
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511'
        ],
        pricePerNight: 299,
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking'],
        availableDates: [
          {
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-03-15')
          },
          {
            startDate: new Date('2024-04-01'),
            endDate: new Date('2024-04-30')
          }
        ],
        ownerId: users[0]._id
      },
      {
        title: 'Mountain Cabin Retreat',
        description: 'Cozy cabin in the mountains with scenic views',
        location: {
          address: '456 Mountain Trail',
          city: 'Denver',
          state: 'Colorado',
          country: 'USA',
          coordinates: {
            lat: 39.7392,
            lng: -104.9903
          }
        },
        images: [
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
          'https://images.unsplash.com/photo-1523217582562-09d0def993a6'
        ],
        pricePerNight: 199,
        bedrooms: 2,
        bathrooms: 1,
        maxGuests: 4,
        amenities: ['WiFi', 'Fireplace', 'Kitchen', 'Hiking Trails'],
        availableDates: [
          {
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-03-31')
          }
        ],
        ownerId: users[0]._id
      }
    ]);
    console.log('Created test listings');

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();