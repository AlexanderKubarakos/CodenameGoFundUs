import mongoose from 'mongoose';
import User from './userModel.js';  // Import the User model using ES6

const { Schema } = mongoose;

const fundSchema = new Schema({
  contractAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fundName: {
    type: String,
    required: true,
    unique: false,
    trim: false
  },
  fundPercentWithdraw: {
    type: Number,  // Changed to Number as MongoDB doesn't support Float32Array directly
    required: true,
    unique: false,
  },
}, {
  timestamps: true
});

const Fund = mongoose.model('Fund', fundSchema);
export default Fund;  // Use export default instead of module.exports
