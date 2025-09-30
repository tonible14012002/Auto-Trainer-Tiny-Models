"use client";

import { useState, type ReactNode } from "react";
import { createContext } from "@/lib/utils";

interface AppSidebarContextValue {
  setOpen: (_: boolean) => void;
  open?: boolean;
  toggleSidebar?: () => void;
}

const [Provider, useAppSidebarContextV2] =
  createContext<AppSidebarContextValue>();

export { useAppSidebarContextV2 };

interface AppSidebarProviderProps {
  children: ReactNode;
}

export const AppSidebarProviderV2 = ({ children }: AppSidebarProviderProps) => {
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <Provider value={{ setOpen, open, toggleSidebar }}>{children}</Provider>
  );
};
