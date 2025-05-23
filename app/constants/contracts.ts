export const raffleContractConfig = {
  address: {
    "31337": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    "11155111": "0xE8B2dcbaE4164EeeCe15a4aD056b2f2A76EDeCB7"
  },
  abi: [
    {
      type: "constructor",
      stateMutability: "undefined",
      payable: false,
      inputs: [
        { type: "address", name: "vrfCoordinator" },
        { type: "uint256", name: "entranceFee" },
        { type: "bytes32", name: "gasLane" },
        { type: "uint256", name: "subscriptionId" },
        { type: "uint32", name: "callbackGasLimit" },
        { type: "uint256", name: "interval" },
        { type: "bool", name: "enableNativePayment" }
      ]
    },
    {
      type: "error",
      name: "OnlyCoordinatorCanFulfill",
      inputs: [
        { type: "address", name: "have" },
        { type: "address", name: "want" }
      ]
    },
    {
      type: "error",
      name: "OnlyOwnerOrCoordinator",
      inputs: [
        { type: "address", name: "have" },
        { type: "address", name: "owner" },
        { type: "address", name: "coordinator" }
      ]
    },
    { type: "error", name: "Raffle__NotEnoughETHEntered", inputs: [] },
    { type: "error", name: "Raffle__NotOpen", inputs: [] },
    { type: "error", name: "Raffle__TransferFailed", inputs: [] },
    {
      type: "error",
      name: "Raffle__UpkeepNotNeeded",
      inputs: [
        { type: "uint256", name: "currentBalance" },
        { type: "uint256", name: "numPlayers" },
        { type: "uint8", name: "raffleState" }
      ]
    },
    { type: "error", name: "ZeroAddress", inputs: [] },
    {
      type: "event",
      anonymous: false,
      name: "CoordinatorSet",
      inputs: [{ type: "address", name: "vrfCoordinator", indexed: false }]
    },
    {
      type: "event",
      anonymous: false,
      name: "NativePaymentUpdated",
      inputs: [{ type: "bool", name: "enabled", indexed: false }]
    },
    {
      type: "event",
      anonymous: false,
      name: "OwnershipTransferRequested",
      inputs: [
        { type: "address", name: "from", indexed: true },
        { type: "address", name: "to", indexed: true }
      ]
    },
    {
      type: "event",
      anonymous: false,
      name: "OwnershipTransferred",
      inputs: [
        { type: "address", name: "from", indexed: true },
        { type: "address", name: "to", indexed: true }
      ]
    },
    {
      type: "event",
      anonymous: false,
      name: "RaffleEnter",
      inputs: [{ type: "address", name: "player", indexed: true }]
    },
    {
      type: "event",
      anonymous: false,
      name: "RequestedRaffleWinner",
      inputs: [{ type: "uint256", name: "requestId", indexed: true }]
    },
    {
      type: "event",
      anonymous: false,
      name: "WinnerPicked",
      inputs: [{ type: "address", name: "winner", indexed: true }]
    },
    {
      type: "function",
      name: "acceptOwnership",
      constant: false,
      payable: false,
      inputs: [],
      outputs: []
    },
    {
      type: "function",
      name: "checkUpkeep",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [{ type: "bytes", name: "" }],
      outputs: [
        { type: "bool", name: "upkeepNeeded" },
        { type: "bytes", name: "" }
      ]
    },
    {
      type: "function",
      name: "enterRaffle",
      constant: false,
      stateMutability: "payable",
      payable: true,
      inputs: [],
      outputs: []
    },
    {
      type: "function",
      name: "getEnableNativePayment",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [{ type: "bool", name: "" }]
    },
    {
      type: "function",
      name: "getEntranceFee",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [{ type: "uint256", name: "" }]
    },
    {
      type: "function",
      name: "getInterval",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [{ type: "uint256", name: "" }]
    },
    {
      type: "function",
      name: "getNumWords",
      constant: true,
      stateMutability: "pure",
      payable: false,
      inputs: [],
      outputs: [{ type: "uint256", name: "" }]
    },
    {
      type: "function",
      name: "getNumberOfPlayers",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [{ type: "uint256", name: "" }]
    },
    {
      type: "function",
      name: "getPlayer",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [{ type: "uint256", name: "index" }],
      outputs: [{ type: "address", name: "" }]
    },
    {
      type: "function",
      name: "getRaffleState",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [{ type: "uint8", name: "" }]
    },
    {
      type: "function",
      name: "getRecentWinner",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [{ type: "address", name: "" }]
    },
    {
      type: "function",
      name: "getRequestConfirmations",
      constant: true,
      stateMutability: "pure",
      payable: false,
      inputs: [],
      outputs: [{ type: "uint256", name: "" }]
    },
    {
      type: "function",
      name: "getTimestamp",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [{ type: "uint256", name: "" }]
    },
    {
      type: "function",
      name: "owner",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [{ type: "address", name: "" }]
    },
    {
      type: "function",
      name: "performUpkeep",
      constant: false,
      payable: false,
      inputs: [{ type: "bytes", name: "" }],
      outputs: []
    },
    {
      type: "function",
      name: "rawFulfillRandomWords",
      constant: false,
      payable: false,
      inputs: [
        { type: "uint256", name: "requestId" },
        { type: "uint256[]", name: "randomWords" }
      ],
      outputs: []
    },
    {
      type: "function",
      name: "s_vrfCoordinator",
      constant: true,
      stateMutability: "view",
      payable: false,
      inputs: [],
      outputs: [{ type: "address", name: "" }]
    },
    {
      type: "function",
      name: "setCoordinator",
      constant: false,
      payable: false,
      inputs: [{ type: "address", name: "_vrfCoordinator" }],
      outputs: []
    },
    {
      type: "function",
      name: "setEnableNativePayment",
      constant: false,
      payable: false,
      inputs: [{ type: "bool", name: "enableNativePayment" }],
      outputs: []
    },
    {
      type: "function",
      name: "transferOwnership",
      constant: false,
      payable: false,
      inputs: [{ type: "address", name: "to" }],
      outputs: []
    }
  ]
} as const
