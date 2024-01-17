'use client'

import React, { useState } from 'react';

import { EditLockView } from "../views/EditLockView";
import { useWalletCommand } from "../commands/useWalletCommand";

const EditLockContainer = () => {
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
        <EditLockView
            isConnected={walletAddress !== undefined}
            walletAddress={walletAddress}
            onClick={handleClick}
        />
    )
}

export default EditLockContainer;