const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Yash Meena',
    email: 'yashbt22csd@gmail.com',
    password: bcrypt.hashSync('1421yash', 10),
    role: 'host',
    phone: '9876543210'
  }
];

const indianLocations = [
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    coordinates: [72.8777, 19.0760],
    popularAreas: ['Colaba', 'Bandra', 'Juhu', 'Powai', 'Andheri']
  },
  {
    city: 'Delhi',
    state: 'Delhi',
    coordinates: [77.1025, 28.7041],
    popularAreas: ['Connaught Place', 'Hauz Khas', 'Saket', 'Dwarka', 'Vasant Kunj']
  },
  {
    city: 'Bangalore',
    state: 'Karnataka',
    coordinates: [77.5946, 12.9716],
    popularAreas: ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Marathahalli']
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    coordinates: [78.4867, 17.3850],
    popularAreas: ['Hitech City', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills', 'Secunderabad']
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    coordinates: [80.2707, 13.0827],
    popularAreas: ['T Nagar', 'Adyar', 'Anna Nagar', 'Velachery', 'OMR']
  },
  {
    city: 'Kolkata',
    state: 'West Bengal',
    coordinates: [88.3639, 22.5726],
    popularAreas: ['Park Street', 'Salt Lake', 'New Town', 'Howrah', 'Dum Dum']
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    coordinates: [73.8567, 18.5204],
    popularAreas: ['Koregaon Park', 'Kalyani Nagar', 'Hinjewadi', 'Viman Nagar', 'Baner']
  },
  {
    city: 'Ahmedabad',
    state: 'Gujarat',
    coordinates: [72.5714, 23.0225],
    popularAreas: ['Satellite', 'Vastrapur', 'Navrangpura', 'Bopal', 'SG Road']
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    coordinates: [75.7873, 26.9124],
    popularAreas: ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Raja Park', 'Sodala']
  },
  {
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    coordinates: [80.9462, 26.8467],
    popularAreas: ['Gomti Nagar', 'Hazratganj', 'Indira Nagar', 'Aliganj', 'Mahanagar']
  }
];

const propertyTypes = [
  'Luxury Apartment',
  'Modern Villa',
  'Cozy Studio',
  'Heritage Home',
  'Beach House',
  'Mountain View Cottage',
  'City Center Flat',
  'Garden Apartment',
  'Penthouse Suite',
  'Traditional House'
];

const amenities = [
  'WiFi',
  'Air Conditioning',
  'Kitchen',
  'Swimming Pool',
  'Gym',
  'Parking',
  'Security',
  'Elevator',
  'Garden',
  'Balcony',
  'TV',
  'Washing Machine',
  'Heating',
  'Workspace',
  'BBQ Grill'
];

const generateListings = () => {
  const listings = [];
  const ownerId = users[0]._id; // Yash Meena's ID

  indianLocations.forEach(location => {
    // Generate 5 listings for each city
    for (let i = 0; i < 5; i++) {
      const area = location.popularAreas[Math.floor(Math.random() * location.popularAreas.length)];
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const bedrooms = Math.floor(Math.random() * 4) + 1;
      const bathrooms = Math.floor(Math.random() * 3) + 1;
      const maxGuests = bedrooms * 2;
      const pricePerNight = Math.floor(Math.random() * 5000) + 1000;
      
      // Generate random coordinates within the city (small offset)
      const latOffset = (Math.random() - 0.5) * 0.1;
      const lngOffset = (Math.random() - 0.5) * 0.1;
      
      const listing = {
        title: `${propertyType} in ${area}, ${location.city}`,
        description: `Beautiful ${propertyType.toLowerCase()} located in the heart of ${area}, ${location.city}. Perfect for your stay in ${location.state}.`,
        location: {
          address: `${Math.floor(Math.random() * 100) + 1} ${area} Road`,
          city: location.city,
          state: location.state,
          country: 'India',
          coordinates: {
            type: 'Point',
            coordinates: [
              location.coordinates[0] + lngOffset,
              location.coordinates[1] + latOffset
            ]
          }
        },
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
        ],
        pricePerNight,
        bedrooms,
        bathrooms,
        maxGuests,
        amenities: amenities.sort(() => 0.5 - Math.random()).slice(0, 8),
        ownerId,
        hostName: 'Yash Meena',
        rating: 0,
        availableDates: [],
        reviews: []
      };
      
      listings.push(listing);
    }
  });

  return listings;
};

module.exports = {
  users,
  listings: generateListings()
}; 