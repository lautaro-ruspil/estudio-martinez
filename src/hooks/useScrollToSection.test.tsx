import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollToSection } from "./useScrollToSection";

describe("useScrollToSection", () => {
    let scrollToMock: ReturnType<typeof vi.fn>;
    let getElementByIdMock: ReturnType<typeof vi.spyOn>;
    let querySelectorMock: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        // Mock window.scrollTo
        scrollToMock = vi.fn();
        window.scrollTo = scrollToMock as any;

        // Mock document.getElementById
        getElementByIdMock = vi.spyOn(document, "getElementById");

        // Mock document.querySelector para navbar con getBoundingClientRect
        querySelectorMock = vi.spyOn(document, "querySelector");
        const mockNavbar = {
            getBoundingClientRect: () => ({ height: 80 }),
        } as unknown as HTMLElement;
        querySelectorMock.mockReturnValue(mockNavbar);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Funcionalidad básica", () => {
        it("retorna una función", () => {
            const { result } = renderHook(() => useScrollToSection());
            expect(typeof result.current).toBe("function");
        });

        it("hace scroll a una sección que existe", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 500 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            Object.defineProperty(window, "pageYOffset", {
                writable: true,
                configurable: true,
                value: 100,
            });

            const { result } = renderHook(() => useScrollToSection());
            result.current("about");

            expect(getElementByIdMock).toHaveBeenCalledWith("about");
            // 500 (top) + 100 (pageYOffset) - 80 (navbar) = 520
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 520,
                behavior: "smooth",
            });
        });

        it("no hace nada si la sección no existe", () => {
            getElementByIdMock.mockReturnValue(null);

            const { result } = renderHook(() => useScrollToSection());
            result.current("nonexistent");

            expect(getElementByIdMock).toHaveBeenCalledWith("nonexistent");
            expect(scrollToMock).not.toHaveBeenCalled();
        });

        it("busca el elemento por el ID proporcionado", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 300 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            Object.defineProperty(window, "pageYOffset", {
                writable: true,
                value: 0,
            });

            const { result } = renderHook(() => useScrollToSection());
            result.current("services");

            expect(getElementByIdMock).toHaveBeenCalledWith("services");
        });
    });

    describe("Offset del navbar", () => {
        it("aplica offset dinámico del navbar", () => {
            const mockNavbar = {
                getBoundingClientRect: () => ({ height: 100 }),
            } as unknown as HTMLElement;
            querySelectorMock.mockReturnValue(mockNavbar);

            const mockElement = {
                getBoundingClientRect: () => ({ top: 1000 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            Object.defineProperty(window, "pageYOffset", { value: 0 });

            const { result } = renderHook(() => useScrollToSection());
            result.current("contact");

            // 1000 - 100 (navbar custom height) = 900
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 900,
                behavior: "smooth",
            });
        });

        it("calcula correctamente la posición con scroll previo", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 200 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            Object.defineProperty(window, "pageYOffset", { value: 500 });

            const { result } = renderHook(() => useScrollToSection());
            result.current("section");

            // 200 + 500 - 80 = 620
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 620,
                behavior: "smooth",
            });
        });

        it("usa fallback de 80px si navbar no existe", () => {
            querySelectorMock.mockReturnValue(null);

            const mockElement = {
                getBoundingClientRect: () => ({ top: 1000 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            Object.defineProperty(window, "pageYOffset", { value: 0 });

            const { result } = renderHook(() => useScrollToSection());
            result.current("section");

            // 1000 - 80 (fallback) = 920
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 920,
                behavior: "smooth",
            });
        });
    });

    describe("Comportamiento de scroll", () => {
        it("usa comportamiento smooth para el scroll", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 300 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            Object.defineProperty(window, "pageYOffset", { value: 0 });

            const { result } = renderHook(() => useScrollToSection());
            result.current("section");

            expect(scrollToMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    behavior: "smooth",
                }),
            );
        });

        it("llama a window.scrollTo exactamente una vez", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 400 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            Object.defineProperty(window, "pageYOffset", { value: 100 });

            const { result } = renderHook(() => useScrollToSection());
            result.current("section");

            expect(scrollToMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("Múltiples llamadas", () => {
        it("puede hacer scroll a diferentes secciones", () => {
            const mockElement1 = {
                getBoundingClientRect: () => ({ top: 300 }),
            } as HTMLElement;

            const mockElement2 = {
                getBoundingClientRect: () => ({ top: 800 }),
            } as HTMLElement;

            getElementByIdMock
                .mockReturnValueOnce(mockElement1)
                .mockReturnValueOnce(mockElement2);

            Object.defineProperty(window, "pageYOffset", { value: 0 });

            const { result } = renderHook(() => useScrollToSection());

            result.current("section1");
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 220, // 300 - 80
                behavior: "smooth",
            });

            scrollToMock.mockClear();

            result.current("section2");
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 720, // 800 - 80
                behavior: "smooth",
            });
        });

        it("maneja correctamente llamadas secuenciales", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 500 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            Object.defineProperty(window, "pageYOffset", { value: 0 });

            const { result } = renderHook(() => useScrollToSection());

            result.current("section1");
            result.current("section2");
            result.current("section3");

            expect(scrollToMock).toHaveBeenCalledTimes(3);
        });
    });

    describe("Casos edge", () => {
        it("maneja ID vacío", () => {
            getElementByIdMock.mockReturnValue(null);

            const { result } = renderHook(() => useScrollToSection());
            result.current("");

            expect(getElementByIdMock).toHaveBeenCalledWith("");
            expect(scrollToMock).not.toHaveBeenCalled();
        });

        it("maneja IDs con caracteres especiales", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 300 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            Object.defineProperty(window, "pageYOffset", { value: 0 });

            const { result } = renderHook(() => useScrollToSection());
            result.current("section-with-dashes");

            expect(getElementByIdMock).toHaveBeenCalledWith(
                "section-with-dashes",
            );
            expect(scrollToMock).toHaveBeenCalled();
        });

        it("maneja cuando window.pageYOffset es muy grande", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 100 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            Object.defineProperty(window, "pageYOffset", { value: 10000 });

            const { result } = renderHook(() => useScrollToSection());
            result.current("section");

            // 100 + 10000 - 80 = 10020
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 10020,
                behavior: "smooth",
            });
        });

        it("maneja cuando el elemento tiene top negativo", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: -100 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            Object.defineProperty(window, "pageYOffset", { value: 500 });

            const { result } = renderHook(() => useScrollToSection());
            result.current("section");

            // -100 + 500 - 80 = 320
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 320,
                behavior: "smooth",
            });
        });
    });

    describe("useCallback - Estabilidad de referencia", () => {
        it("retorna la misma referencia de función entre renders", () => {
            const { result, rerender } = renderHook(() => useScrollToSection());

            const firstFunction = result.current;
            rerender();

            expect(result.current).toBe(firstFunction);
        });

        it("la función no cambia después de múltiples re-renders", () => {
            const { result, rerender } = renderHook(() => useScrollToSection());

            const initialFunction = result.current;

            rerender();
            rerender();
            rerender();

            expect(result.current).toBe(initialFunction);
        });
    });

    describe("Integración con navegación", () => {
        it("funciona con enlaces de navegación", () => {
            const sections = ["hero", "about", "services", "contact"];

            sections.forEach((sectionId) => {
                const mockElement = {
                    getBoundingClientRect: () => ({ top: 500 }),
                } as HTMLElement;

                getElementByIdMock.mockReturnValue(mockElement);
                Object.defineProperty(window, "pageYOffset", { value: 0 });

                const { result } = renderHook(() => useScrollToSection());
                result.current(sectionId);

                expect(getElementByIdMock).toHaveBeenCalledWith(sectionId);
            });
        });

        it("maneja scroll to top (sección hero)", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 0 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            Object.defineProperty(window, "pageYOffset", { value: 2000 });

            const { result } = renderHook(() => useScrollToSection());
            result.current("hero");

            // 0 + 2000 - 80 = 1920
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 1920,
                behavior: "smooth",
            });
        });
    });

    describe("Performance", () => {
        it("no recalcula la función en cada render", () => {
            const { result, rerender } = renderHook(() => useScrollToSection());

            const refs = [result.current];

            for (let i = 0; i < 10; i++) {
                rerender();
                refs.push(result.current);
            }

            const allSame = refs.every((ref) => ref === refs[0]);
            expect(allSame).toBe(true);
        });
    });
});
