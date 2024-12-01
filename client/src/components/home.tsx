import { useState, useRef, useMemo, useEffect } from "react";
import Header from "./funds/Header";
import CreateFundButton from "./funds/CreateFundButton";
import CreateFundModal from "./funds/CreateFundModal";
import FundsList from "./funds/FundsList";
import WithdrawalModal from "./funds/WithdrawalModal";
import WithdrawalApprovalModal from "./funds/WithdrawalApprovalModal";
import { useToast } from "@/components/ui/use-toast";
import { braavos, useAccount, useContract, useProvider } from "@starknet-react/core";
import { RpcProvider, Contract, Account, ec, json, BigNumberish, cairo, stark, shortString, CallData } from 'starknet';

// const dotenv = require('dotenv');
// dotenv.config();

const CONTRACT_ADDRESS = "0x036bec76648da174c4dc57b173338e03009a6a570877939c3d75c30fd26a9631";
const ACCOUNT_ADDRESS = "0x0682a6b082e08d46a0d38481ffc1f6053b6e02ad586a3a3244828783a2df67fd";
const RPC_NODE_URL = "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";
const PROVIDER = new RpcProvider({ nodeUrl: `${RPC_NODE_URL}` });

// const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ACCOUNT = new Account(PROVIDER, ACCOUNT_ADDRESS, "0x07abdf04fb2ec492c7b6e1ad9bddb95d1c4738272fa9932be6d4c7dc0b07ff20");

