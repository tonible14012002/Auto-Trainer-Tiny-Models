import { AppHeader } from "@/components/common/AppHeader";
import { AppLayout } from "@/components/common/AppLayout";
import { AppSidebarV2 } from "@/components/common/AppSidebarV2";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout sidebar={<AppSidebarV2 />} header={<AppHeader />}>
      {children}
    </AppLayout>
  );
}
