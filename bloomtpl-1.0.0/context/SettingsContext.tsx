"use client";

import type { Settings } from "@/types/settings";
import React, { createContext, useContext } from "react";

const SettingsContext = createContext<Settings | undefined>(undefined);

export const SettingsProvider = ({
  settings,
  children,
}: {
  settings: Settings;
  children: React.ReactNode;
}) => {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
