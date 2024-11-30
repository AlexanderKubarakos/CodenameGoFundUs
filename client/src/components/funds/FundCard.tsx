import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Lock, Unlock, Users } from "lucide-react";

interface FundCardProps {
  name?: string;
  description?: string;
  pendingWithdrawals?: number;
  balance?: string;
  isContributor?: boolean;
  contributors?: number;
  approvalType?: number;
  approvalProgress?: number;
  onWithdraw?: () => void;
  onContribute?: () => void;
  onApproveWithdrawal?: () => void;
  isOwner?: boolean;
}

const FundCard = ({
  name = "Example Fund",
  description = "A sample fund for demonstration purposes",
  balance = "0.00 ETH",
  pendingWithdrawals = 0,
  isContributor = false,
  contributors = 0,
  approvalType = 50,
  approvalProgress = 0,
  onWithdraw = () => console.log("Withdraw clicked"),
  onContribute = () => console.log("Contribute clicked"),
  isOwner = false,
  onApproveWithdrawal = () => console.log("Approve withdrawal clicked"),
}: FundCardProps) => {
  return (
    <Card className="w-[500px] h-[280px] bg-background hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className="text-lg font-semibold">{balance}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{contributors} contributors</span>
            </div>
            {pendingWithdrawals > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onApproveWithdrawal}
                disabled={!isContributor}
              >
                {pendingWithdrawals} pending
                {pendingWithdrawals === 1 ? " withdrawal" : " withdrawals"}
              </Button>
            )}
            <Badge variant="outline"> {approvalType}% approval needed</Badge>
          </div>
        </div>

        {isOwner && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Withdrawal approval</span>
              <span>{approvalProgress}%</span>
            </div>
            <Progress value={approvalProgress} className="h-2" />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        {isOwner ? (
          <Button
            className="w-full flex items-center gap-2"
            onClick={onWithdraw}
            variant="outline"
          >
            <ArrowUpRight className="h-4 w-4" />
            Request Withdrawal
          </Button>
        ) : (
          <Button className="w-full" onClick={onContribute}>
            Contribute
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FundCard;
