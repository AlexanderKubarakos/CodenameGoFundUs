import React, { useState, useEffect } from 'react';
import { useAccount, useContract, useContractWrite } from '@starknet-react/core';
import { RpcProvider } from 'starknet';
import {useParams} from 'react-router-dom';

const CONTRACT_ADDRESS = "0x069bbb7cf691a3e1b40a94e4f10156672f21761637e849f6be72c7b3f355608a";

function YourFund() {
    const { address } = useAccount();
    const RPC_NODE_URL = "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";
    const provider = new RpcProvider({ nodeUrl: RPC_NODE_URL });

    // State management
    const [fundDetails, setFundDetails] = useState(null);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawReason, setWithdrawReason] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Contract setup
    const [abi, setAbi] = useState(null);
    const { contract } = useContract({ abi, address: CONTRACT_ADDRESS });
    const { writeAsync: requestWithdrawal } = useContractWrite({ 
        calls: contract?.populateTransaction['requestWithdrawal']?.(withdrawAmount, withdrawReason) 
    });
    const { id } = useParams();



    // Fetch ABI and fund details
    useEffect(() => {
       
    
        const fetchFundDetails = async () => {
          if (!address) return;
    
          try {
            setIsLoading(true);
            // Fetch ABI
            const classInfo = await provider.getClassAt(CONTRACT_ADDRESS);
            setAbi(classInfo.abi);
    
            // Fetch fund details (mock implementation)
           
          } catch (err) {
            setError(err.message);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchFundDetails();
      }, [address, id]);

      useEffect(() => {
        if(!contract || !address) return;
        const fetchFundDetails = async () => {
            const details = await fetchMockFundDetails();
            setFundDetails(details);
        }
        fetchFundDetails();
      }, [contract, address]);

    // Withdrawal request handler
    const handleRequestWithdrawal = async () => {
        if (!withdrawAmount || parseFloat(withdrawAmount) <= 0 || !withdrawReason) return;

        try {
            await requestWithdrawal();
            alert(`Withdrawal request for ${withdrawAmount} submitted with reason: ${withdrawReason}`);
            setWithdrawAmount('');
            setWithdrawReason('');
        } catch (err) {
            setError(`Withdrawal failed: ${err.message}`);
        }
    };

    // Mock data fetching functions (replace with actual contract calls)
   function asciiHexToString(hexString) {
        // Ensure the hex string length is even (each character is 2 hex digits)
        if (hexString.length % 2 !== 0) {
            throw new Error("Hex string length must be even.");
        }
    
        let result = "";
        for (let i = 0; i < hexString.length; i += 2) {
            // Take each pair of hex digits
            const hexPair = hexString.slice(i, i + 2);
            // Convert the hex pair to a decimal number
            const decimalValue = parseInt(hexPair, 16);
            // Convert the decimal to its ASCII character
            result += String.fromCharCode(decimalValue);
        }
        return result;
    }
    const fetchMockFundDetails = async () => {
        const value = await contract.functions.getFundName(address);
        const value2 = await contract.functions.getFundPercent(address);
        const value3 = await contract.functions.getFundAmount(address);
        console.log("value", value, value2, value3)
        return {
            name: asciiHexToString(value.toString(16)),
            balance: value3,
            amount: value2
        }
    }


    if (isLoading) return <div className="text-center p-4">Loading fund details...</div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
    if (!address) return <div className="text-center p-4">Please connect your wallet</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
           { fundDetails && <div className="bg-white shadow-md rounded-lg p-6">
                {/* Fund Overview */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-4">{fundDetails.name}</h1>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Current Balance</p>
                            <p className="text-2xl font-semibold text-green-600">
                                ${fundDetails.balance.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Invite Contributors (now a link) */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Invite Contributors</h2>
                    <a 
                        href={`http://localhost:3000/joinfund/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                    >
                        Click here to invite contributors
                    </a>
                </div>

                {/* Withdrawal Request */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
                    <div className="flex">
                        <input 
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="Enter withdrawal amount"
                            min="0"
                            className="flex-grow p-2 border rounded-l-md"
                        />
                        <input 
                            type="text"
                            value={withdrawReason}
                            onChange={(e) => setWithdrawReason(e.target.value)}
                            placeholder="Enter withdrawal reason"
                            className="flex-grow p-2 border rounded-l-md ml-2"
                        />
                        <button 
                            onClick={handleRequestWithdrawal}
                            className="bg-green-500 text-white p-2 rounded-r-md hover:bg-green-600 ml-2"
                        >
                            Request
                        </button>
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default YourFund;
