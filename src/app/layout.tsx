import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { GlassHeader, BottomNav, Sidebar, TopBar, EmergencyStrip } from "@/components/navigation";
import { MainLayoutWrapper } from "@/components/MainLayoutWrapper";

export const metadata: Metadata = {
  title: "Neuros Health v3",
  description: "Pharmacy Companion Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body>
        <StoreProvider>
          <Sidebar />
          <TopBar />
          <GlassHeader />
          
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
          
          <EmergencyStrip />
          <BottomNav />
        </StoreProvider>
      </body>
    </html>
  );
}
