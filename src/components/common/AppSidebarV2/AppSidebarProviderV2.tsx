"use client";

import { Dispatch, useState, type ReactNode } from "react";
import { createContext } from "@/lib/utils";

export const SIDEBAR_MODE = {
  MODELS: "models",
  TRAINERS: "trainers",
} as const;

export type AppSidebarMode = typeof SIDEBAR_MODE[keyof typeof SIDEBAR_MODE];

interface AppSidebarContextValue {
  setOpen: (_: boolean) => void;
  open?: boolean;
  toggleSidebar?: () => void;
  mode: AppSidebarMode;
  setMode: Dispatch<React.SetStateAction<AppSidebarMode>>;
}

const [Provider, useAppSidebarContextV2] =
  createContext<AppSidebarContextValue>();

export { useAppSidebarContextV2 };

interface AppSidebarProviderProps {
  children: ReactNode;
}

export const AppSidebarProviderV2 = ({ children }: AppSidebarProviderProps) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AppSidebarMode>(SIDEBAR_MODE.MODELS);

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <Provider value={{ setOpen, open, toggleSidebar, mode, setMode }}>
      {children}
    </Provider>
  );
};
