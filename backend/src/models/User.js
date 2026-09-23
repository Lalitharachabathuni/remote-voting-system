const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  role: {
    type: String,
    enum: ['VOTER', 'ELECTION_OFFICER', 'ADMIN', 'SUPER_ADMIN', 'AUDITOR'],
    default: 'VOTER'
  },
  accountStatus: {
    type: String,
    enum: ['ACTIVE', 'LOCKED', 'SUSPENDED', 'PENDING_VERIFICATION'],
    default: 'ACTIVE'
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockoutUntil: {
    type: Date,
    default: null
  },
  lastLoginAt: {
    type: Date
  },
  lastLoginIp: {
    type: String
  }
}, {
  timestamps: true
});

// Password hash hook
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
