import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "light" | "dark"; // kept for backward compat, ignored in dark mode
  height?: number;
};

export function Logo({ className, height = 32 }: Props) {
  // Icon aspect ratio: 330 × 255
  const iconW = Math.round(height * (330 / 255));

  return (
    <Link
      href="/"
      aria-label="TOUCH MÍDIA — Página inicial"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <Image
        src="/logo-mark-white.png"
        alt=""
        width={iconW}
        height={height}
        className="shrink-0"
        priority
      />
      <span className="flex items-baseline gap-1.5 leading-none">
        <span
          className="font-display font-semibold text-white"
          style={{ fontSize: height * 0.5, letterSpacing: "0.06em" }}
        >
          TOUCH
        </span>
        <span
          className="font-display font-normal text-white/50"
          style={{ fontSize: height * 0.4, letterSpacing: "0.3em" }}
        >
          MÍDIA
        </span>
      </span>
    </Link>
  );
}
