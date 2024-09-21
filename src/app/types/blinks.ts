import { TransactionData } from "./adamik";

type BlinkMetadata = {
  name: string; // From generator
  url: string; // From generator
  description: string; // From generator
  imageUrl: string; // From generator
};

/*
type BlinkTransactionData = {
  chainId: string; // from ???
  sender: string; // from wallet
  recipient: string; // from generator,
  amount: string; // from generator,
  encoded: string; // from Adamik API
};
*/

type BlinkConfig = {
  id: string;
  metadata: BlinkMetadata;
  //transactionData: BlinkTransactionData;
  transactionData: TransactionData;
};

export type { BlinkConfig, BlinkMetadata };
