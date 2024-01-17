"use client";

import React, { memo, useContext } from "react";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import SelectComponent from "@dex/components/Select/SelectComponent";
import DividerComponent from "@dex/components/Divider/DividerComponent";
import LabelComponent from "@dex/components/Label/LabelComponent";
import TextFieldComponent from "@dex/components/TextField/TextFieldComponent";
import RangeComponent from "@dex/components/Range/RangeComponent";
import RadioGroupComponent from "@dex/components/RadioGroup/RadioGroupComponent";
import AlertComponent from "@dex/components/Alert/AlertComponent";
import CheckBoxComponent from "@dex/components/CheckBox/CheckBoxComponent";
import ConnectWalletBtnComponent from "@dex/components/ConnectWalletBtn/ConnectWalletBtnComponent";

import { FormContext } from "@dex/contexts/Form";
import {
  validateTokenName,
  validateSymbol,
  validateAddress
} from "@dex/utils/validator";

import {
  networkTypeList,
  routerTypeList,
  daysWillLockedList,
  lpLockServiceList,
  antiBotList,
  antiBotOptionList,
  minFeeLimit,
  maxFeeLimit,
  tokenTypeList,
  ContractAddresses,
  ChainIds,
  lockTypeList
} from "@dex/constants/data";
import {
  buyFeeLimitExceed,
  sellFeeLimitExceed,
  totalFeeLimitExceed
} from "@dex/constants/message";

import styles from "./styles.module.scss";
import { Web3Context } from "@dex/contexts/Web3";

import pairABI from "@dex/Pair.json"
import WeLockIt from "@dex/WeLockIt.json"
import pairERC20ABI from "@dex/Pair(ERC20).json"
import { useToasts } from "react-toast-notifications";

import { FaArrowLeft, FaCalendar } from "react-icons/fa";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import Link from "next/link";
import Button from "@dex/components/Button/ButtonComponent";

type Props = {
  walletAddress?: string;
  isConnected: boolean;
  onClick: () => void;
};

