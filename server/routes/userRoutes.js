import express from 'express';
import { 
  createUser, 
  getUserByWallet, 
  addOwnerFund, 
  addJoinedFund, 
  updateUser, 
  deleteUser 
} from '../controllers/userController.js';

const router = express.Router();

// Route to create a new user
router.post('/create', createUser);

// Route to get a user by wallet address
router.get('/:walletAddress', getUserByWallet);

// Route to add a fund to the user's ownerFunds
router.post('/ownerFunds', addOwnerFund);

// Route to add a fund to the user's joinedFunds
router.post('/joinedFunds', addJoinedFund);

// Route to update a user's details
router.put('/:walletAddress', updateUser);

// Route to delete a user by wallet address
router.delete('/:walletAddress', deleteUser);

export default router;
