import Fund from '../models/fundModel.js';  // Import the model using ES6 import
import User from '../models/userModel.js';  // Import the model using ES6 import
import Request from '../models/requestModel.js';  // Import the model using ES6 import

// Create a new request
export const createRequest = async (req, res) => {
  const { fundId, amount, reason } = req.body;

  try {
    // Check if the fund exists
    const fund = await Fund.findById(fundId);
    if (!fund) {
      return res.status(404).json({ message: 'Fund not found.' });
    }

    // Create the new request
    const newRequest = new Request({ 
      funds: fundId, 
      amount, 
      reason, 
      votedYes: 0, 
      votedNo: 0, 
      userVoted: []
    });
    
    await newRequest.save();
    
    return res.status(201).json({ message: 'Request created successfully.', request: newRequest });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get all requests for a fund
export const getRequestsForFund = async (req, res) => {
  const { fundId } = req.params;

  try {
    const fund = await Fund.findById(fundId);
    if (!fund) {
      return res.status(404).json({ message: 'Fund not found.' });
    }

    const requests = await Request.find({ funds: fundId }).populate('funds').populate('userVoted');
    
    return res.status(200).json({ requests });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get a single request by ID
export const getRequestById = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Request.findById(requestId).populate('funds').populate('userVoted');
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    return res.status(200).json({ request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Vote on a request (Yes/No)
export const voteOnRequest = async (req, res) => {
  const { requestId, userId, vote } = req.body; // vote is either 'yes' or 'no'

  if (!['yes', 'no'].includes(vote)) {
    return res.status(400).json({ message: 'Invalid vote. Please vote "yes" or "no".' });
  }

  try {
    // Check if the user has already voted
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    if (request.userVoted.includes(userId)) {
      return res.status(400).json({ message: 'User has already voted on this request.' });
    }

    // Update the vote count based on user vote
    if (vote === 'yes') {
      request.votedYes += 1;
    } else if (vote === 'no') {
      request.votedNo += 1;
    }

    // Add the user to the userVoted array
    request.userVoted.push(userId);

    await request.save();

    return res.status(200).json({ message: 'Vote counted successfully.', request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Update a request (e.g., change reason)
export const updateRequest = async (req, res) => {
  const { requestId } = req.params;
  const { amount, reason } = req.body;

  try {
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Update the request details
    if (amount) request.amount = amount;
    if (reason) request.reason = reason;

    await request.save();

    return res.status(200).json({ message: 'Request updated successfully.', request });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Delete a request
export const deleteRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    await request.remove();
    return res.status(200).json({ message: 'Request deleted successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
