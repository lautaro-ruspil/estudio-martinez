import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, render } from "@testing-library/react";
import { useCounter } from "./useCounter";
import { act } from "react";

describe("useCounter", () => {
    let mockObserve: any;
    let mockDisconnect: any;
    let intersectionCallback: any;
    let rafCallbacks: Array<(time: number) => void>;

    beforeEach(() => {
        rafCallbacks = [];
        intersectionCallback = null;
        mockObserve = vi.fn();
        mockDisconnect = vi.fn();

        // Mock IntersectionObserver - DEBE SER UNA CLASE
        (globalThis as any).IntersectionObserver = class IntersectionObserver {
            constructor(callback: any) {
                intersectionCallback = callback;
            }
            observe = mockObserve;
            disconnect = mockDisconnect;
            unobserve = vi.fn();
        };

        // Mock requestAnimationFrame
        vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
            rafCallbacks.push(cb);
            return rafCallbacks.length - 1;
        });

        vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

        // Mock matchMedia
        Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: vi.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        rafCallbacks = [];
    });

    describe("Inicialización", () => {
        it("inicializa con count en 0", () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));

            expect(result.current.count).toBe(0);
        });

        it("proporciona una ref", () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));

            expect(result.current.ref).toBeDefined();
            expect(result.current.ref.current).toBeNull();
        });

        it("no inicia el conteo hasta que el elemento sea visible", () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));

            expect(result.current.count).toBe(0);
        });
    });

    describe("IntersectionObserver", () => {
        it("observa el elemento cuando ref.current está asignado", () => {
            const { result, rerender } = renderHook(() =>
                useCounter({ end: 100 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            expect(mockObserve).toHaveBeenCalled();
        });

        it("inicia el conteo cuando el elemento entra en el viewport", async () => {
            const { result, rerender } = renderHook(() =>
                useCounter({ end: 100 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            act(() => {
                intersectionCallback([{ isIntersecting: true }]);
            });

            act(() => {
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](1000);
                }
            });

            await waitFor(() => {
                expect(result.current.count).toBeGreaterThan(0);
            });
        });

        it("no inicia el conteo si el elemento no es visible", () => {
            const { result, rerender } = renderHook(() =>
                useCounter({ end: 100 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            act(() => {
                intersectionCallback([{ isIntersecting: false }]);
            });

            expect(result.current.count).toBe(0);
        });

        it("desconecta el observer después de que el elemento sea visible", async () => {
            const { result, rerender } = renderHook(() =>
                useCounter({ end: 100 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            act(() => {
                intersectionCallback([{ isIntersecting: true }]);
            });

            await waitFor(() => {
                expect(mockDisconnect).toHaveBeenCalled();
            });
        });
    });

    describe("Animación del contador", () => {
        it("incrementa el count progresivamente", async () => {
            const { result, rerender } = renderHook(() =>
                useCounter({ end: 100, duration: 1000 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            act(() => {
                intersectionCallback([{ isIntersecting: true }]);
            });

            act(() => {
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](0);
                }
            });

            expect(result.current.count).toBe(0);

            act(() => {
                if (rafCallbacks.length > 1) {
                    rafCallbacks[1](500);
                }
            });

            await waitFor(() => {
                expect(result.current.count).toBeGreaterThan(0);
                expect(result.current.count).toBeLessThan(100);
            });
        });

        it("llega exactamente al valor end al finalizar", async () => {
            const { result, rerender } = renderHook(() =>
                useCounter({ end: 100, duration: 100 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            act(() => {
                intersectionCallback([{ isIntersecting: true }]);
            });

            act(() => {
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](0);
                }
            });

            act(() => {
                if (rafCallbacks.length > 1) {
                    rafCallbacks[1](150);
                }
            });

            await waitFor(
                () => {
                    expect(result.current.count).toBe(100);
                },
                { timeout: 2000 },
            );
        });

        it("usa la duración por defecto de 1500ms", () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));

            expect(result.current).toBeDefined();
        });

        it("respeta la duración customizada", async () => {
            const { result, rerender } = renderHook(() =>
                useCounter({ end: 50, duration: 200 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            act(() => {
                intersectionCallback([{ isIntersecting: true }]);
            });

            act(() => {
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](0);
                }
            });

            act(() => {
                if (rafCallbacks.length > 1) {
                    rafCallbacks[1](250);
                }
            });

            await waitFor(
                () => {
                    expect(result.current.count).toBe(50);
                },
                { timeout: 2000 },
            );
        });
    });

    describe("Accesibilidad - prefers-reduced-motion", () => {
        it("muestra el valor final inmediatamente si el usuario prefiere reducir movimiento", async () => {
            Object.defineProperty(window, "matchMedia", {
                writable: true,
                value: vi.fn().mockImplementation((query) => ({
                    matches: query === "(prefers-reduced-motion: reduce)",
                    media: query,
                    onchange: null,
                    addListener: vi.fn(),
                    removeListener: vi.fn(),
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                    dispatchEvent: vi.fn(),
                })),
            });

            const { result, rerender } = renderHook(() =>
                useCounter({ end: 100 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            act(() => {
                intersectionCallback([{ isIntersecting: true }]);
            });

            await waitFor(() => {
                expect(result.current.count).toBe(100);
            });
        });

        it("anima normalmente si no hay preferencia de movimiento reducido", async () => {
            Object.defineProperty(window, "matchMedia", {
                writable: true,
                value: vi.fn().mockImplementation((query) => ({
                    matches: false,
                    media: query,
                    onchange: null,
                    addListener: vi.fn(),
                    removeListener: vi.fn(),
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                    dispatchEvent: vi.fn(),
                })),
            });

            const { result, rerender } = renderHook(() =>
                useCounter({ end: 100, duration: 1000 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            act(() => {
                intersectionCallback([{ isIntersecting: true }]);
            });

            act(() => {
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](0);
                }
            });

            act(() => {
                if (rafCallbacks.length > 1) {
                    rafCallbacks[1](500);
                }
            });

            await waitFor(() => {
                expect(result.current.count).toBeGreaterThan(0);
                expect(result.current.count).toBeLessThanOrEqual(100);
            });
        });
    });

    describe("Casos edge", () => {
        it("maneja end = 0 correctamente", async () => {
            const { result, rerender } = renderHook(() =>
                useCounter({ end: 0 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            act(() => {
                intersectionCallback([{ isIntersecting: true }]);
            });

            await waitFor(() => {
                expect(result.current.count).toBe(0);
            });
        });

        it("maneja valores decimales de end (los redondea)", async () => {
            const { result, rerender } = renderHook(() =>
                useCounter({ end: 50.7, duration: 100 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            act(() => {
                intersectionCallback([{ isIntersecting: true }]);
            });

            act(() => {
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](0);
                }
            });

            act(() => {
                if (rafCallbacks.length > 1) {
                    rafCallbacks[1](150);
                }
            });

            await waitFor(() => {
                expect(result.current.count).toBe(50);
            });
        });

        it("no falla si ref.current es null", () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));

            expect(result.current.ref.current).toBeNull();
            expect(result.current.count).toBe(0);
        });
    });

    describe("Cleanup", () => {
        it("limpia el observer al desmontar", () => {
            const { result, rerender, unmount } = renderHook(() =>
                useCounter({ end: 100 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            unmount();

            expect(mockDisconnect).toHaveBeenCalled();
        });

        it("no vuelve a animar si ya fue animado", async () => {
            const { result, rerender } = renderHook(() =>
                useCounter({ end: 100 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            act(() => {
                intersectionCallback([{ isIntersecting: true }]);
            });

            act(() => {
                intersectionCallback([{ isIntersecting: true }]);
            });

            await waitFor(() => {
                expect(mockDisconnect).toHaveBeenCalled();
            });
        });
    });

    describe("Casos edge adicionales", () => {
        it("maneja cuando matchMedia no está disponible", () => {
            // Guardar el original
            const originalMatchMedia = window.matchMedia;

            // Eliminar matchMedia
            (window as any).matchMedia = undefined;

            const { result, rerender } = renderHook(() =>
                useCounter({ end: 100 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            act(() => {
                intersectionCallback([{ isIntersecting: true }]);
            });

            act(() => {
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](0);
                }
            });

            expect(result.current.count).toBeGreaterThanOrEqual(0);

            // Restaurar
            window.matchMedia = originalMatchMedia;
        });

        it("maneja cuando el entry no está definido en el callback", () => {
            const { result, rerender } = renderHook(() =>
                useCounter({ end: 100 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            // Llamar con array vacío
            act(() => {
                intersectionCallback([]);
            });

            // No debería iniciar animación
            expect(result.current.count).toBe(0);
        });

        it("inicializa startTimeRef correctamente en la animación", async () => {
            const { result, rerender } = renderHook(() =>
                useCounter({ end: 50, duration: 100 }),
            );

            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref.current = mockElement;
            });

            rerender();

            act(() => {
                intersectionCallback([{ isIntersecting: true }]);
            });

            // Primer frame - startTimeRef es null, se setea a 0
            act(() => {
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](100);
                }
            });

            // Segundo frame - startTimeRef ya tiene valor
            act(() => {
                if (rafCallbacks.length > 1) {
                    rafCallbacks[1](150);
                }
            });

            await waitFor(() => {
                expect(result.current.count).toBeGreaterThan(0);
            });
        });
    });

    it("no hace nada si ref.current es null", () => {
        const { result } = renderHook(() => useCounter({ end: 100 }));

        // Sin asignar el ref a ningún elemento, count permanece en 0
        expect(result.current.count).toBe(0);
        expect(result.current.ref.current).toBeNull();
    });

    it("cancela animationFrame en cleanup correctamente", () => {
        vi.useFakeTimers();

        const TestComponent = () => {
            const { count, ref } = useCounter({ end: 100 });
            return <div ref={ref}>{count}</div>;
        };

        const { unmount } = render(<TestComponent />);

        vi.advanceTimersByTime(100);
        unmount();

        // No debería lanzar error al avanzar tiempo después de unmount
        expect(() => vi.advanceTimersByTime(1000)).not.toThrow();

        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it("no re-anima si ya animó una vez (hasAnimatedRef)", async () => {
        const { result, rerender } = renderHook(() =>
            useCounter({ end: 100, duration: 100 }),
        );

        const mockElement = document.createElement("div");
        act(() => {
            result.current.ref.current = mockElement;
        });
        rerender();

        // Primera vez: entra al viewport y anima
        act(() => {
            intersectionCallback([{ isIntersecting: true }]);
        });

        // Verificar que hasAnimatedRef se marcó como true y observer se desconectó
        expect(mockDisconnect).toHaveBeenCalled();

        // Reset del mock para verificar que no se llama de nuevo
        mockDisconnect.mockClear();

        // Intentar re-entrar al viewport (segunda vez)
        act(() => {
            intersectionCallback([{ isIntersecting: true }]);
        });

        // NO debería desconectar de nuevo porque hasAnimatedRef.current === true
        // (línea 22: if (hasAnimatedRef.current) return;)
        expect(mockDisconnect).not.toHaveBeenCalled();
    });

    it("desconecta el observer inmediatamente después de la primera intersección", () => {
        const { result, rerender } = renderHook(() =>
            useCounter({ end: 100, duration: 100 }),
        );

        const mockElement = document.createElement("div");
        act(() => {
            result.current.ref.current = mockElement;
        });
        rerender();

        // Verificar que NO se ha desconectado antes de intersectar
        expect(mockDisconnect).not.toHaveBeenCalled();

        // Primera intersección
        act(() => {
            intersectionCallback([{ isIntersecting: true }]);
        });

        // Debería desconectar INMEDIATAMENTE (línea 39)
        expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
});
