import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight } from "lucide-react";

interface WithdrawalFormProps {
  fundName?: string;
  balance?: string;
  onSubmit?: (data: WithdrawalFormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface WithdrawalFormData {
  amount: string;
  reason: string;
  destinationAddress: string;
}

const WithdrawalForm = ({
  fundName = "Example Fund",
  balance = "0.00 ETH",
  onSubmit = (data) => console.log("Form submitted:", data),
  onCancel = () => console.log("Form cancelled"),
  isLoading = false,
}: WithdrawalFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WithdrawalFormData>({
    defaultValues: {
      amount: "",
      reason: "",
      destinationAddress: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-background w-[440px] space-y-6 p-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Fund</Label>
            <span className="text-sm text-muted-foreground">{fundName}</span>
          </div>
          <div className="flex justify-between items-center">
            <Label>Available Balance</Label>
            <span className="text-lg font-semibold">{balance}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Withdrawal Amount</Label>
          <div className="relative">
            <Input
              id="amount"
              type="text"
              placeholder="0.00"
              {...register("amount")}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ETH
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destinationAddress">Destination Address</Label>
          <Input
            id="destinationAddress"
            placeholder="0x..."
            {...register("destinationAddress")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Withdrawal</Label>
          <Textarea
            id="reason"
            placeholder="Explain the purpose of this withdrawal..."
            className="resize-none h-24"
            {...register("reason")}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <ArrowUpRight className="h-4 w-4" />
          {isLoading ? "Requesting..." : "Request Withdrawal"}
        </Button>
      </div>
    </form>
  );
};

export default WithdrawalForm;
