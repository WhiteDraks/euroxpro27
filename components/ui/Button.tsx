import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#7D1A30] text-white hover:bg-[#64142A] border border-transparent",
  secondary:
    "bg-[#1C1416] text-white hover:bg-[#2A1D1E] border border-white/10",
  outline:
    "bg-transparent text-[#FBF7F0] border-2 border-white/25 hover:bg-[#7D1A30] hover:text-white",
  ghost:
    "bg-transparent text-current hover:bg-white/10 border border-transparent",
  danger:
    "bg-red-600 text-white hover:bg-red-700 border border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold",
          "transition-all duration-200 ease-in-out",
          "sheen rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7D1A30] focus-visible:ring-offset-2 ring-offset-black",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
