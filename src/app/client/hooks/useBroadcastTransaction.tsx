import { useMutation } from "@tanstack/react-query";
import { Transaction } from "~/types/adamik";
import { broadcast } from "../api/adamik/broadcast";

export const useBroadcastTransaction = () => {
  return useMutation({
    mutationFn: (transaction: Transaction) => broadcast(transaction),
  });
};
