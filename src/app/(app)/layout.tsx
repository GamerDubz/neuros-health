import { DesktopSidebar } from "@/components/shell/DesktopSidebar";
import { DesktopTopBar } from "@/components/shell/DesktopTopBar";
import { MobileHeader } from "@/components/shell/MobileHeader";
import { MobileBottomNav } from "@/components/shell/MobileBottomNav";
import { PageWrapper } from "@/components/shell/PageWrapper";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesktopSidebar />
      <DesktopTopBar />
      <MobileHeader />
      <PageWrapper>{children}</PageWrapper>
      <MobileBottomNav />
    </>
  );
}
