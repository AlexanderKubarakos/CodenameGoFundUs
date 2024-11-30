import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, Filter } from "lucide-react";
import FundCard from "./FundCard";

interface Fund {
  id: string;
  name: string;
  description: string;
  balance: string;
  contributors: number;
  approvalType: number;
  approvalProgress: number;
  isContributor: boolean;
  isOwner: boolean;
  pendingWithdrawals: number;
}

interface FundsListProps {
  funds?: Fund[];
  onWithdraw?: (fundId: string) => void;
  onContribute?: (fundId: string) => void;
  isLoading?: boolean;
  onApproveWithdrawal?: (fundId: string) => void;
}

let FundsList = ({
  funds=[],
  onWithdraw = (fundId) => console.log("Withdraw from fund:", fundId),
  onContribute = (fundId) => console.log("Contribute to fund:", fundId),
  onApproveWithdrawal = (fundId) =>
    console.log("Approve withdrawal for fund:", fundId),
  isLoading = false,
}: FundsListProps) => {
  const [filter, setFilter] = React.useState<"all" | "public" | "private">(
    "all",
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredFunds = React.useMemo(() => {
    return funds
      .filter((fund) =>
        fund.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
  }, [funds, filter, searchTerm]);

  console.log("Getting created ", funds.length);

  return (
    <div className="w-full min-h-[800px] bg-background p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search funds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFunds.map((fund) => (
          <FundCard
            key={fund.id}
            name={fund.name}
            description={fund.description}
            balance={fund.balance}
            contributors={fund.contributors}
            pendingWithdrawals={fund.pendingWithdrawals}
            approvalType={fund.approvalType}
            approvalProgress={fund.approvalProgress}
            isOwner={fund.isOwner}
            isContributor={fund.isContributor}
            onApproveWithdrawal={() => onApproveWithdrawal(fund.id)}
            onWithdraw={() => onWithdraw(fund.id)}
            onContribute={() => onContribute(fund.id)}
          />
        ))}
        
      </div>

      {filteredFunds.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p>No funds found</p>
        </div>
      )}
    </div>
  );
};

export default FundsList;
