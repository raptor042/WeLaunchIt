"use client";

import React, { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useWalletCommand } from "../commands/useWalletCommand";
import { MainHeaderView } from "../views/MainHeaderView";

const MainHeaderContainer = () => {
  const { addToast } = useToasts();
  const { walletAddress, connect, disconnect } = useWalletCommand();

  const handleClick = React.useCallback(async () => {
    if (walletAddress === undefined) {
      await connect();
      addToast("Wallet Connected!", { appearance: "success" });
    } else {
      disconnect();
      addToast("Wallet Disconnected!", { appearance: "warning" });
    }
  }, [walletAddress, connect, addToast, disconnect]);

  return (
    <MainHeaderView
      isConnected={walletAddress !== undefined}
      walletAddress={walletAddress}
      onClick={handleClick}
    />
  );
};

export default MainHeaderContainer;
