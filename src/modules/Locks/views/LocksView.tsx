import React, { useContext, useCallback, useState, useEffect } from "react";
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

import { Lock, Web3Context } from "@dex/contexts/Web3";
import WeLockIt from "@dex/WeLockIt.json"
import pairABI from "@dex/Pair.json"
import pairERC20ABI from "@dex/Pair(ERC20).json"

import {
  ContractAddresses,
  SwapRouters,
  networkTypeList,
  routerTypeList
} from "@dex/constants/data";
import Link from "next/link";

const LocksView = () => {
  const {
    lockType
  } = useContext(FormContext);
  const { web3, chainId, account } = useContext(Web3Context);
  const [locks, setLocks] = useState<Lock[]>([])
  const [location, setLocation] = useState<string>()
  const [pair, setPair] = useState<string>()
  const [token, setToken] = useState<string>()

  useEffect(() => {
    setLocation(window.location.pathname)
    const getLocks = async () => {
      if(!web3) return;
      const locker = new web3.eth.Contract(
        WeLockIt.abi as any[],
        ContractAddresses[chainId][3]
      );
      console.log(ContractAddresses[chainId][3])
      try {
        const lpLocks = await locker.methods.lpLocksForUser(account).call()
        console.log(lpLocks)
        const normalLocks = await locker.methods.normalLocksForUser(account).call()
        console.log(normalLocks)
        const locks: Lock[] = lpLocks.concat(normalLocks)

        setLocks(locks)
      } catch (error) {
        console.log(error)
      }
    }
    getLocks()
  }, [lockType])

  const getPair = async (pairAddress: string) => {
    if(!web3) return;
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

      setPair(`${symbol0}/${symbol1}`)
    } catch (error) {
      console.log(error)
    }
  }

  const getToken = async (tokenAddress: string) => {
    if(!web3) return;
    const token = new web3.eth.Contract(
      pairERC20ABI.abi as any[],
      tokenAddress
    );
    try {
      const name = await token.methods.name().call()
      const symbol = await token.methods.symbol().call()
      console.log(name, symbol)

      setToken(`${name}/${symbol}`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={styles.LocksRoot}>
      <div className={styles.LocksContainer}>
        <div className="tw-p-7">
          <div className="tw-flex tw-items-center tw-mb-4">
            <div>{tMark}</div>
            <div className="tw-ml-3">
              <div className="tw-text-greyM">Pair Addresses</div>
              <div className="tw-text-base tw-font-bold">A List of your favorite pairs</div>
            </div>
          </div>
          {/* <div className="tw-text-greyM">
            The smart contract complies with the standard ERC20-BEP20 scheme.
            Liquidity and Marketing fee options are available.
          </div> */}
          {
            locks.map((lock: Lock, index) => (
              <div key={index} className="tw-flex tw-mb-6">
                {location == "/pair" &&
                  <>
                    <div className="tw-font-bold tw-w-[50%]">
                      <Link href={`/locks/${lock.token}`}>
                        {lock.token.slice(0, 4) + "..." + lock.token.slice(-3)}
                      </Link>
                    </div>
                    <div className="tw-font-bold tw-text-center tw-w-[50%]">{web3?.utils.fromWei(lock.amount, "ether")}</div>
                  </>
                }
                {location == "/locks" &&
                  <>
                    <div className="tw-font-bold tw-text-center tw-w-[25%]">
                      <Link href={`/locks/${lock.token}`}>
                        {lock.token.slice(0, 7) + "..." + lock.token.slice(-5)}
                      </Link>
                    </div>
                    <div className="tw-font-bold tw-text-center tw-w-[25%]">{web3?.utils.fromWei(lock.amount, "ether")}</div>
                    <div className="tw-text-center tw-font-bold tw-w-[25%]">{new Date(Number(lock.tgeDate) * 1000).toDateString()}</div>
                    <div className="tw-font-bold tw-text-end tw-w-[25%]">{lock.id}</div>
                  </>
                }
              </div>
            ))
          }
          {locks.length == 0 && <div className="tw-text-greyM tw-py-10 tw-text-center tw-font-bold tw-text-md">Nothing Found.....</div>}
        </div>
        {/* <div className="tw-border-t tw-border-grey tw-p-5 tw-text-greyM">
          We DO NOT accept any liability for any loss caused by anyone acting or
          refraining from taking action as a result of any service provided.
        </div> */}
      </div>
    </div>
  );
};

export default LocksView;
