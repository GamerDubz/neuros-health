import { ReactNode } from "react";

interface AIResponseCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function AIResponseCard({
  title,
  children,
  className = "",
}: AIResponseCardProps) {
  return (
    <div
      className={`bg-surface-container-lowest p-6 rounded-3xl shadow-[0_10px_40px_rgba(21,28,39,0.04)] ${className}`}
    >
      <h2 className="font-bold text-lg text-on-surface mb-3">{title}</h2>
      {children}
    </div>
  );
}
