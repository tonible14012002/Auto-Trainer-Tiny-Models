import { AppProviderV2 } from "@/provider/AppProviderV2";
import type { PropsWithChildren } from "react";
import { AppContent } from "./AppContent";

interface AppLayoutProps extends PropsWithChildren {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const AppLayout = ({ header, sidebar, children }: AppLayoutProps) => {
  return (
    <AppProviderV2>
      <div className="w-full h-[100dvh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 w-full bg-background border-b">{header}</div>
        <div className="flex-1 flex overflow-hidden min-w-0">
          {sidebar}
            <AppContent>
              {children}
            </AppContent>
        </div>
      </div>
    </AppProviderV2>
  );
};
