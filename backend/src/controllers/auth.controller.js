const User = require('../models/User');
const VoterProfile = require('../models/VoterProfile');
const Constituency = require('../models/Constituency');
const { generateAccessToken, generateRefreshToken } = require('../utils/token.utils');
const AuditService = require('../services/audit.service');

// Generate random synthetic voter ID
const generateSyntheticVoterId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `VID-2026-${code}`;
};

/**
 * Register a new voter with synthetic profile
 */
const register = async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      phone,
      dateOfBirth,
      registeredConstituencyId,
      registeredState,
      registeredDistrict,
      currentCity,
      currentState,
      currentPincode,
      occupation
    } = req.body;

    // Validate email uniqueness
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address is already registered.'
      });
    }

    // Validate constituency
    let constituencyId = registeredConstituencyId;
    if (!constituencyId) {
      const defaultConst = await Constituency.findOne();
      if (defaultConst) constituencyId = defaultConst._id;
    }

    if (!constituencyId) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid registered constituency.'
      });
    }

    // Create User
    const user = new User({
      email: email.toLowerCase(),
      password,
      fullName,
      phone,
      dateOfBirth: dateOfBirth || new Date('1998-05-15'),
      role: 'VOTER',
      accountStatus: 'ACTIVE'
    });

    await user.save();

    // Create Voter Profile
    const syntheticVoterId = generateSyntheticVoterId();
    const voterProfile = new VoterProfile({
      userId: user._id,
      syntheticVoterId,
      registeredConstituency: constituencyId,
      registeredState: registeredState || 'Andhra Pradesh',
      registeredDistrict: registeredDistrict || 'Visakhapatnam',
      currentCity: currentCity || 'Bengaluru',
      currentState: currentState || 'Karnataka',
      currentPincode: currentPincode || '560001',
      occupation: occupation || 'Software Engineer',
      verificationStatus: 'VERIFIED'
    });

    await voterProfile.save();

    // Audit log
    await AuditService.logEvent({
      action: 'VOTER_REGISTRATION',
      actorRole: 'VOTER',
      actorId: user._id.toString(),
      details: {
        syntheticVoterId,
        registeredState: voterProfile.registeredState,
        currentCity: voterProfile.currentCity
      },
      ipAddress: req.ip
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      message: 'Voter account created successfully.',
      token: accessToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        syntheticVoterId,
        voterProfile
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create voter account',
      error: error.message
    });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    // Check account lockout
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const waitMinutes = Math.ceil((user.lockoutUntil - new Date()) / (60 * 1000));
      return res.status(403).json({
        success: false,
        message: `Account is temporarily locked due to excessive failed attempts. Try again in ${waitMinutes} minutes.`
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
      }
      await user.save();

      await AuditService.logEvent({
        action: 'FAILED_LOGIN_ATTEMPT',
        actorRole: 'ANONYMOUS',
        actorId: user.email,
        details: { attempts: user.failedLoginAttempts },
        ipAddress: req.ip
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    // Reset failed login counter on success
    user.failedLoginAttempts = 0;
    user.lockoutUntil = null;
    user.lastLoginAt = new Date();
    user.lastLoginIp = req.ip;
    await user.save();

    // Fetch voter profile if applicable
    const voterProfile = await VoterProfile.findOne({ userId: user._id })
      .populate('registeredConstituency');

    // Audit log
    await AuditService.logEvent({
      action: 'USER_LOGIN_SUCCESS',
      actorRole: user.role,
      actorId: user._id.toString(),
      details: { role: user.role },
      ipAddress: req.ip
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token: accessToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        voterProfile: voterProfile || null
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

/**
 * Get current logged in user details
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const voterProfile = await VoterProfile.findOne({ userId: req.user._id })
      .populate('registeredConstituency');

    return res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        voterProfile: voterProfile || null
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message
    });
  }
};

/**
 * Demo Login Helper for quick academic evaluation
 */
const demoLogin = async (req, res) => {
  try {
    const { role } = req.body; // 'VOTER', 'ADMIN', 'OFFICER'
    const targetRole = role || 'VOTER';

    const user = await User.findOne({ role: targetRole });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No demo account found for role ${targetRole}. Please run backend seed.`
      });
    }

    const voterProfile = await VoterProfile.findOne({ userId: user._id })
      .populate('registeredConstituency');

    const accessToken = generateAccessToken(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: `Logged in as demo ${targetRole}`,
      token: accessToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        voterProfile: voterProfile || null
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Demo login failed',
      error: error.message
    });
  }
};

/**
 * Logout
 */
const logout = async (req, res) => {
  res.clearCookie('accessToken');
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

module.exports = {
  register,
  login,
  getMe,
  demoLogin,
  logout
};
