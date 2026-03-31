"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function MainLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMarketingOrAuth = ['/', '/login', '/signup', '/onboarding'].includes(pathname);

  // If marketing/auth, don't apply the dashboard margins/widths. It can just span the whole screen.
  if (isMarketingOrAuth) {
    return <main className="w-full min-h-screen">{children}</main>;
  }

  return (
    <main className="md:ml-64 md:pt-20 pt-16 pb-36 md:pb-8 px-6 md:px-8 max-w-5xl mx-auto transition-all">
      {children}
    </main>
  );
}
