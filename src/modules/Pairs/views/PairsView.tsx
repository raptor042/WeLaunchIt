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

import { Web3Context } from "@dex/contexts/Web3";

import {
  ContractAddresses,
  SwapRouters,
  networkTypeList,
  routerTypeList
} from "@dex/constants/data";

const TaxContractView = () => {
  const {
    pairAddress,
    pair
  } = useContext(FormContext);
  const [pairs, setPairs] = useState<string[]>([])

  useEffect(() => {
    const pairs = localStorage.getItem("pairs")?.split("+")
    if(pairs) {
      setPairs(pairs)
    }
  }, [pair])

  return (
    <div className={styles.taxContractRoot}>
      <div className={styles.taxContractContainer}>
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
            pairs.map((pair: string) => (
              <div className="tw-flex tw-mb-6">
                <div className="tw-font-bold tw-w-[50%]">{pair.split("-")[0]}</div>
                <div>{pair.split("-")[1]}</div>
              </div>
            ))
          }
          {pairs.length == 0 && <div className="tw-text-greyM tw-py-10 tw-text-center tw-font-bold tw-text-md">Nothing Found.....</div>}
        </div>
        {/* <div className="tw-border-t tw-border-grey tw-p-5 tw-text-greyM">
          We DO NOT accept any liability for any loss caused by anyone acting or
          refraining from taking action as a result of any service provided.
        </div> */}
      </div>
    </div>
  );
};

export default TaxContractView;
