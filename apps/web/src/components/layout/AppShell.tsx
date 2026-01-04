import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { ChatWidget } from "@/components/support/ChatWidget";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <Sidebar />
      <MobileHeader />
      {children}
      <ChatWidget />
    </>
  );
}
