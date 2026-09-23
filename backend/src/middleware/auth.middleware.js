const { verifyAccessToken } = require('../utils/token.utils');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required'
      });
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists'
      });
    }

    if (user.accountStatus === 'LOCKED' || user.accountStatus === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.accountStatus.toLowerCase()}. Contact election administration.`
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
      error: error.message
    });
  }
};

module.exports = {
  requireAuth
};
