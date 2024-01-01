import Web3 from "web3";
import { useCallback } from "react";

export const validateTokenName = (name: string) => {
  const length = name.length;
  return length >= 3 && length <= 64;
};
export const validateSymbol = (name: string) => {
  const length = name.length;
  return length >= 3 && length <= 6;
};
export const validateAddress = (address: string) => {
  return Web3.utils.isAddress(address as string);
};
