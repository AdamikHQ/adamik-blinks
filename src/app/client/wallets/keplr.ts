import { WalletName } from "~/types/wallets";
import { WalletClientContext } from "@cosmos-kit/core";
import { Account, Chain, Transaction } from "~/types/adamik";

export class Keplr {
  static getAccounts = async (
    sdk: WalletClientContext,
    cosmosChainIdsMapping: Map<string, string>,
    setAccounts: (accounts: Account[]) => void,
    setCraftTransaction: (craft: boolean) => void
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
      const accounts: Account[] = [];
      cosmosChainIdsMapping.forEach(async (nativeId, chainId) => {
        try {
          const account = await client.getAccount?.(nativeId);
          if (account) {
            accounts.push({
              address: account.address,
              pubKey: Buffer.from(account.pubkey).toString("hex"),
              chainId,
              signer: WalletName.KEPLR,
            });
            setCraftTransaction(true);
          }
        } catch (err) {
          console.warn("Failed to retrieve address from Keplr wallet...", err);
          return;
        }
      });
      setAccounts(accounts);
    }
  };

  static sign = async (
    sdk: WalletClientContext,
    cosmosChains: Chain[],
    transaction: Transaction,
    setSignTransaction: (sign: boolean) => void,
    setBroadcastTransaction: (sign: boolean) => void,
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

      if (transaction && signedTransaction) {
        setSignTransaction(false);
        setBroadcastTransaction(true);
        setTransaction({
          ...transaction,
          signature: signedTransaction?.signature.signature,
        });
      }
    }
  };
}
