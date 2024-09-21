"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { useChains } from "~/client/hooks/useChains";
import { BLINK_CONFIGS } from "~/server/configs_TMP";
import { Metamask } from "~/client/wallets/metamask";
import { Account, Transaction, TransactionData } from "~/types/adamik";
import { BlinkCard } from "~/client/ui/BlinkCard";
import { useWalletClient } from "@cosmos-kit/react-lite";
import { Keplr } from "~/client/wallets/keplr";
//import { transactionEncode } from "~/client/api/adamik/encode";
//import { transactionBroadcast } from "~/client/api/adamik/broadcast";
import { useEncodeTransaction } from "~/client/hooks/useEncodeTransaction";
import { useBroadcastTransaction } from "~/client/hooks/useBroadcastTransaction";

export default function Blink({ params }: { params: { blinkId: string } }) {
  const { blinkId } = params;

  const { sdk: metamaskSdk } = useSDK();
  const keplrSdk = useWalletClient("keplr-extension");

  const [evmAccounts, setEvmAccounts] = useState<Account[]>([]);
  const [craftEvmTransaction, setCraftEvmTransaction] =
    useState<boolean>(false);
  const [signEvmTransaction, setSignEvmTransaction] = useState<boolean>(false);
  const [evmTransaction, setEvmTransaction] = useState<Transaction | undefined>(
    undefined
  );

  const [cosmosAccounts, setCosmosAccounts] = useState<Account[]>([]);
  const [craftCosmosTransaction, setCraftCosmosTransaction] =
    useState<boolean>(false);
  const [cosmosTransaction, setCosmosTransaction] = useState<
    Transaction | undefined
  >(undefined);

  const [bitcoinAccounts, setBitcoinAccounts] = useState<Account[]>([]); // TODO

  const { data: chains } = useChains();

  // TODO Handle UI setting + persistence in local storage
  // TODO Dissociate a blink from a chainId, i.e allow a blink to work with different chainIds
  //const [selectedChainId, setSelectedChainId] = useState<string>("osmosis");

  const blinkConfig = useMemo(
    () => BLINK_CONFIGS.get(blinkId) || BLINK_CONFIGS.get("default")!,
    [blinkId]
  );

  const { mutate: encodeTransaction } = useEncodeTransaction();
  const { mutate: broadcastTransaction } = useBroadcastTransaction();

  const selectedChain = useMemo(
    () =>
      (chains &&
        Object.values(chains).find(
          (chain) => chain.id === blinkConfig.transactionData.chainId
        )) ||
      undefined,
    [blinkConfig.transactionData.chainId, chains]
  );

  const evmChains = useMemo(
    () =>
      chains && Object.values(chains).filter((chain) => chain.family === "evm"),
    [chains]
  );

  const evmChainIds = useMemo(
    () => evmChains && evmChains.map((chain) => chain.id),
    [evmChains]
  );

  const cosmosChains = useMemo(
    () =>
      chains &&
      Object.values(chains).filter((chain) => chain.family === "cosmos"),
    [chains]
  );

  const cosmosChainIds = useMemo(
    () => cosmosChains && cosmosChains.map((chain) => chain.id),
    [cosmosChains]
  );

  // Build a mapping table of: adamik chain IDs <> cosmos native chain IDs
  const cosmosChainIdsMapping = useMemo(() => new Map<string, string>(), []);
  useEffect(() => {
    chains &&
      Object.values(chains)
        .filter((chain) => chain.family === "cosmos")
        .forEach((chain) =>
          cosmosChainIdsMapping.set(chain.id, chain.nativeId)
        );
  }, [chains, cosmosChainIdsMapping]);

  const metamaskAction = useCallback(() => {
    if (!evmAccounts.length) {
      Metamask.getAccounts(metamaskSdk!, evmChainIds!, setEvmAccounts);
    }

    if (evmAccounts.length) {
      setCraftEvmTransaction(true);
    }
  }, [evmAccounts.length, evmChainIds, metamaskSdk]);

  useEffect(() => {
    if (craftEvmTransaction && evmAccounts.length) {
      // FIXME How to ensure to only propose chainIds for available addresses ?
      const sender = evmAccounts.find(
        (account) => account.chainId === blinkConfig.transactionData.chainId
      )?.address;

      if (!sender) {
        return;
      }

      const transactionData: TransactionData = {
        ...blinkConfig.transactionData,
        sender,
        format: "json",
      };

      //transactionEncode(transactionData, setEvmTransaction);
      encodeTransaction(transactionData, {
        onSuccess: (settledTransaction) => {
          setEvmTransaction(settledTransaction);
          setSignEvmTransaction(true);
        },
      });

      setCraftEvmTransaction(false);
    }
  }, [
    blinkConfig.transactionData,
    craftEvmTransaction,
    encodeTransaction,
    evmAccounts,
  ]);

  useEffect(() => {
    if (signEvmTransaction && evmTransaction?.encoded) {
      Metamask.signAndBroadcast(
        metamaskSdk!,
        evmChains!,
        evmTransaction!,
        setSignEvmTransaction,
        setEvmTransaction
      );
    }
  }, [evmChains, evmTransaction, metamaskSdk, signEvmTransaction]);

  /*
  const keplrAction = useCallback(() => {
    const chainId = blinkConfig.transactionData.chainId;

    if (!cosmosAccounts.length) {
      Keplr.getAccounts(
        keplrSdk!,
        cosmosChainIdsMapping,
        setCosmosAccounts,
        setCraftCosmosTransaction
      );
    }
  }, [
    blinkConfig.transactionData.chainId,
    cosmosAccounts.length,
    cosmosChainIdsMapping,
    keplrSdk,
  ]);

  useEffect(() => {
    const chainId = blinkConfig.transactionData.chainId;

    if (craftCosmosTransaction && cosmosAccounts.length) {
      // FIXME How to ensure to only propose chainIds for available addresses ?
      const sender = cosmosAccounts.find(
        (account) => account.chainId === chainId
      )?.address;

      if (!sender) {
        return;
      }

      const transactionData: TransactionData = {
        ...blinkConfig.transactionData,
        sender,
        format: "json",
      };

      transactionEncode(transactionData, setCosmosTransaction);

      if (cosmosTransaction?.encoded) {
        Keplr.sign(
          keplrSdk!,
          cosmosChains!,
          cosmosTransaction!,
          setCosmosTransaction
        );

        if (cosmosTransaction?.signature) {
          if (cosmosChainIds?.includes(chainId!)) {
            transactionBroadcast(cosmosTransaction);
          }
        }
      }
    }
  }, [
    blinkConfig.transactionData,
    cosmosAccounts,
    cosmosChainIds,
    cosmosChainIdsMapping,
    cosmosChains,
    cosmosTransaction,
    craftCosmosTransaction,
    keplrSdk,
  ]);
  */

  const action = useCallback(() => {
    const chainId = blinkConfig.transactionData.chainId;
    if (chainId) {
      if (evmChainIds?.includes(chainId)) {
        metamaskAction();
      } else if (cosmosChainIds?.includes(chainId)) {
        //keplrAction();
      }
    }
  }, [
    blinkConfig.transactionData.chainId,
    cosmosChainIds,
    evmChainIds,
    metamaskAction,
  ]);

  return (
    <BlinkCard
      config={blinkConfig}
      action={action}
      chain={selectedChain}
      //amount={blinkConfig.transactionData.amount}
      //setTransactionAmount={setTransactionAmount}
    />
  );
}
