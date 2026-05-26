import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "main" | "article";
};

export function Container({ children, className, as: Tag = "div" }: Props) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
