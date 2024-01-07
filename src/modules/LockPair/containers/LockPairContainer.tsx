'use client'

import React, { useState } from 'react';

import { LockPairView } from "../views/LockPairView";
import { useWalletCommand } from "../commands/useWalletCommand";

const LockPairContainer = () => {
    const { walletAddress, connect, disconnect } = useWalletCommand();

    const handleClick = React.useCallback(async () => {
        if (walletAddress === undefined) {
            await connect();
        }
        else {
            disconnect();
        }
    }, [connect, walletAddress, disconnect]);
    return (
        <LockPairView
            isConnected={walletAddress !== undefined}
            walletAddress={walletAddress}
            onClick={handleClick}
        />
    )
}

export default LockPairContainer;