'use client'

import React, { useState } from 'react';

import { CreateTokenView } from "../views/CreateTokenView";
import { useWalletCommand } from "../commands/useWalletCommand";

const CreateTokenContainer = () => {
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
        <CreateTokenView
            isConnected={walletAddress !== undefined}
            walletAddress={walletAddress}
            onClick={handleClick}
        />
    )
}

export default CreateTokenContainer;