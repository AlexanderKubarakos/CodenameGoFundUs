import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet, WalletCards } from "lucide-react";

interface WalletConnectProps {
  isConnected?: boolean;
  walletAddress?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

const WalletConnect = ({
  isConnected = false,
  walletAddress = "0x1234...56789999",
  onConnect = () => {console.log("Connect wallet")},
  onDisconnect = () => console.log("Disconnect wallet"),
}: WalletConnectProps) => {
  return (
    <div className="bg-background h-10 flex items-center">
      {isConnected ? (
        <Button
          variant="outline"
          className="flex items-center gap-2 w-[180px] h-[40px]"
          onClick={onDisconnect}
        >
          <WalletCards className="h-4 w-4" />
          <span className="text-sm font-medium truncate">{walletAddress}</span>
        </Button>
      ) : (
        <Button
          variant="default"
          className="flex items-center gap-2 w-[180px] h-[40px]"
          onClick={onConnect}
        >
          <Wallet className="h-4 w-4" />
          <span className="text-sm font-medium">Connect Wallet</span>
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
