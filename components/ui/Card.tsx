import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "white" | "ivory" | "navy" | "outlined";
}

const variantStyles = {
  white: "bg-white border border-[#E3E0DC]",
  ivory: "bg-[#F7F3ED] border border-[#E3E0DC]",
  navy: "bg-[#172443] border border-[#2A3556] text-[#F7F3ED]",
  outlined: "bg-transparent border border-[#E3E0DC]",
};

export function Card({ children, className, variant = "white" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[8px] overflow-hidden",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
