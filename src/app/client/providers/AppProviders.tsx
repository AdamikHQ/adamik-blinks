"use client";

import React from "react";
import { assets, chains } from "chain-registry";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { ChainProvider } from "@cosmos-kit/react-lite";
import { wallets as cosmosWallets } from "@cosmos-kit/keplr";
import { QueryProvider } from "~/client/providers/QueryProvider";
import { BlinkConfigsProvider } from "./BlinkConfigsProvider";

export const AppProviders: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <QueryProvider>
      <BlinkConfigsProvider>
        <MetaMaskProvider
          debug={false}
          sdkOptions={{
            checkInstallationImmediately: false,
            logging: { developerMode: false },
            dappMetadata: {
              name: "Adamik App",
              url:
                typeof window !== "undefined"
                  ? window.location.host
                  : "https://app.adamik.io/",
            },
          }}
        >
          <ChainProvider
            chains={chains} // supported chains
            assetLists={assets} // supported asset lists
            wallets={cosmosWallets} // supported wallets (only keplr desktop wallet for now)
          >
            {children}
          </ChainProvider>
        </MetaMaskProvider>
      </BlinkConfigsProvider>
    </QueryProvider>
  );
};
