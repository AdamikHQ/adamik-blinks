"use client";

import { BlinkConfig } from "~/types/blinks";
import { amountToMainUnit } from "../logic/utils";
import { useMemo, useState } from "react";
import { Chain } from "~/types/adamik";

import bitcoinIcon from "./bitcoin.svg";
import atomIcon from "./atom.svg";
import baseIcon from "./base.svg";
import Image from "next/image";

type BlinkCardProps = {
  config: BlinkConfig;
  chain: Chain | undefined;
  action: () => void;
  //amount: string | undefined;
  //setTransactionAmount: (amount: string) => void;
};

export const BlinkCard = ({
  config,
  action,
  chain,
}: //amount,
//setTransactionAmount,
BlinkCardProps) => {
  const formattedAmount = useMemo(
    () =>
      chain?.decimals
        ? amountToMainUnit(config.transactionData.amount, chain.decimals)
        : undefined,
    [config.transactionData.amount, chain]
  );

  return !chain ? null : (
    <div className="flex">
      <div className="flex-none flex-col p-6 border-2 rounded-xl border-cyan-800 height-auto bg-stone-900">
        <div className="w-[400px] mb-4 rounded-xl">
          <img src={config.metadata.imageUrl} alt="Placeholder image" />
        </div>
        <div className="flex flex-row items-center">
          <span className="mr-2">
            <img src="https://picsum.photos/16" alt="url logo" />
          </span>
          <a href={config.metadata.url} className="text-slate-600 text-sm">
            {config.metadata.url}
          </a>
        </div>
        <div className="font-semibold text-md tracking-tight">
          {config.metadata.name}
        </div>
        <div className="text-sm font-thin tracking-wide">
          {config.metadata.description}
        </div>

        <div className="flex py-2 gap-1">
          <Image src={baseIcon} alt="base" width={32} height={32} />
          <Image src={bitcoinIcon} alt="bitcoin" width={32} height={32} />
          <Image src={atomIcon} alt="atom" width={32} height={32} />
        </div>

        <>
          <button
            className="w-full py-2 mt-4 text-sm font-semibold uppercase text-white bg-blue-600  hover:bg-blue-500 rounded-3xl"
            onClick={action}
          >
            {formattedAmount} {chain?.ticker}
          </button>
        </>

        {/*
        <div className="flex justify-between gap-3">
          {typeof donateValue === "string" ? (
            <>
              <button className="w-full py-2 mt-4 text-sm font-semibold uppercase text-white bg-blue-600  hover:bg-blue-500 rounded-3xl">
                {donateValue}
              </button>
            </>
          ) : (
            donateValue.map((value, i) => {
              return (
                <button
                  key={`${value}_${i}`}
                  className="w-full py-2 mt-4 text-sm font-semibold uppercase text-white bg-blue-600  hover:bg-blue-500 rounded-3xl"
                >
                  {value} {ticker}
                </button>
              );
            })
          )}
        </div>
        */}

        {/*
        <div className="relative mt-3">
          <input
            type="text"
            className="h-14 w-full pl-4 pr-10 rounded-3xl border-slate-500/40 border-[1px] bg-stone-900 focus:border-blue-600  focus:outline-none "
            placeholder={`Enter a custom ${chain?.ticker} amount`}
            onInput={(e) => {
              setTransactionAmount(e.currentTarget.value);
            }}
          />
          <div className="absolute top-2 right-2">
            <button
              disabled={amount === undefined}
              className="h-10 w-24 text-white rounded-3xl bg-blue-600 hover:bg-blue-500 disabled:bg-stone-800 disabled:text-stone-500"
              onClick={action}
            >
              Donate
            </button>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};
