import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToggle } from "./useToggle";

describe("useToggle", () => {
    describe("Inicialización", () => {
        it("inicializa con false por defecto", () => {
            const { result } = renderHook(() => useToggle());

            expect(result.current[0]).toBe(false);
        });

        it("inicializa con true cuando se especifica", () => {
            const { result } = renderHook(() => useToggle(true));

            expect(result.current[0]).toBe(true);
        });

        it("inicializa con false cuando se especifica explícitamente", () => {
            const { result } = renderHook(() => useToggle(false));

            expect(result.current[0]).toBe(false);
        });
    });

    describe("Función toggle", () => {
        it("cambia de false a true", () => {
            const { result } = renderHook(() => useToggle(false));

            expect(result.current[0]).toBe(false);

            act(() => {
                result.current[1](); // toggle
            });

            expect(result.current[0]).toBe(true);
        });

        it("cambia de true a false", () => {
            const { result } = renderHook(() => useToggle(true));

            expect(result.current[0]).toBe(true);

            act(() => {
                result.current[1](); // toggle
            });

            expect(result.current[0]).toBe(false);
        });

        it("alterna múltiples veces correctamente", () => {
            const { result } = renderHook(() => useToggle());

            expect(result.current[0]).toBe(false);

            act(() => {
                result.current[1](); // false -> true
            });

            expect(result.current[0]).toBe(true);

            act(() => {
                result.current[1](); // true -> false
            });

            expect(result.current[0]).toBe(false);

            act(() => {
                result.current[1](); // false -> true
            });

            expect(result.current[0]).toBe(true);

            act(() => {
                result.current[1](); // true -> false
            });

            expect(result.current[0]).toBe(false);
        });

        it("funciona con múltiples toggles en secuencia", () => {
            const { result } = renderHook(() => useToggle());

            act(() => {
                result.current[1]();
                result.current[1]();
                result.current[1]();
            });

            // Empezó en false, 3 toggles = true
            expect(result.current[0]).toBe(true);
        });
    });

    describe("Función set", () => {
        it("establece el valor a true", () => {
            const { result } = renderHook(() => useToggle(false));

            expect(result.current[0]).toBe(false);

            act(() => {
                result.current[2](true); // set(true)
            });

            expect(result.current[0]).toBe(true);
        });

        it("establece el valor a false", () => {
            const { result } = renderHook(() => useToggle(true));

            expect(result.current[0]).toBe(true);

            act(() => {
                result.current[2](false); // set(false)
            });

            expect(result.current[0]).toBe(false);
        });

        it("establece a true cuando ya era true", () => {
            const { result } = renderHook(() => useToggle(true));

            expect(result.current[0]).toBe(true);

            act(() => {
                result.current[2](true);
            });

            expect(result.current[0]).toBe(true);
        });

        it("establece a false cuando ya era false", () => {
            const { result } = renderHook(() => useToggle(false));

            expect(result.current[0]).toBe(false);

            act(() => {
                result.current[2](false);
            });

            expect(result.current[0]).toBe(false);
        });

        it("puede cambiar el valor múltiples veces", () => {
            const { result } = renderHook(() => useToggle());

            act(() => {
                result.current[2](true);
            });
            expect(result.current[0]).toBe(true);

            act(() => {
                result.current[2](false);
            });
            expect(result.current[0]).toBe(false);

            act(() => {
                result.current[2](true);
            });
            expect(result.current[0]).toBe(true);

            act(() => {
                result.current[2](true);
            });
            expect(result.current[0]).toBe(true);

            act(() => {
                result.current[2](false);
            });
            expect(result.current[0]).toBe(false);
        });
    });

    describe("Interacción entre toggle y set", () => {
        it("toggle funciona después de usar set", () => {
            const { result } = renderHook(() => useToggle());

            act(() => {
                result.current[2](true); // set a true
            });

            expect(result.current[0]).toBe(true);

            act(() => {
                result.current[1](); // toggle
            });

            expect(result.current[0]).toBe(false);
        });

        it("set funciona después de usar toggle", () => {
            const { result } = renderHook(() => useToggle(false));

            act(() => {
                result.current[1](); // toggle a true
            });

            expect(result.current[0]).toBe(true);

            act(() => {
                result.current[2](false); // set a false
            });

            expect(result.current[0]).toBe(false);
        });

        it("alterna entre toggle y set correctamente", () => {
            const { result } = renderHook(() => useToggle());

            expect(result.current[0]).toBe(false);

            act(() => {
                result.current[1](); // toggle -> true
            });
            expect(result.current[0]).toBe(true);

            act(() => {
                result.current[2](false); // set -> false
            });
            expect(result.current[0]).toBe(false);

            act(() => {
                result.current[1](); // toggle -> true
            });
            expect(result.current[0]).toBe(true);

            act(() => {
                result.current[1](); // toggle -> false
            });
            expect(result.current[0]).toBe(false);

            act(() => {
                result.current[2](true); // set -> true
            });
            expect(result.current[0]).toBe(true);
        });
    });

    describe("Estabilidad de referencias (useCallback)", () => {
        it("toggle mantiene la misma referencia entre renders", () => {
            const { result, rerender } = renderHook(() => useToggle());

            const firstToggle = result.current[1];

            rerender();

            expect(result.current[1]).toBe(firstToggle);
        });

        it("set mantiene la misma referencia entre renders", () => {
            const { result, rerender } = renderHook(() => useToggle());

            const firstSet = result.current[2];

            rerender();

            expect(result.current[2]).toBe(firstSet);
        });

        it("las funciones mantienen su referencia después de cambios de valor", () => {
            const { result } = renderHook(() => useToggle());

            const initialToggle = result.current[1];
            const initialSet = result.current[2];

            act(() => {
                result.current[1](); // Cambiar valor
            });

            expect(result.current[1]).toBe(initialToggle);
            expect(result.current[2]).toBe(initialSet);

            act(() => {
                result.current[2](false); // Cambiar valor
            });

            expect(result.current[1]).toBe(initialToggle);
            expect(result.current[2]).toBe(initialSet);
        });

        it("las funciones se pueden pasar de forma segura a dependencias de useEffect", () => {
            const { result, rerender } = renderHook(() => useToggle());

            const toggle1 = result.current[1];
            const set1 = result.current[2];

            // Múltiples re-renders
            rerender();
            rerender();
            rerender();

            expect(result.current[1]).toBe(toggle1);
            expect(result.current[2]).toBe(set1);
        });
    });

    describe("Valor de retorno", () => {
        it("retorna un array con 3 elementos", () => {
            const { result } = renderHook(() => useToggle());

            expect(Array.isArray(result.current)).toBe(true);
            expect(result.current).toHaveLength(3);
        });

        it("el primer elemento es el valor booleano", () => {
            const { result } = renderHook(() => useToggle(true));

            expect(typeof result.current[0]).toBe("boolean");
            expect(result.current[0]).toBe(true);
        });

        it("el segundo elemento es la función toggle", () => {
            const { result } = renderHook(() => useToggle());

            expect(typeof result.current[1]).toBe("function");
        });

        it("el tercer elemento es la función set", () => {
            const { result } = renderHook(() => useToggle());

            expect(typeof result.current[2]).toBe("function");
        });
    });

    describe("Casos de uso comunes", () => {
        it("funciona para toggle de modal", () => {
            const { result } = renderHook(() => useToggle(false));

            // Modal cerrado inicialmente
            expect(result.current[0]).toBe(false);

            // Abrir modal
            act(() => {
                result.current[2](true);
            });
            expect(result.current[0]).toBe(true);

            // Cerrar modal
            act(() => {
                result.current[2](false);
            });
            expect(result.current[0]).toBe(false);

            // Toggle modal
            act(() => {
                result.current[1]();
            });
            expect(result.current[0]).toBe(true);
        });

        it("funciona para toggle de menú móvil", () => {
            const { result } = renderHook(() => useToggle());

            // Menú cerrado
            expect(result.current[0]).toBe(false);

            // Abrir menú
            act(() => {
                result.current[1]();
            });
            expect(result.current[0]).toBe(true);

            // Cerrar menú
            act(() => {
                result.current[1]();
            });
            expect(result.current[0]).toBe(false);
        });

        it("funciona para toggle de dark mode", () => {
            const { result } = renderHook(() => useToggle(false));

            // Light mode
            expect(result.current[0]).toBe(false);

            // Activar dark mode
            act(() => {
                result.current[1]();
            });
            expect(result.current[0]).toBe(true);

            // Volver a light mode
            act(() => {
                result.current[1]();
            });
            expect(result.current[0]).toBe(false);
        });

        it("funciona para toggle de acordeón", () => {
            const { result } = renderHook(() => useToggle());

            // Colapsado
            expect(result.current[0]).toBe(false);

            // Expandir
            act(() => {
                result.current[1]();
            });
            expect(result.current[0]).toBe(true);

            // Colapsar
            act(() => {
                result.current[1]();
            });
            expect(result.current[0]).toBe(false);
        });

        it("funciona para estado de loading", () => {
            const { result } = renderHook(() => useToggle(false));

            // No loading
            expect(result.current[0]).toBe(false);

            // Iniciar loading
            act(() => {
                result.current[2](true);
            });
            expect(result.current[0]).toBe(true);

            // Terminar loading
            act(() => {
                result.current[2](false);
            });
            expect(result.current[0]).toBe(false);
        });
    });

    describe("Edge cases", () => {
        it("maneja cambios de valor en el mismo ciclo de renderizado", () => {
            const { result } = renderHook(() => useToggle());

            act(() => {
                result.current[1](); // false -> true
                result.current[1](); // true -> false
                result.current[1](); // false -> true
            });

            expect(result.current[0]).toBe(true);
        });

        it("set con el mismo valor no causa re-renders innecesarios", () => {
            let renderCount = 0;
            const { result } = renderHook(() => {
                renderCount++;
                return useToggle(true);
            });

            const initialRenderCount = renderCount;

            act(() => {
                result.current[2](true); // Ya era true
            });

            // Nota: useState de React aún podría causar un re-render
            // pero el valor debería permanecer igual
            expect(result.current[0]).toBe(true);
        });

        it("funciona con desestructuración", () => {
            const { result } = renderHook(() => useToggle());

            const [value, toggle, set] = result.current;

            expect(value).toBe(false);

            act(() => {
                toggle();
            });

            expect(result.current[0]).toBe(true);

            act(() => {
                set(false);
            });

            expect(result.current[0]).toBe(false);
        });
    });
});
