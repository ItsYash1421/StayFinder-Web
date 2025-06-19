const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const auth = require('../middlewares/auth');

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 10MB',
        error: err.message
      });
    }
    return res.status(400).json({
      message: 'Upload error',
      error: err.message
    });
  }
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      message: err.message,
      error: 'Invalid file type'
    });
  }
  next(err);
};

// Upload single image
router.post('/image', auth, upload.single('image'), handleMulterError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log('Upload successful:', req.file);
    res.json({
      url: req.file.path,
      public_id: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Error uploading file',
      error: error.message 
    });
  }
});

// Upload multiple images
router.post('/images', auth, upload.array('images', 10), handleMulterError, (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    console.log('Upload successful:', req.files);
    const uploadedFiles = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));
    res.json(uploadedFiles);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Error uploading files',
      error: error.message 
    });
  }
});

module.exports = router; 