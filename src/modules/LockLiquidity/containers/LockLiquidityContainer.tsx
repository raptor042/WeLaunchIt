'use client'

import React, { useState } from 'react';

import { LockLiquidityView } from "../views/LockLiquidityView";
import { useWalletCommand } from "../commands/useWalletCommand";

const LockLiquidityContainer = () => {
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
        <LockLiquidityView
            isConnected={walletAddress !== undefined}
            walletAddress={walletAddress}
            onClick={handleClick}
        />
    )
}

export default LockLiquidityContainer;