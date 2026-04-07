import type { Metadata } from "next";
import "./globals.css";
import { AppStoreProvider } from "@/providers/AppStoreProvider";

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
      <body>
        <AppStoreProvider>{children}</AppStoreProvider>
      </body>
    </html>
  );
}
