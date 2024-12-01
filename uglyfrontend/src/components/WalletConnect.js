import React from "react";
import { Wallet, WalletCards } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";

const WalletConnect = ({ isConnected = false, onConnect = () => { console.log("Connect wallet"); }, onDisconnect = () => console.log("Disconnect wallet") }) => {
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
    <div
      className={`w-full h-full ${
        address || isConnected ? "absolute top-0 right-0 mt-4 mr-4" : "flex justify-center items-center"
      }`}
    >
      <button
        className={`${
          isConnected || address ? "bg-gray-200 text-gray-800 border-gray-400" : "bg-blue-600 text-white"
        } flex items-center gap-2 w-[180px] h-[40px] px-4 py-2 rounded-md border-2 shadow-md transition-colors duration-200 ease-in-out hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400`}
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
      </button>
    </div>
  );
};

export default WalletConnect;