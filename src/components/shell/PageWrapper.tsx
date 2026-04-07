import { ReactNode } from "react";

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <main className="md:ml-64 md:pt-20 pt-16 pb-36 md:pb-8 px-6 md:px-8 max-w-5xl mx-auto transition-all">
      {children}
    </main>
  );
}
