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
import { ChainsInfo, tokenTypeList } from "@dex/constants/data";

import { totalFeeLimitExceed } from "@dex/constants/message";
import tokenIABI from "@dex/TokenI.json";
import tokenIIABI from "@dex/TokenII.json";
import tokenIIIABI from "@dex/TokenIII.json";
import routerABI from "@dex/Router.json";
import pairERC20ABI from "@dex/Pair(ERC20).json"
import { Web3Context } from "@dex/contexts/Web3";

import {
  ContractAddresses,
  SwapRouters,
  networkTypeList,
  routerTypeList
} from "@dex/constants/data";

const EditTokenContractView = () => {
  const { addToast } = useToasts();
  const {
    action, 
    setAction,
    tokenAddress,
    setTokenAddress,
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
    tokenType,
    tokenAmount,
    ETHAmount,
  } = useContext(FormContext);

  const { isConnected, account, web3, chainId } = useContext(Web3Context);
  const [isEditing, toggleEditing] = useState<boolean>(false);

  const handleClick = useCallback(async () => {
    if (!isConnected) return;

    if(action == 1) {
      console.log(tokenAddress.length)
      if (tokenAddress.length === 0) {
        addToast("Token Address is required!", { appearance: "warning" });
      } else if (!validateAddress(tokenAddress)) {
        addToast("Token Address is invalid!", { appearance: "warning" });
      } else if (tokenAmount === 0) {
        addToast("Token Amount is required!", { appearance: "warning" });
      } else if (ETHAmount === 0 && chainId == 1) {
        addToast("ETH Amount is required!", { appearance: "warning" });
      } else if (ETHAmount === 0 && chainId == 56) {
        addToast("BNB Amount is required!", { appearance: "warning" });
      } else {
        toggleEditing(true);
        if (!web3) return;
        const contract = new web3.eth.Contract(
          routerABI.abi as any[],
          SwapRouters[chainId]
        );

        const _contract = new web3.eth.Contract(
          pairERC20ABI.abi as any[],
          tokenAddress
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
          await _contract.methods
            .approve(
              SwapRouters[chainId],
              numberToBN(tokenAmount)
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Approved!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to approve", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
            });

          await contract.methods
            .addLiquidityETH(
              tokenAddress,
              numberToBN(tokenAmount),
              numberToBN(0),
              numberToBN(0),
              account,
              Number((await web3.eth.getBlock("latest")).timestamp) + 10000
            )
            .send({
              from: account,
              value: numberToBN(ETHAmount)
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Liquidity added!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleEditing(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to add liquidity", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleEditing(false);
            });
        } catch (error) {
          addToast("Failed to add liquidity", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleEditing(false);
        }
        return;
      }
    }

    if(tokenType == 1 && action == 2) {
      if (buyFee + sellFee > 30) {
        addToast(totalFeeLimitExceed, { appearance: "warning" });
      } else {
        toggleEditing(true);
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIABI as any[],
          tokenAddress
        );
        
        try {
          await contract.methods
            .updateMarketingBuyTax(
              buyMarketingFee
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated Marketing Buy Tax!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to update marketing buy tax", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
            });

            await contract.methods
            .updateMarketingSellTax(
              sellMarketingFee
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated Marketing Sell Tax!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to update marketing sell tax", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
            });

            await contract.methods
            .updateDevBuyTax(
              buyDevFee
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated Dev Buy Tax!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to update dev buy tax", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
            });

            await contract.methods
            .updateDevSellTax(
              sellDevFee
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated Dev Sell Tax!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to update dev sell tax", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
            });

            await contract.methods
            .updateLpBuyTax(
              buyLpFee
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated LP Buy Tax!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to update LP buy tax", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
            });

            await contract.methods
            .updateLpSellTax(
              sellLpFee
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated LP Sell Tax!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to update LP sell tax", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
            });
        } catch (error) {
          addToast("Failed to update taxes", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleEditing(false);
        }
        return;
      }
    }

    if(tokenType == 2 && action == 2) {
      if (marketingFee + lpFee + reflectionFee > 30) {
        addToast(totalFeeLimitExceed, { appearance: "warning" });
      } else {
        toggleEditing(true);
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIIABI as any[],
          tokenAddress
        );

        try {
          await contract.methods
            .setFees(
              lpFee,
              reflectionFee,
              marketingFee,
              100
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated Fees!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleEditing(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to update fees", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleEditing(false);
            });
        } catch (error) {
          addToast("Failed to update fees", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleEditing(false);
        }
        return;
      }
    }

    if(tokenType == 3 && action == 2) {
      if (taxFee + liquidityFee > 30) {
        addToast(totalFeeLimitExceed, { appearance: "warning" });
      } else {
        toggleEditing(true);
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIIIABI as any[],
          tokenAddress
        );

        try {
          await contract.methods
            .setTaxFeePercent(
              taxFee
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated Tax Fees!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to update tax fees", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
            });

            await contract.methods
            .setLiquidityFeePercent(
              liquidityFee
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated Liquidity Fees!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
              }
              toggleEditing(false)
            })
            .on("error", (error: any) => {
              addToast("Failed to update liquidity fees", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
            });
        } catch (error) {
          addToast("Failed to update fees", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleEditing(false);
        }
        return;
      }
    }

    if(tokenType == 1 && action == 3) {
      toggleEditing(true);
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIABI as any[],
          tokenAddress
        );

        try {
            await contract.methods
            .renounceOwnership()
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Renounced Ownership!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleEditing(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to renounce ownership", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleEditing(false);
            });
        } catch (error) {
          addToast("Failed to renounce ownership", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleEditing(false);
        }
    }

    if(tokenType == 2 && action == 3) {
      toggleEditing(true);
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIIABI as any[],
          tokenAddress
        );

        try {
            await contract.methods
            .transferOwnership(
              ownerAddress
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    {`Successfully transfered ownership to ${ownerAddress.slice(0, 4) + "..." + ownerAddress.slice(-3)}!!!!`}
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleEditing(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to transfer ownership", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleEditing(false);
            });
        } catch (error) {
          addToast("Failed to transfer ownership", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleEditing(false);
        }
    }

    if(tokenType == 3 && action == 3) {
      toggleEditing(true);
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIIIABI as any[],
          tokenAddress
        );

        try {
            await contract.methods
            .renounceOwnership()
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Renounced Ownership!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleEditing(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to renounce ownership", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleEditing(false);
            });
        } catch (error) {
          addToast("Failed to renounce ownership", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleEditing(false);
        }
    }

    if(tokenType == 1 && action == 4) {
      toggleEditing(true);
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIABI as any[],
          tokenAddress
        );

        try {
            await contract.methods
            .updateMaxWalletAmount(
              maxWalletAmount
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated Max Wallet Amount!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleEditing(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to max wallet amount", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleEditing(false);
            });
        } catch (error) {
          addToast("Failed to max wallet amount", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleEditing(false);
        }
    }

    if(tokenType == 3 && action == 4) {
      toggleEditing(true);
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIIIABI as any[],
          tokenAddress
        );

        try {
            await contract.methods
            .setNumTokensSellToAddToLiquidity(
              sellMaxAmount
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated Sell Max Amount!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleEditing(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to sell max amount", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleEditing(false);
            });
        } catch (error) {
          addToast("Failed to sell max amount", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleEditing(false);
        }
    }

    if(tokenType == 2 && action == 4) {
      toggleEditing(true);
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIIABI as any[],
          tokenAddress
        );

        try {
            await contract.methods
            .setMaxWalletPercent_base1000(
              maxWalletAmount * 1000
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated Max Wallet Amount!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleEditing(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to max wallet amount", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleEditing(false);
            });
        } catch (error) {
          addToast("Failed to max wallet amount", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleEditing(false);
        }
    }

    if(tokenType == 1 && action == 5) {
      toggleEditing(true);
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIABI as any[],
          tokenAddress
        );

        try {
            await contract.methods
            .updateMaxTransactionAmount(
              maxTxAmount
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated Max Tx Amount!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleEditing(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to max tx amount", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleEditing(false);
            });
        } catch (error) {
          addToast("Failed to max tx amount", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleEditing(false);
        }
    }

    if(tokenType == 2 && action == 5) {
      toggleEditing(true);
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIIABI as any[],
          tokenAddress
        );

        try {
            await contract.methods
            .setMaxTxPercent_base1000(
              maxTxAmount * 1000
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated Max Tx Amount!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleEditing(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to max tx amount", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleEditing(false);
            });
        } catch (error) {
          addToast("Failed to max tx amount", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleEditing(false);
        }
    }

    if(tokenType == 3 && action == 5) {
      toggleEditing(true);
        if (!web3) return;
        const contract = new web3.eth.Contract(
          tokenIIIABI as any[],
          tokenAddress
        );

        try {
            await contract.methods
            .setMaxTxPercent(
              maxTransAmount
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
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Updated Max Tx Amount!!!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleEditing(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to max tx amount", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleEditing(false);
            });
        } catch (error) {
          addToast("Failed to max tx amount", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleEditing(false);
        }
    }

    toggleEditing(false);
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
    account,
    liquidityFee, 
    maxTxAmount, 
    ownerWallet, 
    sellMaxAmount,
    taxFee
  ]);

  return (
    <div className={styles.editTokenContractRoot}>
      <div className={styles.editTokenContractContainer}>
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
            {Number(action) == 1 && <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Router</div>
              <div>{routerTypeList[chainId]}</div>
            </div>}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Token Address</div>
              <div>
                {tokenAddress.length === 0
                    ? "-"
                    : tokenAddress.length > 10
                    ? tokenAddress.slice(0, 4) + "..." + tokenAddress.slice(-3)
                    : tokenAddress}
              </div>
            </div>

            {Number(action) == 1 && <>
              <div className="tw-flex tw-mb-2">
                <div className="tw-font-bold tw-w-[50%]">Token Amount</div>
                <div>{tokenAmount === 0 ? "-" : `${tokenAmount}`}</div>
              </div>
              <div className="tw-flex tw-mb-2">
                <div className="tw-font-bold tw-w-[50%]">{chainId == 1 ? "ETH Amount" : "BNB Amount"}</div>
                <div>{ETHAmount === 0 ? "-" : `${ETHAmount}`}</div>
              </div>
            </>}

            {Number(action) == 2 && <>
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
            </>}

            {/* Max Transaction and Wallet Amount */}
            {Number(action) == 5 && <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">
                Max Transaction Amount
              </div>
              <div>{maxTransAmount} %</div>
            </div>}
            {Number(action) == 4 && <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Max Wallet Amount</div>
              <div>{maxWalletAmount} %</div>
            </div>}
          </div>
          <Button
            className={`tw-w-[160px] tw-h-[44px] ${
              !isConnected ||
              isEditing ||
              ContractAddresses[chainId] === undefined
                ? "tw-opacity-50 tw-pointer-events-none"
                : ""
            }`}
            onClick={() => handleClick()}
          >
            {isEditing ? "Editing..." : "Edit"}
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
            {Number(action) == 1 && <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Router</div>
              <div>{routerTypeList[chainId]}</div>
            </div>}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Token Address</div>
              <div>
                {tokenAddress.length === 0
                  ? "-"
                  : tokenAddress.length > 10
                  ? tokenAddress.slice(0, 4) + "..." + tokenAddress.slice(-3)
                  : tokenAddress}
              </div>
            </div>
            {Number(action) == 3 && <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">New Owner Address</div>
              <div>
                {ownerAddress.length === 0
                  ? "-"
                  : ownerAddress.length > 10
                  ? ownerAddress.slice(0, 4) + "..." + ownerAddress.slice(-3)
                  : ownerAddress}
              </div>
            </div>}

            {Number(action) == 1 && <>
              <div className="tw-flex tw-mb-2">
                <div className="tw-font-bold tw-w-[50%]">Token Amount</div>
                <div>{tokenAmount === 0 ? "-" : `${tokenAmount}`}</div>
              </div>
              <div className="tw-flex tw-mb-2">
                <div className="tw-font-bold tw-w-[50%]">{chainId == 1 ? "ETH Amount" : "BNB Amount"}</div>
                <div>{ETHAmount === 0 ? "-" : `${ETHAmount}`}</div>
              </div>
            </>}

            {Number(action) == 2 && <>
              {/* Buy Fee Configs */}
              <div className="tw-flex tw-mb-2">
                <div className="tw-font-bold tw-w-[50%]">Marketing Fee</div>
                <div>{marketingFee === 0 ? "-" : `${marketingFee} %`}</div>
              </div>
              {/* <div className="tw-flex tw-mb-2">
                <div className="tw-font-bold tw-w-[50%]">Dev Fee</div>
                <div>{devFee === 0 ? "-" : `${devFee} %`}</div>
              </div> */}
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
                    marketingFee + lpFee + reflectionFee === 0 
                    ? "-" 
                    : `${marketingFee + lpFee + reflectionFee} %`
                  }
                </div>
              </div>
            </>}

            {/* Max Transaction and Wallet Amount */}
            {Number(action) == 5 && <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">
                Max Transaction Amount
              </div>
              <div>{maxTransAmount} %</div>
            </div>}
            {Number(action) == 4 && <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Max Wallet Amount</div>
              <div>{maxWalletAmount} %</div>
            </div>}
          </div>
          <Button
            className={`tw-w-[160px] tw-h-[44px] ${
              !isConnected ||
              isEditing ||
              ContractAddresses[chainId] === undefined
                ? "tw-opacity-50 tw-pointer-events-none"
                : ""
            }`}
            onClick={() => handleClick()}
          >
            {isEditing ? "Editing..." : "Edit"}
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
            {Number(action) == 1 && <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Router</div>
              <div>{routerTypeList[chainId]}</div>
            </div>}
            <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Token Address</div>
              <div>
                {tokenAddress.length === 0
                  ? "-"
                  : tokenAddress.length > 10
                  ? tokenAddress.slice(0, 4) + "..." + tokenAddress.slice(-3)
                  : tokenAddress}
              </div>
            </div>

            {Number(action) == 1 && <>
              <div className="tw-flex tw-mb-2">
                <div className="tw-font-bold tw-w-[50%]">Token Amount</div>
                <div>{tokenAmount === 0 ? "-" : `${tokenAmount}`}</div>
              </div>
              <div className="tw-flex tw-mb-2">
                <div className="tw-font-bold tw-w-[50%]">{chainId == 1 ? "ETH Amount" : "BNB Amount"}</div>
                <div>{ETHAmount === 0 ? "-" : `${ETHAmount}`}</div>
              </div>
            </>}

            {Number(action) == 2 && <>
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
            </>}

            {/* Max Transaction and Wallet Amount */}
            {Number(action) == 5 && <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">
                Max Transaction Amount
              </div>
              <div>{maxTxAmount} %</div>
            </div>}
            {Number(action) == 4 && <div className="tw-flex tw-mb-2">
              <div className="tw-font-bold tw-w-[50%]">Max Sell Amount</div>
              <div>{sellMaxAmount} %</div>
            </div>}
          </div>
          <Button
            className={`tw-w-[160px] tw-h-[44px] ${
              !isConnected ||
              isEditing ||
              ContractAddresses[chainId] === undefined
                ? "tw-opacity-50 tw-pointer-events-none"
                : ""
            }`}
            onClick={() => handleClick()}
          >
            {isEditing ? "Editing..." : "Edit"}
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

export default EditTokenContractView;
