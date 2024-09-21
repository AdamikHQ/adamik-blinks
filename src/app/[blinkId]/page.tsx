"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { useChains } from "~/client/hooks/useChains";
import { useWallet } from "~/client/hooks/useWallet";
import { useTransaction } from "~/client/hooks/useTransaction";
import { BlinkConfig } from "~/types/blinks";
import { BLINK_CONFIGS } from "~/server/configs_TMP";
import { useEncodeTransaction } from "~/client/hooks/useEncodeTransaction";
import { Metamask } from "~/client/wallets/metamask";
import { TransactionData } from "~/types/adamik";
import { BlinkCard } from "~/client/ui/BlinkCard";
import { useWalletClient } from "@cosmos-kit/react-lite";
import { Keplr } from "~/client/wallets/keplr";
import { useBroadcastTransaction } from "~/client/hooks/useBroadcastTransaction";

export default function Blink({ params }: { params: { blinkId: string } }) {
  const { sdk: metamaskSdk } = useSDK();
  const keplrSdk = useWalletClient("keplr-extension");

  const { data: chains } = useChains();
  // FIXME walletContext is overkill, could be removed
  const walletContext = useWallet();
  const { transaction, setTransaction, setTransactionHash } = useTransaction();

  // TODO Handle UI setting + persistence in local storage
  const [selectedChainId, setSelectedChainId] = useState<string>("osmosis"); // FIXME hardcoded
  const [blinkConfig, setBlinkConfig] = useState<BlinkConfig>(
    BLINK_CONFIGS.get("default-base")! // FIXME hardcoded
  );

  const { mutate: encodeTransaction } = useEncodeTransaction();

  const { mutate: broadcastTransaction } = useBroadcastTransaction();

  const selectedChain = useMemo(
    () =>
      (chains &&
        Object.values(chains).find((chain) => chain.id === selectedChainId)) ||
      undefined,
    [chains, selectedChainId]
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
      chains && Object.values(chains).filter((chain) => chain.family === "evm"),
    [chains]
  );

  const cosmosChainIds = useMemo(
    () => evmChains && evmChains.map((chain) => chain.id),
    [evmChains]
  );

  const setTransactionAmount = useCallback(
    (amount: string) => {
      if (transaction && !isNaN(Number(amount))) {
        transaction.data.amount = amount;
      }
    },
    [transaction]
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

  const decimals = useMemo(
    () =>
      (chains &&
        Object.values(chains!)?.find((chain) => chain.id === selectedChainId)
          ?.decimals) ||
      undefined,
    [chains, selectedChainId]
  );

  useEffect(() => {
    BLINK_CONFIGS.has(params.blinkId) &&
      setBlinkConfig(BLINK_CONFIGS.get(params.blinkId)!);
  }, [params.blinkId]);

  const craftTransaction = useCallback(() => {
    // FIXME How to ensure to only propose chainIds for available addresses ?
    const sender = walletContext.accounts.find(
      (account) => account.chainId === selectedChainId
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
        setTransaction(undefined);
        setTransactionHash(undefined);
        if (settledTransaction) {
          if (
            settledTransaction.status.errors &&
            settledTransaction.status.errors.length > 0
          ) {
            console.warn(
              "Adamik API validation error: ",
              settledTransaction.status.errors[0].message
            );
          } else {
            setTransaction(settledTransaction);
          }
        } else {
          console.warn("Unknown Adamik API error");
        }
      },
      onError: (error) => {
        console.warn("Adamik API error: ", error);
        setTransaction(undefined);
        setTransactionHash(undefined);
      },
    });
  }, [
    blinkConfig.transactionData,
    encodeTransaction,
    selectedChainId,
    setTransaction,
    setTransactionHash,
    walletContext,
  ]);

  // CRAFTING
  const action = useCallback(() => {
    if (evmChainIds?.includes(selectedChainId)) {
      Metamask.getAddresses(metamaskSdk!, walletContext, evmChainIds!);
    } else if (cosmosChainIds?.includes(selectedChainId)) {
      Keplr.getAddresses(keplrSdk!, walletContext, cosmosChainIdsMapping);
    }

    craftTransaction();
  }, [
    cosmosChainIds,
    cosmosChainIdsMapping,
    craftTransaction,
    evmChainIds,
    keplrSdk,
    metamaskSdk,
    selectedChainId,
    walletContext,
  ]);

  /*
  // METAMASK
  const actionMetamask = useCallback(() => {
    Metamask.getAddresses(metamaskSdk!, walletContext, evmChainIds!);
    craftTransaction();
  }, [craftTransaction, evmChainIds, metamaskSdk, walletContext]);

  // KEPLR (CRAFTING)
  const actionKeplr = useCallback(() => {
    Keplr.getAddresses(keplrSdk!, walletContext, cosmosChainIdsMapping);
    craftTransaction();
  }, [cosmosChainIdsMapping, craftTransaction, keplrSdk, walletContext]);
  */

  // SIGNING
  useEffect(() => {
    if (transaction?.encoded) {
      if (evmChainIds?.includes(selectedChainId)) {
        Metamask.signAndBroadcast(
          metamaskSdk!,
          walletContext,
          evmChains!,
          transaction!
        );
      } else if (cosmosChainIds?.includes(selectedChainId)) {
        Keplr.sign(keplrSdk!, cosmosChains!, transaction!, setTransaction);
      }
    }
  }, [
    cosmosChainIds,
    cosmosChains,
    evmChainIds,
    evmChains,
    keplrSdk,
    metamaskSdk,
    selectedChainId,
    setTransaction,
    transaction,
    walletContext,
  ]);

  // BROADCAST
  useEffect(() => {
    if (transaction?.signature) {
      if (cosmosChainIds?.includes(selectedChainId)) {
        broadcastTransaction(transaction, {
          onSuccess: (values) => {
            if (values.error) {
              console.warn(values.error.message);
            } else {
              setTransactionHash(values.hash);
              setTransaction(undefined);
            }
          },
        });
      }
    }
  }, [
    broadcastTransaction,
    cosmosChainIds,
    selectedChainId,
    setTransaction,
    setTransactionHash,
    transaction,
    transaction?.signature,
  ]);

  return (
    <BlinkCard
      config={blinkConfig}
      action={action}
      chain={selectedChain}
      amount={transaction?.data.amount!}
      setTransactionAmount={setTransactionAmount}
    />
  );
}
