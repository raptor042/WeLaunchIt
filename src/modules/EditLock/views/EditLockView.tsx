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
  lockTypeList,
  ChainIds,
  EOUList
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
import ButtonComponent from "@dex/components/Button/ButtonComponent";

import { FaArrowLeft, FaCalendar } from "react-icons/fa";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import Link from "next/link";

type Props = {
  walletAddress?: string;
  isConnected: boolean;
  onClick: () => void;
};

export const EditLockView: React.FC<Props> = memo<Props>(
  ({ walletAddress, isConnected, onClick }) => {
    const {
      lockId,
      setLockId,
      newLockAmount,
      setNewLockAmount,
      newUnlockDate,
      setNewUnlockDate,
      EOU,
      setEOU,
    } = useContext(FormContext);
    const { web3, chainId } = useContext(Web3Context);
    const { addToast } = useToasts();

    const handleDate = () => {
      const date0 = new Date().getTime()
      const date1 = newUnlockDate.getTime()
      const timeInMilliSecs = date1 - date0
      const timeInDays = timeInMilliSecs / (1000*60*60*24)
      console.log(date0, date1, timeInMilliSecs, timeInDays)

      if(timeInMilliSecs < 0) {
        return `${newUnlockDate.toDateString()}`
      } else {
        return `${newUnlockDate.toDateString()} - In ${timeInDays.toFixed(0)} days`
      }
    }

    return (
    <div className={styles.editLockRoot}>
        <div className="tw-flex tw-justify-between tw-px-7 tw-py-4 tw-border-b tw-border-grey tw-items-center">
            <h5 className="tw-text-[#3C3F4A] tw-text-md tw-font-semi-bold">
              {EOU == 0 ? "EDIT LOCK" : "UNLOCK"}
            </h5>
            <ConnectWalletBtnComponent
              onClick={() => onClick()}
              isConnected={isConnected}
              walletAddress={walletAddress}
            />
        </div>
        <div className="tw-p-7">
          <div className="tw-mb-6 tw-mt-10">
            <LabelComponent value="Edit/Withdraw" />
            <SelectComponent
              value={EOU.toString()}
              setValue={setEOU}
              options={EOUList}
            />
          </div>
            <DividerComponent value="LOCK ID" />
            <div className="tw-mb-6 tw-mt-10">
                <LabelComponent value="Lock ID" required />
                <TextFieldComponent
                  value={lockId}
                  setValue={setLockId}
                  placeholder="Enter a Lock ID...."
                />
            </div>
            {EOU == 0 && <>
              <DividerComponent value="LOCK AMOUNT" />
              <div className="tw-mb-6 tw-mt-10">
                  <LabelComponent value="New Lock Amount" required />
                  <TextFieldComponent
                    value={newLockAmount}
                    setValue={setNewLockAmount}
                    placeholder="Enter a new Lock amount...."
                  />
              </div>
            </>}
            {EOU == 0 && <>
              <DividerComponent value="UNLOCK DATE" />
              <div className="tw-mb-6 tw-mt-10 tw-flex tw-gap-5 tw-items-center">
                <div className="tw-w-full tw-flex-grow">
                  <LabelComponent value="New Unlock Date" required />
                  <TextFieldComponent
                    readonly
                    value={handleDate()}
                    placeholder={handleDate()}
                  />
                </div>
                <div className="tw-w-full tw-flex-[20%] tw-pt-10">
                  <Datepicker
                    selected={newUnlockDate}
                    onChange={(date: Date) => setNewUnlockDate(date)}
                    showIcon
                  />
                </div>
              </div>
            </>}
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

EditLockView.propTypes = {
  walletAddress: PropTypes.string,
  isConnected: PropTypes.bool.isRequired,
};

EditLockView.displayName = "EditLockView";
