"use client";

import type { ReactNode } from "react";

export function DemoShell({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: ReactNode | null;
}) {
  return (
    <div className="mx-auto w-full max-w-[420px] select-none touch-none">
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-brand-black">
        {children}
        {hint ? (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center pb-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-[#9CA3AF] text-center">
              {hint}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
