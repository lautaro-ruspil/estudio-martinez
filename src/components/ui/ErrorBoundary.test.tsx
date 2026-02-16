import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "./ErrorBoundary";
import * as loggerModule from "../../utils/logger";

// Componente que lanza error para testing
const ThrowError = ({ shouldThrow }: { shouldThrow?: boolean }) => {
    if (shouldThrow) {
        throw new Error("Test error");
    }
    return <div>No error</div>;
};

describe("ErrorBoundary", () => {
    // Mock completo del logger con todas las propiedades requeridas
    const mockLogger = {
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        debug: vi.fn(),
        log: vi.fn(),
        isDev: false,
        shouldLog: vi.fn(() => true),
        group: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Suprimir errores de consola en los tests
        vi.spyOn(console, "error").mockImplementation(() => {});
        // Mock del logger
        vi.spyOn(loggerModule, "logger", "get").mockReturnValue(
            mockLogger as any,
        );
    });

    describe("Renderizado normal (sin errores)", () => {
        it("renderiza los children cuando no hay error", () => {
            render(
                <ErrorBoundary>
                    <div>Test content</div>
                </ErrorBoundary>,
            );

            expect(screen.getByText("Test content")).toBeInTheDocument();
        });

        it("no muestra el UI de error cuando todo está bien", () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={false} />
                </ErrorBoundary>,
            );

            expect(
                screen.queryByText("Algo salió mal"),
            ).not.toBeInTheDocument();
            expect(screen.getByText("No error")).toBeInTheDocument();
        });
    });

    describe("Captura de errores", () => {
        it("captura errores y muestra UI de fallback por defecto", () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>,
            );

            // Verificar que se muestra el mensaje de error
            expect(screen.getByText("Algo salió mal")).toBeInTheDocument();
            expect(
                screen.getByText(
                    /Ocurrió un error inesperado. Por favor recargá la página./,
                ),
            ).toBeInTheDocument();
        });

        it("muestra el botón de recargar página", () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>,
            );

            expect(
                screen.getByRole("button", { name: /Recargar página/i }),
            ).toBeInTheDocument();
        });

        it("llama al logger.error cuando captura un error", () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>,
            );

            expect(mockLogger.error).toHaveBeenCalledWith(
                "Error boundary caught:",
                expect.any(Error),
                expect.objectContaining({
                    componentStack: expect.any(String),
                }),
            );
        });

        it("muestra el ícono de error en el UI de fallback", () => {
            const { container } = render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>,
            );

            // Verificar que existe el SVG del ícono de error
            const svg = container.querySelector("svg");
            expect(svg).toBeInTheDocument();
            expect(svg).toHaveClass("text-red-600");
        });
    });

    describe("Fallback personalizado", () => {
        it("renderiza el fallback custom cuando se provee", () => {
            const customFallback = <div>Custom error message</div>;

            render(
                <ErrorBoundary fallback={customFallback}>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>,
            );

            expect(
                screen.getByText("Custom error message"),
            ).toBeInTheDocument();
            expect(
                screen.queryByText("Algo salió mal"),
            ).not.toBeInTheDocument();
        });

        it("no muestra el UI por defecto cuando hay fallback custom", () => {
            const customFallback = (
                <div>
                    <h1>My Custom Error</h1>
                    <button>My Custom Button</button>
                </div>
            );

            render(
                <ErrorBoundary fallback={customFallback}>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>,
            );

            expect(screen.getByText("My Custom Error")).toBeInTheDocument();
            expect(
                screen.queryByText("Recargar página"),
            ).not.toBeInTheDocument();
        });
    });

    describe("Botón de recarga", () => {
        it("recarga la página cuando se hace click en el botón", async () => {
            const user = userEvent.setup();
            const reloadMock = vi.fn();
            Object.defineProperty(window, "location", {
                value: { reload: reloadMock },
                writable: true,
            });

            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>,
            );

            const reloadButton = screen.getByRole("button", {
                name: /Recargar página/i,
            });
            await user.click(reloadButton);

            expect(reloadMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("Detalles del error en desarrollo", () => {
        it("muestra detalles del error en modo desarrollo", () => {
            // Simular modo desarrollo
            vi.stubEnv("DEV", true);

            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>,
            );

            // Verificar que existe el elemento details
            const details = screen.getByText(/Error details \(dev only\)/i);
            expect(details).toBeInTheDocument();

            vi.unstubAllEnvs();
        });

        it("no muestra detalles del error en producción", () => {
            // Simular modo producción
            vi.stubEnv("DEV", false);
            vi.stubEnv("PROD", true);

            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>,
            );

            // No debería existir el elemento details
            expect(
                screen.queryByText(/Error details \(dev only\)/i),
            ).not.toBeInTheDocument();

            vi.unstubAllEnvs();
        });

        it("muestra el stack trace del error en desarrollo", () => {
            vi.stubEnv("DEV", true);

            const { container } = render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>,
            );

            // Buscar el elemento <pre> que contiene el stack trace
            const preElement = container.querySelector("pre");
            expect(preElement).toBeInTheDocument();
            expect(preElement?.textContent).toContain("Error: Test error");

            vi.unstubAllEnvs();
        });
    });

    describe("Estado del componente", () => {
        it("actualiza el estado correctamente cuando hay error", () => {
            const { rerender } = render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={false} />
                </ErrorBoundary>,
            );

            // Inicialmente no hay error
            expect(screen.getByText("No error")).toBeInTheDocument();

            // Provocar error
            rerender(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>,
            );

            // Ahora debería mostrar el UI de error
            expect(screen.getByText("Algo salió mal")).toBeInTheDocument();
        });

        it("mantiene el estado de error después de capturarlo", () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>,
            );

            // El UI de error debería permanecer visible
            expect(screen.getByText("Algo salió mal")).toBeInTheDocument();

            // Verificar que el estado no se resetea automáticamente
            expect(
                screen.getByRole("button", { name: /Recargar página/i }),
            ).toBeInTheDocument();
        });
    });

    describe("Estructura visual del fallback", () => {
        it("tiene la estructura correcta de clases CSS", () => {
            const { container } = render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>,
            );

            // Verificar estructura de contenedor principal
            const mainDiv = container.querySelector(".min-h-screen");
            expect(mainDiv).toBeInTheDocument();
            expect(mainDiv).toHaveClass(
                "flex",
                "items-center",
                "justify-center",
            );

            // Verificar tarjeta de error
            const card = container.querySelector(".bg-white");
            expect(card).toHaveClass("rounded-2xl", "shadow-medium");

            // Verificar contenedor del ícono
            const iconContainer = container.querySelector(".bg-red-50");
            expect(iconContainer).toHaveClass("rounded-full");
        });

        it("renderiza todos los elementos visuales esperados", () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>,
            );

            // Título
            expect(screen.getByText("Algo salió mal")).toBeInTheDocument();

            // Descripción
            expect(
                screen.getByText(
                    /Ocurrió un error inesperado. Por favor recargá la página./,
                ),
            ).toBeInTheDocument();

            // Botón
            expect(
                screen.getByRole("button", { name: /Recargar página/i }),
            ).toBeInTheDocument();
        });
    });

    describe("Errores específicos", () => {
        it("maneja correctamente errores con mensajes diferentes", () => {
            const CustomError = () => {
                throw new Error("Custom error message");
            };

            render(
                <ErrorBoundary>
                    <CustomError />
                </ErrorBoundary>,
            );

            expect(mockLogger.error).toHaveBeenCalledWith(
                "Error boundary caught:",
                expect.objectContaining({
                    message: "Custom error message",
                }),
                expect.any(Object),
            );
        });

        it("maneja errores sin stack trace", () => {
            vi.stubEnv("DEV", true);

            const ErrorWithoutStack = () => {
                const error = new Error("Error without stack");
                error.stack = undefined;
                throw error;
            };

            const { container } = render(
                <ErrorBoundary>
                    <ErrorWithoutStack />
                </ErrorBoundary>,
            );

            // Debería mostrar el UI de error de todos modos
            expect(screen.getByText("Algo salió mal")).toBeInTheDocument();

            // El pre debería existir pero podría estar vacío
            const preElement = container.querySelector("pre");
            expect(preElement).toBeInTheDocument();

            vi.unstubAllEnvs();
        });
    });

    describe("Integración con múltiples children", () => {
        it("renderiza múltiples children cuando no hay error", () => {
            render(
                <ErrorBoundary>
                    <div>Child 1</div>
                    <div>Child 2</div>
                    <div>Child 3</div>
                </ErrorBoundary>,
            );

            expect(screen.getByText("Child 1")).toBeInTheDocument();
            expect(screen.getByText("Child 2")).toBeInTheDocument();
            expect(screen.getByText("Child 3")).toBeInTheDocument();
        });

        it("captura error incluso con múltiples children", () => {
            render(
                <ErrorBoundary>
                    <div>Child 1</div>
                    <ThrowError shouldThrow={true} />
                    <div>Child 3</div>
                </ErrorBoundary>,
            );

            expect(screen.getByText("Algo salió mal")).toBeInTheDocument();
            expect(screen.queryByText("Child 1")).not.toBeInTheDocument();
            expect(screen.queryByText("Child 3")).not.toBeInTheDocument();
        });
    });
});
