import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollToSection } from "./useScrollToSection";

describe("useScrollToSection", () => {
    let scrollToMock: any;
    let getElementByIdMock: any;
    let querySelectorMock: any;

    beforeEach(() => {
        // Mock window.scrollTo
        scrollToMock = vi.fn();
        window.scrollTo = scrollToMock;

        // Mock document.getElementById
        getElementByIdMock = vi.spyOn(document, "getElementById");

        // Mock document.querySelector para navbar
        querySelectorMock = vi.spyOn(document, "querySelector");
        const mockNavbar = { offsetHeight: 80 } as HTMLElement;
        querySelectorMock.mockReturnValue(mockNavbar);

        // Mock window.innerWidth (desktop por defecto)
        Object.defineProperty(window, "innerWidth", {
            writable: true,
            configurable: true,
            value: 1024,
        });

        // Mock document.documentElement.classList
        document.documentElement.classList.add = vi.fn();
        document.documentElement.classList.remove = vi.fn();

        // Mock setTimeout
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
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
            window.scrollY = 100;

            const { result } = renderHook(() => useScrollToSection());

            result.current("about");

            expect(getElementByIdMock).toHaveBeenCalledWith("about");
            // 500 + 100 - 80 (navbar) - 8 (extraPadding desktop) = 512
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 512,
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
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            result.current("services");

            expect(getElementByIdMock).toHaveBeenCalledWith("services");
        });
    });

    describe("Offset del navbar", () => {
        it("aplica offset dinámico del navbar", () => {
            const mockNavbar = { offsetHeight: 80 } as HTMLElement;
            querySelectorMock.mockReturnValue(mockNavbar);

            const mockElement = {
                getBoundingClientRect: () => ({ top: 1000 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            result.current("contact");

            // 1000 - 80 (navbar) - 8 (extraPadding desktop) = 912
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 912,
                behavior: "smooth",
            });
        });

        it("calcula correctamente la posición con scroll previo", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 200 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 500;

            const { result } = renderHook(() => useScrollToSection());

            result.current("section");

            // 200 + 500 - 80 - 8 = 612
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 612,
                behavior: "smooth",
            });
        });

        it("maneja correctamente cuando el elemento está arriba en la página", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 50 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            result.current("top-section");

            // 50 - 80 - 8 = -38
            expect(scrollToMock).toHaveBeenCalledWith({
                top: -38,
                behavior: "smooth",
            });
        });

        it("usa fallback de 80px si navbar no existe", () => {
            querySelectorMock.mockReturnValue(null);

            const mockElement = {
                getBoundingClientRect: () => ({ top: 1000 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            result.current("section");

            // 1000 - 80 (fallback) - 8 = 912
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 912,
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
            window.scrollY = 0;

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
            window.scrollY = 100;

            const { result } = renderHook(() => useScrollToSection());

            result.current("section");

            expect(scrollToMock).toHaveBeenCalledTimes(1);
        });

        it("agrega clase smooth-scroll temporalmente", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 300 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            result.current("section");

            expect(document.documentElement.classList.add).toHaveBeenCalledWith(
                "smooth-scroll",
            );

            // Avanzar timers
            vi.advanceTimersByTime(1000);

            expect(
                document.documentElement.classList.remove,
            ).toHaveBeenCalledWith("smooth-scroll");
        });
    });

    describe("Padding extra responsive", () => {
        it("aplica 16px de padding extra en mobile", () => {
            // Simular mobile
            Object.defineProperty(window, "innerWidth", {
                writable: true,
                configurable: true,
                value: 375,
            });

            const mockElement = {
                getBoundingClientRect: () => ({ top: 500 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            result.current("section");

            // 500 - 80 - 16 (mobile padding) = 404
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 404,
                behavior: "smooth",
            });
        });

        it("aplica 8px de padding extra en desktop", () => {
            // Simular desktop
            Object.defineProperty(window, "innerWidth", {
                writable: true,
                configurable: true,
                value: 1440,
            });

            const mockElement = {
                getBoundingClientRect: () => ({ top: 500 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            result.current("section");

            // 500 - 80 - 8 (desktop padding) = 412
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 412,
                behavior: "smooth",
            });
        });

        it("considera 768px como breakpoint mobile/desktop", () => {
            // Justo en el breakpoint (767px = mobile)
            Object.defineProperty(window, "innerWidth", {
                writable: true,
                configurable: true,
                value: 767,
            });

            const mockElement = {
                getBoundingClientRect: () => ({ top: 500 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            result.current("section");

            // 767px < 768, entonces mobile: 500 - 80 - 16 = 404
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 404,
                behavior: "smooth",
            });
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

            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            result.current("section1");

            // 300 - 80 - 8 = 212
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 212,
                behavior: "smooth",
            });

            scrollToMock.mockClear();

            result.current("section2");

            // 800 - 80 - 8 = 712
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 712,
                behavior: "smooth",
            });
        });

        it("maneja correctamente llamadas secuenciales", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 500 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 0;

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
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            result.current("section-with-dashes");

            expect(getElementByIdMock).toHaveBeenCalledWith(
                "section-with-dashes",
            );
            expect(scrollToMock).toHaveBeenCalled();
        });

        it("maneja IDs con números", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 300 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            result.current("section123");

            expect(getElementByIdMock).toHaveBeenCalledWith("section123");
            expect(scrollToMock).toHaveBeenCalled();
        });

        it("maneja cuando window.scrollY es muy grande", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 100 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 10000;

            const { result } = renderHook(() => useScrollToSection());

            result.current("section");

            // 100 + 10000 - 80 - 8 = 10012
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 10012,
                behavior: "smooth",
            });
        });

        it("maneja cuando el elemento tiene top negativo", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: -100 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 500;

            const { result } = renderHook(() => useScrollToSection());

            result.current("section");

            // -100 + 500 - 80 - 8 = 312
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 312,
                behavior: "smooth",
            });
        });

        it("no crashea si getBoundingClientRect retorna undefined", () => {
            const mockElement = {
                getBoundingClientRect: () => ({}),
            } as any;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            expect(() => result.current("section")).not.toThrow();
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

        it("se puede pasar de forma segura a dependencias de useEffect", () => {
            const { result } = renderHook(() => useScrollToSection());

            const scrollToSection = result.current;

            expect(typeof scrollToSection).toBe("function");
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
                window.scrollY = 0;

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
            window.scrollY = 2000;

            const { result } = renderHook(() => useScrollToSection());

            result.current("hero");

            // 0 + 2000 - 80 - 8 = 1912
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 1912,
                behavior: "smooth",
            });
        });
    });

    describe("Casos de uso reales", () => {
        it("simula click en botón de navegación", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 1200 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            const handleNavClick = (sectionId: string) => {
                result.current(sectionId);
            };

            handleNavClick("about");

            // 1200 - 80 - 8 = 1112
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 1112,
                behavior: "smooth",
            });
        });

        it("simula navegación por menú móvil", () => {
            // Simular mobile
            Object.defineProperty(window, "innerWidth", {
                writable: true,
                configurable: true,
                value: 375,
            });

            const mockElement = {
                getBoundingClientRect: () => ({ top: 800 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            const handleMobileMenuClick = (sectionId: string) => {
                result.current(sectionId);
            };

            handleMobileMenuClick("services");

            expect(scrollToMock).toHaveBeenCalled();
        });

        it("maneja scroll desde footer", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: -3000 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 5000;

            const { result } = renderHook(() => useScrollToSection());

            result.current("hero");

            // -3000 + 5000 - 80 - 8 = 1912
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 1912,
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
