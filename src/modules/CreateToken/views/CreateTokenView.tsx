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
  tokenTypeList
} from "@dex/constants/data";
import {
  buyFeeLimitExceed,
  sellFeeLimitExceed,
  totalFeeLimitExceed
} from "@dex/constants/message";

import styles from "./styles.module.scss";

type Props = {
  walletAddress?: string;
  isConnected: boolean;
  onClick: () => void;
};

export const CreateTokenView: React.FC<Props> = memo<Props>(
  ({ walletAddress, isConnected, onClick }) => {
    const {
      tokenName,
      setTokenName,
      symbol,
      setSymbol,
      totalSupply,
      setTotalSupply,
      ownerAddress,
      setOwnerAddress,
      ownerWallet,
      setOwnerWallet,
      liquidityFee,
      setLiquidityFee,
      taxFee,
      setTaxFee,
      maxTxAmount,
      setMaxTxAmount,
      sellMaxAmount,
      setSellMaxAmount,
      marketingFee,
      setMarketingFee,
      devFee,
      setDevFee,
      lpFee,
      setLpFee,
      reflectionFee,
      setReflectionFee,
      rewardToken,
      setRewardToken,
      buyMarketingFee,
      setBuyMarketingFee,
      buyDevFee,
      setBuyDevFee,
      buyLpFee,
      setBuyLpFee,
      buyFee,
      setBuyFee,
      buyFeeWarn,
      setBuyFeeWarn,
      sellMarketingFee,
      setSellMarketingFee,
      sellDevFee,
      setSellDevFee,
      sellLpFee,
      setSellLpFee,
      sellFee,
      setSellFee,
      sellFeeWarn,
      setSellFeeWarn,
      totalFeeWarn,
      setTotalFeeWarn,
      marketingWallet,
      setMarketingWallet,
      devWallet,
      setDevWallet,
      maxTransAmount,
      setMaxTransAmount,
      maxWalletAmount,
      setMaxWalletAmount,
      networkType,
      setNetworkType,
      tokenType,
      setTokenType
    } = useContext(FormContext);

    useEffect(() => {
      if (tokenType == 1) {
        const buyFee = Number(
          (buyMarketingFee + buyDevFee + buyLpFee).toFixed(6)
        );
        const sellFee = Number(
          (sellMarketingFee + sellDevFee + sellLpFee).toFixed(6)
        );
        if (buyFee + sellFee > 30) setTotalFeeWarn(totalFeeLimitExceed);
        else setTotalFeeWarn("");
        if (buyFee > 15) setBuyFeeWarn(buyFeeLimitExceed);
        else setBuyFeeWarn("");
        if (sellFee > 15) setSellFeeWarn(sellFeeLimitExceed);
        else setSellFeeWarn("");
        setBuyFee(buyFee);
        setSellFee(sellFee);
      } else if (tokenType == 2) {
        const totalFee = Number(
          (marketingFee + devFee + lpFee + reflectionFee).toFixed(6)
        );
        if (totalFee > 30) setTotalFeeWarn(totalFeeLimitExceed);
      } else if (tokenType == 3) {
        const totalFee = Number(
          (liquidityFee + taxFee).toFixed(6)
        );
        if (totalFee > 30) setTotalFeeWarn(totalFeeLimitExceed);
      }
    }, [
      buyMarketingFee,
      buyDevFee,
      buyLpFee,
      sellMarketingFee,
      sellDevFee,
      sellLpFee,
      setTotalFeeWarn,
      setBuyFeeWarn,
      setSellFeeWarn,
      setBuyFee,
      setSellFee
    ]);

    return (
      <div className={styles.createTokenRoot}>
        <div className="tw-flex tw-justify-between tw-px-7 tw-py-4 tw-border-b tw-border-grey tw-items-center">
          <h5 className="tw-text-[#3C3F4A] tw-text-md tw-font-semi-bold">
            CREATE TOKEN
          </h5>
          <ConnectWalletBtnComponent
            onClick={() => onClick()}
            isConnected={isConnected}
            walletAddress={walletAddress}
          />
        </div>
        <div className="tw-p-7">
        <div className="tw-mb-6">
            <LabelComponent value="Contract" />
            <SelectComponent
              value={tokenType.toString()}
              setValue={setTokenType}
              options={tokenTypeList}
            />
          </div>
          <DividerComponent value="NETWORK INFORMATION" />
          <div className="tw-mb-6 tw-mt-10">
            <LabelComponent value="Network" />
            <SelectComponent
              value={networkType.toString()}
              setValue={setNetworkType}
              options={networkTypeList}
            />
          </div>
          <DividerComponent value="TOKEN INFORMATION" />
          <div className="tw-flex tw-gap-2 tw-mt-10 tw-mb-8">
            <div className="tw-w-full tw-flex-grow">
              <LabelComponent value="Name" required={true} />
              <TextFieldComponent
                value={tokenName}
                setValue={setTokenName}
                validator={validateTokenName}
                placeholder="Token Name (BINANCE Coin)"
              />
            </div>
            <div className="tw-w-full tw-flex-[60%]">
              <LabelComponent value="Symbol" required={true} />
              <TextFieldComponent
                value={symbol}
                setValue={setSymbol}
                validator={validateSymbol}
                placeholder="Token Symbol (BNB)"
              />
            </div>
            <div className="tw-w-full tw-flex-[60%]">
              <LabelComponent value="Totalsupply" required={true} />
              <TextFieldComponent
                value={totalSupply}
                setValue={setTotalSupply}
                number
                step={1}
                min={1000}
                max={Number.MAX_SAFE_INTEGER}
                placeholder="Min 1000"
              />
            </div>
          </div>

          <DividerComponent value="WALLET INFORMATION" />
          <div className="tw-flex tw-gap-2 tw-mt-12 tw-mb-6">
            {tokenType == 1 && <div className="tw-w-full">
              <LabelComponent value="Marketing wallet" required={true} />
              <TextFieldComponent
                value={marketingWallet}
                setValue={setMarketingWallet}
                placeholder="0x..."
                validator={validateAddress}
              />
            </div>}
            {tokenType != 3 && <div className="tw-w-full">
              <LabelComponent value="Dev wallet" required={true} />
              <TextFieldComponent
                value={devWallet}
                setValue={setDevWallet}
                placeholder="0x..."
                validator={validateAddress}
              />
            </div>}
            {tokenType == 3 && <div className="tw-w-full">
              <LabelComponent value="Owner Wallet" required={true} />
              <TextFieldComponent
                value={ownerWallet}
                setValue={setOwnerWallet}
                placeholder="0x..."
                validator={validateAddress}
              />
            </div>}
          </div>

          {tokenType == 2 && <>
            <DividerComponent value="REWARD TOKEN" />
            <div className="tw-flex tw-gap-2 tw-mt-12 tw-mb-6">
              <div className="tw-w-full">
                <LabelComponent value="Reward Token Contract Address" required={true} />
                <TextFieldComponent
                  value={rewardToken}
                  setValue={setRewardToken}
                  placeholder="0x..."
                  validator={validateAddress}
                />
              </div>
            </div>
          </>}

          <DividerComponent value="TAX CONFIGS" />
          <div className="tw-mt-10 tw-mb-12">
            {tokenType == 1 && <div className="tw-flex tw-gap-2 tw-mb-2">
              <div className="tw-w-full">
                <LabelComponent value="Marketing Buy Fee" required />
                <TextFieldComponent
                  number
                  step={0.1}
                  value={buyMarketingFee}
                  setValue={setBuyMarketingFee}
                  min={minFeeLimit}
                  max={maxFeeLimit}
                  placeholder="0 - 15%"
                />
              </div>
              <div className="tw-w-full">
                <LabelComponent value="Dev Buy Fee" required />
                <TextFieldComponent
                  number
                  step={0.1}
                  value={buyDevFee}
                  setValue={setBuyDevFee}
                  min={minFeeLimit}
                  max={maxFeeLimit}
                  placeholder="0 - 15%"
                />
              </div>
              <div className="tw-w-full">
                <LabelComponent value="Lp Buy Fee" required />
                <TextFieldComponent
                  number
                  step={0.1}
                  value={buyLpFee}
                  setValue={setBuyLpFee}
                  min={minFeeLimit}
                  max={maxFeeLimit}
                  placeholder="0 - 15%"
                />
              </div>
              <div className="tw-w-full">
                <LabelComponent value="Buy Fee" />
                <TextFieldComponent
                  readonly
                  warned={buyFeeWarn.length > 0}
                  message={buyFeeWarn}
                  value={buyFee}
                  placeholder="0 - 15%"
                />
              </div>
            </div>}
            {tokenType == 1 && <div className="tw-flex tw-gap-2 tw-mb-2">
              <div className="tw-w-full">
                <LabelComponent value="Marketing Sell Fee" required />
                <TextFieldComponent
                  number
                  step={0.1}
                  value={sellMarketingFee}
                  setValue={setSellMarketingFee}
                  min={minFeeLimit}
                  max={maxFeeLimit}
                  placeholder="0 - 15%"
                />
              </div>
              <div className="tw-w-full">
                <LabelComponent value="Dev Sell Fee" required />
                <TextFieldComponent
                  number
                  step={0.1}
                  value={sellDevFee}
                  setValue={setSellDevFee}
                  min={minFeeLimit}
                  max={maxFeeLimit}
                  placeholder="0 - 15%"
                />
              </div>
              <div className="tw-w-full">
                <LabelComponent value="Lp Sell Fee" required />
                <TextFieldComponent
                  number
                  step={0.1}
                  value={sellLpFee}
                  setValue={setSellLpFee}
                  min={minFeeLimit}
                  max={maxFeeLimit}
                  placeholder="0 - 15%"
                />
              </div>
              <div className="tw-w-full">
                <LabelComponent value="Sell Fee" />
                <TextFieldComponent
                  readonly
                  warned={sellFeeWarn.length > 0}
                  message={sellFeeWarn}
                  value={sellFee}
                  placeholder="0 - 15%"
                />
              </div>
            </div>}
            {tokenType == 2 && <div className="tw-flex tw-gap-2 tw-mb-2">
              <div className="tw-w-full">
                <LabelComponent value="Marketing Fee" required />
                <TextFieldComponent
                  number
                  step={0.1}
                  value={marketingFee}
                  setValue={setMarketingFee}
                  min={minFeeLimit}
                  max={maxFeeLimit}
                  placeholder="0 - 15%"
                />
              </div>
              <div className="tw-w-full">
                <LabelComponent value="Dev Fee" required />
                <TextFieldComponent
                  number
                  step={0.1}
                  value={devFee}
                  setValue={setDevFee}
                  min={minFeeLimit}
                  max={maxFeeLimit}
                  placeholder="0 - 15%"
                />
              </div>
              <div className="tw-w-full">
                <LabelComponent value="Lp Fee" required />
                <TextFieldComponent
                  number
                  step={0.1}
                  value={lpFee}
                  setValue={setLpFee}
                  min={minFeeLimit}
                  max={maxFeeLimit}
                  placeholder="0 - 15%"
                />
              </div>
              <div className="tw-w-full">
                <LabelComponent value="Reflection Fee" required />
                <TextFieldComponent
                  number
                  step={0.1}
                  value={reflectionFee}
                  setValue={setReflectionFee}
                  min={minFeeLimit}
                  max={maxFeeLimit}
                  placeholder="0 - 15%"
                />
              </div>
            </div>}
            {tokenType == 3 && <div className="tw-flex tw-gap-2 tw-mb-2">
              <div className="tw-w-full">
                <LabelComponent value="Tax Fee" required />
                <TextFieldComponent
                  number
                  step={0.1}
                  value={taxFee}
                  setValue={setTaxFee}
                  min={minFeeLimit}
                  max={maxFeeLimit}
                  placeholder="0 - 15%"
                />
              </div>
              <div className="tw-w-full">
                <LabelComponent value="Liquidity Fee" required />
                <TextFieldComponent
                  number
                  step={0.1}
                  value={liquidityFee}
                  setValue={setLiquidityFee}
                  min={minFeeLimit}
                  max={maxFeeLimit}
                  placeholder="0 - 15%"
                />
              </div>
            </div>}
            {tokenType == 1 && <div className="tw-flex tw-gap-2 tw-mt-5">
              <div className="tw-w-full tw-flex-grow tw-pt-10 tw-mr-[100px] tw-text-right">
                <LabelComponent
                  value=""
                  subValue="Buy Fee + Sell Fee amount must be between 0 - 30"
                  required
                />
              </div>
              <div className="tw-w-full tw-flex-[32.6%]">
                <LabelComponent value="Total Fee" />
                <TextFieldComponent
                  readonly
                  warned={totalFeeWarn.length > 0}
                  message={totalFeeWarn}
                  value={buyFee + sellFee}
                  placeholder="0 - 30%"
                />
              </div>
            </div>}
            {tokenType == 2 && <div className="tw-flex tw-gap-2 tw-mt-5">
              <div className="tw-w-full tw-flex-grow tw-pt-10 tw-mr-[100px] tw-text-right">
                <LabelComponent
                  value=""
                  subValue="Total Fee amount must be between 0 - 30"
                  required
                />
              </div>
              <div className="tw-w-full tw-flex-[32.6%]">
                <LabelComponent value="Total Fee" />
                <TextFieldComponent
                  readonly
                  warned={totalFeeWarn.length > 0}
                  message={totalFeeWarn}
                  value={marketingFee + devFee + lpFee + reflectionFee}
                  placeholder="0 - 30%"
                />
              </div>
            </div>}
            {tokenType == 3 && <div className="tw-flex tw-gap-2 tw-mt-5">
              <div className="tw-w-full tw-flex-grow tw-pt-10 tw-mr-[100px] tw-text-right">
                <LabelComponent
                  value=""
                  subValue="Total Fee amount must be between 0 - 30"
                  required
                />
              </div>
              <div className="tw-w-full tw-flex-[32.6%]">
                <LabelComponent value="Total Fee" />
                <TextFieldComponent
                  readonly
                  warned={totalFeeWarn.length > 0}
                  message={totalFeeWarn}
                  value={taxFee + liquidityFee}
                  placeholder="0 - 30%"
                />
              </div>
            </div>}
          </div>
          {tokenType == 1 && <>
            <DividerComponent value="TOKEN CONFIGS" />
            <div className="tw-mt-20">
              <LabelComponent value="Max Transaction Amount" required={true} />
              <RangeComponent
                value={maxTransAmount}
                setValue={setMaxTransAmount}
                minValue={0.5}
                maxValue={100}
                step={0.1}
                amount={0}
              />
            </div>
            <div className="tw-mt-2 tw-mb-4">
              <LabelComponent value="Max Wallet Amount" required={true} />
              <RangeComponent
                value={maxWalletAmount}
                setValue={setMaxWalletAmount}
                minValue={0.5}
                maxValue={100}
                step={0.1}
                amount={0}
              />
            </div>
          </>}
          {tokenType == 3 && <>
            <DividerComponent value="TOKEN CONFIGS" />
            <div className="tw-mt-20">
              <LabelComponent value="Max Transaction Amount" required={true} />
              <RangeComponent
                value={maxTxAmount}
                setValue={setMaxTxAmount}
                minValue={0.5}
                maxValue={100}
                step={0.1}
                amount={0}
              />
            </div>
            <div className="tw-mt-2 tw-mb-4">
              <LabelComponent value="Max Sell Amount" required={true} />
              <RangeComponent
                value={sellMaxAmount}
                setValue={setSellMaxAmount}
                minValue={0.5}
                maxValue={100}
                step={0.1}
                amount={0}
              />
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

CreateTokenView.propTypes = {
  walletAddress: PropTypes.string,
  isConnected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

CreateTokenView.displayName = "CreateTokenView";
