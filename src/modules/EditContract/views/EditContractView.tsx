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

const EditContractView = () => {
  const { addToast } = useToasts();
  const {
    lockId,
    EOU,
    setEOU,
    newLockAmount,
    newUnlockDate
  } = useContext(FormContext);

  const { isConnected, account, web3, chainId, setUserLockedPair } = useContext(Web3Context);
  const [isLocking, toggleLocking] = useState<boolean>(false);

  const handleClick = useCallback(async () => {
    if (!isConnected) return;

    if(EOU == 0) {
      if(newLockAmount <= 0) {
        addToast("Lock amount is invalid, Must be greater than 0!", {
          appearance: "warning"
        });
      } else if(lockId < 0) {
        addToast("Lock amount is invalid, Must be greater than 0!", {
          appearance: "warning"
        });
      } else if(getTimeDiff()) {
        addToast("Unlock Date is invalid, Must be in the future!", {
          appearance: "warning"
        });
      } else {
        toggleLocking(true);

        if (!web3) return;
        const lock = new web3.eth.Contract(
          WeLockItABI.abi as any[],
          ContractAddresses[chainId][3]
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
          await lock.methods
            .editLock(
              lockId,
              numberToBN(newLockAmount),
              newUnlockDate.getTime()
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
            .on("confirmation", async (confirmationNumber: number, recepit: any) => {
              const lockId = recepit.events.LockUpdated.returnValues
                .id as number;
              const amount = recepit.events.LockUpdated.returnValues
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
        return;
      }
    } else if(EOU == 1) {
      if(lockId < 0) {
        addToast("Lock amount is invalid, Must be greater than 0!", {
          appearance: "warning"
        });
      } else {
        toggleLocking(true);
  
        if (!web3) return;
        const lock = new web3.eth.Contract(
          WeLockItABI.abi as any[],
          ContractAddresses[chainId][3]
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
          await lock.methods
            .unlock(
              lockId
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
            .on("confirmation", async (confirmationNumber: number, recepit: any) => {
              const lockId = recepit.events.LockRemoved.returnValues
                .id as number;
              const amount = recepit.events.LockRemoved.returnValues
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
        return;
      }
    }
  }, [
    lockId,
    EOU,
    setEOU,
    newLockAmount,
    newUnlockDate
  ]);

  const getTimeDiff = () => {
    const date0 = new Date().getTime()
    const date1 = newUnlockDate.getTime()
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
              <div className="tw-text-greyM">{EOU == 0 ? "Edit Lock Summary" : "Unlock Summary"}</div>
              <div className="tw-text-base tw-font-bold">LP Locker</div>
            </div>
          </div>
          {/* <div className="tw-text-greyM">
            The smart contract complies with the standard ERC20-BEP20 scheme.
            Liquidity and Marketing fee options are available.
          </div> */}
          <div className="tw-my-5 tw-w-full">
            <div className="tw-flex tw-mb-8">
              <div className="tw-font-bold tw-w-[50%]">Lock ID</div>
              <div>{lockId === 0 ? "-" : lockId}</div>
            </div>
            {EOU == 0 && <div className="tw-flex tw-mb-8">
              <div className="tw-font-bold tw-w-[50%]">New Lock Amount</div>
              <div>{newLockAmount}</div>
            </div>}
            {EOU == 0 && <div className="tw-flex tw-mb-8">
              <div className="tw-font-bold tw-w-[50%]">New Unlock Date</div>
              <div>{newUnlockDate.toDateString().length === 0 ? "-" : newUnlockDate.toDateString()}</div>
            </div>}
            {EOU == 0 && <Button
              className={`tw-w-[160px] tw-h-[44px] ${
                !isConnected ||
                isLocking ||
                ContractAddresses[chainId] === undefined
                  ? "tw-opacity-50 tw-pointer-events-none"
                  : ""
              }`}
              onClick={() => handleClick()}
            >
              {isLocking ? "Editing Lock..." : "Edit Lock"}
            </Button>}
            {EOU == 1 && <Button
              className={`tw-w-[160px] tw-h-[44px] ${
                !isConnected ||
                isLocking ||
                ContractAddresses[chainId] === undefined
                  ? "tw-opacity-50 tw-pointer-events-none"
                  : ""
              }`}
              onClick={() => handleClick()}
            >
              {isLocking ? "Unlocking..." : "Unlock"}
            </Button>}
            <p className="tw-text-negative tw-mt-4 tw-font-semi-bold">
            {isConnected &&
              ContractAddresses[chainId] === undefined &&
              "This Network is not supported"}
            </p>
          </div>
        </div>
        {/* <div className="tw-border-t tw-border-grey tw-p-5 tw-text-greyM">
          We DO NOT accept any liability for any loss caused by anyone acting or
          refraining from taking action as a result of any service provided.
        </div> */}
      </div>
    </div>
  );
};

export default EditContractView;
