import fs from 'fs';
import { RpcProvider, Contract, Account, ec, json } from 'starknet';
import { provider, myNodeUrl } from './starknet.js'; // Make sure these are correctly exported from 'starknet.js'

// Contract address (ensure this is valid on the network you are using)
const addrContract = "0x036bec76648da174c4dc57b173338e03009a6a570877939c3d75c30fd26a9631";

// Function to test the contract interaction
// Get the contract class and ABI
const compressedContract = await provider.getClassAt(addrContract);
// Ensure the compiledContracts directory exists
const dirPath = './compiledContracts';
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });  // Create the directory if it doesn't exist
}

// Write the ABI to a file (Ensure the directory exists)
const contractABI = compressedContract.abi;
fs.writeFileSync('./compiledContracts/myAbi.json', JSON.stringify(contractABI, undefined, 2));

// Read the compiled contract ABI for interaction
// const compiledTest = JSON.parse(
//   fs.readFileSync('./compiledContracts/myAbi.json').toString('ascii')
// );

// Connect to the contract using the ABI and provider
const myTestContract = new Contract(contractABI, addrContract, provider);

// Perform contract interaction (optional: you can add contract calls here)
// console.log('Contract loaded and connected successfully');
console.log("-----> myTestContract:\n");
console.log(myTestContract);


export { myTestContract };
