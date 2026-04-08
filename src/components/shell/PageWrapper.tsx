import { ReactNode } from "react";

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="md:ml-64 transition-all relative">
      <main className="md:pt-20 pt-16 pb-36 md:pb-8 px-6 md:px-10 max-w-[1600px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
