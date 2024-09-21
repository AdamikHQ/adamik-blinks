"use client";

import { wallets as cosmosWallets } from "@cosmos-kit/keplr";
import { ChainProvider } from "@cosmos-kit/react-lite";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { assets, chains } from "chain-registry";
import React, { useState } from "react";
import { Account } from "~/types/adamik";
import { WalletContext } from "../hooks/useWallet";
import { Wallet } from "~/types/wallets";

// TODO Use this for chainID
//const localStorage = typeof window !== "undefined" ? window.localStorage : null;

export const WalletProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [signature, setSignature] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string>("");
  //const [isShowroom, setShowroom] = useState<boolean>(false);
  //const [isWalletMenuOpen, setWalletMenuOpen] = useState(false);

  /*
  useEffect(() => {
    const localDataAddresses = localStorage?.getItem("AdamikClientAddresses");
    setAccounts(localDataAddresses ? JSON.parse(localDataAddresses) : []);

    const localDataClientState = localStorage?.getItem("AdamikClientState");
    const localDataClientStateParsed = JSON.parse(localDataClientState || "{}");
    setShowroom(localDataClientStateParsed?.isShowroom || false);
  }, []);

  useEffect(() => {
    if (accounts.length > 0) {
      setShowroom(false);
    }
  }, [accounts]);
  */

  const addWallet = (wallet: Wallet) => {
    const exist = wallets.find((w) => w.id === wallet.id);
    if (!exist) {
      setWallets([...wallets, wallet]);
    }
  };

  const addAccounts = (newAccounts: Account[]) => {
    setAccounts((oldAccounts) => {
      const mergedAccounts = [...oldAccounts, ...newAccounts];

      const uniqueAccounts = mergedAccounts.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.address === value.address && t.chainId === value.chainId
          )
      );

      /*
      localStorage?.setItem(
        "AdamikClientAddresses",
        JSON.stringify(uniqueAccounts)
      );
      */

      return uniqueAccounts;
    });
  };

  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        checkInstallationImmediately: false,
        logging: { developerMode: false },
        dappMetadata: {
          name: "Adamik Blinks",
          url:
            typeof window !== "undefined"
              ? window.location.host
              : "https://blinks.adamik.io/",
        },
      }}
    >
      <ChainProvider
        chains={chains} // supported chains
        assetLists={assets} // supported asset lists
        wallets={cosmosWallets} // supported wallets (only keplr desktop wallet for now)
      >
        <WalletContext.Provider
          value={{
            wallets,
            addWallet,
            accounts,
            addAccounts,
            setAccounts,
            signature,
            setSignature,
            transactionHash,
            setTransactionHash,
            //isShowroom,
            /*
            setShowroom: (isShowroom: boolean) => {
              const localData = localStorage?.getItem("AdamikClientState");
              const oldLocalData = JSON.parse(localData || "{}");
              localStorage?.setItem(
                "AdamikClientState",
                JSON.stringify({ ...oldLocalData, isShowroom: isShowroom })
              );
              setShowroom(isShowroom);
            },
            */
          }}
        >
          {children}
        </WalletContext.Provider>
      </ChainProvider>
    </MetaMaskProvider>
  );
};
