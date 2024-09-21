// Represents the configuration of a blockchain.
export type Chain = {
  decimals: number;
  ticker: string;
  id: string;
  name: string;
  params: any;
  family: string;
  isTestNet: boolean;
  nativeId: string;
};

export type Account = {
  chainId: string;
  address: string;
  pubKey?: string;
  signer?: string;
};

// Enum to represent different transaction modes.
export enum TransactionMode {
  TRANSFER = "transfer",
  TRANSFER_TOKEN = "transferToken",
  DELEGATE = "delegate",
  UNDELEGATE = "undelegate",
  CLAIM_REWARDS = "claimRewards",
}

// Plain transaction object without additional metadata.
export type TransactionData = {
  chainId: string;
  mode: TransactionMode;
  amount: string;
  amountUSD?: string;
  sender: string;
  recipient: string;
  validatorAddress?: string;
  tokenId?: string;
  fees?: string;
  gas?: string;
  nonce?: string;
  format?: string;
  memo?: string;
  params?: {
    pubKey?: string;
  };
};

// Full transaction object including metadata like status and signature.
export type Transaction = {
  data: TransactionData;
  encoded: string;
  signature: string;
  status: { errors: { message: string }[]; warnings: { message: string }[] };
};
