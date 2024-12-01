// src/components/JoinFund.js
import React, { useState, useEffect } from 'react';
import { useAccount, useContract, useContractWrite } from '@starknet-react/core';
import { RpcProvider } from 'starknet';
import {useParams} from 'react-router-dom';
import {useNavigate} from 'react-router';


const CONTRACT_ADDRESS = "0x069bbb7cf691a3e1b40a94e4f10156672f21761637e849f6be72c7b3f355608a";
const STRK = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"
function JoinFund() {
    const { address } = useAccount();
    const RPC_NODE_URL = "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";
    const provider = new RpcProvider({ nodeUrl: RPC_NODE_URL });
    const [calls, setCalls] = useState();
    const [fundName, setFundName] = useState("");
    const [fundAmount, setFundAmount] = useState(0);
    const [abi, setAbi] = useState(null);
    const [abi2, setAbi2] = useState(null);

    const navigate = useNavigate();
    const [joining, setJoining] = useState("");
    const [amount, setAmount] = useState('');
    const {id} = useParams();

    // Contract address and ABI setup
    const { contract } = useContract({ abi, address: CONTRACT_ADDRESS });
    const { contract2 } = useContract({ abi2, address: STRK });
    useEffect(() => {
        console.log("contract2", contract2)
    }, [contract2]);
    useEffect(() => {
        console.log("contract", contract)
    }, [contract]);

    const getAbi = async () => {
        try {
            const classInfo = await provider.getClassAt(CONTRACT_ADDRESS);
            setAbi(classInfo.abi);
            const classInfo2 = await provider.getClassAt(STRK);
            setAbi2(classInfo2.abi);

        } catch (error) {
            console.error("Error fetching ABI:", error);
        }
    };
    useEffect(() => {
        console.log("ABI for CONTRACT_ADDRESS:", abi);
    }, [abi]);

    React.useEffect(() => {
        const fetchData = async () => {
            if (address) {
                await getAbi(); // Assuming getAbi is an async function
            }
        };
    
        fetchData();
    }, [address]); // Only runs when `address` or `contract` changes
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
const handleView = async () => {
    if (address && contract) {
        let value = await contract.functions.getFundName(id);
        value = value.toString(16)
        console.log(value)
        const character = asciiHexToString(value);
        setJoining(character);

        const value2 = await contract.functions.getFundAmount(id);
        setFundAmount(value2)
        setAmount(String(value2));
    }
}
const { writeAsync } = useContractWrite({ calls });


const allowance = async () => {
    console.log("Running allowance function...");
    console.log(contract2)
    if (contract2 && address) {
        try {
            console.log("Running allowance function...");
            setCalls(contract2.populateTransaction['approve'](address, CONTRACT_ADDRESS, fundAmount));
            await writeAsync();
            console.log("Fund allowed successfully!");

        } catch (error) {
            console.error("Error getting value:", error);
        }
    }
};
const pay = async () => {
    if (contract && address) {
        try {
            setCalls(contract.populateTransaction['pay'](CONTRACT_ADDRESS, address ,fundAmount * 1000000000000000000n));
            await writeAsync();
            navigate('/ViewFund/' + id);
        } catch (error) {
            console.error("Error getting value:", error);
        }
    }
};

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleJoinFund = async () => {
    //allowance
    await allowance();
    await pay();
    // Logic for joining the fund (e.g., call a smart contract or an API)
    console.log(`Joining the fund with amount: ${amount}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
     {!joining &&
      <button onClick={() => handleView()}className="text-2xl mb-4">View</button>
     }
     {joining && 
     <div>
     <h1 className="text-2xl mb-4">Join the Fund: {joining}</h1>
      <p>It will cost {amount} STRK</p>
      <button
        onClick={handleJoinFund}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Join Fund
      </button>
      </div>
      }
    </div>
  );
}

export default JoinFund;