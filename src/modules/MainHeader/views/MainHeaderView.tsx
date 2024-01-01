"use client";

import React, { memo } from "react";
import PropTypes from "prop-types";

import ConnectWalletBtnComponent from "@dex/components/ConnectWalletBtn/ConnectWalletBtnComponent";

import styles from "./styles.module.scss";

type Props = {
  walletAddress?: string;
  isConnected: boolean;
  onClick: () => void;
};

export const MainHeaderView: React.FC<Props> = memo<Props>(
  ({ walletAddress, isConnected, onClick }) => {
    return (
      <div className={styles.mainHeaderRoot} id="top-rank">
        {/* <div className={styles.mainHeaderNavbar}>
                    <nav className={styles.mainHeaderNav}>
                        <li><a href='#'>Analyzer</a></li>
                        <li><a href='#'>Token Creator</a></li>
                        <li><a href='#'>API</a></li>
                        <li><a href='#'>Products</a></li>
                        <li><a href='#'>Docs</a></li>
                        <li><a href='#'>VIP</a></li>
                    </nav>
                </div> */}
      </div>
    );
  }
);

MainHeaderView.propTypes = {
  walletAddress: PropTypes.string,
  isConnected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

MainHeaderView.displayName = "MainHeaderView";
