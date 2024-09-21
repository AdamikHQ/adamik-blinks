"use server";

import { ADAMIK_API_URL, ADAMIK_API_KEY } from "~/server/env";
import { Chain } from "~/types/adamik";

type GetChainsResponse = {
  chains: Record<string, Chain>;
};

// FIXME Just call server component instead?
export const getChains = async (): Promise<Record<string, Chain> | null> => {
  const response = await fetch(`${ADAMIK_API_URL}/chains`, {
    headers: {
      Authorization: ADAMIK_API_KEY,
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (response.status === 200) {
    const data: GetChainsResponse = await response.json();
    return data?.chains;
  }

  return null;
};
