import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "white" | "ivory" | "navy" | "outlined";
}

const variantStyles = {
  white: "bg-[#141012] border border-white/10",
  ivory: "bg-black border border-white/10",
  navy: "bg-[#1F1415] border border-[#3A2A2A] text-[#F4EDE2]",
  outlined: "bg-transparent border border-white/10",
};

export function Card({ children, className, variant = "white" }: CardProps) {
  return (
    <div
      className={cn(
        "reveal spot rounded-3xl overflow-hidden",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
