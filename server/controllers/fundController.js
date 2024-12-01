import mongoose from 'mongoose';
import Fund from '../models/fundModel.js';
import User from '../models/userModel.js';

// Create a Fund
export const createFund = async (req, res) => {
  try {
    const { contractAddress, fundName, fundPercentWithdraw } = req.body;

    // Check if the fund already exists
    const existingFund = await Fund.findOne({ contractAddress });
    if (existingFund) {
      return res.status(400).json({ message: 'Fund with this contract address already exists.' });
    }

    // Create a new fund
    const newFund = new Fund({
      contractAddress,
      fundName,
      fundPercentWithdraw
    });

    // Save the fund
    await newFund.save();
    res.status(201).json(newFund);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating fund', details: err.message });
  }
};

// Get all Funds
export const getAllFunds = async (req, res) => {
  try {
    const funds = await Fund.find();
    res.status(200).json(funds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching funds', details: err.message });
  }
};

// Get a single Fund by contractAddress
export const getFundByAddress = async (req, res) => {
  try {
    const { contractAddress } = req.params;
    const fund = await Fund.findOne({ contractAddress });

    if (!fund) {
      return res.status(404).json({ message: 'Fund not found' });
    }

    res.status(200).json(fund);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching fund', details: err.message });
  }
};

// Update a Fund's details by contractAddress
export const updateFund = async (req, res) => {
  try {
    const { contractAddress } = req.params;
    const updates = req.body;

    const updatedFund = await Fund.findOneAndUpdate(
      { contractAddress },
      updates,
      { new: true }
    );

    if (!updatedFund) {
      return res.status(404).json({ message: 'Fund not found' });
    }

    res.status(200).json(updatedFund);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating fund', details: err.message });
  }
};

// Delete a Fund by contractAddress
export const deleteFund = async (req, res) => {
  try {
    const { contractAddress } = req.params;

    // Delete the fund
    const deletedFund = await Fund.findOneAndDelete({ contractAddress });

    if (!deletedFund) {
      return res.status(404).json({ message: 'Fund not found' });
    }

    res.status(200).json({ message: 'Fund deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting fund', details: err.message });
  }
};

// Associate a Fund with a User (Add fund to ownerFunds or joinedFunds)
export const associateFundWithUser = async (req, res) => {
  try {
    const { userAddress, fundAddress, type } = req.body; // type can be 'ownerFunds' or 'joinedFunds'
    console.log(userAddress);
    // Find the user
    const user = await User.findOne({ walletAddress: userAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the fund
    const fund = await Fund.findOne({ contractAddress: fundAddress });
    if (!fund) {
      return res.status(404).json({ message: 'Fund not found' });
    }

    // Add the fund to the appropriate array (ownerFunds or joinedFunds)
    if (type === 'ownerFunds') {
      user.ownerFunds.push(fund._id);
    } else if (type === 'joinedFunds') {
      user.joinedFunds.push(fund._id);
    } else {
      return res.status(400).json({ message: 'Invalid type, must be "ownerFunds" or "joinedFunds"' });
    }

    // Save the user with updated funds
    await user.save();

    res.status(200).json({ message: 'Fund associated with user successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error associating fund with user', details: err.message });
  }
};
