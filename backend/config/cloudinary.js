const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dn9nxulxp',
  api_key: '198165173432998',
  api_secret: 'NwdqK766yUB68TouwQ8kRlD3weI'
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'stayfinder',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'avif', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    resource_type: 'auto' // This allows Cloudinary to automatically detect the resource type
  }
});

// Create multer upload instance with file filter
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/avif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types are: ${allowedTypes.join(', ')}`));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = {
  cloudinary,
  upload
}; 