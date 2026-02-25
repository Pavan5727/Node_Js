const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId :{
    type : String,
    unique : true
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
    required: true,
  },
  passowrd: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);