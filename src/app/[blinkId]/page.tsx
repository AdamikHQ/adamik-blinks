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
  const [signCosmosTransaction, setSignCosmosTransaction] =
    useState<boolean>(false);
  const [broadcastCosmosTransaction, setBroadcastCosmosTransaction] =
    useState<boolean>(false);
  const [cosmosTransaction, setCosmosTransaction] = useState<
    Transaction | undefined
  >(undefined);

  const [bitcoinAccounts, setBitcoinAccounts] = useState<Account[]>([]); // TODO

  const { data: chains } = useChains();

  // TODO Handle UI setting + persistence in local storage
  // TODO Dissociate a blink from a chainId, i.e allow a blink to work with different chainIds
  //const [selectedChainId, setSelectedChainId] = useState<string>("osmosis");

  console.log(blinkId);

  console.log(BLINK_CONFIGS);

  const blinkConfig = useMemo(
    () => BLINK_CONFIGS.get(blinkId) || BLINK_CONFIGS.get("default")!,
    [blinkId, BLINK_CONFIGS]
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

  // METAMASK //////////////////////////////////////////////////////////////////////////////

  // GET ADDRESSES
  const metamaskAction = useCallback(() => {
    if (evmAccounts.length) {
      setCraftEvmTransaction(true);
    } else {
      Metamask.getAccounts(
        metamaskSdk!,
        evmChainIds!,
        setEvmAccounts,
        setCraftEvmTransaction
      );
    }
  }, [evmAccounts.length, evmChainIds, metamaskSdk]);

  // CRAFT
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

      encodeTransaction(transactionData, {
        onSuccess: (settledTransaction) => {
          setEvmTransaction(settledTransaction);
          setSignEvmTransaction(true);
          setCraftEvmTransaction(false);
        },
      });
    }
  }, [
    blinkConfig.transactionData,
    craftEvmTransaction,
    encodeTransaction,
    evmAccounts,
  ]);

  // SIGN
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

  // KEPLR //////////////////////////////////////////////////////////////////////////////

  // GET ADDRESSES
  const keplrAction = useCallback(() => {
    if (cosmosAccounts.length) {
      setCraftCosmosTransaction(true);
    } else {
      Keplr.getAccounts(
        keplrSdk!,
        cosmosChainIdsMapping,
        setCosmosAccounts,
        setCraftCosmosTransaction
      );
    }
  }, [cosmosAccounts.length, cosmosChainIdsMapping, keplrSdk]);

  // CRAFT
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

      encodeTransaction(transactionData, {
        onSuccess: (settledTransaction) => {
          setCosmosTransaction(settledTransaction);
          setSignCosmosTransaction(true);
          setCraftCosmosTransaction(false);
        },
      });
    }
  }, [
    blinkConfig.transactionData,
    cosmosAccounts,
    craftCosmosTransaction,
    encodeTransaction,
  ]);

  // SIGN
  useEffect(() => {
    if (signCosmosTransaction && cosmosTransaction?.encoded) {
      Keplr.sign(
        keplrSdk!,
        cosmosChains!,
        cosmosTransaction!,
        setSignCosmosTransaction,
        setBroadcastCosmosTransaction,
        setCosmosTransaction
      );
    }
  }, [cosmosChains, cosmosTransaction, keplrSdk, signCosmosTransaction]);

  // BROADCAST
  useEffect(() => {
    if (broadcastCosmosTransaction && cosmosTransaction?.signature) {
      //transactionBroadcast(cosmosTransaction);
      broadcastTransaction(cosmosTransaction, {
        onSuccess: (settledTransaction) => {
          setCosmosTransaction(undefined);
          setBroadcastCosmosTransaction(false);
        },
      });
    }
  }, [broadcastCosmosTransaction, broadcastTransaction, cosmosTransaction]);

  const action = useCallback(() => {
    const chainId = blinkConfig.transactionData.chainId;
    if (chainId) {
      if (evmChainIds?.includes(chainId)) {
        metamaskAction();
      } else if (cosmosChainIds?.includes(chainId)) {
        keplrAction();
      }
    }
  }, [
    blinkConfig.transactionData.chainId,
    cosmosChainIds,
    evmChainIds,
    keplrAction,
    metamaskAction,
  ]);

  return (
    <BlinkCard config={blinkConfig} action={action} chain={selectedChain} />
  );
}
