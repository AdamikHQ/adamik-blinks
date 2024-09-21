import { MetaMaskSDK } from "@metamask/sdk-react";
import { Account, Chain, Transaction, TransactionData } from "~/types/adamik";
import { WalletName } from "~/types/wallets";
import { etherumNetworkConfig } from "./utils/ethereumNetworks";

export class Metamask {
  static getAccounts = async (
    sdk: MetaMaskSDK,
    evmChainIds: string[],
    setAccounts: (accounts: Account[]) => void,
    setCraftTransaction: (craft: boolean) => void
  ): Promise<void> => {
    try {
      const metamaskAddresses: string[] = await sdk?.connect();

      if (metamaskAddresses) {
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

        //wallet.addAccounts(addresses);
        setAccounts(addresses);
        setCraftTransaction(true);
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
    evmChains: Chain[],
    transaction: Transaction,
    setSignTransaction: (sign: boolean) => void,
    setTransaction: (transaction: Transaction | undefined) => void
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

      try {
        await provider.request({
          method: "eth_sendTransaction",
          params: [transaction.encoded],
        });
      } catch (e) {
        console.warn("Transaction failed:", e);
      }

      setSignTransaction(false);
      setTransaction(undefined);
    }
  };
}
