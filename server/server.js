import { Account, RpcProvider } from 'starknet';
import fs from 'fs';
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('Error connecting to MongoDB:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Welcome to the MERN Stack Backend!');
});

// app.get('/starknet-version', async (req, res) => {
//   try {
//     const version = await provider.getSpecVersion();
//     res.json({ rpcVersion: version });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch StarkNet RPC version' });
//   }
// });

// app.post('/send-transaction', async (req, res) => {
//   try {
//     const { functionName, args } = req.body;

//     const txHash = await contract.invoke(functionName, args);
//     res.json({ txHash });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to send transaction', details: error.message });
//   }
// });

// app.get('/query-data', async (req, res) => {
//   try {
//     const data = await contract.getData(req.query.param1);
//     res.json({ data });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch contract data', details: error.message });
//   }
// });


// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const exampleRoutes = require('./routes/exampleRoute');
app.use('/api', exampleRoutes);
