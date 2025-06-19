const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const auth = require('../middlewares/auth');

// Public routes
router.get('/', listingController.getListings);
router.get('/:id', listingController.getListing);

// Protected routes
router.post('/', auth, listingController.createListing);
router.put('/:id', auth, listingController.updateListing);
router.delete('/:id', auth, listingController.deleteListing);
router.get('/owner/listings', auth, listingController.getOwnerListings);
router.post('/:id/reviews', auth, listingController.addReview);

module.exports = router;