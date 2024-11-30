import fs from 'fs';
import { RpcProvider, Contract, Account, ec, json } from 'starknet';
import { provider, myNodeUrl } from './starknet.js'; // Make sure these are correctly exported from 'starknet.js'

// Contract address (ensure this is valid on the network you are using)
const addrContract = "0x030ecf57f105a95144d8e1beb1595eafaef83c8b24abd4c004770c6a4897e46e";

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
