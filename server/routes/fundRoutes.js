import express from 'express';
import { 
  createFund, 
  getAllFunds, 
  getFundByAddress, 
  updateFund, 
  deleteFund, 
  associateFundWithUser 
} from '../controllers/fundController.js';

const router = express.Router();

// Route to create a new fund
router.post('/create', createFund);

// Route to get all funds
router.get('/', getAllFunds);

// Route to get a fund by contract address
router.get('/:contractAddress', getFundByAddress);

// Route to update a fund by contract address
router.put('/:contractAddress', updateFund);

// Route to delete a fund by contract address
router.delete('/:contractAddress', deleteFund);

// Route to associate a fund with a user (add to ownerFunds or joinedFunds)
router.post('/associate', associateFundWithUser);

export default router;