export const LockLiquidityView: React.FC<Props> = memo<Props>(
  ({ walletAddress, isConnected, onClick }) => {
    const {
      pairAddress,
      setPairAddress,
      networkType,
      setNetworkType,
      pair,
      setPair,
      lpToken,
      setLpToken,
      lpTokenAddress,
      setLpTokenAddress,
      lpOwnerAddress,
      setLpOwnerAddress,
      lpTokenAmount,
      setLpTokenAmount,
      lpTokenRatio,
      setLpTokenRatio,
      lpTokenBalance,
      setLpTokenBalance,
      unlockDate,
      setUnlockDate,
      lockFee,
      setLockFee,
      lockDescription,
      setLockDescription,
      lockType,
      setLockType,
      tokenBalance,
      token
    } = useContext(FormContext);
    const { web3, chainId } = useContext(Web3Context);
    const { addToast } = useToasts();

    useEffect(() => {
      if(setLpTokenRatio && lockType == 0) {
        setLpTokenAmount((lpTokenBalance * lpTokenRatio) / 100)
      } else if(setLpTokenRatio && lockType == 1) {
        setLpTokenAmount((tokenBalance * lpTokenRatio) / 100)
      }

      const getLockFee = async () => {
        if(!web3) return;
        const locker = new web3.eth.Contract(
          WeLockIt.abi as any[],
          ContractAddresses[chainId][3]
        );
        console.log(ContractAddresses[chainId][3])
        try {
          const lockfee = await locker.methods.lockFee().call()
          console.log(lockfee)

          setLockFee(lockfee)
        } catch (error) {
          console.log(error)
        }
      }

      getLockFee()
    }, [
      lpTokenRatio,
      setLpTokenRatio,
      chainId, 
      lockType, 
      lpTokenBalance, 
      setLockFee, 
      setLpTokenAmount, 
      tokenBalance, 
      web3
    ]);

    const handleDate = () => {
      const date0 = Number(new Date().getTime()) / 1000
      const date1 = Number(unlockDate.getTime()) / 1000
      const timeInSecs = date1 - date0
      const timeInDays = timeInSecs / (60*60*24)
      console.log(date0, date1, timeInSecs, timeInDays)

      if(timeInSecs < 0) {
        return `${unlockDate.toDateString()}`
      } else {
        return `${unlockDate.toDateString()} - In ${timeInDays.toFixed(0)} days`
      }
    }

    const setMax = () => {
      setLpTokenRatio(100)
    }

    return (
    <div className={styles.lockLiquidityRoot}>
        <div className="tw-flex tw-justify-between tw-px-7 tw-py-4 tw-border-b tw-border-grey tw-items-center">
            <div className="tw-flex tw-items-center">
              <FaArrowLeft color="#06A95C" size={18} />
              <span className="tw-text-[#3C3F4A] tw-text-md tw-font-semi-bold tw-ml-1">
                <Link href={"/pair"}>Back</Link>
              </span>
            </div>
            <h5 className="tw-text-[#3C3F4A] tw-text-md tw-font-semi-bold">
              LOCK LIQUIDITY
            </h5>
            <ConnectWalletBtnComponent
              onClick={() => onClick()}
              isConnected={isConnected}
              walletAddress={walletAddress}
            />
        </div>
        <div className="tw-p-7">
            <DividerComponent value="LOCK DESCRIPTION" />
            <div className="tw-mb-6 tw-mt-10">
                <LabelComponent value="Description" required />
                <TextFieldComponent
                  value={lockDescription}
                  setValue={setLockDescription}
                  placeholder="Enter the address of the owner(unlocker) of the Lp token you would like to lock...."
                />
            </div>
            <DividerComponent value="LP TOKEN AMOUNT" />
            <div className="tw-mb-6 tw-mt-10 tw-flex tw-gap-5 tw-items-center">
              <div className="tw-w-full tw-flex-grow">
                <LabelComponent value="Lp Token Amount" required />
                <TextFieldComponent
                  value={lpTokenAmount}
                  setValue={setLpTokenAmount}
                  placeholder="Enter the amount of the Lp token you would like to lock...."
                />
              </div>
              {lockType == 0 && <div className="tw-w-full tw-flex-[20%] tw-pt-10">
                <span className="tw-text-[#3C3F4A] tw-text-xs">Balance: {lpTokenBalance}</span>
                <h5 className="tw-text-[#06A95C] tw-text-lg tw-font-semi-bold">{lpToken.length == 0 ? "-" : lpToken.split("+")[1]}</h5>
              </div>}
              {lockType == 1 && <div className="tw-w-full tw-flex-[20%] tw-pt-10">
                <span className="tw-text-[#3C3F4A] tw-text-xs">Balance: {tokenBalance}</span>
                <h5 className="tw-text-[#06A95C] tw-text-lg tw-font-semi-bold">{token.length == 0 ? "-" : token.split("+")[1]}</h5>
              </div>}
            </div>
            <div className="tw-mt-5 tw-mb-6 tw-flex tw-gap-5 tw-items-center">
              <div className="tw-w-full tw-flex-grow">
                <RangeComponent
                  value={lpTokenRatio}
                  setValue={setLpTokenRatio}
                  minValue={0}
                  maxValue={100}
                  step={10}
                  amount={0}
                />
              </div>
              <div className="tw-w-full tw-flex-[20%]">
                <Button 
                  onClick={setMax}
                  className="tw-p-2"
                >MAX</Button>
              </div>
            </div>
            <DividerComponent value="LP UNLOCK DATE" />
            <div className="tw-mb-6 tw-mt-10 tw-flex tw-gap-5 tw-items-center">
              <div className="tw-w-full tw-flex-grow">
                <LabelComponent value="Lp Unlock Date" required />
                <TextFieldComponent
                  readonly
                  value={handleDate()}
                  placeholder={handleDate()}
                />
              </div>
              <div className="tw-w-full tw-flex-[20%] tw-pt-10">
                <Datepicker
                  selected={unlockDate}
                  onChange={(date: Date) => setUnlockDate(date)}
                  showIcon
                />
              </div>
            </div>
            <div className="tw-flex tw-gap-2 tw-mt-5">
              <div className="tw-w-full tw-flex-grow tw-pt-10 tw-mr-[100px] tw-text-center">
                <LabelComponent
                  value=""
                  subValue="Once tokens are locked they cannot be withdrawn under any circumstances until the timer has expired."
                  required
                />
              </div>
              <div className="tw-w-full tw-flex-[32.6%]">
                <LabelComponent value="Lock Fee" />
                <TextFieldComponent
                  readonly
                  value={lockFee}
                  placeholder={lockFee.toString()}
                />
              </div>
            </div>
          {/* <AlertComponent
            title="ATTENTION!"
            content="ANTI-Bot features may show your token as Honeypot at some honeypot checker platform even if it is not. Run the RemoveLimits function after launch so your token will look ok on any platform."
          /> */}
        </div>
        <div className="tw-px-5 tw-py-4 tw-rounded-b-2xl tw-border-t tw-border-grey tw-text-greyD tw-bg-[#FAFAFA] tw-text-sm">
          <span>Socials </span>
          <a href="https://t.me/welaunchit" target="_blank">
            Telegram
          </a>
          <span> | </span>
          <a href="https://twitter.com/welaunchitorg" target="_blank">
            Twitter
          </a>
          <span> | </span>
          <a href="https://www.youtube.com/channel/UCu3j8Wf8OrsgrneWe2rlq5A" target="_blank">
            Youtube
          </a>
        </div>
      </div>
    );
  }
);

LockLiquidityView.propTypes = {
  walletAddress: PropTypes.string,
  isConnected: PropTypes.bool.isRequired,
};

LockLiquidityView.displayName = "LockLiquidityView";
