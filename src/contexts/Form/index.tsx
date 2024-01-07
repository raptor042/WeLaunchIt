import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";

import {
  networkTypeList,
  routerTypeList,
  daysWillLockedList,
  lpLockServiceList,
  antiBotList,
  antiBotOptionList,
  minFeeLimit,
  maxFeeLimit
} from "@dex/constants/data";
import { Web3Context } from "../Web3";

export interface IFormContext {
  tokenName: string;
  setTokenName: Function;
  symbol: string;
  setSymbol: Function;

  totalSupply: number;
  setTotalSupply: Function;

  ownerAddress: string;
  setOwnerAddress: Function;

  ownerWallet: string;
  setOwnerWallet: Function;

  liquidityFee: number;
  setLiquidityFee: Function;
  taxFee: number;
  setTaxFee: Function;

  maxTxAmount: number;
  setMaxTxAmount: Function;
  sellMaxAmount: number;
  setSellMaxAmount: Function;

  marketingFee: number;
  setMarketingFee: Function;
  devFee: number;
  setDevFee: Function;
  lpFee: number;
  setLpFee: Function;
  reflectionFee: number;
  setReflectionFee: Function;

  rewardToken: string;
  setRewardToken: Function;

  buyMarketingFee: number;
  setBuyMarketingFee: Function;
  buyDevFee: number;
  setBuyDevFee: Function;
  buyLpFee: number;
  setBuyLpFee: Function;
  buyFee: number;
  setBuyFee: Function;
  buyFeeWarn: string;
  setBuyFeeWarn: Function;

  sellMarketingFee: number;
  setSellMarketingFee: Function;
  sellDevFee: number;
  setSellDevFee: Function;
  sellLpFee: number;
  setSellLpFee: Function;
  sellFee: number;
  setSellFee: Function;
  sellFeeWarn: string;
  setSellFeeWarn: Function;

  totalFeeWarn: string;
  setTotalFeeWarn: Function;

  marketingWallet: string;
  setMarketingWallet: Function;
  devWallet: string;
  setDevWallet: Function;

  maxTransAmount: number;
  setMaxTransAmount: Function;
  maxWalletAmount: number;
  setMaxWalletAmount: Function;

  networkType: number;
  setNetworkType: Function;
  routerType: string;
  setRouterType: Function;

  tokenType: number;
  setTokenType: Function;

  pairAddress: string;
  setPairAddress: Function;

  pair: string;
  setPair: Function;

  lpToken: string;
  setLpToken: Function;

  lpTokenAddress: string;
  setLpTokenAddress: Function;

  lpOwnerAddress: string;
  setLpOwnerAddress: Function;

  lpTokenAmount: number;
  setLpTokenAmount: Function;

  lpTokenRatio: number;
  setLpTokenRatio: Function;

  lpTokenBalance: number;
  setLpTokenBalance: Function;

  unlockDate: Date;
  setUnlockDate: Function;

  lockFee: number;
  setLockFee: Function;

  lockDescription: string;
  setLockDescription: Function;
}

export const FormContext = createContext<IFormContext>({
  tokenName: "",
  symbol: "",
  totalSupply: 1000,
  ownerAddress: "",
  ownerWallet: "",
  liquidityFee: 0,
  taxFee: 0,
  maxTxAmount: 0,
  sellMaxAmount: 0,
  marketingFee: 0,
  devFee: 0,
  lpFee: 0,
  reflectionFee: 0,
  rewardToken: "",
  buyMarketingFee: 0,
  buyDevFee: 0,
  buyLpFee: 0,
  buyFee: 0,
  buyFeeWarn: "",
  sellMarketingFee: 0,
  sellDevFee: 0,
  sellLpFee: 0,
  sellFee: 0,
  sellFeeWarn: "",
  totalFeeWarn: "",
  marketingWallet: "",
  devWallet: "",
  maxTransAmount: 0.5,
  maxWalletAmount: 0.5,
  routerType: "",
  setTokenName: () => {},
  setSymbol: () => {},
  setTotalSupply: () => {},
  setOwnerAddress: () => {},
  setOwnerWallet: () => {},
  setLiquidityFee: () => {},
  setTaxFee: () => {},
  setMaxTxAmount: () => {},
  setSellMaxAmount: () => {},
  setMarketingFee: () => {},
  setDevFee: () => {},
  setLpFee: () => {},
  setReflectionFee: () => {},
  setRewardToken: () => {},
  setBuyMarketingFee: () => {},
  setBuyDevFee: () => {},
  setBuyLpFee: () => {},
  setBuyFee: () => {},
  setBuyFeeWarn: () => {},
  setSellMarketingFee: () => {},
  setSellDevFee: () => {},
  setSellLpFee: () => {},
  setSellFee: () => {},
  setSellFeeWarn: () => {},
  setTotalFeeWarn: () => {},
  setMarketingWallet: () => {},
  setDevWallet: () => {},
  setMaxTransAmount: () => {},
  setMaxWalletAmount: () => {},
  setRouterType: () => {},
  networkType: 1,
  setNetworkType: () => {},
  tokenType: 1,
  setTokenType: () => {},
  pairAddress: "",
  setPairAddress: () => {},
  pair: "",
  setPair: () => {},
  lpToken: "",
  setLpToken: () => {},
  lpTokenAddress: "",
  setLpTokenAddress: () => {},
  lpOwnerAddress: "",
  setLpOwnerAddress: () => {},
  lpTokenAmount: 0,
  setLpTokenAmount: () => {},
  lpTokenRatio: 0,
  setLpTokenRatio: () => {},
  lpTokenBalance: 0,
  setLpTokenBalance: () => {},
  unlockDate: new Date(),
  setUnlockDate: () => {},
  lockFee: 0,
  setLockFee: () => {},
  lockDescription: "",
  setLockDescription: () => {},
});

