import fs from 'fs';
import { RpcProvider, Contract, Account, ec, json } from 'starknet';
import { provider, myNodeUrl } from './starknet.js'; // Make sure these are correctly exported from 'starknet.js'

// Connect the deployed Test contract in Sepolia Testnet
const testAddress = '0x02d2a4804f83c34227314dba41d5c2f8a546a500d34e30bb5078fd36b5af2d77';
const account0Address = '0x0682a6b082e08d46a0d38481ffc1f6053b6e02ad586a3a3244828783a2df67fd';

// Read ABI of Test contract
const { abi: testAbi } = await provider.getClassAt(testAddress);
if (testAbi === undefined) {
  throw new Error('no abi.');
}
const myTestContract = new Contract(testAbi, testAddress, provider);

// Account setup (Private key to use for signing the transaction)
const privateKey = process.env.PRIVATE_KEY; // Load the private key from environment variable

const compiledAccount = new Account(provider, account0Address, privateKey);

// Connect account with the contract
myTestContract.connect(compiledAccount);

// Interactions with the contract with meta-class
const bal1 = await myTestContract.get_balance();
console.log('Initial balance =', bal1); // Cairo 1 contract
const myCall = myTestContract.populate('increase_balance', [10]);
const res = await myTestContract.increase_balance(myCall.calldata);
await provider.waitForTransaction(res.transaction_hash);

const bal2 = await myTestContract.get_balance();
console.log('Final balance =', bal2);

// With Cairo 0 contract, `bal1.res.toString()` because the return value is called 'res' in the Cairo 0 contract.
// With Cairo 1 contract, the result value is in `bal1`, as bigint.
