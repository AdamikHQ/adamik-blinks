import React from "react";
import { Account } from "~/types/adamik";
import { Wallet } from "~/types/wallets";

export type WalletContextType = {
  wallets: Wallet[];
  addWallet: (wallet: Wallet) => void;
  accounts: Account[];
  addAccounts: (accounts: Account[]) => void;
  setAccounts: (accounts: Account[]) => void;
  signature: string;
  setSignature: (signature: string) => void;
  transactionHash: string;
  setTransactionHash: (hash: string) => void;
  //setWalletMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  //isWalletMenuOpen: boolean;
  // TODO store chainId ?
  //isShowroom: boolean;
  //setShowroom: (isShowroom: boolean) => void;
};

export const WalletContext = React.createContext<WalletContextType>({
  //isShowroom: false,
  //setShowroom: () => {},
  wallets: [],
  addWallet: () => {},
  accounts: [],
  addAccounts: () => {},
  setAccounts: () => {},
  signature: "",
  setSignature: () => {},
  transactionHash: "",
  setTransactionHash: () => {},
  //setWalletMenuOpen: () => {},
  //isWalletMenuOpen: false,
});

export const useWallet = () => {
  const context = React.useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
