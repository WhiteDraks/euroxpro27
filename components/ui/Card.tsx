import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "white" | "ivory" | "navy" | "outlined";
}

const variantStyles = {
  white: "bg-[#FBF7F0] border border-[#DCCFBE]",
  ivory: "bg-[#F4EDE2] border border-[#DCCFBE]",
  navy: "bg-[#1F1415] border border-[#3A2A2A] text-[#F4EDE2]",
  outlined: "bg-transparent border border-[#DCCFBE]",
};

export function Card({ children, className, variant = "white" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
