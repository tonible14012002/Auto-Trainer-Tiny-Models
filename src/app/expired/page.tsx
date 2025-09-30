import { HomePage } from "@/components/expired/HomePage";
import { AppProvider } from "@/provider/AppProvider";

export default function ExpiredPage() {
  return (
    <AppProvider>
      <HomePage />
    </AppProvider>
  );
}
