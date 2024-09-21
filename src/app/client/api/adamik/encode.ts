"use server";

import { ADAMIK_API_URL, ADAMIK_API_KEY } from "~/server/env";
import { Transaction, TransactionData } from "~/types/adamik";

// FIXME Just call server component instead?
export const transactionEncode = async (
  transactionData: TransactionData
): Promise<Transaction> => {
  // FIXME DEBUG TBR
  console.log("XXX - transactionEncode called, with data:", transactionData);

  const response = await fetch(`${ADAMIK_API_URL}/transaction/encode`, {
    headers: {
      Authorization: ADAMIK_API_KEY,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ transaction: { data: transactionData } }),
  });

  const result = await response.json();

  // FIXME DEBUG TBR
  console.log("XXX - transactionEncode result:", result);

  const {
    transaction,
    message,
  }: { transaction: Transaction; message: string } = result;

  const messageString = message && JSON.stringify(message);

  if (messageString) {
    console.error("encode - backend error:", messageString);
    throw new Error(messageString);
  }

  return transaction;
};
