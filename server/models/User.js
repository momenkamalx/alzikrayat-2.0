const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name max 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name max 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [100, 'Email max 100 characters'],
    match: [/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'Enter a valid email address'],
  },
  // stores the bcrypt hash, never the plain password
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  // optional profile fields
  location: { type: String, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500 },
  occupation: { type: String, trim: true, maxlength: 100 },
});

module.exports = mongoose.model('User', userSchema);
