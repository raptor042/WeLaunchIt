'use client'

import React, { useState } from 'react';
import PropTypes from "prop-types";

import { LockInfoView } from "../views/LockInfoView";
import { useWalletCommand } from "../commands/useWalletCommand";

type Props = {
    address?: string;
};

const LockInfoContainer: React.FC<Props> = ({ address }) => {
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
        <LockInfoView
            isConnected={walletAddress !== undefined}
            walletAddress={walletAddress}
            address={address}
            onClick={handleClick}
        />
    )
}

LockInfoContainer.propTypes = {
    address: PropTypes.string
};

export default LockInfoContainer;