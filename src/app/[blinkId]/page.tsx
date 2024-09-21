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

export default function Blink({ params }: { params: { blinkId: string } }) {
  const { sdk: metamaskSdk } = useSDK();
  const { data: chains } = useChains();
  const walletContext = useWallet();
  const { transaction, setTransaction, setTransactionHash } = useTransaction();

  // TODO Handle UI setting + persistence in local storage
  const [selectedChainId, setSelectedChainId] = useState<string>("base");
  const [blinkConfig, setBlinkConfig] = useState<BlinkConfig>(
    BLINK_CONFIGS.get("default")!
  );

  const {
    mutate: encodeTransaction,
    isPending,
    isSuccess,
  } = useEncodeTransaction();

  const evmChains = useMemo(
    () =>
      chains && Object.values(chains).filter((chain) => chain.family === "evm"),
    [chains]
  );

  const evmChainIds = useMemo(
    () => evmChains && evmChains.map((chain) => chain.id),
    [evmChains]
  );

  const decimals = useMemo(
    () =>
      (chains &&
        Object.values(chains!)?.find((chain) => chain.id === selectedChainId)
          ?.decimals) ||
      0, // FIXME This fallback makes no sense
    [chains, selectedChainId]
  );

  useEffect(() => {
    BLINK_CONFIGS.has(params.blinkId) &&
      setBlinkConfig(BLINK_CONFIGS.get(params.blinkId)!);
  }, [params.blinkId]);

  const action = useCallback(() => {
    // 1. Get address
    /*
    switch (chainId) {
      case ethereum: metamask.getAddress
      case cosmos: keplr.getAddress
      case algorand: pera.getAddress
      case bitoin: truc.getAddress
    }
    */

    Metamask.getAddresses(metamaskSdk!, walletContext, evmChainIds!);

    // 2. Craft transaction

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

    // 3a. sign (& broadcast ?) transaction

    //Metamask.sign(metamaskSdk!, walletContext, evmChains!, transaction!);

    // 3b. broadcast transaction ?
    // TODO
  }, [
    blinkConfig,
    encodeTransaction,
    evmChainIds,
    metamaskSdk,
    selectedChainId,
    setTransaction,
    setTransactionHash,
    walletContext,
  ]);

  useEffect(() => {
    if (transaction?.encoded) {
      Metamask.sign(metamaskSdk!, walletContext, evmChains!, transaction!);
    }
  }, [evmChains, metamaskSdk, transaction, walletContext]);

  return (
    <BlinkCard config={blinkConfig} action={action} decimals={decimals!} />
  );
}
