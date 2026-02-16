/**
 * Logger utility que solo ejecuta en development.
 * Previene console spam en producción y facilita debugging.
 */

export type LogLevel = "log" | "warn" | "error" | "info" | "debug";

class Logger {
    private isDev = import.meta.env.DEV;

    private shouldLog(): boolean {
        return this.isDev;
    }

    log(...args: unknown[]): void {
        if (this.shouldLog()) {
            console.log(...args);
        }
    }

    warn(...args: unknown[]): void {
        if (this.shouldLog()) {
            console.warn(...args);
        }
    }

    error(...args: unknown[]): void {
        // Errors siempre se loguean, pero en prod irían a Sentry
        console.error(...args);
    }

    info(...args: unknown[]): void {
        if (this.shouldLog()) {
            console.info(...args);
        }
    }

    debug(...args: unknown[]): void {
        if (this.shouldLog()) {
            console.debug(...args);
        }
    }

    /**
     * Agrupa logs relacionados (solo en dev)
     */
    group(label: string, callback: () => void): void {
        if (this.shouldLog()) {
            console.group(label);
            callback();
            console.groupEnd();
        }
    }
}

export const logger = new Logger();
