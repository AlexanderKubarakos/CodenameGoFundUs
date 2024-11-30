import { useState, useRef, useMemo, useEffect } from "react";
import Header from "./funds/Header";
import CreateFundButton from "./funds/CreateFundButton";
import CreateFundModal from "./funds/CreateFundModal";
import FundsList from "./funds/FundsList";
import WithdrawalModal from "./funds/WithdrawalModal";
import WithdrawalApprovalModal from "./funds/WithdrawalApprovalModal";
import { useToast } from "@/components/ui/use-toast";
import { braavos, useAccount, useContract, useProvider } from "@starknet-react/core";
import { RpcProvider, Contract, Account, ec, json } from 'starknet';

const CONTRACT_ADDRESS = "0x02d2a4804f83c34227314dba41d5c2f8a546a500d34e30bb5078fd36b5af2d77";
const ACCOUNT_ADDRESS = "0x0682a6b082e08d46a0d38481ffc1f6053b6e02ad586a3a3244828783a2df67fd";
const RPC_NODE_URL = "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";
const PROVIDER = new RpcProvider({ nodeUrl: `${RPC_NODE_URL}` });
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ACCOUNT = new Account(PROVIDER, ACCOUNT_ADDRESS, PRIVATE_KEY);

function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  const { address } = useAccount();
  const [abi, setAbi] = useState(null);
  const { provider } = useProvider();
  const { contract } = useContract({ abi, address: CONTRACT_ADDRESS });
  const [getVal, setGetVal] = useState(0);
  const inputValRef = useRef(0);
  const [, setInputValState] = useState(0);

  const calls = useMemo(() => {

    if (!address || !contract) return [];
    return contract.populateTransaction['set'](inputValRef.current);

  }, [contract, address, inputValRef.current]);

  // const { writeAsync } = useContractWrite({ calls });

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

  const myContract = new Contract(abi, CONTRACT_ADDRESS, PROVIDER);
  myContract.connect(ACCOUNT);

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

    // // In a real app, you'd check if user is a contributor here
    // const fund = mockFunds.find((f) => f.id === fundId);
    // if (!fund?.isContributor) {
    //   toast({
    //     variant: "destructive",
    //     title: "Approval Not Allowed",
    //     description:
    //       "Only contributors to this fund can approve withdrawal requests.",
    //   });
    //   return;
    // }

    setSelectedFund(fundId);
    setSelectedWithdrawal({
      fundName: "Community Fund",
      requestAmount: "0.5 ETH",
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
                toast({
                  variant: "destructive",
                  title: "Wallet Connection Required",
                  description: "Please connect your wallet to create a fund.",
                });
                return;
              }
              setIsCreateModalOpen(true);
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
