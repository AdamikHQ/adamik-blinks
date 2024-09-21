import { useMutation } from "@tanstack/react-query";
import { TransactionData } from "~/types/adamik";
import { transactionEncode } from "../api/adamik/encode";

export const useEncodeTransaction = () => {
  return useMutation({
    mutationFn: (transactionData: TransactionData) =>
      transactionEncode(transactionData),
  });
};
