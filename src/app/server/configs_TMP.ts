import { TransactionMode } from "~/types/adamik";
import { BlinkConfig } from "~/types/blinks";

// TODO Replace with Vercel DB
const DEFAULT_BLINK_CONFIGS: BlinkConfig[] = [
  {
    id: "default-base",
    metadata: {
      name: "Donate to Adamik",
      url: "https://adamik.io",
      description: "The easiest way to scale blockchain integration",
      imageUrl: "https://picsum.photos/500/300",
    },
    transactionData: {
      chainId: "base",
      mode: TransactionMode.TRANSFER,
      sender: "", // Completed during blink execution
      recipient: "0x8bc6922Eb94e4858efaF9F433c35Bc241F69e8a6",
      amount: "100000000000000", // 0.0001 ETH
      amountUSD: "10",
    },
  },
  {
    id: "default-osmosis",
    metadata: {
      name: "Donate to Adamik",
      url: "https://adamik.io",
      description: "The easiest way to scale blockchain integration",
      imageUrl: "https://picsum.photos/500/300",
    },
    transactionData: {
      chainId: "osmosis",
      mode: TransactionMode.TRANSFER,
      sender: "", // Completed during blink execution
      recipient: "osmo1tkepfylhl7fmkrzsvphky2z0r7upvr9tjukcuw",
      amount: "100000", // 0.1 OSMO
      amountUSD: "10",
    },
  },
  {
    id: "default",
    metadata: {
      name: "Donate to Hakim",
      url: "https://adamik.io",
      description: "The easiest way to scale blockchain integration",
      imageUrl: "https://picsum.photos/500/300",
    },
    transactionData: {
      chainId: "base",
      mode: TransactionMode.TRANSFER,
      sender: "", // Completed during blink execution
      recipient: "0xbD69C010bfa8C166346C57239D25e15F61686A37",
      amount: "100000000000000000", // 1 ETH
      amountUSD: "10",
    },
  },
  {
    id: "160922",
    metadata: {
      name: "Donate 10 USD of ETH token",
      url: "https://adamik.io",
      description: "Payment of 10 USD equivalent of ETH (Linea)",
      imageUrl: "https://picsum.photos/500/300",
    },
    transactionData: {
      chainId: "linea",
      mode: TransactionMode.TRANSFER,
      sender: "", // Completed during blink execution
      recipient: "0x0dc9b9fb11f927f94c138ec2fe0cb0e635e1a215",
      amountUSD: "10",
      amount: "4200000000000000",
    },
  },
  {
    id: "080287",
    metadata: {
      name: "Donate 5 USD of ETH token",
      url: "https://adamik.io",
      description: "Payment of 5 USD equivalent of ETH (Arbitrum)",
      imageUrl: "https://picsum.photos/500/300",
    },
    transactionData: {
      chainId: "arbitrum",
      mode: TransactionMode.TRANSFER,
      sender: "", // Completed during blink execution
      recipient: "0x0dc9b9fb11f927f94c138ec2fe0cb0e635e1a215",
      amountUSD: "5",
      amount: "2100000000000000",
    },
  },
  {
    id: "151020",
    metadata: {
      name: "Donate 5 USD with Meria",
      url: "https://adamik.io",
      description: "Delegate 5 USD of ATOM tokens to Meria validator",
      imageUrl: "https://picsum.photos/500/300",
    },
    transactionData: {
      chainId: "cosmoshub",
      mode: TransactionMode.DELEGATE,
      sender: "", // Completed during blink execution
      recipient: "", // Useless for staking
      validatorAddress: "cosmosvaloper1wrx0x9m9ykdhw9sg04v7uljme53wuj03aa5d4f",
      amountUSD: "5",
      amount: "1050000",
    },
  },
  {
    id: "rootstock",
    metadata: {
      name: "Donate 5 USD with Rootstock",
      url: "https://adamik.io",
      description: "Payment of 5 USD equivalent of ETH (Rootstock)",
      imageUrl: "https://picsum.photos/500/300",
    },
    transactionData: {
      chainId: "rootstock",
      mode: TransactionMode.TRANSFER,
      sender: "", // Completed during blink execution
      recipient: "0x0dc9b9fb11f927f94c138ec2fe0cb0e635e1a215", // Useless for staking
      amountUSD: "5",
      amount: "79048000000000",
    },
  },
  {
    id: "rootstock-testnet",
    metadata: {
      name: "Donate 5 USD with Rootstock",
      url: "https://adamik.io",
      description: "Payment of 5 USD equivalent of ETH (Rootstock)",
      imageUrl: "https://picsum.photos/500/300",
    },
    transactionData: {
      chainId: "rootstock-testnet",
      mode: TransactionMode.TRANSFER,
      sender: "", // Completed during blink execution
      recipient: "0x0dc9b9fb11f927f94c138ec2fe0cb0e635e1a215", // Useless for staking
      amountUSD: "5",
      amount: "79048000000000",
    },
  },
];

export { DEFAULT_BLINK_CONFIGS };
