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
  SwapRouters
} from "@dex/constants/data";
import {
  buyFeeLimitExceed,
  sellFeeLimitExceed,
  totalFeeLimitExceed
} from "@dex/constants/message";

import styles from "./styles.module.scss";
import { Lock, Web3Context } from "@dex/contexts/Web3";

import pairABI from "@dex/Pair.json"
import routerABI from "@dex/Router.json"
import WeLockIt from "@dex/WeLockIt.json"
import pairERC20ABI from "@dex/Pair(ERC20).json"
import { useToasts } from "react-toast-notifications";
import ButtonComponent from "@dex/components/Button/ButtonComponent";

import { FaArrowLeft, FaLock } from "react-icons/fa";
import { BsArrowUpRight } from "react-icons/bs";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  walletAddress?: string;
  isConnected: boolean;
  address?: string
  onClick: () => void;
};

export const LockInfoView: React.FC<Props> = memo<Props>(
  ({ walletAddress, isConnected, address, onClick }) => {
    const {

    } = useContext(FormContext);
    const { web3, chainId } = useContext(Web3Context);
    const { addToast } = useToasts();

    const [isLptoken, setIsLpToken] = useState(true)
    const [lockId, setLockId] = useState<number>()
    const [lockAmount, setLockAmount] = useState<string>()
    const [lockDescription, setLockDescription] = useState<string>()
    const [unlockDate, setUnlockDate] = useState<number>()
    const [cycle, setCycle] = useState<number>()
    const [data, setData] = useState(false)
    const [priceInUSD, setPriceInUSD] = useState()
    const [price, setPrice] = useState()
    const [base, setBase] = useState()
    const [quote, setQuote] = useState()
    const [liqBase, setLiqBase] = useState()
    const [liqQuote, setLiqQuote] = useState()
    const [liqUSD, setLiqUSD] = useState()
    const [supply, setSupply] = useState<string>()

    useEffect(() => {
      const getLockInfo = async () => {
        if(!web3) return;
        const locker = new web3.eth.Contract(
          WeLockIt.abi as any[],
          ContractAddresses[chainId][3]
        );
        try {
          const lpLocks = await locker.methods.lpLocksForUser(walletAddress).call()
          console.log(lpLocks)
          const normalLocks = await locker.methods.normalLocksForUser(walletAddress).call()
          console.log(normalLocks)
          const locks: Lock[] = lpLocks.concat(normalLocks)

          const lock: Lock = locks.filter(lock => lock.token == address)[0]
          console.log(lock)

          setLockId(lock.id)
          setLockAmount(web3.utils.fromWei(lock.amount.toString() as string, "ether"))
          setLockDescription(lock.description)
          setUnlockDate(lock.tgeDate)
          setCycle(lock.cycle)
        } catch (error) {
          console.log(error)
        }
      }
      getLockInfo()

      const lpTotalSupply = async () => {
        if(!web3) return;
        const token = new web3.eth.Contract(
          pairERC20ABI.abi as any[],
          address
        );
        try {
          const supply = await token.methods.totalSupply().call()
          console.log(web3.utils.fromWei(supply, "ether"))
          setSupply(Number(web3.utils.fromWei(supply, "ether")).toFixed(8))
        } catch (error) {
          console.log(error)
        }
      }
      lpTotalSupply()

      const getIsLpToken = async () => {
        if(!web3) return;
        const pair = new web3.eth.Contract(
          pairABI.abi as any[],
          address
        );
        try {
          const factory = await pair.methods.factory().call()
          console.log(factory)
          setIsLpToken(true)
        } catch (error) {
          console.log(error)
          setIsLpToken(false)
        }
      }
      getIsLpToken()

      const getPrice = async () => {
        try {
          const url = cycle == 0 ? `https://api.dexscreener.com/latest/dex/tokens/${address}` : `https://api.dexscreener.com/latest/dex/pairs/${chainId == 1 ? "ethereum" : "bsc"}/${address}`
          const response = await fetch(url)
          const data = await response.json()
          console.log(data)

          setData(true)
          setBase(data.pair.baseToken.symbol)
          setQuote(data.pair.quoteToken.symbol)
          setPrice(data.pair.priceNative)
          setPriceInUSD(data.pair.priceNative)
          setLiqBase(data.pair.liquidity.base)
          setLiqQuote(data.pair.liquidity.quote)
          setLiqUSD(data.pair.liquidity.usd)
        } catch (error) {
          console.log(error)
        }
      }
      if(lockId) {
        getPrice()
      }
    }, [
      address, 
      chainId, 
      cycle, 
      lockId, 
      walletAddress,
      web3
    ]);

    return (
    <div className={styles.lockLiquidityRoot}>
        <div className="tw-flex tw-justify-between tw-px-7 tw-py-4 tw-border-b tw-border-grey tw-items-center">
            <div className="tw-flex tw-items-center">
              <FaArrowLeft color="#06A95C" size={18} />
              <span className="tw-text-[#3C3F4A] tw-text-md tw-font-semi-bold tw-ml-1">
                <Link href={"/pair"}>Back</Link>
              </span>
            </div>
            {/* <h5 className="tw-text-[#3C3F4A] tw-text-md tw-font-semi-bold">
              {pair}
            </h5> */}
            <ConnectWalletBtnComponent
              onClick={() => onClick()}
              isConnected={isConnected}
              walletAddress={walletAddress}
            />
        </div>
        <div className="tw-p-7">
            <DividerComponent value="PAIR PRICE" />
            <div className="tw-mb-2 tw-mt-4 tw-flex tw-flex-col tw-justify-center tw-items-center">
              <h5 className="tw-text-[#3C3F4A] tw-text-lg">{data ? `1 ${base} = ${price} ${quote}` : "--"}</h5>
            </div>
            <DividerComponent value="LOCKED LIQUIDITY" />
            <div className="tw-mb-3 tw-mt-10 tw-grid tw-grid-cols-3 tw-gap-4">
              <div className="tw-w-full tw-flex tw-flex-col tw-items-start">
                <h2 className="tw-text-[#06A95C] tw-text-2xl tw-font-bold tw-mb-2">{data ? base : "--"}</h2>
                <span className="tw-text-[#3C3F4A] tw-text-md">{data ? liqBase : "--"}</span>
              </div>
              <div className="tw-w-full tw-flex tw-justify-center">
                <FaLock color="#3C3F4A" size={32} />
              </div>
              <div className="tw-w-full tw-flex tw-flex-col tw-items-end">
                <h2 className="tw-text-[#06A95C] tw-text-2xl tw-font-bold tw-mb-2">{data ? quote : "--"}</h2>
                <span className="tw-text-[#3C3F4A] tw-text-md">{data ? liqQuote : "--"}</span>
              </div>
            </div>
            <DividerComponent value=""/>
            <div className="tw-pt-4 tw-grid tw-grid-cols-3 tw-gap-4">
              <div className="tw-w-full tw-flex">
                <h5 className="tw-text-[#06A95C] tw-text-md tw-font-semi-bold">{chainId == 1 ? "Etherscan" : "Bscscan"}</h5>
                <BsArrowUpRight color="#06A95C" size={12} />
              </div>
              <div className="tw-w-full tw-flex tw-justify-center">
                <h5 className="tw-text-[#06A95C] tw-text-md tw-font-semi-bold">{chainId == 1 ? "Uniswap V2" : "Pancakeswap V2"}</h5>
                <BsArrowUpRight color="#06A95C" size={12} />
              </div>
              <div className="tw-w-full tw-flex tw-justify-end">
                <h5 className="tw-text-[#06A95C] tw-text-md tw-font-semi-bold">Dextools</h5>
                <BsArrowUpRight color="#06A95C" size={12} />
              </div>
            </div>
            <DividerComponent value=""/>
            <div className="tw-mt-4 tw-grid tw-grid-cols-2 tw-gap-4">
              <div className="tw-w-full tw-flex tw-flex-col tw-items-start">
                <h5 className="tw-text-[#3C3F4A] tw-text-sm">{isLptoken ? "Total LP Tokens" : "Total Tokens"}</h5>
                <h5 className="tw-text-[#3C3F4A] tw-text-sm">{isLptoken ? "Total Locked LP Tokens" : "Total Locked Tokens"}</h5>
              </div>
              <div className="tw-w-full tw-flex tw-flex-col tw-items-end">
                <h5 className="tw-text-[#3C3F4A] tw-text-sm">{data ? supply : "--"}</h5>
                <h5 className="tw-text-[#3C3F4A] tw-text-sm">{data ? lockAmount : "--"}</h5>
              </div>
            </div>
            <div className="tw-w-full tw-mt-12">
              <h5 className="tw-text-[#3C3F4A] tw-text-xl tw-font-semi-bold">Liquidity Locks</h5>
              <span className="tw-text-[#3C3F4A] tw-text-xs tw-text-left">
                Please be aware only the tokens are locked. Not the actual dollar value.
                This changes as people trade. More liquidity tokens are also minted as people add liquidity to the pool.
              </span>
            </div>
            <div className="tw-mt-8 tw-grid tw-grid-cols-2 tw-gap-4">
              <div className="tw-w-full tw-flex tw-flex-col tw-items-start">
                <h5 className="tw-text-[#3C3F4A] tw-text-sm tw-mb-4 tw-italic">Value</h5>
                <h5 className="tw-text-[#06A95C] tw-text-md tw-font-semi-bold">{data ? priceInUSD : "--"}</h5>
              </div>
              <div className="tw-w-full tw-flex tw-flex-col tw-items-end">
                <h5 className="tw-text-[#3C3F4A] tw-text-sm tw-mb-4 tw-italic">Unlock Date</h5>
                <h5 className="tw-text-[#3C3F4A] tw-text-sm">{data ? new Date(unlockDate as number).toLocaleDateString("en-US") : "--"}</h5>
              </div>
            </div>
            <div className="tw-mb-6 tw-mt-10">
              <LabelComponent value="Lock ID" />
              <TextFieldComponent
                readonly
                value={data ? lockId?.toString() as string : "--"}
              />
            </div>
            <div className="tw-mb-6 tw-mt-10">
              <LabelComponent value="Lock Description" />
              <TextFieldComponent
                readonly
                value={data ? lockDescription as string : "--"}
              />
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

LockInfoView.propTypes = {
  walletAddress: PropTypes.string,
  address: PropTypes.string,
  isConnected: PropTypes.bool.isRequired,
};

LockInfoView.displayName = "LockInfoView";
