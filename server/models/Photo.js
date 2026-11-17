const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId is required'],
    index: true,
  },
  fileName: {
    type: String,
    required: [true, 'fileName is required'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title max 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description max 1000 characters'],
    default: '',
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Photo', photoSchema);
