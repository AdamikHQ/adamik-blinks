"use server";

import { ADAMIK_API_URL } from "~/server/env";
import { Transaction, TransactionData } from "~/types/adamik";

// FIXME Just call server component instead?
export const transactionEncode = async (
  transactionData: TransactionData
  //setTransaction: (transaction: Transaction) => void
): Promise<Transaction> => {
  const response = await fetch(`${ADAMIK_API_URL}/transaction/encode`, {
    headers: {
      Authorization: process.env.ADAMIK_API_KEY || "",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ transaction: { data: transactionData } }),
  });

  const result = await response.json();

  const {
    transaction,
    message,
  }: { transaction: Transaction; message: string } = result;

  const messageString = message && JSON.stringify(message);

  if (messageString) {
    console.error("encode - backend error:", messageString);
    throw new Error(messageString);
  }

  //setTransaction(transaction);
  return transaction;
};
