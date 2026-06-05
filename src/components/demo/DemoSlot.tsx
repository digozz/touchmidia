"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Play, X } from "lucide-react";
import { TotemMockup } from "./TotemMockup";

type Props = {
  title: string;
  children: ReactNode;
  /** Avisa o pai quando o modal abre/fecha (ex: pausar carousel) */
  onModalChange?: (open: boolean) => void;
};

export function DemoSlot({ title, children, onModalChange }: Props) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    onModalChange?.(true);
  };
  const handleClose = () => {
    setOpen(false);
    onModalChange?.(false);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      {/* PREVIEW (não-interativo, com overlay "Jogar") */}
      <div className="relative">
        <div className="pointer-events-none select-none" aria-hidden="true">
          <TotemMockup>{children}</TotemMockup>
        </div>

        <button
          type="button"
          onClick={handleOpen}
          aria-label={`Jogar demo de ${title}`}
          className="group absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-brand-black/0 transition-all duration-300 hover:bg-brand-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
        >
          <span className="pointer-events-none flex items-center gap-2.5 rounded-full bg-volt px-6 py-3 font-display text-base font-bold text-brand-black shadow-xl shadow-volt/30 transition-all duration-300 group-hover:scale-105">
            <Play className="h-5 w-5 fill-current" strokeWidth={0} />
            Jogar
          </span>
        </button>
      </div>

      {/* MODAL com demo interativo */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/85 p-4 backdrop-blur-sm"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Demo de ${title}`}
        >
          <div
            className="relative w-full max-w-[380px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-volt">
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-volt align-middle animate-pulse" />
                {title}
              </p>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <TotemMockup>{children}</TotemMockup>
          </div>
        </div>
      )}
    </>
  );
}
