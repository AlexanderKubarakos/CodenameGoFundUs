import { useState } from "react";
import Header from "./funds/Header";
import CreateFundButton from "./funds/CreateFundButton";
import CreateFundModal from "./funds/CreateFundModal";
import FundsList from "./funds/FundsList";
import WithdrawalModal from "./funds/WithdrawalModal";
import WithdrawalApprovalModal from "./funds/WithdrawalApprovalModal";
import { useToast } from "@/components/ui/use-toast";
import CreateFundFormData from "./funds/CreateFundModal";
import CreateContributeForm from "./funds/CreateContributeModal";
import CreateContributeModal from "./funds/CreateContributeModal";
function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [hasNewFunddata, publishNewFundListData] = useState(null);
  const { toast } = useToast();

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
  const handleContributeRequest = (fundId: string) => {
    if (!isWalletConnected) {
      toast({
        variant: "destructive",
        title: "Wallet Connection Required",
        description: "Please connect your wallet to request withdrawals.",
      });
      return;
    }
    setSelectedFund(fundId);
    setIsContributeOpen(true);
  };

  const [myFunds, setMyFunds] = useState([ // Changed this
    {
      id: "1",
      name: "Community Fund",
      description: "Supporting local initiatives and projects",
      balance: "2.5 STRK",
      contributors: 12,
      pendingWithdrawals: 2,
      approvalType: 51,
      approvalProgress: 30,
      isOwner: true,
      isContributor: true,
    },
    {
      id: "2",
      name: "Tech Startup Fund",
      description: "Funding innovative blockchain projects",
      balance: "5.0 STRK",
      contributors: 8,
      pendingWithdrawals: 0,
      approvalType: 75,
      approvalProgress: 0,
      isOwner: false,
      isContributor: false,
    },
    {
      id: "3",
      name: "Private Investment",
      description: "Exclusive investment opportunity",
      balance: "1.2 STRK",
      contributors: 3,
      pendingWithdrawals: 1,
      approvalType: 0,
      approvalProgress: 60,
      isOwner: true,
      isContributor: true,
    },
    {
      id: "4",
      name: "Private Investment",
      description: "Exclusive investment opportunity",
      balance: "1.2 STRK",
      contributors: 3,
      pendingWithdrawals: 1,
      approvalType: 0,
      approvalProgress: 50,
      isOwner: true,
      isContributor: true,
    },
  ]);

  const onSubmit = (data) => {
    console.log(data);
    setMyFunds(prevFunds => [
      ...prevFunds,
      {
        id: "6", // New ID for the new fund
        name: data.name,
        description: data.description,
        balance: "1.2 STRK",
        contributors: 3,
        pendingWithdrawals: 1,
        approvalType: data.approvalThreshold,
        approvalProgress: data.approvalProgress,
        isOwner: true,
        isContributor: true,
      }
    ]);
    setIsCreateModalOpen(false);
  }

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
      requestAmount: "0.5 STRK",
      requesterAddress: "0x1234...5678",
      reason: "Project development expenses",
    });
    setIsApprovalModalOpen(true);
  };

  return (
    <div className="w-screen h-screen">
      <Header
        isWalletConnected={isWalletConnected}
        onWalletConnect={() => {
          setIsWalletConnected(true)}}
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
                console.log("Need wallet!");
                return;
              }
              setIsCreateModalOpen(true);
            }}
          />
        </div>

        <FundsList
          funds={myFunds}
          onWithdraw={handleWithdrawalRequest}
          onContribute={handleContributeRequest}
          onApproveWithdrawal={handleApprovalRequest}
        />

        <CreateFundModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={onSubmit}
        />

        <WithdrawalModal
          isOpen={isWithdrawModalOpen}
          onOpenChange={setIsWithdrawModalOpen}
        />
        <CreateContributeModal
          isOpen={isContributeOpen}
          onOpenChange={setIsContributeOpen}
          onSubmit={(data) => {
          console.log(`Contributing ${data.amount} STRK to ${selectedFund}`);
          toast({
            title: "Contribution Successful",
            description: `You contributed ${data.amount} STRK to the fund.`,
          });
      setIsContributeOpen(false); 
    }}
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
