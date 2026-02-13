import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollToSection } from "./useScrollToSection";

describe("useScrollToSection", () => {
    let scrollToMock: any;
    let getElementByIdMock: any;

    beforeEach(() => {
        // Mock window.scrollTo
        scrollToMock = vi.fn();
        window.scrollTo = scrollToMock;

        // Mock document.getElementById
        getElementByIdMock = vi.spyOn(document, "getElementById");
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
            window.scrollY = 100;

            const { result } = renderHook(() => useScrollToSection());

            result.current("about");

            expect(getElementByIdMock).toHaveBeenCalledWith("about");
            expect(scrollToMock).toHaveBeenCalledWith({
                top: 520, // 500 (position) + 100 (scrollY) - 80 (navbar)
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
        it("aplica offset de 80px para el navbar fijo", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 1000 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            result.current("contact");

            expect(scrollToMock).toHaveBeenCalledWith({
                top: 920, // 1000 - 80
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

            expect(scrollToMock).toHaveBeenCalledWith({
                top: 620, // 200 + 500 - 80
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

            expect(scrollToMock).toHaveBeenCalledWith({
                top: -30, // 50 - 80 (puede ser negativo si está muy arriba)
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

            expect(scrollToMock).toHaveBeenCalledWith({
                top: 10020, // 100 + 10000 - 80
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

            expect(scrollToMock).toHaveBeenCalledWith({
                top: 320, // -100 + 500 - 80
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

            // En un componente real, esto se usaría así:
            // useEffect(() => {
            //   scrollToSection('about');
            // }, [scrollToSection]);

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

            expect(scrollToMock).toHaveBeenCalledWith({
                top: 1920, // 0 + 2000 - 80
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

            // Simular click en botón que llama a scrollToSection
            const handleNavClick = (sectionId: string) => {
                result.current(sectionId);
            };

            handleNavClick("about");

            expect(scrollToMock).toHaveBeenCalledWith({
                top: 1120,
                behavior: "smooth",
            });
        });

        it("simula navegación por menú móvil", () => {
            const mockElement = {
                getBoundingClientRect: () => ({ top: 800 }),
            } as HTMLElement;

            getElementByIdMock.mockReturnValue(mockElement);
            window.scrollY = 0;

            const { result } = renderHook(() => useScrollToSection());

            // Simular cierre de menú y scroll
            const handleMobileMenuClick = (sectionId: string) => {
                // setMenuOpen(false) - en componente real
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

            expect(scrollToMock).toHaveBeenCalledWith({
                top: 1920, // -3000 + 5000 - 80
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

            // Todas las referencias deben ser iguales
            const allSame = refs.every((ref) => ref === refs[0]);
            expect(allSame).toBe(true);
        });
    });
});
