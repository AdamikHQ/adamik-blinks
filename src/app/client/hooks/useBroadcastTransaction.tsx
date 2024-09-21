import { useMutation } from "@tanstack/react-query";
import { Transaction } from "~/types/adamik";
import { transactionBroadcast } from "../api/adamik/broadcast";

export const useBroadcastTransaction = () => {
  return useMutation({
    mutationFn: (transaction: Transaction) => transactionBroadcast(transaction),
  });
};
