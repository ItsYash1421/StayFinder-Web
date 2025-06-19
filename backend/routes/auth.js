const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');
const { upload } = require('../config/cloudinary');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getProfile);
router.put('/profile', auth, upload.single('avatar'), authController.updateProfile);
router.delete('/profile', auth, authController.deleteProfile);

module.exports = router;