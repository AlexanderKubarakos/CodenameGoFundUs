import mongoose from 'mongoose';
import Fund from './fundModel.js'; // Correct import for default export

const { Schema } = mongoose;

const userSchema = new Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  ownerFunds: {
    type: [Schema.Types.ObjectId],
    ref: "Fund",  // Reference to the Fund model
    unique: false,
  },
  joinedFunds: {
    type: [Schema.Types.ObjectId],
    ref: "Fund",  // Reference to the Fund model
    unique: false,
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
export default User;
