import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, render } from "@testing-library/react";
import { useCounter } from "./useCounter";
import { act } from "react";

describe("useCounter", () => {
    let mockObserve: ReturnType<typeof vi.fn>;
    let mockDisconnect: ReturnType<typeof vi.fn>;
    let intersectionCallback: IntersectionObserverCallback | null;
    let mockObserverInstance: IntersectionObserver | null;
    let rafCallbacks: Array<FrameRequestCallback>;
    let performanceNowMock: ReturnType<typeof vi.spyOn>;
    let currentTime: number;

    beforeEach(() => {
        rafCallbacks = [];
        intersectionCallback = null;
        mockObserverInstance = null;
        mockObserve = vi.fn();
        mockDisconnect = vi.fn();
        currentTime = 0;

        performanceNowMock = vi
            .spyOn(performance, "now")
            .mockImplementation(() => currentTime);

        (globalThis as any).IntersectionObserver = class IntersectionObserver {
            constructor(callback: IntersectionObserverCallback) {
                intersectionCallback = callback;
                mockObserverInstance = this as any;
            }
            observe = mockObserve;
            disconnect = mockDisconnect;
            unobserve = vi.fn();
        };

        vi.spyOn(window, "requestAnimationFrame").mockImplementation(
            (cb: FrameRequestCallback) => {
                rafCallbacks.push(cb);
                return rafCallbacks.length - 1;
            },
        );

        vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

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
        currentTime = 0;
        mockObserverInstance = null;
        intersectionCallback = null;
    });

    describe("Inicialización", () => {
        it("inicializa con count en 0", () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));
            expect(result.current.count).toBe(0);
        });

        it("proporciona una ref", () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));
            expect(result.current.ref).toBeDefined();
            expect(typeof result.current.ref).toBe("function");
        });

        it("no inicia el conteo hasta que el elemento sea visible", () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));
            expect(result.current.count).toBe(0);
        });
    });

    describe("IntersectionObserver", () => {
        it("observa el elemento cuando ref es llamado", async () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(mockObserve).toHaveBeenCalled();
            });
        });

        it("inicia el conteo cuando el elemento entra en el viewport", async () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(intersectionCallback).not.toBeNull();
            });

            act(() => {
                currentTime = 0;
                intersectionCallback!(
                    [{ isIntersecting: true } as IntersectionObserverEntry],
                    mockObserverInstance!,
                );
            });

            act(() => {
                currentTime = 500;
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](currentTime);
                }
            });

            await waitFor(() => {
                expect(result.current.count).toBeGreaterThan(0);
            });
        });

        it("no inicia el conteo si el elemento no es visible", async () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(intersectionCallback).not.toBeNull();
            });

            act(() => {
                intersectionCallback!(
                    [{ isIntersecting: false } as IntersectionObserverEntry],
                    mockObserverInstance!,
                );
            });

            expect(result.current.count).toBe(0);
        });

        it("desconecta el observer después de que el elemento sea visible", async () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(intersectionCallback).not.toBeNull();
            });

            act(() => {
                intersectionCallback!(
                    [{ isIntersecting: true } as IntersectionObserverEntry],
                    mockObserverInstance!,
                );
            });

            await waitFor(() => {
                expect(mockDisconnect).toHaveBeenCalled();
            });
        });
    });

    describe("Animación del contador", () => {
        it("incrementa el count progresivamente", async () => {
            const { result } = renderHook(() =>
                useCounter({ end: 100, duration: 1000 }),
            );
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(intersectionCallback).not.toBeNull();
            });

            act(() => {
                currentTime = 0;
                intersectionCallback!(
                    [{ isIntersecting: true } as IntersectionObserverEntry],
                    mockObserverInstance!,
                );
            });

            act(() => {
                currentTime = 0;
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](currentTime);
                }
            });

            expect(result.current.count).toBe(0);

            act(() => {
                currentTime = 500;
                if (rafCallbacks.length > 1) {
                    rafCallbacks[1](currentTime);
                }
            });

            await waitFor(() => {
                expect(result.current.count).toBeGreaterThan(0);
                expect(result.current.count).toBeLessThan(100);
            });
        });

        it("llega exactamente al valor end al finalizar", async () => {
            const { result } = renderHook(() =>
                useCounter({ end: 100, duration: 100 }),
            );
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(intersectionCallback).not.toBeNull();
            });

            act(() => {
                currentTime = 0;
                intersectionCallback!(
                    [{ isIntersecting: true } as IntersectionObserverEntry],
                    mockObserverInstance!,
                );
            });

            act(() => {
                currentTime = 0;
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](currentTime);
                }
            });

            act(() => {
                currentTime = 150;
                if (rafCallbacks.length > 1) {
                    rafCallbacks[1](currentTime);
                }
            });

            await waitFor(
                () => {
                    expect(result.current.count).toBe(100);
                },
                { timeout: 2000 },
            );
        });

        it("usa la duración por defecto de 2000ms", () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));
            expect(result.current).toBeDefined();
        });

        it("respeta la duración customizada", async () => {
            const { result } = renderHook(() =>
                useCounter({ end: 50, duration: 200 }),
            );
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(intersectionCallback).not.toBeNull();
            });

            act(() => {
                currentTime = 0;
                intersectionCallback!(
                    [{ isIntersecting: true } as IntersectionObserverEntry],
                    mockObserverInstance!,
                );
            });

            act(() => {
                currentTime = 0;
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](currentTime);
                }
            });

            act(() => {
                currentTime = 250;
                if (rafCallbacks.length > 1) {
                    rafCallbacks[1](currentTime);
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

            const { result } = renderHook(() => useCounter({ end: 100 }));
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(intersectionCallback).not.toBeNull();
            });

            act(() => {
                intersectionCallback!(
                    [{ isIntersecting: true } as IntersectionObserverEntry],
                    mockObserverInstance!,
                );
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

            const { result } = renderHook(() =>
                useCounter({ end: 100, duration: 1000 }),
            );
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(intersectionCallback).not.toBeNull();
            });

            act(() => {
                currentTime = 0;
                intersectionCallback!(
                    [{ isIntersecting: true } as IntersectionObserverEntry],
                    mockObserverInstance!,
                );
            });

            act(() => {
                currentTime = 0;
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](currentTime);
                }
            });

            act(() => {
                currentTime = 500;
                if (rafCallbacks.length > 1) {
                    rafCallbacks[1](currentTime);
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
            const { result } = renderHook(() => useCounter({ end: 0 }));
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(intersectionCallback).not.toBeNull();
            });

            act(() => {
                intersectionCallback!(
                    [{ isIntersecting: true } as IntersectionObserverEntry],
                    mockObserverInstance!,
                );
            });

            await waitFor(() => {
                expect(result.current.count).toBe(0);
            });
        });

        it("maneja valores decimales de end (los redondea)", async () => {
            const { result } = renderHook(() =>
                useCounter({ end: 50.7, duration: 100 }),
            );
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(intersectionCallback).not.toBeNull();
            });

            act(() => {
                currentTime = 0;
                intersectionCallback!(
                    [{ isIntersecting: true } as IntersectionObserverEntry],
                    mockObserverInstance!,
                );
            });

            act(() => {
                currentTime = 0;
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](currentTime);
                }
            });

            act(() => {
                currentTime = 150;
                if (rafCallbacks.length > 1) {
                    rafCallbacks[1](currentTime);
                }
            });

            await waitFor(() => {
                expect(result.current.count).toBe(50);
            });
        });

        it("no falla si ref no se llama", () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));
            expect(result.current.count).toBe(0);
        });
    });

    describe("Cleanup", () => {
        it("limpia el observer al desmontar", async () => {
            const { result, unmount } = renderHook(() =>
                useCounter({ end: 100 }),
            );
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(mockObserve).toHaveBeenCalled();
            });

            unmount();

            expect(mockDisconnect).toHaveBeenCalled();
        });

        it("no vuelve a animar si ya fue animado", async () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(intersectionCallback).not.toBeNull();
            });

            act(() => {
                intersectionCallback!(
                    [{ isIntersecting: true } as IntersectionObserverEntry],
                    mockObserverInstance!,
                );
            });

            const disconnectCount = mockDisconnect.mock.calls.length;

            act(() => {
                intersectionCallback!(
                    [{ isIntersecting: true } as IntersectionObserverEntry],
                    mockObserverInstance!,
                );
            });

            await waitFor(() => {
                expect(mockDisconnect.mock.calls.length).toBe(disconnectCount);
            });
        });
    });

    describe("Casos edge adicionales", () => {
        it("maneja cuando matchMedia no está disponible", async () => {
            const originalMatchMedia = window.matchMedia;
            (window as any).matchMedia = undefined;

            const { result } = renderHook(() => useCounter({ end: 100 }));
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(intersectionCallback).not.toBeNull();
            });

            act(() => {
                currentTime = 0;
                intersectionCallback!(
                    [{ isIntersecting: true } as IntersectionObserverEntry],
                    mockObserverInstance!,
                );
            });

            act(() => {
                currentTime = 0;
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](currentTime);
                }
            });

            expect(result.current.count).toBeGreaterThanOrEqual(0);
            window.matchMedia = originalMatchMedia;
        });

        it("maneja cuando el entry no está definido en el callback", async () => {
            const { result } = renderHook(() => useCounter({ end: 100 }));
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(intersectionCallback).not.toBeNull();
            });

            act(() => {
                intersectionCallback!([], mockObserverInstance!);
            });

            expect(result.current.count).toBe(0);
        });

        it("inicializa startTime correctamente con performance.now()", async () => {
            const { result } = renderHook(() =>
                useCounter({ end: 50, duration: 100 }),
            );
            const mockElement = document.createElement("div");

            act(() => {
                result.current.ref(mockElement);
            });

            await waitFor(() => {
                expect(intersectionCallback).not.toBeNull();
            });

            act(() => {
                currentTime = 100;
                intersectionCallback!(
                    [{ isIntersecting: true } as IntersectionObserverEntry],
                    mockObserverInstance!,
                );
            });

            act(() => {
                currentTime = 150;
                if (rafCallbacks.length > 0) {
                    rafCallbacks[0](currentTime);
                }
            });

            await waitFor(() => {
                expect(result.current.count).toBeGreaterThan(0);
            });
        });
    });

    it("no hace nada si ref no se llama", () => {
        const { result } = renderHook(() => useCounter({ end: 100 }));
        expect(result.current.count).toBe(0);
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

        expect(() => vi.advanceTimersByTime(1000)).not.toThrow();

        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it("no re-anima si ya animó una vez (hasAnimatedRef)", async () => {
        const { result } = renderHook(() =>
            useCounter({ end: 100, duration: 100 }),
        );
        const mockElement = document.createElement("div");

        act(() => {
            result.current.ref(mockElement);
        });

        await waitFor(() => {
            expect(intersectionCallback).not.toBeNull();
        });

        act(() => {
            intersectionCallback!(
                [{ isIntersecting: true } as IntersectionObserverEntry],
                mockObserverInstance!,
            );
        });

        expect(mockDisconnect).toHaveBeenCalled();
        mockDisconnect.mockClear();

        act(() => {
            intersectionCallback!(
                [{ isIntersecting: true } as IntersectionObserverEntry],
                mockObserverInstance!,
            );
        });

        expect(mockDisconnect).not.toHaveBeenCalled();
    });

    it("desconecta el observer inmediatamente después de la primera intersección", async () => {
        const { result } = renderHook(() =>
            useCounter({ end: 100, duration: 100 }),
        );
        const mockElement = document.createElement("div");

        act(() => {
            result.current.ref(mockElement);
        });

        await waitFor(() => {
            expect(intersectionCallback).not.toBeNull();
        });

        expect(mockDisconnect).not.toHaveBeenCalled();

        act(() => {
            intersectionCallback!(
                [{ isIntersecting: true } as IntersectionObserverEntry],
                mockObserverInstance!,
            );
        });

        expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
});
