import { useEffect, useState } from "react";
import Head from "next/head";
import clsx from "clsx";
import { telegramMark } from "@dex/constants/svg_icons";

import MainHeaderContainer from "@dex/modules/MainHeader/containers/MainHeaderContainer";
import CreateTokenContainer from "@dex/modules/CreateToken/containers/CreateTokenContainer";
import TaxContractContainer from "@dex/modules/TaxContract/containers/TaxContractContainer";
import FooterContainer from "@dex/modules/Footer/FooterContainer/FooterContainer";

import styles from "./page.module.scss";

export default function DashboardPage() {
  return (
    <>
      <div className={styles.root}>
        <div className={styles.topText}>
          <span className="tw-font-bold">We Launch It:</span>&nbsp;
          <span>Launch your BEP20 or ERC20 token for free.</span>&nbsp;
          <span>
            <a href="https://youtu.be/DKQtjzMgG2k" className="tw-font-semi-bold">
              Click here
            </a>{" "}
            to watch our tutorial on how you can launch a BEP20 or ERC20 token
            for free.<br></br>
            <span className="tw-font-bold">Partnership:</span>&nbsp; Make A Crypto Website For Free With <a href="https://t.me/WebsiteAIBot" className="tw-font-semi-bold">WebsiteAIBot</a>{" "}
          </span>
        </div>
        <div className={styles.mainRoot}>
          <div className="tw-w-full tw-flex-grow">
            <CreateTokenContainer />
          </div>
          <div className="md:tw-w-full md:tw-flex-[60%]">
            <TaxContractContainer />
          </div>
          {/* <div className={styles.telegram}>
            <a href="https://t.me/welaunchit" target="blank">
              {telegramMark}
            </a>
          </div> */}
        </div>
        <FooterContainer />
      </div>
    </>
  );
}
