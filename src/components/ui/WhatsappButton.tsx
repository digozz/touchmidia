import Link from "next/link";
import { cn } from "@/lib/utils";
import { buildWhatsappUrl } from "@/lib/contact";

type Props = {
  message: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variantClasses = {
  primary:
    "bg-volt text-brand-black hover:bg-volt-600 active:bg-volt-700",
  outline:
    "border border-white/15 text-white hover:border-volt hover:text-volt",
  ghost: "text-white hover:text-volt",
} as const;

const sizeClasses = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-14 px-7 text-xl font-bold",
} as const;

export function WhatsappButton({
  message,
  children,
  className,
  variant = "primary",
  size = "md",
}: Props) {
  return (
    <Link
      href={buildWhatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
