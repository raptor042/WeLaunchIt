'use client'

import React, { useState } from 'react';

import { EditTokenView } from "../views/EditTokenView";
import { useWalletCommand } from "../commands/useWalletCommand";

const EditTokenContainer = () => {
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
        <EditTokenView
            isConnected={walletAddress !== undefined}
            walletAddress={walletAddress}
            onClick={handleClick}
        />
    )
}

export default EditTokenContainer;