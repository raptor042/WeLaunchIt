import React, { memo } from "react";
import PropTypes from "prop-types";

import Button from "@dex/components/Button/ButtonComponent";

import styles from "./styles.module.scss";

type Props = {
  isConnected: boolean;
  walletAddress?: string;
  onClick: () => void;
};

const ConnectWalletBtnComponent: React.FC<Props> = memo<Props>(
  ({ isConnected, walletAddress, onClick }) => (
    <Button className={styles.connectWalletBtnRoot} onClick={() => onClick()}>
      {isConnected && walletAddress
        ? `${walletAddress?.slice(0, 4)}...${walletAddress?.slice(-3)}`
        : "Connect Wallet"}
    </Button>
  )
);

ConnectWalletBtnComponent.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  walletAddress: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

ConnectWalletBtnComponent.displayName = "ConnectWalletBtnComponent";

export default ConnectWalletBtnComponent;
