import { AppHeader } from "@/components/common/AppHeader";
import { AppSidebarV2 } from "@/components/common/AppSidebarV2";
import { AppProviderV2 } from "@/provider/AppProviderV2";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProviderV2>
      <div className="w-full h-[100dvh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 w-full bg-background border-b">
          <AppHeader />
        </div>
        <div className="flex-1 flex overflow-hidden min-w-0">
          <AppSidebarV2 />
          {children}
        </div>
      </div>
    </AppProviderV2>
  );
}
