import { Transaction } from "~/types/adamik";

declare global {
  interface Window {
    unisat: UnisatWalletInterface;
    litescribe: UnisatWalletInterface; // this is a fork of Unisat, hence the same interface
  }
}

export interface Wallet {
  id: string;
  families: string[];
  icon: string;
  withoutBroadcast: boolean;
  connect: () => Promise<string[]>;
  getAddresses: () => Promise<string[]>;
  getDiscoveryMethod?: () => Promise<string[]>; // pubKey for cosmos, address for ethereum
  changeAddressEvent?: (callback: (address: string) => void) => void;
}

export enum WalletName {
  METAMASK = "metamask",
  KEPLR = "keplr",
  PERA = "pera",
  UNISAT = "unisat",
  LITESCRIBE = "litescribe",
}

export type WalletConnectorProps = {
  transactionPayload?: Transaction;
};

/**
 * Unisat Wallet Interface types from {@link https://github.com/unisat-wallet/extension/blob/04cbfd6e7f7953815d35d8f77df457388fea2707/src/background/controller/wallet.ts}
 * */
export type UnisatWalletInterface = {
  signPsbt(psbtHex: string): Promise<string>;
  disconnect(): Promise<void>;
  requestAccounts(): Promise<string[]>;
};
