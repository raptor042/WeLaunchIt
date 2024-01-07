import React, { useContext, useCallback, useState } from "react";
import Button from "@dex/components/Button/ButtonComponent";
import { tMark } from "@dex/constants/svg_icons";
import styles from "./styles.module.scss";

import { useToasts } from "react-toast-notifications";
import { FormContext } from "@dex/contexts/Form";
import {
  validateTokenName,
  validateSymbol,
  validateAddress
} from "@dex/utils/validator";
import { ChainsInfo } from "@dex/constants/data";

import { totalFeeLimitExceed } from "@dex/constants/message";
import tokenIABI from "@dex/TokenFactoryI.json";
import tokenIIABI from "@dex/TokenFactoryII.json";
import tokenIIIABI from "@dex/TokenFactoryIII.json";
import { Web3Context } from "@dex/contexts/Web3";

import {
  ContractAddresses,
  SwapRouters,
  networkTypeList,
  routerTypeList
} from "@dex/constants/data";

const TaxContractView = () => {
  const { addToast } = useToasts();
  const {
    tokenName,
    symbol,
    totalSupply,
    liquidityFee,
    taxFee,
    maxTxAmount,
    sellMaxAmount,
    ownerAddress,
    ownerWallet,
    marketingFee,
    devFee,
    lpFee,
    reflectionFee,
    rewardToken,
    buyMarketingFee,
    buyDevFee,
    buyLpFee,
    buyFee,
    sellMarketingFee,
    sellDevFee,
    sellLpFee,
    sellFee,
    marketingWallet,
    devWallet,
    maxTransAmount,
    maxWalletAmount,
    routerType,
    tokenType
  } = useContext(FormContext);

  const { isConnected, account, web3, chainId } = useContext(Web3Context);
  const [isDeploying, toggleDeploying] = useState<boolean>(false);

  const handleClick = useCallback(async () => {
    if (!isConnected) return;

    if (tokenType == 1) {
      if (tokenName.length === 0) {
        addToast("Token Name is required!", { appearance: "warning" });
      } else if (symbol.length === 0) {
        addToast("Symbol is required!", { appearance: "warning" });
      } else if (totalSupply === 0) {
        addToast("Total Supply is required!", { appearance: "warning" });
      } else if (marketingWallet.length === 0) {
        addToast("Marketing Wallet Address is required!", {
          appearance: "warning"
        });
      } else if (!validateAddress(marketingWallet)) {
        addToast("Marketing Wallet Address is invalid!", {
          appearance: "warning"
        });
      } else if (devWallet.length === 0) {
        addToast("Dev Wallet Address is required!", { appearance: "warning" });
      } else if (!validateAddress(devWallet)) {
        addToast("Dev Wallet Address is invalid!", { appearance: "warning" });
      } else if (buyFee + sellFee > 30) {
        addToast(totalFeeLimitExceed, { appearance: "warning" });
      } else {
        toggleDeploying(true);
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIABI as any[],
          ContractAddresses[chainId][0]
        );

        const zeros = "000000000000000000";
        const numberToBN = (_value: number) => {
          let dotPosition = _value.toString().indexOf(".");
          const value =
            dotPosition === -1 ? _value.toString() + "." + zeros : _value + zeros;
          if (dotPosition === -1) dotPosition = _value.toString().length;
          return value.slice(0, dotPosition + 19).replace(/\D/g, "");
        };

        try {
          await contract.methods
            .deployToken({
              name: tokenName,
              symbol,
              marketingFeeReceiver: marketingWallet,
              devFeeReceiver: devWallet,
              marketingTaxBuy: numberToBN(buyMarketingFee),
              marketingTaxSell: numberToBN(sellMarketingFee),
              devTaxSell: numberToBN(sellDevFee),
              devTaxBuy: numberToBN(buyDevFee),
              lpTaxBuy: numberToBN(buyLpFee),
              lpTaxSell: numberToBN(sellLpFee),
              totalSupply: numberToBN(totalSupply),
              maxPercentageForWallet: numberToBN(maxWalletAmount),
              maxPercentageForTx: numberToBN(maxTransAmount),
              swapRouter: SwapRouters[chainId], //routerType,
              newOwner: account
            })
            .send({
              from: account
            })
            .on("transactionHash", (hash: string) =>
              addToast(
                <p className="tw-m-4">
                  Transaction:
                  <a
                    target="_blank"
                    href={`${ChainsInfo[chainId].blockExplorerUrls}tx/${hash}`}
                  >
                    {`${hash.slice(0, 10)}...${hash.slice(-8)}`}
                  </a>
                </p>,
                { appearance: "info", autoDismissTimeout: 10000 }
              )
            )
            .on("confirmation", (confirmationNumber: number, recepit: any) => {
              const deployedAddress = recepit.events.TokenDeployed.returnValues
                .tokenAddress as string;
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Deployed:
                    <a
                      target="_blank"
                      href={`${ChainsInfo[chainId].blockExplorerUrls}address/${deployedAddress}`}
                    >
                      {`${deployedAddress.slice(0, 10)}...${deployedAddress.slice(
                        -8
                      )}`}
                    </a>
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleDeploying(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to deploy", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleDeploying(false);
            });
        } catch (error) {
          addToast("Failed to deploy", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleDeploying(false);
        }
        return;
      }
    } else if (tokenType == 2) {
      if (tokenName.length === 0) {
        addToast("Token Name is required!", { appearance: "warning" });
      } else if (symbol.length === 0) {
        addToast("Symbol is required!", { appearance: "warning" });
      } else if (totalSupply === 0) {
        addToast("Total Supply is required!", { appearance: "warning" });
      } else if (devWallet.length === 0) {
        addToast("Dev Wallet Address is required!", { appearance: "warning" });
      } else if (!validateAddress(devWallet)) {
        addToast("Dev Wallet Address is invalid!", { appearance: "warning" });
      } else if (marketingFee + devFee + lpFee + reflectionFee > 30) {
        addToast(totalFeeLimitExceed, { appearance: "warning" });
      } else {
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIIABI as any[],
          ContractAddresses[chainId][1]
        );

        const zeros = "000000000000000000";
        const numberToBN = (_value: number) => {
          let dotPosition = _value.toString().indexOf(".");
          const value =
            dotPosition === -1 ? _value.toString() + "." + zeros : _value + zeros;
          if (dotPosition === -1) dotPosition = _value.toString().length;
          return value.slice(0, dotPosition + 19).replace(/\D/g, "");
        };

        try {
          await contract.methods
            .createToken(
              tokenName,
              symbol,
              18,
              numberToBN(totalSupply),
              devWallet,
              [
                numberToBN(lpFee),
                numberToBN(reflectionFee),
                numberToBN(marketingFee),
                numberToBN(devFee)
              ],
              rewardToken,
              SwapRouters[chainId]
            )
            .send({
              from: account
            })
            .on("transactionHash", (hash: string) =>
              addToast(
                <p className="tw-m-4">
                  Transaction:
                  <a
                    target="_blank"
                    href={`${ChainsInfo[chainId].blockExplorerUrls}tx/${hash}`}
                  >
                    {`${hash.slice(0, 10)}...${hash.slice(-8)}`}
                  </a>
                </p>,
                { appearance: "info", autoDismissTimeout: 10000 }
              )
            )
            .on("confirmation", (confirmationNumber: number, recepit: any) => {
              const deployedAddress = recepit.events.CreateToken.returnValues
                .tokenAddress as string;
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Deployed:
                    <a
                      target="_blank"
                      href={`${ChainsInfo[chainId].blockExplorerUrls}address/${deployedAddress}`}
                    >
                      {`${deployedAddress.slice(0, 10)}...${deployedAddress.slice(
                        -8
                      )}`}
                    </a>
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleDeploying(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to deploy", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleDeploying(false);
            });
        } catch (error) {
          addToast("Failed to deploy", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleDeploying(false);
        }
        return;
      } 
    } else if (tokenType == 3) {
      if (tokenName.length === 0) {
        addToast("Token Name is required!", { appearance: "warning" });
      } else if (symbol.length === 0) {
        addToast("Symbol is required!", { appearance: "warning" });
      } else if (totalSupply === 0) {
        addToast("Total Supply is required!", { appearance: "warning" });
      } else if (ownerWallet.length === 0) {
        addToast("Owner Wallet Address is required!", { appearance: "warning" });
      } else if (!validateAddress(ownerWallet)) {
        addToast("Owner Wallet Address is invalid!", { appearance: "warning" });
      } else if (liquidityFee + taxFee > 30) {
        addToast(totalFeeLimitExceed, { appearance: "warning" });
      } else {
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIIIABI as any[],
          ContractAddresses[chainId][2]
        );

        const zeros = "000000000000000000";
        const numberToBN = (_value: number) => {
          let dotPosition = _value.toString().indexOf(".");
          const value =
            dotPosition === -1 ? _value.toString() + "." + zeros : _value + zeros;
          if (dotPosition === -1) dotPosition = _value.toString().length;
          return value.slice(0, dotPosition + 19).replace(/\D/g, "");
        };

        try {
          await contract.methods
            .createToken(
              tokenName,
              symbol,
              numberToBN(totalSupply),
              numberToBN(taxFee),
              numberToBN(liquidityFee),
              numberToBN(maxTxAmount),
              numberToBN(sellMaxAmount),
              SwapRouters[chainId],
              ownerWallet
            )
            .send({
              from: account
            })
            .on("transactionHash", (hash: string) =>
              addToast(
                <p className="tw-m-4">
                  Transaction:
                  <a
                    target="_blank"
                    href={`${ChainsInfo[chainId].blockExplorerUrls}tx/${hash}`}
                  >
                    {`${hash.slice(0, 10)}...${hash.slice(-8)}`}
                  </a>
                </p>,
                { appearance: "info", autoDismissTimeout: 10000 }
              )
            )
            .on("confirmation", (confirmationNumber: number, recepit: any) => {
              const deployedAddress = recepit.events.CreateToken.returnValues
                .tokenAddress as string;
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Deployed:
                    <a
                      target="_blank"
                      href={`${ChainsInfo[chainId].blockExplorerUrls}address/${deployedAddress}`}
                    >
                      {`${deployedAddress.slice(0, 10)}...${deployedAddress.slice(
                        -8
                      )}`}
                    </a>
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleDeploying(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to deploy", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleDeploying(false);
            });
        } catch (error) {
          addToast("Failed to deploy", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleDeploying(false);
        }
        return;
      } 
    }
    toggleDeploying(false);
  }, [
    chainId,
    isConnected,
    tokenName,
    symbol,
    totalSupply,
    marketingWallet,
    devWallet,
    buyFee,
    sellFee,
    addToast,
    web3,
    marketingFee,
    devFee,
    lpFee,
    reflectionFee,
    rewardToken,
    buyMarketingFee,
    sellMarketingFee,
    sellDevFee,
    buyDevFee,
    buyLpFee,
    sellLpFee,
    maxWalletAmount,
    maxTransAmount,
    tokenType,
    // routerType,
    // networkType,
    account
  ]);

  return (
    <div className={styles.taxContractRoot}>
      <div className={styles.taxContractContainer}>
        {tokenType == 1 && <div className="tw-p-7">
          <div className="tw-flex tw-items-center tw-mb-4">
            <div>{tMark}</div>
            <div className="tw-ml-3">
              <div className="tw-text-greyM">Contract Summary</div>
              <div className="tw-text-base tw-font-bold">Standard</div>
            </div>
          </div>
          {/* <div className="tw-text-greyM">
            The smart contract complies with the standard ERC20-BEP20 scheme.
            Liquidity and Marketing fee options are available.
          </div> */}
          <div className="tw-my-5 tw-w-full">
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Network</div>
              <div>{networkTypeList[chainId]}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Router</div>
              <div>{routerTypeList[chainId]}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Token Name</div>
              <div>{tokenName.length === 0 ? "-" : tokenName}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Symbol</div>
              <div>{symbol.length === 0 ? "-" : symbol}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Total Supply</div>
              <div>{totalSupply === 0 ? "-" : totalSupply}</div>
            </div>

            {/* Wallet Information */}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Marketing Wallet</div>
              <div>
                {marketingWallet.length === 0
                  ? "-"
                  : marketingWallet.length > 10
                  ? marketingWallet.slice(0, 4) +
                    "..." +
                    marketingWallet.slice(-3)
                  : marketingWallet}
              </div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Dev Wallet</div>
              <div>
                {devWallet.length === 0
                  ? "-"
                  : devWallet.length > 10
                  ? devWallet.slice(0, 4) + "..." + devWallet.slice(-3)
                  : devWallet}
              </div>
            </div>

            {/* Buy Fee Configs */}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Marketing Buy Fee</div>
              <div>{buyMarketingFee === 0 ? "-" : `${buyMarketingFee} %`}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Dev Buy Fee</div>
              <div>{buyDevFee === 0 ? "-" : `${buyDevFee} %`}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Lp Buy Fee</div>
              <div>{buyLpFee === 0 ? "-" : `${buyLpFee} %`}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Buy Fee</div>
              <div>{buyFee === 0 ? "-" : `${buyFee} %`}</div>
            </div>

            {/* Sell Fee Configs */}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Marketing Buy Fee</div>
              <div>
                {sellMarketingFee === 0 ? "-" : `${sellMarketingFee} %`}
              </div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Dev Sell Fee</div>
              <div>{sellDevFee === 0 ? "-" : `${sellDevFee} %`}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Lp Sell Fee</div>
              <div>{sellLpFee === 0 ? "-" : `${sellLpFee} %`}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Sell Fee</div>
              <div>{sellFee === 0 ? "-" : `${sellFee} %`}</div>
            </div>

            {/* Total Fee Configs */}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Total Fee</div>
              <div>
                {buyFee + sellFee === 0 ? "-" : `${buyFee + sellFee} %`}
              </div>
            </div>

            {/* Max Transaction and Wallet Amount */}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">
                Max Transaction Amount
              </div>
              <div>{maxTransAmount} %</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Max Wallet Amount</div>
              <div>{maxWalletAmount} %</div>
            </div>
          </div>
          <Button
            className={`tw-w-[160px] tw-h-[44px] ${
              !isConnected ||
              isDeploying ||
              ContractAddresses[chainId] === undefined
                ? "tw-opacity-50 tw-pointer-events-none"
                : ""
            }`}
            onClick={() => handleClick()}
          >
            {isDeploying ? "Deploying..." : "Deploy"}
          </Button>
          <p className="tw-text-negative tw-mt-4 tw-font-semi-bold">
            {isConnected &&
              ContractAddresses[chainId] === undefined &&
              "This Network is not supported"}
          </p>
        </div>}
        {tokenType == 2 && <div className="tw-p-7">
          <div className="tw-flex tw-items-center tw-mb-4">
            <div>{tMark}</div>
            <div className="tw-ml-3">
              <div className="tw-text-greyM">Contract Summary</div>
              <div className="tw-text-base tw-font-bold">Rewards</div>
            </div>
          </div>
          {/* <div className="tw-text-greyM">
            The smart contract complies with the standard ERC20-BEP20 scheme.
            Liquidity and Marketing fee options are available.
          </div> */}
          <div className="tw-my-5 tw-w-full">
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Network</div>
              <div>{networkTypeList[chainId]}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Router</div>
              <div>{routerTypeList[chainId]}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Token Name</div>
              <div>{tokenName.length === 0 ? "-" : tokenName}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Symbol</div>
              <div>{symbol.length === 0 ? "-" : symbol}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Total Supply</div>
              <div>{totalSupply === 0 ? "-" : totalSupply}</div>
            </div>

            {/* Wallet Information */}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Dev Wallet</div>
              <div>
                {devWallet.length === 0
                  ? "-"
                  : devWallet.length > 10
                  ? devWallet.slice(0, 4) + "..." + devWallet.slice(-3)
                  : devWallet}
              </div>
            </div>

            {/* Reward Token Configs */}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Reward Token</div>
              <div>
                {
                  rewardToken.length === 0
                    ? "-"
                    : rewardToken.length > 10
                    ? rewardToken.slice(0, 4) + "..." + rewardToken.slice(-3)
                    : rewardToken
                }
              </div>
            </div>

            {/* Buy Fee Configs */}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Marketing Fee</div>
              <div>{marketingFee === 0 ? "-" : `${marketingFee} %`}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Dev Fee</div>
              <div>{devFee === 0 ? "-" : `${devFee} %`}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Lp Fee</div>
              <div>{lpFee === 0 ? "-" : `${lpFee} %`}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Reflection Fee</div>
              <div>{reflectionFee === 0 ? "-" : `${reflectionFee} %`}</div>
            </div>

            {/* Total Fee Configs */}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Total Fee</div>
              <div>
                {
                  marketingFee + devFee + lpFee + reflectionFee === 0 
                  ? "-" 
                  : `${marketingFee + devFee + lpFee + reflectionFee} %`
                }
              </div>
            </div>
          </div>
          <Button
            className={`tw-w-[160px] tw-h-[44px] ${
              !isConnected ||
              isDeploying ||
              ContractAddresses[chainId] === undefined
                ? "tw-opacity-50 tw-pointer-events-none"
                : ""
            }`}
            onClick={() => handleClick()}
          >
            {isDeploying ? "Deploying..." : "Deploy"}
          </Button>
          <p className="tw-text-negative tw-mt-4 tw-font-semi-bold">
            {isConnected &&
              ContractAddresses[chainId] === undefined &&
              "This Network is not supported"}
          </p>
        </div>}
        {tokenType == 3 && <div className="tw-p-7">
          <div className="tw-flex tw-items-center tw-mb-4">
            <div>{tMark}</div>
            <div className="tw-ml-3">
              <div className="tw-text-greyM">Contract Summary</div>
              <div className="tw-text-base tw-font-bold">Reflections</div>
            </div>
          </div>
          {/* <div className="tw-text-greyM">
            The smart contract complies with the standard ERC20-BEP20 scheme.
            Liquidity and Marketing fee options are available.
          </div> */}
          <div className="tw-my-5 tw-w-full">
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Network</div>
              <div>{networkTypeList[chainId]}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Router</div>
              <div>{routerTypeList[chainId]}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Token Name</div>
              <div>{tokenName.length === 0 ? "-" : tokenName}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Symbol</div>
              <div>{symbol.length === 0 ? "-" : symbol}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Total Supply</div>
              <div>{totalSupply === 0 ? "-" : totalSupply}</div>
            </div>

            {/* Wallet Information */}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Owner Wallet</div>
              <div>
                {ownerWallet.length === 0
                  ? "-"
                  : ownerWallet.length > 10
                  ? ownerWallet.slice(0, 4) + "..." + ownerWallet.slice(-3)
                  : ownerWallet}
              </div>
            </div>

            {/* Fee Configs */}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Tax Fee</div>
              <div>{taxFee === 0 ? "-" : `${taxFee} %`}</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Liquidity Fee</div>
              <div>{liquidityFee === 0 ? "-" : `${liquidityFee} %`}</div>
            </div>

            {/* Total Fee Configs */}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Total Fee</div>
              <div>
                {
                  liquidityFee + taxFee === 0 
                  ? "-" 
                  : `${liquidityFee + taxFee} %`
                }
              </div>
            </div>
            {/* Max Transaction and Wallet Amount */}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">
                Max Transaction Amount
              </div>
              <div>{maxTxAmount} %</div>
            </div>
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Max Sell Amount</div>
              <div>{sellMaxAmount} %</div>
            </div>
          </div>
          <Button
            className={`tw-w-[160px] tw-h-[44px] ${
              !isConnected ||
              isDeploying ||
              ContractAddresses[chainId] === undefined
                ? "tw-opacity-50 tw-pointer-events-none"
                : ""
            }`}
            onClick={() => handleClick()}
          >
            {isDeploying ? "Deploying..." : "Deploy"}
          </Button>
          <p className="tw-text-negative tw-mt-4 tw-font-semi-bold">
            {isConnected &&
              ContractAddresses[chainId] === undefined &&
              "This Network is not supported"}
          </p>
        </div>}
        {/* <div className="tw-border-t tw-border-grey tw-p-5 tw-text-greyM">
          We DO NOT accept any liability for any loss caused by anyone acting or
          refraining from taking action as a result of any service provided.
        </div> */}
      </div>
    </div>
  );
};

export default TaxContractView;
