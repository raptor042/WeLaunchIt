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

import { Web3Context } from "@dex/contexts/Web3";

import WeLockItABI from "@dex/WeLockIt.json"

import {
  ContractAddresses,
  SwapRouters,
  networkTypeList,
  routerTypeList
} from "@dex/constants/data";
import pairABI from "@dex/Pair.json"
import pairERC20ABI from "@dex/Pair(ERC20).json"

const LockContractView = () => {
  const { addToast } = useToasts();
  const {
    pairAddress,
    pair,
    lpToken,
    lpTokenAddress,
    lpOwnerAddress,
    lpTokenAmount,
    unlockDate,
    lockDescription,
    lockFee,
    lockType,
    tokenAddress,
    token
  } = useContext(FormContext);

  const { isConnected, account, web3, chainId, setUserLockedPair } = useContext(Web3Context);
  const [isLocking, toggleLocking] = useState<boolean>(false);

  const handleClick = useCallback(async () => {
    if (!isConnected) return;

    if(lockType == 0 && lpTokenAddress.length === 0) {
      addToast("LP token address is required!", { appearance: "warning" });
    } else if(lockType == 1 && tokenAddress.length === 0) {
      addToast("Token address is required!", { appearance: "warning" });
    } else if(lockType == 0 && !validateAddress(lpTokenAddress)) {
      addToast("LP token Address is invalid!", {
        appearance: "warning"
      });
    } else if(lockType == 1 && !validateAddress(tokenAddress)) {
      addToast("Token Address is invalid!", {
        appearance: "warning"
      });
    } else if(lpTokenAmount <= 0) {
      addToast("Lock amount is invalid, Must be greater than 0!", {
        appearance: "warning"
      });
    } else if(getTimeDiff()) {
      addToast("Unlock Date is invalid, Must be in the future!", {
        appearance: "warning"
      });
    } else if(lockDescription.length === 0) {
      addToast("Lock Description is required!", { appearance: "warning" });
    } else {
      toggleLocking(true);

      if (!web3) return;
      const lock = new web3.eth.Contract(
        WeLockItABI.abi as any[],
        ContractAddresses[chainId][3]
      );

      const token = new web3.eth.Contract(
        pairERC20ABI.abi as any[],
        lockType == 0 ? lpTokenAddress : tokenAddress
      );

      const zeros = "000000000000000000";
      const numberToBN = (_value: number) => {
        let dotPosition = _value.toString().indexOf(".");
        const value =
          dotPosition === -1 ? _value.toString() + "." + zeros : _value + zeros;
        if (dotPosition === -1) dotPosition = _value.toString().length;
        return value.slice(0, dotPosition + 19).replace(/\D/g, "");
      };

      const approved = await token.methods.approve(
        ContractAddresses[chainId][3],
        numberToBN(lpTokenAmount)
      ).send({
        from: account
      })
      console.log(approved)

      if(approved) {
        try {
          await lock.methods
            .lock(
              account,
              lockType == 0 ? lpTokenAddress : tokenAddress,
              lockType == 0 ? true : false,
              numberToBN(lpTokenAmount),
              Number(unlockDate.getTime()) / 1000,
              lockDescription
            )
            .send({
              from: account,
              value: numberToBN(lockFee)
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
            .on("confirmation", async (confirmationNumber: number, recepit: any) => {
              const lockId = recepit.events.LockAdded.returnValues
                .id as number;
              const amount = recepit.events.LockAdded.returnValues
                .amount as number;
                console.log(lockId, amount)
              if (confirmationNumber === 1) {
                addToast(
                  <p className="tw-m-4">
                    Lock was successful, LockID - {lockId}!!
                  </p>,
                  { appearance: "success", autoDismissTimeout: 10000 }
                );
                toggleLocking(false);
              }
            })
            .on("error", (error: any) => {
              addToast("Failed to lock", {
                appearance: "error",
                autoDismissTimeout: 10000
              });
              toggleLocking(false);
            });
        } catch (error) {
          addToast("Failed to lock", {
            appearance: "error",
            autoDismissTimeout: 10000
          });
          console.error(error);
          toggleLocking(false);
        }
      }
      return;
    }
  }, [
    lpTokenAddress,
    lpOwnerAddress,
    lpTokenAmount,
    unlockDate,
    lockDescription
  ]);

  const getTimeDiff = () => {
    const date0 = new Date().getTime()
    const date1 = unlockDate.getTime()
    const timeInMilliSecs = date1 - date0
    
    if(timeInMilliSecs < 0) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className={styles.taxContractRoot}>
      <div className={styles.taxContractContainer}>
        <div className="tw-p-7">
          <div className="tw-flex tw-items-center tw-mb-4">
            <div>{tMark}</div>
            <div className="tw-ml-3">
              <div className="tw-text-greyM">Lock Liquidity Summary</div>
              <div className="tw-text-base tw-font-bold">LP Locker</div>
            </div>
          </div>
          {/* <div className="tw-text-greyM">
            The smart contract complies with the standard ERC20-BEP20 scheme.
            Liquidity and Marketing fee options are available.
          </div> */}
          {lockType == 0 && <div className="tw-my-5 tw-w-full">
            <div className="tw-flex tw-mb-4">
              <div className="tw-font-bold tw-w-[50%]">Pair</div>
              <div>{pair.length === 0 ? "-" : pair.split("-")[0]}</div>
            </div>
            <div className="tw-flex tw-mb-4">
              <div className="tw-font-bold tw-w-[50%]">Pair Address</div>
              <div>
                {pairAddress.length === 0
                  ? "-"
                  : pairAddress.length > 10
                  ? pairAddress.slice(0, 4) +
                    "..." +
                    pairAddress.slice(-3)
                  : pairAddress}
              </div>
            </div>
            <div className="tw-flex tw-mb-4">
              <div className="tw-font-bold tw-w-[50%]">Lp Token</div>
              <div>{lpToken.length === 0 ? "-" : lpToken.split("+")[0]}</div>
            </div>
            <div className="tw-flex tw-mb-4">
              <div className="tw-font-bold tw-w-[50%]">Lp Token Address</div>
              <div>
                {lpTokenAddress.length === 0
                  ? "-"
                  : lpTokenAddress.length > 10
                  ? lpTokenAddress.slice(0, 4) +
                    "..." +
                    lpTokenAddress.slice(-3)
                  : lpTokenAddress}
              </div>
            </div>
            <div className="tw-flex tw-mb-4">
              <div className="tw-font-bold tw-w-[50%]">Lp Lock Amount</div>
              <div>{lpTokenAmount}</div>
            </div>
            <div className="tw-flex tw-mb-4">
              <div className="tw-font-bold tw-w-[50%]">Lp Unlock Date</div>
              <div>{unlockDate.toDateString().length === 0 ? "-" : unlockDate.toDateString()}</div>
            </div>
            <div className="tw-flex tw-mb-8">
              <div className="tw-font-bold tw-w-[50%]">Description</div>
              <div>
                {lockDescription.length === 0
                  ? "-"
                  : lockDescription.length > 20
                  ? lockDescription.slice(0, 15) +
                    "....."
                  : lockDescription}
              </div>
            </div>
            <Button
              className={`tw-w-[160px] tw-h-[44px] ${
                !isConnected ||
                isLocking ||
                ContractAddresses[chainId] === undefined
                  ? "tw-opacity-50 tw-pointer-events-none"
                  : ""
              }`}
              onClick={() => handleClick()}
            >
              {isLocking ? "Locking..." : "Lock"}
            </Button>
            <p className="tw-text-negative tw-mt-4 tw-font-semi-bold">
            {isConnected &&
              ContractAddresses[chainId] === undefined &&
              "This Network is not supported"}
            </p>
          </div>}
          {lockType == 1 && <div className="tw-my-5 tw-w-full">
            <div className="tw-flex tw-mb-4">
              <div className="tw-font-bold tw-w-[50%]">Token Address</div>
              <div>
                {tokenAddress.length === 0
                  ? "-"
                  : tokenAddress.length > 10
                  ? tokenAddress.slice(0, 4) +
                    "..." +
                    tokenAddress.slice(-3)
                  : tokenAddress}
              </div>
            </div>
            <div className="tw-flex tw-mb-4">
              <div className="tw-font-bold tw-w-[50%]">Token</div>
              <div>{token.length === 0 ? "-" : token.split("+")[0]}</div>
            </div>
            <div className="tw-flex tw-mb-4">
              <div className="tw-font-bold tw-w-[50%]">Lock Amount</div>
              <div>{lpTokenAmount}</div>
            </div>
            <div className="tw-flex tw-mb-4">
              <div className="tw-font-bold tw-w-[50%]">Unlock Date</div>
              <div>{unlockDate.toDateString().length === 0 ? "-" : unlockDate.toDateString()}</div>
            </div>
            <div className="tw-flex tw-mb-8">
              <div className="tw-font-bold tw-w-[50%]">Description</div>
              <div>
                {lockDescription.length === 0
                  ? "-"
                  : lockDescription.length > 20
                  ? lockDescription.slice(0, 15) +
                    "....."
                  : lockDescription}
              </div>
            </div>
            <Button
              className={`tw-w-[160px] tw-h-[44px] ${
                !isConnected ||
                isLocking ||
                ContractAddresses[chainId] === undefined
                  ? "tw-opacity-50 tw-pointer-events-none"
                  : ""
              }`}
              onClick={() => handleClick()}
            >
              {isLocking ? "Locking..." : "Lock"}
            </Button>
            <p className="tw-text-negative tw-mt-4 tw-font-semi-bold">
            {isConnected &&
              ContractAddresses[chainId] === undefined &&
              "This Network is not supported"}
            </p>
          </div>}
        </div>
        {/* <div className="tw-border-t tw-border-grey tw-p-5 tw-text-greyM">
          We DO NOT accept any liability for any loss caused by anyone acting or
          refraining from taking action as a result of any service provided.
        </div> */}
      </div>
    </div>
  );
};

export default LockContractView;
