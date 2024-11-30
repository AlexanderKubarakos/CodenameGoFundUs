import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowUpRight, Check, X } from "lucide-react";

interface WithdrawalApprovalModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  fundName?: string;
  requestAmount?: string;
  requesterAddress?: string;
  reason?: string;
  onApprove?: () => void;
  onReject?: () => void;
  isLoading?: boolean;
}

const WithdrawalApprovalModal = ({
  isOpen = true,
  onOpenChange = () => console.log("Modal state changed"),
  fundName = "Example Fund",
  requestAmount = "0.00 ETH",
  requesterAddress = "0x1234...5678",
  reason = "No reason provided",
  onApprove = () => console.log("Withdrawal approved"),
  onReject = () => console.log("Withdrawal rejected"),
  isLoading = false,
}: WithdrawalApprovalModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background sm:max-w-[500px] h-[400px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Approve Withdrawal Request
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6 p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Fund</Label>
                <span className="text-sm text-muted-foreground">
                  {fundName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <Label>Request Amount</Label>
                <span className="text-lg font-semibold">{requestAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <Label>Requester</Label>
                <span className="text-sm text-muted-foreground">
                  {requesterAddress}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reason for Withdrawal</Label>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {reason}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onReject}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={onApprove}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              {isLoading ? "Processing..." : "Approve"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalApprovalModal;
