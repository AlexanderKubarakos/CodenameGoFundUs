import Fund from '../models/fundModel.js';  // Use ES6 import for the Fund model
import User from '../models/userModel.js';  // Use ES6 import for the User model

// Create a new user
export const createUser = async (req, res) => {
  const { walletAddress, userName } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ walletAddress });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this wallet address already exists.' });
    }

    // Create new user
    const newUser = new User({ walletAddress, userName });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully.', user: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get user by wallet address
export const getUserByWallet = async (req, res) => {
  const { walletAddress } = req.params;

  try {
    const user = await User.findOne({ walletAddress }).populate('ownerFunds joinedFunds');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Add a fund to the user's ownerFunds
export const addOwnerFund = async (req, res) => {
  const { walletAddress, fundId } = req.body;

  try {
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find the fund by ID
    const fund = await Fund.findById(fundId);
    if (!fund) {
      return res.status(404).json({ message: 'Fund not found.' });
    }

    // Add the fund to the user's ownerFunds
    if (!user.ownerFunds.includes(fundId)) {
      user.ownerFunds.push(fundId);
      await user.save();
    }

    return res.status(200).json({ message: 'Fund added to ownerFunds successfully.', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Add a fund to the user's joinedFunds
export const addJoinedFund = async (req, res) => {
  const { walletAddress, fundId } = req.body;

  try {
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find the fund by ID
    const fund = await Fund.findById(fundId);
    if (!fund) {
      return res.status(404).json({ message: 'Fund not found.' });
    }

    // Add the fund to the user's joinedFunds
    if (!user.joinedFunds.includes(fundId)) {
      user.joinedFunds.push(fundId);
      await user.save();
    }

    return res.status(200).json({ message: 'Fund added to joinedFunds successfully.', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Update a user's details (e.g., userName)
export const updateUser = async (req, res) => {
  const { walletAddress } = req.params;
  const { userName } = req.body;

  try {
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update the user's name
    if (userName) {
      user.userName = userName;
      await user.save();
    }

    return res.status(200).json({ message: 'User updated successfully.', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Delete a user by wallet address
export const deleteUser = async (req, res) => {
  const { walletAddress } = req.params;

  try {
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await user.remove();
    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
