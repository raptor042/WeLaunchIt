import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { rpcUrls, ChainIds, ChainsInfo } from "@dex/constants/data";

// import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";
import { useToasts } from "react-toast-notifications";
import pairABI from "@dex/Pair.json"
import pairERC20ABI from "@dex/Pair(ERC20).json"
import { FormContext } from "../Form";
import { useLiveQuery } from "dexie-react-hooks";

const providerOptions = {
  // coinbasewallet: {
  //   package: CoinbaseWalletSDK,
  //   options: {
  //     appName: "Web 3 Modal Demo",
  //     infuraId: process.env.NEXT_PUBLIC_INFURA_KEY
  //   }
  // },
  walletconnect: {
    package: WalletConnect,
    options: {
      // url: "wss://small-green-river.bsc-testnet.discover.quiknode.pro/b801e263f1872da7cd0f569db2d11c9e0e4f6739/",
      rpc: rpcUrls
    }
  }
};

const modalTheme = {
  background: "#05895c",
  main: "white",
  secondary: "white",
  border: "#02692c",
  hover: "#05a95c"
};

export interface IWeb3Context {
  web3?: Web3;
  connect: Function;
  disconnect: Function;
  account?: string;
  isConnected: boolean;
  chainId: number;
  switchNetwork: Function;
  setUserLockedPair: Function;
}

export interface Lock {
  id: number;
  token: string;
  owner: string;
  amount: string;
  lockDate: number;
  tgeDate: number;
  unlockedAmount: number;
  description: string;
  cycle: number;
}

export const Web3Context = createContext<IWeb3Context>({
  web3: undefined,
  connect: () => {},
  disconnect: () => {},
  account: undefined,
  isConnected: false,
  chainId: 1,
  switchNetwork: () => {},
  setUserLockedPair: () => {},
});

type Web3ProviderPropType = {
  children?: ReactNode;
};

const NetworkErrorToast = ({
  handleSwitch
}: {
  handleSwitch: (chainId: string) => void;
}) => {
  const env: "development" | "product" = (process.env.NEXT_PUBLIC_PROD_ENV ||
    "development") as "development" | "product";

  return (
    <p className="tw-m-4">
      Provide only{" "}
      <span
        style={{ borderBottom: "1px solid", cursor: "pointer" }}
        onClick={() => handleSwitch("0x" + ChainIds[env][0].toString(16))}
      >
        Ethereum
      </span>{" "}
      and{" "}
      <span
        style={{ borderBottom: "1px solid", cursor: "pointer" }}
        onClick={() => handleSwitch("0x" + ChainIds[env][1].toString(16))}
      >
        BSC
      </span>
    </p>
  );
};

export const Web3Provider = (props: Web3ProviderPropType) => {
  const [web3, setWeb3] = useState<Web3>();
  const [chainId, setChainId] = useState<number>(1);
  const [account, setAccount] = useState<string>();
  const [isConnected, toggleConnection] = useState<boolean>(false);
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  const { addToast, removeToast } = useToasts();
  const {
    setPair,
  } = useContext(FormContext);

  useEffect(() => {
    setWeb3Modal(
      new Web3Modal({
        theme: modalTheme,
        providerOptions
      })
    );
  }, []);

  const reset = useCallback(() => {
    setWeb3(undefined);
    setAccount(undefined);
    toggleConnection(false);
  }, []);

  const switchNetwork = useCallback(async (chainId: string, _provider: any) => {
    try {
      await _provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }]
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await _provider.request({
            method: "wallet_addEthereumChain",
            params: [ChainsInfo[Number(chainId)]]
          });
        } catch (addError) {
          throw addError;
        }
      }
    }
  }, []);

  const setUserLockedPair = useCallback(async (pairAddress: string, id: number, amount: number, ops: string) => {
    
  }, []);

  const subscribeProvider = useCallback(
    (provider: any) => {
      const env: "development" | "product" = (process.env
        .NEXT_PUBLIC_PROD_ENV || "development") as "development" | "product";

      if (!provider) return;

      provider.on("disconnect", () => {
        reset();
      });

      provider.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) reset();
        else setAccount(Web3.utils.toChecksumAddress(accounts[0]));
      });

      provider.on("chainChanged", async (chainId: number) => {
        setChainId(Number(chainId));
        if (ChainIds[env].includes(Number(chainId))) {
          removeToast("toastNetworkError");
          if (provider) {
            const _web3 = new Web3(provider);
            const _accounts = await _web3.eth.getAccounts();
            const _account = _web3.utils.toChecksumAddress(_accounts[0]);
            const _chainId = await _web3.eth.getChainId();
            setWeb3(_web3);
            setChainId(Number(_chainId));
            setAccount(_account);
            toggleConnection(true);
          }
        } else {
          addToast(
            <NetworkErrorToast
              handleSwitch={(chainId: string) => {
                switchNetwork(chainId, provider);
              }}
            />,
            { appearance: "error", autoDismiss: false, id: "toastNetworkError" }
          );
        }
      });
    },
    [reset, addToast, removeToast, switchNetwork]
  );

  const disconnect = useCallback(async () => {
    if (web3 && web3.currentProvider) {
      const _provider: any = web3.currentProvider;
      if (_provider.close) await _provider.close();
    }
    if (web3Modal) {
      await web3Modal.clearCachedProvider();
    }
    reset();
  }, [web3Modal, web3, reset]);

  const connect = useCallback(async () => {
    if (!web3Modal) return;

    try {
      const env: "development" | "product" = (process.env
        .NEXT_PUBLIC_PROD_ENV || "development") as "development" | "product";

      const _provider = await web3Modal.connect();

      if (_provider === null) return;

      const _web3 = new Web3(_provider);
      setWeb3(_web3);

      await subscribeProvider(_provider);

      const _accounts = await _web3.eth.getAccounts();
      const _account = _web3.utils.toChecksumAddress(_accounts[0]);
      const _chainId = await _web3.eth.getChainId();
      setChainId(Number(_chainId));

      if (!ChainIds[env].includes(Number(_chainId))) {
        addToast(
          <NetworkErrorToast
            handleSwitch={(chainId: string) => {
              switchNetwork(chainId, _provider);
            }}
          />,
          { appearance: "error", autoDismiss: false, id: "toastNetworkError" }
        );
      }

      setAccount(_account);
      toggleConnection(true);
    } catch (e) {
      await web3Modal.toggleModal();
    }
  }, [web3Modal, subscribeProvider, switchNetwork, addToast]);

  return (
    <Web3Context.Provider
      value={{
        web3,
        connect,
        disconnect,
        account,
        isConnected,
        chainId,
        switchNetwork,
        setUserLockedPair
      }}
    >
      {props.children}
    </Web3Context.Provider>
  );
};
