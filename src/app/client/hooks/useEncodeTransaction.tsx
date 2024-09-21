import { useMutation } from "@tanstack/react-query";
import { transactionEncode } from "~/client/api/adamik/encode";
import { TransactionData } from "~/types/adamik";

export const useEncodeTransaction = () => {
  return useMutation({
    mutationFn: (transactionData: TransactionData) =>
      transactionEncode(transactionData),
  });
};
