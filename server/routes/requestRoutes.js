import express from 'express';
import { 
  createRequest, 
  getRequestsForFund, 
  getRequestById, 
  voteOnRequest, 
  updateRequest, 
  deleteRequest 
} from '../controllers/requestController.js';

const router = express.Router();

// Route to create a new request
router.post('/create', createRequest);

// Route to get all requests for a specific fund
router.get('/funds/:fundId', getRequestsForFund);

// Route to get a single request by ID
router.get('/:requestId', getRequestById);

// Route to vote on a request (Yes/No)
router.post('/vote', voteOnRequest);

// Route to update a request (e.g., change amount or reason)
router.put('/:requestId', updateRequest);

// Route to delete a request by ID
router.delete('/:requestId', deleteRequest);

export default router;
