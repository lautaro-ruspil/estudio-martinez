// components/ui/Input.tsx - VERSIÓN FINAL

import { AlertCircle, CheckCircle } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    isValid?: boolean;
    helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        { label, error, isValid, helpText, id, className = "", ...props },
        ref,
    ) => {
        const helpId = `${id}-help`;
        const errorId = `${id}-error`;
        const validId = `${id}-valid`;

        return (
            <div className="space-y-2">
                <label
                    htmlFor={id}
                    className={`block text-sm font-medium ${
                        props.disabled ? "text-slate-500" : "text-slate-700"
                    }`}
                >
                    {label}
                </label>

                <div className="relative">
                    <input
                        ref={ref}
                        id={id}
                        className={`
              w-full px-4 py-3 rounded-xl
              border
              ${
                  props.disabled
                      ? "bg-slate-50 cursor-not-allowed opacity-60 border-slate-200"
                      : "bg-white"
              }
              text-slate-900 placeholder:text-slate-400
              transition-all duration-200
              ${
                  error
                      ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                      : "border-slate-300 focus:border-primary-500 focus:ring-primary-500"
              }
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:focus:ring-0 disabled:focus:border-slate-200
              ${className}
            `}
                        aria-invalid={!!error}
                        aria-describedby={
                            error
                                ? errorId
                                : isValid
                                  ? validId
                                  : helpText
                                    ? helpId
                                    : undefined
                        }
                        {...props}
                    />

                    {/* Validation icon - no mostrar cuando disabled */}
                    {isValid && !error && !props.disabled && (
                        <div
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            role="status"
                            aria-live="polite"
                        >
                            <CheckCircle
                                className="w-4 h-4 text-slate-400"
                                aria-hidden="true"
                            />
                            <span id={validId} className="sr-only">
                                Campo válido
                            </span>
                        </div>
                    )}
                </div>

                {error && (
                    <p
                        id={errorId}
                        className="text-sm text-red-600 flex items-center gap-1"
                        role="alert"
                    >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </p>
                )}

                {!error && helpText && (
                    <p id={helpId} className="text-sm text-slate-500">
                        {helpText}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = "Input";
