import { AppContent } from "@/components/common/AppLayout";

export default function ModelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppContent>{children}</AppContent>;
}
