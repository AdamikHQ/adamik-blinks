import { TransactionMode } from "~/types/adamik";
import { BlinkConfig } from "~/types/blinks";

// TODO Replace with Vercel DB
const BLINK_CONFIGS: Map<string, BlinkConfig> = new Map([
  [
    "default-base",
    {
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
  ],
  [
    "default-osmosis",
    {
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
      },
    },
  ],
  [
    "default",
    {
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
      },
    },
  ],

  [
    "08021987",
    {
      metadata: {
        name: "Donate 5$ of ARB token",
        url: "https://adamik.io",
        description: "Payment of $5 USD equivalent of ARB",
        imageUrl: "https://picsum.photos/500/300",
      },
      transactionData: {
        chainId: "arbitrum",
        mode: TransactionMode.TRANSFER,
        sender: "", // Completed during blink execution
        recipient: "0x0dc9b9fb11f927f94c138ec2fe0cb0e635e1a215",
        amountUSD: "5",
        amount: "82189529053998530", // 1 ETH
      },
    },
  ],
]);

export { BLINK_CONFIGS };