function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [contract, setContract] = useState(null);

  const { address } = useAccount();
  const [abi, setAbi] = useState(null);
  const { provider } = useProvider();
  console.log("test" + abi)
  // const { contract } = useContract({ abi, address: CONTRACT_ADDRESS });
  // let contract = new Contract(abi, CONTRACT_ADDRESS, ACCOUNT);
  const [getVal, setGetVal] = useState(0);
  const inputValRef = useRef(0);
  const [, setInputValState] = useState(0);

  useEffect(() => {
    if (abi && address) {
      console.log("Initializing contract with ABI:", abi);
      const newContract = new Contract(abi, CONTRACT_ADDRESS, ACCOUNT);
      setContract(newContract);
      console.log("Contract initialized");
    }
  }, [abi, address]);

  // const setStoredValue = async () => {
  //   if (contract && address) {
  //     try {
  //       writeAsync().then(v =>
  //         console.log("Value set successfully!")
  //       );
  //     } catch (error) {
  //       console.error("Error setting value:", error);
  //     }
  //   }
  // };

  async function getAbi() {
    try {
      const { abi: testAbi } = await provider.getClassAt(CONTRACT_ADDRESS);
      setAbi(testAbi);
    } catch (error) {
      console.error("Error fetching ABI:", error);
    }
  }

  // const myContract = new Contract(abi, CONTRACT_ADDRESS, PROVIDER);
  // myContract.connect(ACCOUNT);

  useEffect(() => {
    if (address) {
      getAbi();
    }
  }, [address]);


  const getValue = async () => {
    try {
      const val = await contract.functions.interact();
      setGetVal(val);
    } catch (error) {
      console.error("Error getting value:", error);
    }
  };

  const createFund = async () => {
    try {
      if (!contract) {
        console.error("Contract is not initialized");
        return;
      }
      const name = "Thomas";
      const requestPercent = cairo.uint256(10);

      console.log("Calling createFund with:", { name, requestPercent });

      // Call the function and log the transaction result
      const txResponse = await contract.functions.createFund(name, requestPercent);

      console.log("Transaction Response:", txResponse);

      const txHash = txResponse.transaction_hash;
      console.log("Transaction Hash:", txHash);

      setSelectedFund(txResponse);
      console.log("Selected Fund:", JSON.stringify(txResponse, null, 2));

      const last_user = await contract.functions.get_last_user();
      console.log("Last user: 0x" + last_user.toString(16));

      // const newName = await contract.functions.setFundName(1, "Alex");
      // console.log("New name: " + newName[0]);

      setFundOwner();
      getFundName();
      getFundOwner();
      setFundName();
      getFundName();
    } catch (error) {
      console.error("Error creating fund\n", error);
    }
  };

  const setFundName = async () => {
    try {
      // const fundId = 1;
      // const newFundName = "Thomas2"

      // const fundNameResponse = await contract.functions.setFundName(fundId, newFundName);
      // if (fundNameResponse) {
      //   console.log("Set fund name: ", shortString.decodeShortString(await getFundName()));
      // }

      const params = { entry: 1, name: "thomas" };
      const selectedFunction = "setFundName";
      const myCallData = new CallData(abi);
      const result = myCallData.compile(selectedFunction, params);

      console.log("Set fund name: " + shortString.decodeShortString(result[1]));
      // getFundName();
    } catch (error) {
      console.error("Error setting fund name\n" + error);
    }
  };

  const setFundOwner = async () => {
    try {
      const params = { entry: 1, owner: ACCOUNT_ADDRESS };
      const selectedFunction = "setFundOwner";
      const myCallData = new CallData(abi);
      const result = myCallData.compile(selectedFunction, params);

      console.log("Set fund owner: 0x" + result[0]);
    } catch (error) {
      console.error("Error in setting fund owner");
    }
  }

  const getFundName = async () => {
    try {
      const fundId = 1;
      const fundNameResponse = await contract.functions.getFundName(fundId);
      const fundName = fundNameResponse; // Assuming the first element is the name

      console.log("Fund Name:", shortString.decodeShortString(fundName));
      return fundName;
    } catch (error) {
      console.error("Error getting fund name\n", error);
    }
  };

  const getFundOwner = async () => {
    try {
      const fundId = 1;
      const fundOwnerResponse = await contract.functions.getFundOwner(fundId);
      // const fundName = fundNameResponse; // Assuming the first element is the name

      console.log("Fund Owner: 0x" + fundOwnerResponse.toString(16));
      return fundOwnerResponse;
    } catch (error) {
      console.error("Error getting fund name", error);
    }
  };

  const handleChange = (e) => {
    if (e.target.value) {
      inputValRef.current = e.target.value;
      setInputValState(inputValRef.current);
    }
    else {
      inputValRef.current = 0;
      setInputValState(inputValRef.current);
    }
  };

  const { toast } = useToast();
  const connectors = [
    braavos()
  ];

  const handleWithdrawalRequest = (fundId: string) => {
    if (!isWalletConnected) {
      toast({
        variant: "destructive",
        title: "Wallet Connection Required",
        description: "Please connect your wallet to request withdrawals.",
      });
      return;
    }
    setSelectedFund(fundId);
    setIsWithdrawModalOpen(true);
  };

  const handleApprovalRequest = (fundId: string) => {
    if (!isWalletConnected) {
      toast({
        variant: "destructive",
        title: "Wallet Connection Required",
        description: "Please connect your wallet to approve withdrawals.",
      });
      return;
    }

    // In a real app, you'd check if user is a contributor here
    const fund = mockFunds.find((f) => f.id === fundId);
    if (!fund?.isContributor) {
      toast({
        variant: "destructive",
        title: "Approval Not Allowed",
        description:
          "Only contributors to this fund can approve withdrawal requests.",
      });
      return;
    }

    setSelectedFund(fundId);
    setSelectedWithdrawal({
      fundName: "Community Fund",
      requestAmount: "0.1 ETH",
      requesterAddress: ACCOUNT_ADDRESS,
      reason: "Project development expenses",
    });
    setIsApprovalModalOpen(true);
  };

  return (
    <div className="w-screen h-screen">
      <Header
        isWalletConnected={isWalletConnected}
        onWalletConnect={() => { setIsWalletConnected(true) }}
        onWalletDisconnect={() => setIsWalletConnected(false)}
      />

      <main className="pt-20 px-6">
        <div className="flex justify-between items-center py-6">
          <CreateFundButton
            onClick={() => {
              if (!isWalletConnected) {
                createFund();
                setIsCreateModalOpen(true);
              } else {
                toast({
                  variant: "destructive",
                  title: "Wallet Connection Required",
                  description: "Please connect your wallet to create a fund.",
                });
              }
            }}
          />
        </div>

        <FundsList
          onWithdraw={handleWithdrawalRequest}
          onApproveWithdrawal={handleApprovalRequest}
        />

        <CreateFundModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
        />

        <WithdrawalModal
          isOpen={isWithdrawModalOpen}
          onOpenChange={setIsWithdrawModalOpen}
        />

        {selectedWithdrawal && (
          <WithdrawalApprovalModal
            isOpen={isApprovalModalOpen}
            onOpenChange={setIsApprovalModalOpen}
            {...selectedWithdrawal}
            onApprove={() => {
              // Handle approval
              setIsApprovalModalOpen(false);
              toast({
                title: "Withdrawal Approved",
                description: "Your approval has been recorded.",
              });
            }}
            onReject={() => {
              // Handle rejection
              setIsApprovalModalOpen(false);
              toast({
                title: "Withdrawal Rejected",
                description: "The withdrawal request has been rejected.",
              });
            }}
          />
        )}
      </main>
    </div>
  );
}

export default Home;