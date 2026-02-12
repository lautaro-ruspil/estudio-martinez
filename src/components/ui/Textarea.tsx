import { forwardRef, type TextareaHTMLAttributes } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    helpText?: string;
    isValid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        { label, error, helpText, id, className = "", isValid, ...props },
        ref,
    ) => {
        const textareaId =
            id || `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;

        const errorId = `${textareaId}-error`;
        const helpId = `${textareaId}-help`;

        return (
            <div className="space-y-2">
                <label
                    htmlFor={textareaId}
                    className="block text-sm font-medium text-slate-700"
                >
                    {label}
                </label>

                <div className="relative">
                    <textarea
                        ref={ref}
                        id={textareaId}
                        aria-invalid={!!error}
                        aria-describedby={
                            error ? errorId : helpText ? helpId : undefined
                        }
                        className={`
              w-full px-4 py-3 rounded-xl
              border bg-white
              text-slate-900 placeholder:text-slate-400
              resize-none transition-all duration-200
              ${
                  error
                      ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                      : "border-slate-300 focus:border-primary-500 focus:ring-primary-500"
              }
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-slate-100 disabled:cursor-not-allowed
              ${className}
            `}
                        {...props}
                    />

                    {isValid && !error && (
                        <CheckCircle className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                    )}

                    {error && (
                        <AlertCircle className="absolute right-3 top-3 w-4 h-4 text-red-500" />
                    )}
                </div>

                {error && (
                    <p
                        id={errorId}
                        className="text-sm text-red-600 flex items-center gap-1"
                        role="alert"
                    >
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

Textarea.displayName = "Textarea";
