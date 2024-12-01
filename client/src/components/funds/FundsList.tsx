import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, Filter } from "lucide-react";
import FundCard from "./FundCard";
import { RpcProvider, Contract, cairo ,Account} from 'starknet';
import { Buffer } from "buffer";
import { useAccount, useContract, useProvider, useContractWrite } from '@starknet-react/core'
import React, { useEffect, useState, useMemo, useRef } from 'react'

// Constants

// Interfaces
interface Fund {
  id: string;
  name: string;
  description: string;
  balance: string;
  contributors: number;
  isPublic: boolean;
  approvalType: string;
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

// Utility function to convert string to Starknet felt


// Async function to interact with contract


const FundsList: React.FC<FundsListProps> = ({
  funds = [
    {
      id: "1",
      name: "Community Fund",
      description: "Supporting local initiatives and projects",
      balance: "2.5 ETH",
      contributors: 12,
      isPublic: true,
      pendingWithdrawals: 2,
      approvalType: "51%",
      approvalProgress: 30,
      isOwner: true,
      isContributor: true,
    },
    {
      id: "2",
      name: "Tech Startup Fund",
      description: "Funding innovative blockchain projects",
      balance: "5.0 ETH",
      contributors: 8,
      isPublic: true,
      pendingWithdrawals: 0,
      approvalType: "75%",
      approvalProgress: 0,
      isOwner: false,
      isContributor: false,
    },
    {
      id: "3",
      name: "Private Investment",
      description: "Exclusive investment opportunity",
      balance: "1.2 ETH",
      contributors: 3,
      isPublic: false,
      pendingWithdrawals: 1,
      approvalType: "0%",
      approvalProgress: 60,
      isOwner: true,
      isContributor: true,
    },
  ],
  onWithdraw = (fundId: string) => console.log("Withdraw from fund:", fundId),
  onContribute = async (fundId: string) => console.log("Contribute"),
  onApproveWithdrawal = (fundId: string) =>
    console.log("Approve withdrawal for fund:", fundId),
  isLoading = false,
}) => {
  
  // Memoized filtered funds
  const filteredFunds = useMemo(() => {
    return funds
      .filter((fund) => {
        if (filter === "public") return fund.isPublic;
        if (filter === "private") return !fund.isPublic;
        return true;
      })
      .filter((fund) =>
        fund.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [funds, filter, searchTerm]);
  
  return (
    <div className="w-full min-h-[800px] bg-background p-6 space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search funds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Radio Group */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Label>Filter:</Label>
          <RadioGroup
            defaultValue="all"
            value={filter}
            onValueChange={(value: "all" | "public" | "private") =>
              setFilter(value)
            }
            className="flex gap-4"
          >
            {/* Radio Group Options */}
            {["all", "public", "private"].map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={value} />
                <Label htmlFor={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Funds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFunds.map((fund) => (
          <FundCard
            key={fund.id}
            {...fund}
            onApproveWithdrawal={() => onApproveWithdrawal(fund.id)}
            onWithdraw={() => onWithdraw(fund.id)}
            onContribute={() => setStoredValue()}
          />
        ))}
      </div>

      {/* No Funds Found Message */}
      {filteredFunds.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p>No funds found</p>
        </div>
      )}
    </div>
  );
};

export default FundsList;