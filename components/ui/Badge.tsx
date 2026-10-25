import { cn } from "@/lib/utils";

type BadgeVariant = "burgundy" | "navy" | "muted" | "success" | "warning";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  burgundy: "bg-[#741F3D]/15 text-[#741F3D] border border-[#741F3D]/20",
  navy: "bg-[#101B35]/10 text-[#101B35] border border-[#101B35]/20",
  muted: "bg-[#A7AFBF]/15 text-[#A7AFBF] border border-[#A7AFBF]/20",
  success: "bg-green-500/15 text-green-700 border border-green-500/20",
  warning: "bg-amber-500/15 text-amber-700 border border-amber-500/20",
};

export function Badge({ children, variant = "burgundy", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-sm tracking-wide",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
