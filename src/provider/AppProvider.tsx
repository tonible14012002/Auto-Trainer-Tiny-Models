import { memo, type PropsWithChildren } from "react";
import { ModelWorkerProvider } from "./ModelWorkerProvider";
import { Toaster } from "@/components/ui/sonner";
import { ModelsProvider } from "./ModelsProvider";

export const AppProvider = memo(({ children }: PropsWithChildren) => {
  return (
    <ModelWorkerProvider>
      <ModelsProvider>
        {children}
        <Toaster position="top-center" />
      </ModelsProvider>
    </ModelWorkerProvider>
  );
});

AppProvider.displayName = "AppProvider";