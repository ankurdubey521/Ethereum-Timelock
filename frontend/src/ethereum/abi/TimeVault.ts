export const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "trustedForwarder",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
    ],
    name: "TimeLockDepositClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
    ],
    name: "TimeLockDepositCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
    ],
    name: "claimDeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "minimumReleaseTimestamp",
        type: "uint256",
      },
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "createErc20TimeLockDeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "minimumReleaseTimestamp",
        type: "uint256",
      },
    ],
    name: "createEthTimeLockDeposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "depositIdToDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "depositId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "erc20token",
        type: "address",
      },
      {
        internalType: "enum TimeVault.TimeLockDepositType",
        name: "depositType",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "minimumReleaseTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "claimed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "depositor",
        type: "address",
      },
    ],
    name: "getDepositsByDepositor",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "depositId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "depositor",
            type: "address",
          },
          {
            internalType: "address payable",
            name: "receiver",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "erc20token",
            type: "address",
          },
          {
            internalType: "enum TimeVault.TimeLockDepositType",
            name: "depositType",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "minimumReleaseTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "claimed",
            type: "bool",
          },
        ],
        internalType: "struct TimeVault.TimeLockDeposit[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "getDepositsByReceiver",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "depositId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "depositor",
            type: "address",
          },
          {
            internalType: "address payable",
            name: "receiver",
            type: "address",
          },
          {
            internalType: "contract IERC20",
            name: "erc20token",
            type: "address",
          },
          {
            internalType: "enum TimeVault.TimeLockDepositType",
            name: "depositType",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "minimumReleaseTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "claimed",
            type: "bool",
          },
        ],
        internalType: "struct TimeVault.TimeLockDeposit[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "isTrustedForwarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
