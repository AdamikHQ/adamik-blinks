import { WalletName } from "~/types/wallets";
import { WalletContextType } from "../hooks/useWallet";
import { WalletClientContext } from "@cosmos-kit/core";
import { Chain, Transaction } from "~/types/adamik";

export class Keplr {
  static getAddresses = async (
    sdk: WalletClientContext,
    wallet: WalletContextType,
    cosmosChainIdsMapping: Map<string, string>
  ): Promise<void> => {
    const { client, status } = sdk;

    if (status === "Done" && client) {
      const nativeIds = Array.from(cosmosChainIdsMapping.values());

      // Try to enable Keplr client with all known native chain IDs
      for (const nativeId of nativeIds) {
        try {
          await client.enable?.(nativeId);
        } catch (err) {
          console.warn("Failed to connect to Keplr wallet...", err);
          // Remove the unsupported ones
          cosmosChainIdsMapping.delete(nativeId);
        }
      }

      // For each supported (Adamik) chain ID, get its (single) address from Keplr
      cosmosChainIdsMapping.forEach(async (nativeId, chainId) => {
        try {
          const account = await client.getAccount?.(nativeId);
          if (account) {
            wallet.addAccounts([
              {
                address: account.address,
                pubKey: Buffer.from(account.pubkey).toString("hex"),
                chainId,
                signer: WalletName.KEPLR,
              },
            ]);
          }
        } catch (err) {
          console.warn("Failed to connect to Keplr wallet...", err);
          return;
        }
      });
    }
  };

  static sign = async (
    sdk: WalletClientContext,
    cosmosChains: Chain[],
    transaction: Transaction,
    setTransaction: (transaction: Transaction | undefined) => void
  ): Promise<void> => {
    const { client } = sdk;

    if (client && cosmosChains && transaction) {
      const chainId = transaction.data.chainId;
      const chain = cosmosChains.find((chain) => chain.id === chainId);

      if (!chain) {
        throw new Error(`${chainId} is not supported by Keplr wallet`);
      }

      const signedTransaction = await client.signAmino?.(
        chain.nativeId,
        transaction.data.sender,
        transaction.encoded as any
      );

      transaction &&
        signedTransaction &&
        setTransaction({
          ...transaction,
          signature: signedTransaction?.signature.signature,
        });
    }
  };
}
