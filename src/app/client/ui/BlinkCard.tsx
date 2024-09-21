"use client";

import { BlinkConfig } from "~/types/blinks";
import { amountToMainUnit } from "../logic/utils";
import { useMemo, useState } from "react";
import { Chain } from "~/types/adamik";

type BlinkCardProps = {
  config: BlinkConfig;
  chain: Chain | undefined;
  action: () => void;
};

export const BlinkCard = ({ config, action, chain }: BlinkCardProps) => {
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
        <div className="font-semibold text-md tracking-tight">
          {config.metadata.name}
        </div>
        <div className="text-sm font-thin tracking-wide">
          {config.metadata.description}
        </div>

        {/* Action Button */}
        <button
          className="w-full py-2 mt-4 text-sm font-semibold uppercase text-white bg-blue-600 hover:bg-blue-500 rounded-3xl"
          onClick={action}
        >
          {formattedAmount} {chain?.ticker}
        </button>

        {/* "Powered by" Section with URL */}
        <div className="mt-4 text-right">
          <span className="text-sm text-slate-500">Powered by </span>
          <a
            href={config.metadata.url}
            className="text-blue-500 text-sm hover:underline"
          >
            {config.metadata.url}
          </a>
        </div>
      </div>
    </div>
  );
};
