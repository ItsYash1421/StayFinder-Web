const Listing = require('../models/Listing');

const listingController = {
  // Create a new listing
  createListing: async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('User:', req.user);

      const { title, description, location, images, pricePerNight, availableDates, bedrooms, bathrooms, maxGuests, amenities } = req.body;
      const ownerId = req.user._id;
      const hostName = req.user.name;

      // Validate all required fields
      const requiredFields = {
        title,
        description,
        location,
        images,
        pricePerNight,
        availableDates,
        bedrooms,
        bathrooms,
        maxGuests
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingFields.length > 0) {
        console.log('Missing required fields:', missingFields);
        return res.status(400).json({
          message: 'Missing required fields',
          missingFields
        });
      }

      // Validate location structure
      if (!location.address || !location.city || !location.state || !location.country) {
        console.log('Invalid location structure:', location);
        return res.status(400).json({
          message: 'Invalid location format',
          location
        });
      }

      // Validate availableDates
      if (!Array.isArray(availableDates) || availableDates.length === 0) {
        console.log('Invalid availableDates:', availableDates);
        return res.status(400).json({
          message: 'At least one available date range is required',
          availableDates
        });
      }

      for (const date of availableDates) {
        if (!date.start || !date.end) {
          console.log('Invalid date range:', date);
          return res.status(400).json({
            message: 'Each available date must have start and end dates',
            date
          });
        }

        // Validate date format
        const startDate = new Date(date.start);
        const endDate = new Date(date.end);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.log('Invalid date format:', { start: date.start, end: date.end });
          return res.status(400).json({
            message: 'Invalid date format. Dates must be in YYYY-MM-DD format',
            dates: { start: date.start, end: date.end }
          });
        }

        if (startDate >= endDate) {
          console.log('Invalid date range - end date must be after start date:', { start: date.start, end: date.end });
          return res.status(400).json({
            message: 'End date must be after start date',
            dates: { start: date.start, end: date.end }
          });
        }
      }

      // Create the listing object
      const listingData = {
        title,
        description,
        location,
        images,
        pricePerNight: Number(pricePerNight),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        maxGuests: Number(maxGuests),
        amenities: amenities || [],
        availableDates,
        ownerId,
        hostName
      };

      console.log('Creating listing with data:', listingData);

      const listing = new Listing(listingData);
      console.log('Listing model created:', listing);

      const savedListing = await listing.save();
      console.log('Listing saved successfully:', savedListing);

      res.status(201).json({ data: savedListing });
    } catch (error) {
      console.error('Error creating listing:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        errors: error.errors
      });
      
      res.status(500).json({
        message: 'Error creating listing',
        error: error.message,
        details: error.errors
      });
    }
  },

  // Get all listings with filters
  getListings: async (req, res) => {
    try {
      const { location, minPrice, maxPrice, sortBy, minRating } = req.query;
      console.log('Received filter request:', req.query);

      // Build query
      const query = {};

      // Location search
      if (location) {
        query.$or = [
          { 'location.address': { $regex: location, $options: 'i' } },
          { 'location.city': { $regex: location, $options: 'i' } },
          { 'location.state': { $regex: location, $options: 'i' } },
          { 'location.country': { $regex: location, $options: 'i' } }
        ];
      }

      // Price range
      if (minPrice || maxPrice) {
        query.pricePerNight = {};
        if (minPrice) query.pricePerNight.$gte = Number(minPrice);
        if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
      }

      // Rating filter
      if (minRating) {
        query.rating = { $gte: Number(minRating) };
      }

      // Sort options
      let sort = {};
      switch (sortBy) {
        case 'price_asc':
          sort = { pricePerNight: 1 };
          break;
        case 'price_desc':
          sort = { pricePerNight: -1 };
          break;
        case 'rating':
          sort = { rating: -1 };
          break;
        case 'newest':
        default:
          sort = { createdAt: -1 };
          break;
      }

      console.log('Executing query:', query);
      console.log('Sort options:', sort);

      const listings = await Listing.find(query)
        .populate('ownerId', 'name email')
        .populate({
          path: 'reviews.user',
          select: 'name'
        })
        .sort(sort);

      console.log(`Found ${listings.length} listings`);

      res.json({ data: listings });
    } catch (error) {
      console.error('Error getting listings:', error);
      res.status(500).json({ message: 'Error getting listings' });
    }
  },

  // Get a single listing by ID
  getListing: async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id)
        .populate('ownerId', 'name email')
        .populate({
          path: 'reviews',
          populate: {
            path: 'user',
            select: 'name'
          }
        });

      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      // Convert ownerId to string for consistent comparison
      const listingData = listing.toObject();
      listingData.ownerId = listingData.ownerId._id.toString();

      res.json({ data: listingData });
    } catch (error) {
      console.error('Error getting listing:', error);
      res.status(500).json({ message: 'Error getting listing' });
    }
  },

  // Update a listing
  updateListing: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const listing = await Listing.findById(id);

      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      // Check if the user is the owner
      if (listing.ownerId.toString() !== req.user._id.toString()) {
        console.log('Owner ID mismatch:', {
          listingOwnerId: listing.ownerId.toString(),
          userId: req.user._id.toString()
        });
        return res.status(403).json({ message: 'Not authorized to update this listing' });
      }

      // Don't allow updating ownerId or hostName
      delete updates.ownerId;
      delete updates.hostName;

      const updatedListing = await Listing.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      );

      res.json({ data: updatedListing });
    } catch (error) {
      console.error('Error updating listing:', error);
      res.status(500).json({ message: 'Error updating listing' });
    }
  },

  // Delete a listing
  deleteListing: async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id);
      
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      // Check if user is the owner
      if (listing.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this listing' });
      }

      await listing.deleteOne();
      res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
      console.error('Error deleting listing:', error);
      res.status(500).json({ message: 'Error deleting listing' });
    }
  },

  // Get listings by owner
  getOwnerListings: async (req, res) => {
    try {
      const listings = await Listing.find({ ownerId: req.user._id })
        .sort({ createdAt: -1 });
      res.json({ data: listings });
    } catch (error) {
      console.error('Error getting owner listings:', error);
      res.status(500).json({ message: 'Error getting owner listings' });
    }
  },

  // Add a review to a listing
  addReview: async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const userId = req.user._id;
      const listingId = req.params.id;

      console.log('Adding review - Request body:', req.body);
      console.log('Adding review - User:', req.user);
      console.log('Adding review - Listing ID:', listingId);

      const listing = await Listing.findById(listingId);
      console.log('Found listing:', listing._id);

      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      // Check if user has already reviewed this listing
      const existingReview = listing.reviews.find(
        review => review.user.toString() === userId.toString()
      );

      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this listing' });
      }

      // Create a new review object with the correct field name
      const review = {
        rating,
        comment,
        user: userId,  // Changed from userId to user to match schema
        createdAt: new Date()
      };

      console.log('Adding new review:', review);

      // Update the listing with the new review while preserving all existing fields
      const updatedListing = await Listing.findByIdAndUpdate(
        listingId,
        {
          $push: { reviews: review },
          $set: {
            rating: listing.reviews.length === 0 
              ? rating 
              : (listing.rating * listing.reviews.length + rating) / (listing.reviews.length + 1)
          }
        },
        { 
          new: true,
          runValidators: true
        }
      ).populate({
        path: 'reviews.user',
        select: 'name'
      });

      console.log('Successfully added review');
      res.json({ data: updatedListing });
    } catch (error) {
      console.error('Error adding review:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      res.status(500).json({ 
        message: 'Error adding review',
        error: error.message 
      });
    }
  }
};

module.exports = listingController;