import { AppSidebarProviderV2 } from "@/components/common/AppSidebarV2/AppSidebarProviderV2";
import { Toaster } from "@/components/ui/sonner";
import type { PropsWithChildren } from "react";
import { ModelWorkerProvider } from "./ModelWorkerProvider";
import { ModelsProvider } from "./ModelsProvider";
import { QueryProvider } from "./QueryClientProvider";

export const AppProviderV2 = ({ children }: PropsWithChildren) => {
  return (
    <>
      <QueryProvider>
        <ModelWorkerProvider>
          <ModelsProvider>
            <AppSidebarProviderV2>{children}</AppSidebarProviderV2>
            <Toaster position="top-center" />
          </ModelsProvider>
        </ModelWorkerProvider>
      </QueryProvider>
    </>
  );
};
