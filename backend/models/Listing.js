const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true });

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],  // [longitude, latitude]
        required: false
      }
    }
  },
  images: [{
    type: String,
    required: true
  }],
  pricePerNight: {
    type: Number,
    required: true,
    min: 0
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 1
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 1
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1
  },
  amenities: [{
    type: String
  }],
  availableDates: [{
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  }],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [reviewSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add text index for search
listingSchema.index({
  'title': 'text',
  'description': 'text',
  'location.address': 'text',
  'location.city': 'text',
  'location.state': 'text',
  'location.country': 'text'
});

// Create a 2dsphere index for geospatial queries
listingSchema.index({ 'location.coordinates': '2dsphere' });

// Pre-save middleware to update timestamps
listingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;