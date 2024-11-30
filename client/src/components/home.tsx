import { useState } from "react";
import Header from "./funds/Header";
import CreateFundButton from "./funds/CreateFundButton";
import CreateFundModal from "./funds/CreateFundModal";
import FundsList from "./funds/FundsList";
import WithdrawalModal from "./funds/WithdrawalModal";
import WithdrawalApprovalModal from "./funds/WithdrawalApprovalModal";
import { useToast } from "@/components/ui/use-toast";
import { braavos } from "@starknet-react/core";
function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
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
      requestAmount: "0.5 ETH",
      requesterAddress: "0x1234...5678",
      reason: "Project development expenses",
    });
    setIsApprovalModalOpen(true);
  };

  return (
    <div className="w-screen h-screen">
      <Header
        isWalletConnected={isWalletConnected}
        onWalletConnect={() => {setIsWalletConnected(true)}}
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
