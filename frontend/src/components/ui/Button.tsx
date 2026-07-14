import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import clsx from "@/utils/clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gradient" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "gradient", size = "md", isLoading, className, children, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: "text-sm px-3 py-1.5",
      md: "text-sm px-4 py-2.5",
      lg: "text-base px-6 py-3",
    }[size];

    const variantClasses = {
      gradient: "btn-gradient",
      ghost: "btn-ghost",
      outline:
        "rounded-xl border border-border text-text hover:border-primary/50 hover:bg-surface transition-colors duration-150",
      danger:
        "rounded-xl bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 transition-colors duration-150",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx("inline-flex items-center justify-center gap-2 font-medium", sizeClasses, variantClasses, className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
