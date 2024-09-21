import { TransactionMode } from "~/types/adamik";
import { BlinkConfig } from "~/types/blinks";

// TODO Replace with Vercel DB
const BLINK_CONFIGS: Map<string, BlinkConfig> = new Map([
  [
    "default",
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
      },
    },
  ],
]);

export { BLINK_CONFIGS };