type FormProviderPropType = {
  children?: ReactNode;
};

export const FormProvider = (props: FormProviderPropType) => {
  const { chainId, switchNetwork, web3 } = useContext(Web3Context);
  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState(1000);

  const [ownerAddress, setOwnerAddress] = useState("");

  const [ownerWallet, setOwnerWallet] = useState("");

  const [liquidityFee, setLiquidityFee] = useState(0);
  const [taxFee, setTaxFee] = useState(0);

  const [maxTxAmount, setMaxTxAmount] = useState(0.5);
  const [sellMaxAmount, setSellMaxAmount] = useState(0.5);

  const [marketingFee, setMarketingFee] = useState(0);
  const [devFee, setDevFee] = useState(0);
  const [lpFee, setLpFee] = useState(0);
  const [reflectionFee, setReflectionFee] = useState(0);

  const [rewardToken, setRewardToken] = useState("");

  const [buyMarketingFee, setBuyMarketingFee] = useState(0);
  const [buyDevFee, setBuyDevFee] = useState(0);
  const [buyLpFee, setBuyLpFee] = useState(0);
  const [buyFee, setBuyFee] = useState(0);
  const [buyFeeWarn, setBuyFeeWarn] = useState("");

  const [sellMarketingFee, setSellMarketingFee] = useState(0);
  const [sellDevFee, setSellDevFee] = useState(0);
  const [sellLpFee, setSellLpFee] = useState(0);
  const [sellFee, setSellFee] = useState(0);
  const [sellFeeWarn, setSellFeeWarn] = useState("");

  const [totalFeeWarn, setTotalFeeWarn] = useState("");

  const [marketingWallet, setMarketingWallet] = useState("");
  const [devWallet, setDevWallet] = useState("");
  const [maxTransAmount, setMaxTransAmount] = useState(0.5);
  const [maxWalletAmount, setMaxWalletAmount] = useState(0.5);

  const [networkType, setNetworkType] = useState(1);

  const [routerType, setRouterType] = useState(routerTypeList[0]);

  const [tokenType, setTokenType] = useState(1)

  const [pairAddress, setPairAddress] = useState("")
  const [pair, setPair] = useState("")

  const [lpToken, setLpToken] = useState("")
  const [lpTokenAddress, setLpTokenAddress] = useState("")
  const [lpOwnerAddress, setLpOwnerAddress] = useState("")
  const [lpTokenAmount, setLpTokenAmount] = useState(0)
  const [lpTokenRatio, setLpTokenRatio] = useState(0)
  const [lpTokenBalance, setLpTokenBalance] = useState(0)

  const [unlockDate, setUnlockDate] = useState(new Date())

  const [lockFee, setLockFee] = useState(0)

  const [lockDescription, setLockDescription] = useState("")

  useEffect(() => {
    setNetworkType(chainId);
  }, [chainId]);

  return (
    <FormContext.Provider
      value={{
        tokenType,
        setTokenType,
        networkType,
        setNetworkType: (_chainId: number) =>
          switchNetwork(
            "0x" + Number(_chainId).toString(16),
            web3?.currentProvider
          ),
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
        setLiquidityFee,
        liquidityFee,
        setTaxFee,
        taxFee,
        setMaxTxAmount,
        maxTxAmount,
        setSellMaxAmount,
        sellMaxAmount,
        buyMarketingFee,
        setMarketingFee,
        marketingFee,
        setDevFee,
        devFee,
        setLpFee,
        lpFee,
        setReflectionFee,
        reflectionFee,
        setRewardToken,
        rewardToken,
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
        routerType,
        setRouterType,
        pairAddress,
        setPairAddress,
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
      }}
    >
      {props.children}
    </FormContext.Provider>
  );
};
