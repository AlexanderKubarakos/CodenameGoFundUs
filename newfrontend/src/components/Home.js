import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useAccount, useContract, useProvider, useContractWrite } from '@starknet-react/core'
import { Buffer } from "buffer";
import { RpcProvider, Contract, cairo ,Account} from 'starknet';

const CONTRACT_ADDRESS = "0x04f3caf1ea48801e6a7fb497c1fc499bab94c366e19934e2bd0a866902c4e52d";
function stringToFelt(str) {
    return "0x" + Buffer.from(str, "utf-8").toString("hex");
  }
function Home() {
    const { address } = useAccount();
    const RPC_NODE_URL = "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";
    const provider = new RpcProvider({ nodeUrl: RPC_NODE_URL });
	const [abi, setAbi] = useState(null);
	const { contract } = useContract({ abi, address: '0x0704e5b3236f53220bd9cdac4856d44d5546715b10d16bbfb276ccb3fc342102' });
	const [getVal, setGetVal] = useState(0);
	const inputValRef = useRef(0);
	const [, setInputValState] = useState(0); 

	async function getAbi() {
		try {
			const classInfo = await provider.getClassAt('0x0704e5b3236f53220bd9cdac4856d44d5546715b10d16bbfb276ccb3fc342102');
			setAbi(classInfo.abi); 
		} catch (error) {
			console.error("Error fetching ABI:", error);
		}
	}

	useEffect(() => {
		if (address) {
			getAbi();
		}
	}, [address]);
  const calls = useMemo(() => {

		if (!address || !contract) return [];
		return contract.populateTransaction['createFund'](stringToFelt("HelloWorld"),10);

	}, [contract, address, inputValRef.current]);

  const { writeAsync } = useContractWrite({ calls });

  const createFund = async () => {
    console.log("Run!")
    console.log(contract, address)
		if (contract && address) {
			try {
				writeAsync().then(v => 
					console.log("Value set successfully!")
				);
			} catch (error) {
				console.error("Error setting value:", error);
			}
		}
	};
	const getValue = async () => {
		try {
			const val = await contract.functions.get();
			setGetVal(val);
		} catch (error) {
			console.error("Error getting value:", error);
		}
	};

	const handleChange = (e) => {
		if(e.target.value) {
			inputValRef.current = e.target.value;
			setInputValState(inputValRef.current);
		}
		else {
			inputValRef.current = 0;
			setInputValState(inputValRef.current);
		}

	};


	return (
	<div className='h-full w-full flex flex-col '>

		<div className='flex h-full w-full justify-center items-center'>
			
			{address && 
				<div className='p-1 sm:p-4 w-3/5 md:w-2/5 absolute border-2 border-slate-400'>
					<div className='text-3xl tracking-widest  font-bold pt-6 text-center'> Simple Storage Demo </div>		
					<div className='text-xs pt-1 pb-6 truncate opacity-70 text-center'>{address}</div>

					<div className='flex flex-col my-2 p-4'>
						<div className='flex mb-4'>
							<input type='number' min={0} placeholder='Data amount' onChange={handleChange} className='text-black p-2 outline-0 flex-grow m-1 rounded bg-slate-300'/>

							<button onClick={createFund} className='p-2 m-1 tracking-wider rounded  border-2 border-orange-600 hover:border-transparent hover:bg-orange-600   '>
								Create Fund
							</button>
						</div>

						<button onClick={getValue} className='p-2 m-1 tracking-wider rounded bg-orange-600 hover:bg-orange-700'>
							Get data value
						</button>
						<div type='number' onChange={handleChange} className='text-black p-4 outline-0 flex-grow m-1 mt-2 rounded bg-slate-300'>
							{getVal ? <span>{getVal.toString()}</span>  : <span className='italic opacity-40'> Data value in storage </span>}
						</div>

					</div>
				</div>
			}

		</div>

		<div className='mt-auto flex tracking-wide'>
			<a className='flex ml-auto hover:cursor-pointer hover:text-sky-300 hover:underline' target='_blank' href='https://github.com/prashansatanwar/simple-storage-cairo'>	
				<span className='px-1'>Github</span>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
					<path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
				</svg>
			</a>
		</div>


	</div>
	)
}

export default Home