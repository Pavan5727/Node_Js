const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "User"
  },
  profilePic: {         
    type: String,
    default: null
  },
  teamCode: {
    type: String,
    unique: true
  },
  teamLeader: {
    type: String,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);