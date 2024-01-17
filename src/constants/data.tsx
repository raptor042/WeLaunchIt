export const tokenTypeList: { [key: number]: string } = {
  1: "Standard",
  2: "Rewards",
  3: "Reflections"
};

export const networkTypeList: { [key: number]: string } = {
  1: "Ethereum Mainnet",
  // 5: "Ethereum Testnet Goerli",
  56: "BNB Smart Chain",
  // 97: "BSC Testnet"
};

export const lockTypeList: { [key: number]: string } = {
  0: "Lp Token Locker",
  1: "Normal Token Locker"
}

export const EOUList: { [key: number]: string } = {
  0: "Edit",
  1: "Unlock"
}

export const routerTypeList: { [key: number]: string } = {
  1: "Uniswap V2",
  5: "Uniswap V2",
  56: "PancakeSwap V2",
  97: "PancakeSwap V2"
};

export const rpcUrls = {
  1: "https://eth-mainnet.g.alchemy.com/v2/zcNIdlPU5Vn-2U0uQpfi0AZf11F4rrV5", // Ethereum Mainnet
  5: "https://eth-goerli.g.alchemy.com/v2/KqDagOiXKFQ8T_QzPNpKBk1Yn-3Zgtgl", // Ethereum Testnet Goerli
  56: "https://bsc-dataseed.binance.org/", // Binance Smart Chain
  97: "https://data-seed-prebsc-1-s1.binance.org:8545" // BSC Testnet
};

export const ChainIds = {
  development: [5, 97],
  product: [1, 56]
};

export const chains: { [key: number]: string } = {
  1: "ether",
  56: "bsc"
}

export const SwapRouters: { [key: number]: any } = {
  5: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  97: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
  1: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  56: "0x10ED43C718714eb63d5aA57B78B54704E256024E"
};

export const ContractAddresses: { [key: number]: any } = {
  // 5: [
  //   "0x422c19D87369dcEc2d684fc5e1522431F89A96C4",
  //   "0xf2dc4bea1dc9D220A1159a2b2A07bA9bE55A2CB1",
  //   "",
  //   ""
  // ],
  // 97: [
  //   "0x2CeA7648636e0816732104f76b002492cCDd5cB8",
  //   "0x6551BA54Ba118Db373D059f7d81b6fa9248ACB63",
  //   "",
  //   "0x85Af96fCBb1BC348fB7cD760214d0599eFB969e5"
  // ],
  1: [
    "0x960DAC5533D9befd4eFdDe427c67714C2E20032f",
    "",
    "",
    ""
  ],
  56: [
    "0xCc89F132E9cdd6e88Fa435c69Ef5e805267Bf803",
    "0x5901bD5a5b4dCf85A9FA59300dc8212c8210850f",
    "0xB8411eBcEf559881Df0229a48C1831417231849d",
    "0x57a871d20B27d49fccE044F3406dFe023780b0dB"
  ]
};

export const ChainsInfo: { [key: number]: any } = {
  1: {
    chainId: 1,
    chainName: "Ethereum Mainnet",
    rpcUrls: [rpcUrls[1]],
    blockExplorerUrls: ["https://etherscan.io/"]
  },
  5: {
    chainId: 5,
    chainName: "Goerli testnet",
    rpcUrls: [rpcUrls[5]],
    blockExplorerUrls: ["https://goerli.etherscan.io/"]
  },
  56: {
    chainId: 56,
    chainName: "Binance Smart Chain",
    rpcUrls: [rpcUrls[56]],
    blockExplorerUrls: ["https://bscscan.com/"]
  },
  97: {
    chainId: 97,
    chainName: "BSC Testnet",
    rpcUrls: [rpcUrls[97]],
    blockExplorerUrls: ["https://testnet.bscscan.com/"]
  }
};

export const daysWillLockedList = [
  "1 Month",
  "2 Month",
  "3 Month",
  "6 Month",
  "9 Month",
  "1 Year",
  "2 Year"
];

export const lpLockServiceList = ["Pinksale"];

export const antiBotList = ["0 block (false)"];

export const antiBotOptionList = [
  {
    disabled: false,
    name: "openTradeAtLaunch",
    text: "Do you want to open trade at launch?"
  },
  {
    disabled: true,
    name: "antiWale",
    text: "Anti-whale : Only one wallet is able to buy at one block"
  },
  {
    disabled: true,
    name: "antiBot",
    text: "Anti-Bot : Only less than 10 GWEI is valid for trade"
  }
];

export const minFeeLimit = 0;
export const maxFeeLimit = 15;
