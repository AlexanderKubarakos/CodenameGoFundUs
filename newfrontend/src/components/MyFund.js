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
        if (id && address &&  address !== id) {
          // If the user is not authorized, set an error state and don't proceed with fetching data
          setError('You are not authorized to access this page.');
          setIsLoading(false);
          return;
        }
    
        const fetchFundDetails = async () => {
          if (!address) return;
    
          try {
            setIsLoading(true);
            // Fetch ABI
            const classInfo = await provider.getClassAt(CONTRACT_ADDRESS);
            setAbi(classInfo.abi);
    
            // Fetch fund details (mock implementation)
            const details = await fetchMockFundDetails(address);
            setFundDetails(details);
          } catch (err) {
            setError(err.message);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchFundDetails();
      }, [address, id]);

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
    const fetchMockFundDetails = async (userAddress) => ({
        name: "Community Development Fund",
        balance: 5420.50,
        totalContributions: 10000,
        createdAt: new Date('2024-01-15'),
        owner: userAddress
    });

    if (isLoading) return <div className="text-center p-4">Loading fund details...</div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
    if (!address) return <div className="text-center p-4">Please connect your wallet</div>;

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <div className="bg-white shadow-md rounded-lg p-6">
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
                        <div>
                            <p className="text-gray-600">Total Contributions</p>
                            <p className="text-xl">
                                ${fundDetails.totalContributions.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Invite Contributors (now a link) */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Invite Contributors</h2>
                    <a 
                        href={`https://link.com/fund/${fundDetails.name}`}
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
            </div>
        </div>
    );
}

export default YourFund;
