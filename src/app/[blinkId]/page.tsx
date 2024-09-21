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
      Object.values(chains!)?.find((chain) => chain.id === selectedChainId)
        ?.decimals,
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

    Metamask.sign(metamaskSdk!, walletContext, evmChains!, transaction!);

    // 3b. broadcast transaction ?
    // TODO
  }, [
    blinkConfig.transactionData,
    encodeTransaction,
    evmChainIds,
    evmChains,
    metamaskSdk,
    selectedChainId,
    setTransaction,
    setTransactionHash,
    transaction,
    walletContext,
  ]);

  return (
    <BlinkCard config={blinkConfig} action={action} decimals={decimals!} />
  );

  /*
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
  */
}
