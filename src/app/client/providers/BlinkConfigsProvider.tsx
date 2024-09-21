"use client";

import React, { useState } from "react";
import { BlinkConfigsContext } from "../hooks/useBlinkConfigs";
import { BlinkConfig } from "~/types/blinks";
import { DEFAULT_BLINK_CONFIGS } from "~/server/configs_TMP";

export const BlinkConfigsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [blinkConfigs, setBlinkConfigs] = useState<BlinkConfig[]>(
    DEFAULT_BLINK_CONFIGS
  );

  const addBlinkConfig = (blinkConfig: BlinkConfig) => {
    setBlinkConfigs(blinkConfigs.concat(blinkConfig));
  };

  return (
    <BlinkConfigsContext.Provider
      value={{
        blinkConfigs,
        addBlinkConfig,
      }}
    >
      {children}
    </BlinkConfigsContext.Provider>
  );
};
