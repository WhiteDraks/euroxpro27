import { cn } from "@/lib/utils";

type BadgeVariant = "burgundy" | "navy" | "muted" | "success" | "warning";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  burgundy: "bg-[#7D1A30]/15 text-[#7D1A30] border border-[#7D1A30]/20",
  navy: "bg-[#140D0E]/10 text-[#140D0E] border border-[#140D0E]/20",
  muted: "bg-[#B8A69C]/15 text-[#B8A69C] border border-[#B8A69C]/20",
  success: "bg-green-500/15 text-green-700 border border-green-500/20",
  warning: "bg-amber-500/15 text-amber-700 border border-amber-500/20",
};

export function Badge({ children, variant = "burgundy", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
