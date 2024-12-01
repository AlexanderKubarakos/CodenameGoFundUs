import mongoose from 'mongoose';
import Fund from './fundModel.js';  // Import the Fund model using ES6
import User from './userModel.js';  // Import the User model using ES6

const { Schema } = mongoose;

const requestModel = new Schema({
  funds: {
    type: Schema.Types.ObjectId, // Use ObjectId to store references
    ref: "Fund", // Reference to the Fund model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    // required: true // Uncomment if this should be required
  },
  userVoted: {
    type: [Schema.Types.ObjectId],
    ref: "User",
  },
  votedYes: {
    type: Number,
  },
  votedNo: {
    type: Number,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const Request = mongoose.model('Request', requestModel);
export default Request; // Use export default instead of module.exports
