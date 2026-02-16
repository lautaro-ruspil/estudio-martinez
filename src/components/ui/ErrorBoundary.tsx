// components/ErrorBoundary.tsx - NUEVO ARCHIVO

import { Component, type ErrorInfo, type ReactNode } from "react";
import { logger } from "../../utils/logger";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error("Error boundary caught:", error, errorInfo);
        // ✅ En producción: enviar a Sentry/LogRocket
        // if (import.meta.env.PROD) {
        //   Sentry.captureException(error, { extra: errorInfo });
        // }
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-medium p-8 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8 text-red-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>

                        <h1 className="text-h3 text-slate-900 mb-2">
                            Algo salió mal
                        </h1>

                        <p className="text-body text-slate-600 mb-6">
                            Ocurrió un error inesperado. Por favor recargá la
                            página.
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                        >
                            Recargar página
                        </button>

                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
                                    Error details (dev only)
                                </summary>
                                <pre className="mt-2 p-4 bg-slate-50 rounded text-xs overflow-auto text-left">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
