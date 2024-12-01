import React, { useState } from 'react';
import { useAccount, useContract, useContractWrite } from '@starknet-react/core';
import { Buffer } from "buffer";
import { RpcProvider } from 'starknet';
import {useNavigate} from 'react-router';


const CONTRACT_ADDRESS = "0x03bd19c59181bbba12ee4bef2dcc5938b2fdbe53a2159fbd92dfb6afe0464df0";
function stringToFelt(str) {
    return "0x" + Buffer.from(str, "utf-8").toString("hex");
}

function NewFund() {
    const { address } = useAccount();
    const RPC_NODE_URL = "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";
    const provider = new RpcProvider({ nodeUrl: RPC_NODE_URL });
    const [calls, setCalls] = useState();
    const [fundName, setFundName] = useState("");
    const [fundAmount, setFundAmount] = useState(0);
    const [abi, setAbi] = useState(null);
    const navigate = useNavigate();

    // Contract address and ABI setup
    const { contract } = useContract({ abi, address: CONTRACT_ADDRESS });

    const getAbi = async () => {
        try {
            const classInfo = await provider.getClassAt(CONTRACT_ADDRESS);
            setAbi(classInfo.abi);
        } catch (error) {
            console.error("Error fetching ABI:", error);
        }
    };

    React.useEffect(() => {
        const fetchData = async () => {
            if (address) {
                await getAbi(); // Assuming getAbi is an async function
            }
            if (contract) {
                const check = await contract.functions.getFundName(address);
                console.log(check);
                if (check != 0n) {
                    navigate('/ViewFund/' + address);
                }
            }
        };
    
        fetchData();
    }, [address, contract]);
    

    // Preparing the transaction


    const { writeAsync } = useContractWrite({ calls });

    const createFund = async () => {
        if (contract && address) {
            try {
                setCalls(contract.populateTransaction['createFund'](stringToFelt(fundName), fundAmount));
                await writeAsync();
                console.log("Fund created successfully!");
                navigate('/MyFund/' + address);
            } catch (error) {
                console.error("Error creating fund:", error);
            }
        }
    };

    const handleNameChange = (e) => {
        setFundName(e.target.value);
    };

    const handleAmountChange = (e) => {
        setFundAmount(e.target.value);
    };

    return (
        <div className='h-full w-full flex flex-col'>
            <div className='flex h-full w-full justify-center items-center'>
                {address &&
                    <div className='p-1 sm:p-4 w-3/5 md:w-2/5 absolute border-2 border-slate-400'>
                        <div className='text-3xl tracking-widest font-bold pt-6 text-center'>Create New Fund</div>
                        <div className='text-xs pt-1 pb-6 truncate opacity-70 text-center'>{address}</div>

                        <div className='flex flex-col my-2 p-4'>
                            {/* Fund Name Section */}
                            <div className='flex mb-4'>
                                <input
                                    type='text'
                                    placeholder='Fund Name'
                                    value={fundName}
                                    onChange={handleNameChange}
                                    className='text-black p-2 outline-0 flex-grow m-1 rounded bg-slate-300'
                                />
                            </div>

                            {/* Fund Amount Section */}
                            <div className='flex mb-4'>
                                <input
                                    type='number'
                                    min={0}
                                    placeholder='Data Amount'
                                    value={fundAmount}
                                    onChange={handleAmountChange}
                                    className='text-black p-2 outline-0 flex-grow m-1 rounded bg-slate-300'
                                />
                            </div>

                            {/* Create Fund Button */}
                            <button
                                onClick={createFund}
                                className='p-2 m-1 tracking-wider rounded border-2 border-orange-600 hover:border-transparent hover:bg-orange-600'
                            >
                                Create Fund
                            </button>
                        </div>
                    </div>
                }
            </div>

            <div className='mt-auto flex tracking-wide'>
                <a className='flex ml-auto hover:cursor-pointer hover:text-sky-300 hover:underline' target='_blank' href='https://github.com/prashansatanwar/simple-storage-cairo'>
                    <span className='px-1'>Github</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                        <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
                    </svg>
                </a>
            </div>
        </div>
    );
}

export default NewFund;