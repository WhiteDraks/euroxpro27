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
    "bg-[#741F3D] text-white hover:bg-[#51152D] border border-transparent shadow-sm",
  secondary:
    "bg-[#101B35] text-[#F7F3ED] hover:bg-[#172443] border border-transparent",
  outline:
    "bg-transparent text-[#741F3D] border border-[#741F3D] hover:bg-[#741F3D] hover:text-white",
  ghost:
    "bg-transparent text-current hover:bg-black/10 border border-transparent",
  danger:
    "bg-red-600 text-white hover:bg-red-700 border border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
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
          "inline-flex items-center justify-center gap-2 font-medium tracking-wide",
          "transition-all duration-200 ease-in-out",
          "rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#741F3D] focus-visible:ring-offset-2",
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
