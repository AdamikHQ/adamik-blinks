import { MetaMaskSDK } from "@metamask/sdk-react";
import { Account, Chain, Transaction, TransactionData } from "~/types/adamik";
import { WalletContextType } from "../hooks/useWallet";
import { WalletName } from "~/types/wallets";
import { etherumNetworkConfig } from "./utils/ethereumNetworks";

export class Metamask {
  static getAddresses = async (
    sdk: MetaMaskSDK,
    wallet: WalletContextType,
    evmChainIds: string[]
  ): Promise<void> => {
    try {
      const metamaskAddresses: string[] = await sdk?.connect();

      if (metamaskAddresses && evmChainIds) {
        const addresses: Account[] = [];
        // NOTE Using only 1st address in metamask
        const address = metamaskAddresses[0];

        // NOTE Looping over all supported chains for full discovery, should check if performance is ok
        for (const chainId of evmChainIds) {
          addresses.push({
            address,
            chainId,
            signer: WalletName.METAMASK,
          });
        }

        wallet.addAccounts(addresses);
      } else {
        console.warn(
          "Failed to connect to Metamask, verify if you allow connectivity"
        );
      }
    } catch (err) {
      console.warn("Failed to connect to Metamask wallet..", err);
    }
  };

  static signAndBroadcast = async (
    sdk: MetaMaskSDK,
    wallet: WalletContextType,
    evmChains: Chain[],
    transaction: Transaction
  ): Promise<void> => {
    const provider = sdk?.getProvider();

    if (provider && transaction) {
      const chainId = transaction.data.chainId;
      const chain = evmChains?.find((chain) => chain.id === chainId);

      if (!chain) {
        throw new Error(`${chainId} is not supported by Metamask wallet`);
      }

      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x" + Number(chain.nativeId).toString(16) }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [etherumNetworkConfig[chain.params.name]],
            });
          } catch (addError) {
            throw addError;
          }
        }
        throw switchError;
      }

      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [transaction.encoded],
      });

      if (typeof txHash === "string") {
        wallet.setTransactionHash(txHash);
      } else {
        console.warn("Transaction failed");
      }
    }
  };
}
