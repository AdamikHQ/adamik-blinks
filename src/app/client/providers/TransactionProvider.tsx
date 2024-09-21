"use client";

import React, { useState } from "react";
import { Transaction } from "~/types/adamik";
import { TransactionContext } from "../hooks/useTransaction";

export const TransactionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [transaction, setTransaction] = useState<Transaction | undefined>();
  const [transactionHash, setTransactionHash] = useState<string | undefined>();

  return (
    <TransactionContext.Provider
      value={{
        transaction,
        setTransaction,
        transactionHash,
        setTransactionHash,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
