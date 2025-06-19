const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    console.log('Auth middleware - Headers:', req.headers);
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);

      // Get user from token
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        console.log('No user found for token');
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Set user in request
      req.user = user;
      req.userId = user._id;
      console.log('User set in request:', {
        userId: user._id,
        email: user.email,
        role: user.role
      });

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error in auth middleware' });
  }
}; 