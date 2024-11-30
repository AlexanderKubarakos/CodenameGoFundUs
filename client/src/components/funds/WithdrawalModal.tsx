import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WithdrawalForm from "./WithdrawalForm";

interface WithdrawalFormData {
  amount: string;
  reason: string;
  destinationAddress: string;
}

interface WithdrawalModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  fundName?: string;
  balance?: string;
  onSubmit?: (data: WithdrawalFormData) => void;
  isLoading?: boolean;
}

const WithdrawalModal = ({
  isOpen = true,
  onOpenChange = () => console.log("Modal state changed"),
  fundName = "Example Fund",
  balance = "0.00 ETH",
  onSubmit = (data) => console.log("Form submitted:", data),
  isLoading = false,
}: WithdrawalModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background sm:max-w-[500px] h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Request Withdrawal
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <WithdrawalForm
            fundName={fundName}
            balance={balance}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;
