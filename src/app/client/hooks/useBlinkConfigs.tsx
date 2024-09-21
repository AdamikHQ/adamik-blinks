import React from "react";
import { BlinkConfig } from "~/types/blinks";

export type BlinkConfigsContextType = {
  blinkConfigs: BlinkConfig[];
  addBlinkConfig: (blinkConfig: BlinkConfig) => void;
};

export const BlinkConfigsContext = React.createContext<BlinkConfigsContextType>(
  {
    blinkConfigs: [],
    addBlinkConfig: () => {},
  }
);

export const useBlinkConfigs = () => {
  const context = React.useContext(BlinkConfigsContext);
  if (!context) {
    throw new Error(
      "useBlinkConfigs must be used within a BlinkConfigsProvider"
    );
  }
  return context;
};
