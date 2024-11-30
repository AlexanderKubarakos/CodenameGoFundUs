import React from "react";
import WalletConnect from "./WalletConnect";
import { Coins } from "lucide-react";
import { braavos } from "@starknet-react/core";
interface HeaderProps {
  isWalletConnected?: boolean;
  walletAddress?: string;
  onWalletConnect?: () => void;
  onWalletDisconnect?: () => void;
}

const Header = ({
  isWalletConnected = false,
  walletAddress = "0x1234...5678888", // Actual displayed shit
  onWalletConnect = () => console.log("Connect wallet"),
  onWalletDisconnect = () => console.log("Disconnect wallet"),
}: HeaderProps) => {
  return (
    <header className="w-full h-20 bg-background border-b border-border px-6 flex items-center justify-between fixed top-0 left-0 z-50">
      <div className="flex items-center gap-2">
        <Coins className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold text-primary">Crypto Funds</h1>
      </div>

      <div className="flex items-center gap-4">
        <WalletConnect
          isConnected={isWalletConnected}
          walletAddress={walletAddress}
          onConnect={onWalletConnect}
          onDisconnect={onWalletDisconnect}
        />
      </div>
    </header>
  );
};

export default Header;
