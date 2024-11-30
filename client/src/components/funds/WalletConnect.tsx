import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet, WalletCards } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";

interface WalletConnectProps {
  isConnected?: boolean;
  walletAddress?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

const WalletConnect = ({
  isConnected = false,
  onConnect = () => { console.log("Connect wallet") },
  onDisconnect = () => console.log("Disconnect wallet"),
}: WalletConnectProps) => {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    if (!address) {
      // Connect wallet if not connected
      connectors[0] && connect({ connector: connectors[0] }); // You can choose a specific connector
    }
  };

  const handleDisconnect = () => {
    if (address) {
      disconnect(); // Disconnect if connected
    }
  };

  return (
    <div className="w-full h-full">
      <Button
        variant={isConnected || address ? "outline" : "default"}
        className="flex items-center gap-2 w-[180px] h-[40px]"
        onClick={address ? handleDisconnect : handleConnect}
      >
        {address ? (
          <>
            <WalletCards className="h-4 w-4" />
            <span className="text-sm font-medium truncate">
              {address.substring(0, 5) + "..." + address.substring(address.length - 5)}
            </span>
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium">Connect Wallet</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default WalletConnect;