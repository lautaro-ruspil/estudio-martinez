import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    secondary:
        "bg-secondary-700 text-white hover:bg-secondary-800 focus:ring-secondary-500",
    outline:
        "border-2 border-secondary-600 text-secondary-700 hover:bg-secondary-50",
    ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-400",
    link: "text-primary-600 hover:text-primary-700 underline hover:no-underline",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-8 py-3 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            isLoading = false,
            disabled,
            className = "",
            children,
            type = "button",
            ...props
        },
        ref,
    ) => {
        const baseStyles =
            "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

        return (
            <button
                ref={ref}
                type={type}
                disabled={disabled || isLoading}
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
                aria-busy={isLoading}
                {...props}
            >
                {children}
            </button>
        );
    },
);

Button.displayName = "Button";
