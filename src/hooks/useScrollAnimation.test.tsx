import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act, renderHook } from "@testing-library/react";
import React, { useState } from "react";
import { useScrollAnimation } from "./useScrollAnimation";

describe("useScrollAnimation", () => {
    let observeMock: any;
    let disconnectMock: any;
    let savedCallback: any;

    beforeEach(() => {
        observeMock = vi.fn();
        disconnectMock = vi.fn();
        savedCallback = undefined;

        // Mock como clase, no como función
        class IntersectionObserverMock {
            constructor(callback: any, _options?: any) {
                savedCallback = callback;
            }
            observe = observeMock;
            disconnect = disconnectMock;
            unobserve = vi.fn();
            takeRecords = vi.fn();
            root = null;
            rootMargin = "";
            thresholds = [];
        }

        globalThis.IntersectionObserver = IntersectionObserverMock as any;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    function TestComponent(props: any) {
        const { ref, isVisible } = useScrollAnimation(props);
        const [, forceRender] = useState(0);

        // Forzamos segundo render para que el effect vea el ref asignado
        React.useEffect(() => {
            forceRender(1);
        }, []);

        return (
            <div>
                <div
                    ref={ref as React.RefObject<HTMLDivElement>}
                    data-testid="element"
                />
                <span data-testid="visible">
                    {isVisible ? "visible" : "hidden"}
                </span>
            </div>
        );
    }

    it("inicializa con isVisible en false", () => {
        const { getByTestId } = render(<TestComponent />);
        expect(getByTestId("visible").textContent).toBe("hidden");
    });

    it("crea el observer cuando el elemento existe", () => {
        render(<TestComponent />);
        expect(observeMock).toHaveBeenCalled();
    });

    it("cambia isVisible a true cuando intersecta", () => {
        const { getByTestId } = render(<TestComponent />);

        act(() => {
            savedCallback([{ isIntersecting: true }]);
        });

        expect(getByTestId("visible").textContent).toBe("visible");
    });

    it("desconecta cuando triggerOnce es true", () => {
        render(<TestComponent triggerOnce={true} />);

        act(() => {
            savedCallback([{ isIntersecting: true }]);
        });

        expect(disconnectMock).toHaveBeenCalled();
    });

    it("no desconecta cuando triggerOnce es false", () => {
        render(<TestComponent triggerOnce={false} />);

        act(() => {
            savedCallback([{ isIntersecting: true }]);
        });

        expect(disconnectMock).not.toHaveBeenCalled();
    });

    it("desconecta en cleanup", () => {
        const { unmount } = render(<TestComponent />);
        unmount();
        expect(disconnectMock).toHaveBeenCalled();
    });

    // Nuevo test para cubrir cuando ref.current es null
    it("no crea observer cuando el elemento no existe (ref es null)", () => {
        const { result } = renderHook(() => useScrollAnimation());

        // ref.current es null porque nunca se asignó a un elemento
        expect(result.current.ref.current).toBeNull();
        expect(observeMock).not.toHaveBeenCalled();
    });

    // Nuevo test para cubrir el cleanup con observer
    it("ejecuta cleanup correctamente cuando se desmonta", () => {
        const { unmount } = render(<TestComponent />);

        // Verificar que el observer se creó
        expect(observeMock).toHaveBeenCalled();

        // Desmontar componente
        unmount();

        // Verificar que se llamó disconnect en el cleanup
        expect(disconnectMock).toHaveBeenCalled();
    });

    // Test adicional para cubrir el caso cuando entry NO está intersectando
    it("no cambia isVisible cuando no intersecta", () => {
        const { getByTestId } = render(<TestComponent />);

        act(() => {
            savedCallback([{ isIntersecting: false }]);
        });

        expect(getByTestId("visible").textContent).toBe("hidden");
    });

    // Test para cubrir la rama else del if (observer) en el cleanup
    it("maneja cleanup cuando no hay observer (elemento no existe)", () => {
        const { result, rerender } = renderHook(() => useScrollAnimation());

        // Verificar que ref existe pero está null
        expect(result.current.ref.current).toBeNull();

        // No se crea observer porque ref.current es null
        expect(observeMock).not.toHaveBeenCalled();

        // Forzar re-render para ejecutar cleanup
        rerender();

        // El cleanup se ejecuta pero no llama disconnect porque no hay observer
        expect(disconnectMock).not.toHaveBeenCalled();
    });
});
