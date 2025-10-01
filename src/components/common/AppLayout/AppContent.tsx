import { AppBreadcrumb } from "@/components/common/AppBreadcrumb";

export const AppContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <AppBreadcrumb />
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Breadcrumb - Full width, aligned left */}

        {/* Main content - Constrained width */}
        <div className="p-4 pt-2">
          <div className="flex flex-col min-h-0 md:max-w-[900px] container mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
