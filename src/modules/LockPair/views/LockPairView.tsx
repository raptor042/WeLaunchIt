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
import { Web3Context } from "@dex/contexts/Web3";

import pairABI from "@dex/Pair.json"
import pairERC20ABI from "@dex/Pair(ERC20).json"
import { useToasts } from "react-toast-notifications";
import ButtonComponent from "@dex/components/Button/ButtonComponent";
import { useRouter } from "next/router";
import { Audio } from "react-loader-spinner";

type Props = {
  walletAddress?: string;
  isConnected: boolean;
  onClick: () => void;
};

export const LockPairView: React.FC<Props> = memo<Props>(
  ({ walletAddress, isConnected, onClick }) => {
    const {
      pairAddress,
      setPairAddress,
      networkType,
      setNetworkType,
      pair,
      setPair,
      setLpToken,
      setLpTokenAddress,
      setLpTokenBalance
    } = useContext(FormContext);
    const { web3 } = useContext(Web3Context);
    const { addToast } = useToasts();
    const [loader, setLoader] = useState(false)

    const router = useRouter()

    useEffect(() => {
        console.log(validateAddress(pairAddress))
        if(validateAddress(pairAddress)) {
          setLoader(true)
            const getPair = async () => {
                if (!web3) return;
                const pair = new web3.eth.Contract(
                    pairABI.abi as any[],
                    pairAddress
                );
                try {
                    const token0 = await pair.methods.token0().call()
                    const token1 = await pair.methods.token1().call()
                    console.log(token0, token1)

                    const tokenA = new web3.eth.Contract(
                    pairERC20ABI.abi as any[],
                    token0
                    );
                    const tokenB = new web3.eth.Contract(
                    pairERC20ABI.abi as any[],
                    token1
                    );

                    const symbol0 = await tokenA.methods.symbol().call()
                    const symbol1 = await tokenB.methods.symbol().call()
                    console.log(symbol0, symbol1)

                    setPair(`${symbol0}/${symbol1} - ${pairAddress.slice(0, 4) + "..." + pairAddress.slice(-3)}`)
                    setLoader(false)

                    const pairSlug = `${symbol0}/${symbol1} - ${pairAddress.slice(0, 4) + "..." + pairAddress.slice(-3)} + `
                    const pairs = localStorage?.getItem("pairs")
                    if(pairs) {
                      const pair_ = pairs.split("+").filter(pair => pair.split("-")[0] == pairSlug.split("-")[0])
                      if(pair_.length > 0) {
                        return;
                      } else {
                        const _pairs = localStorage.setItem("pairs", `${pairs + pairSlug}`)
                      }
                    } else {
                      const _pairs = localStorage.setItem("pairs", pairSlug)
                    }
                } catch (getPairError: any) {
                    console.log(getPairError)
                    addToast("An error occured while trying to retrieve pair info!", { appearance: "error" });
                }
            }
            getPair()

            const getToken = async () => {
              if(!web3) return;
              const token = new web3.eth.Contract(
                pairERC20ABI.abi as any[],
                pairAddress
              );
              try {
                const name = await token.methods.name().call()
                const symbol = await token.methods.symbol().call()
                const balanceOf = await token.methods.balanceOf(walletAddress).call()
                console.log(name, symbol, balanceOf, walletAddress)
        
                setLpToken(`${name}+${symbol}`)
                setLpTokenBalance(Number(balanceOf))
                setLpTokenAddress(pairAddress)
              } catch (error) {
                console.log(error)
                addToast("An error occured while trying to retrieve LP token data.")
              }
            }

            getToken()
        }
    }, [
      pairAddress,
      setPairAddress
    ]);

    const handleClick = () => {
      router.push("/lock")
    }

    return (
    <div className={styles.lockPairRoot}>
        <div className="tw-flex tw-justify-between tw-px-7 tw-py-4 tw-border-b tw-border-grey tw-items-center">
            <h5 className="tw-text-[#3C3F4A] tw-text-md tw-font-semi-bold">
                LP LOCKER
            </h5>
            <ConnectWalletBtnComponent
                onClick={() => onClick()}
                isConnected={isConnected}
                walletAddress={walletAddress}
            />
        </div>
        <div className="tw-p-7">
            <DividerComponent value="NETWORK INFORMATION" />
            <div className="tw-mb-6 tw-mt-10">
                <LabelComponent value="Network" />
                <SelectComponent
                    value={networkType.toString()}
                    setValue={setNetworkType}
                    options={networkTypeList}
                />
            </div>
            <DividerComponent value="PAIR ADDRESS" />
            <div className="tw-mb-6 tw-mt-10 tw-flex tw-items-center tw-gap-5">
                <div className="tw-w-full tw-flex-grow">
                    <LabelComponent value="Pair Address" required={true} />
                    <TextFieldComponent
                        value={pairAddress}
                        setValue={setPairAddress}
                        placeholder="Enter the pair address you would like to lock liquidity for...."
                        validator={validateAddress}
                    />
                </div>
                {loader && pairAddress.length > 0 && <div className="tw-w-full tw-flex-[20%] tw-pt-10">
                  <Audio
                    height={24}
                    width={24}
                    color="#06A95C"
                    ariaLabel="loading"
                  />
                </div>}
            </div>
            {pair.length > 0 && pairAddress.length > 0 && <>
              <DividerComponent value="PAIR INFORMATION" />
              <div className="tw-mb-6 tw-mt-10 tw-flex tw-gap-5 tw-items-center">
                <div className="tw-w-full tw-flex-grow">
                  <LabelComponent value="Pair" required />
                  <TextFieldComponent
                    readonly
                    value={pair}
                    placeholder={pair}
                  />
                </div>
                <div className="tw-w-full tw-flex-[20%] tw-pt-10">
                <ButtonComponent 
                  children={"Continue"}
                  onClick={handleClick}
                  className="tw-p-2"
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

LockPairView.propTypes = {
  walletAddress: PropTypes.string,
  isConnected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

LockPairView.displayName = "LockPairView";
