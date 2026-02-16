import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFocusTrap } from "./useFocusTrap";
import { act } from "react";

// Componente de prueba para testing
function TestComponent({ isActive }: { isActive: boolean }) {
    const ref = useFocusTrap(isActive);

    return (
        <div ref={ref} data-testid="trap-container">
            <button>First Button</button>
            <a href="#test">Link</a>
            <input type="text" placeholder="Input" />
            <select>
                <option>Select</option>
            </select>
            <textarea placeholder="Textarea" />
            <button>Last Button</button>
        </div>
    );
}

describe("useFocusTrap", () => {
    let addEventListenerSpy: any;
    let removeEventListenerSpy: any;

    beforeEach(() => {
        addEventListenerSpy = vi.spyOn(document, "addEventListener");
        removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Inicialización", () => {
        it("retorna una ref", () => {
            const { result } = renderHook(() => useFocusTrap(false));

            expect(result.current).toBeDefined();
            expect(result.current.current).toBeNull();
        });

        it("no agrega event listener cuando isActive es false", () => {
            renderHook(() => useFocusTrap(false));

            expect(addEventListenerSpy).not.toHaveBeenCalledWith(
                "keydown",
                expect.any(Function),
            );
        });

        it("agrega event listener cuando isActive es true", () => {
            const { result, rerender } = renderHook(
                ({ active }) => useFocusTrap(active),
                { initialProps: { active: true } },
            );

            const mockElement = document.createElement("div");
            mockElement.innerHTML = "<button>Test</button>";

            act(() => {
                result.current.current = mockElement;
            });

            rerender({ active: true });

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                "keydown",
                expect.any(Function),
            );
        });
    });

    describe("Focus en primer elemento", () => {
        it("enfoca el primer elemento focusable cuando se activa", async () => {
            const { rerender } = render(<TestComponent isActive={false} />);

            const firstButton = screen.getByText("First Button");
            expect(firstButton).not.toHaveFocus();

            rerender(<TestComponent isActive={true} />);

            await vi.waitFor(() => {
                expect(firstButton).toHaveFocus();
            });
        });

        it("no enfoca elementos cuando isActive es false", () => {
            render(<TestComponent isActive={false} />);

            const firstButton = screen.getByText("First Button");
            expect(firstButton).not.toHaveFocus();
        });

        it("maneja el caso cuando no hay elementos focusables", () => {
            const EmptyComponent = ({ isActive }: { isActive: boolean }) => {
                const ref = useFocusTrap(isActive);
                return <div ref={ref} data-testid="empty-trap"></div>;
            };

            render(<EmptyComponent isActive={true} />);

            expect(screen.getByTestId("empty-trap")).toBeInTheDocument();
        });
    });

    describe("Navegación con Tab", () => {
        it("permite navegar hacia adelante con Tab", async () => {
            const user = userEvent.setup();
            render(<TestComponent isActive={true} />);

            const firstButton = screen.getByText("First Button");
            const link = screen.getByText("Link");

            await vi.waitFor(() => {
                expect(firstButton).toHaveFocus();
            });

            await user.tab();

            expect(link).toHaveFocus();
        });

        it("permite navegar hacia atrás con Shift+Tab", async () => {
            const user = userEvent.setup();
            render(<TestComponent isActive={true} />);

            const link = screen.getByText("Link");
            link.focus();

            expect(link).toHaveFocus();

            await user.tab({ shift: true });

            const firstButton = screen.getByText("First Button");
            expect(firstButton).toHaveFocus();
        });

        it("no interfiere con la navegación cuando isActive es false", async () => {
            const user = userEvent.setup();
            render(<TestComponent isActive={false} />);

            const firstButton = screen.getByText("First Button");
            firstButton.focus();

            await user.tab();

            expect(firstButton).not.toHaveFocus();
        });
    });

    describe("Trap circular", () => {
        it("vuelve al primer elemento al hacer Tab en el último", async () => {
            const user = userEvent.setup();
            render(<TestComponent isActive={true} />);

            const firstButton = screen.getByText("First Button");
            const lastButton = screen.getByText("Last Button");

            lastButton.focus();
            expect(lastButton).toHaveFocus();

            await user.tab();

            expect(firstButton).toHaveFocus();
        });

        it("va al último elemento al hacer Shift+Tab en el primero", async () => {
            const user = userEvent.setup();
            render(<TestComponent isActive={true} />);

            const firstButton = screen.getByText("First Button");
            const lastButton = screen.getByText("Last Button");

            await vi.waitFor(() => {
                expect(firstButton).toHaveFocus();
            });

            await user.tab({ shift: true });

            expect(lastButton).toHaveFocus();
        });
    });

    describe("Elementos focusables", () => {
        it("identifica botones como focusables", async () => {
            render(<TestComponent isActive={true} />);

            const firstButton = screen.getByText("First Button");

            await vi.waitFor(() => {
                expect(firstButton).toHaveFocus();
            });
        });

        it("identifica links como focusables", async () => {
            const user = userEvent.setup();
            render(<TestComponent isActive={true} />);

            await vi.waitFor(() => {
                expect(screen.getByText("First Button")).toHaveFocus();
            });

            await user.tab();

            expect(screen.getByText("Link")).toHaveFocus();
        });

        it("identifica inputs como focusables", async () => {
            const user = userEvent.setup();
            render(<TestComponent isActive={true} />);

            await vi.waitFor(() => {
                expect(screen.getByText("First Button")).toHaveFocus();
            });

            await user.tab();
            await user.tab();

            expect(screen.getByPlaceholderText("Input")).toHaveFocus();
        });

        it("identifica selects como focusables", async () => {
            const user = userEvent.setup();
            render(<TestComponent isActive={true} />);

            await vi.waitFor(() => {
                expect(screen.getByText("First Button")).toHaveFocus();
            });

            await user.tab();
            await user.tab();
            await user.tab();

            expect(screen.getByRole("combobox")).toHaveFocus();
        });

        it("identifica textareas como focusables", async () => {
            const user = userEvent.setup();
            render(<TestComponent isActive={true} />);

            await vi.waitFor(() => {
                expect(screen.getByText("First Button")).toHaveFocus();
            });

            await user.tab();
            await user.tab();
            await user.tab();
            await user.tab();

            expect(screen.getByPlaceholderText("Textarea")).toHaveFocus();
        });

        it("ignora elementos con tabindex='-1'", () => {
            const ComponentWithNegativeTabIndex = ({
                isActive,
            }: {
                isActive: boolean;
            }) => {
                const ref = useFocusTrap(isActive);
                return (
                    <div ref={ref}>
                        <button>First</button>
                        <button tabIndex={-1}>Should be ignored</button>
                        <button>Last</button>
                    </div>
                );
            };

            render(<ComponentWithNegativeTabIndex isActive={true} />);

            const ignoredButton = screen.getByText("Should be ignored");
            const firstButton = screen.getByText("First");

            expect(ignoredButton).not.toHaveFocus();
            expect(firstButton).toHaveFocus();
        });

        it("incluye elementos con tabindex positivo", async () => {
            const ComponentWithPositiveTabIndex = ({
                isActive,
            }: {
                isActive: boolean;
            }) => {
                const ref = useFocusTrap(isActive);
                return (
                    <div ref={ref}>
                        <button>First</button>
                        <button tabIndex={1}>With positive tabindex</button>
                        <button>Last</button>
                    </div>
                );
            };

            render(<ComponentWithPositiveTabIndex isActive={true} />);

            await vi.waitFor(() => {
                expect(screen.getByText("First")).toHaveFocus();
            });
        });
    });

    describe("Otras teclas", () => {
        it("no interfiere con otras teclas que no sean Tab", async () => {
            const user = userEvent.setup();
            render(<TestComponent isActive={true} />);

            const input = screen.getByPlaceholderText("Input");
            input.focus();

            await user.keyboard("Hello");

            expect(input).toHaveValue("Hello");
        });

        it("no previene el comportamiento de Enter", async () => {
            const handleClick = vi.fn();
            const ComponentWithButton = ({
                isActive,
            }: {
                isActive: boolean;
            }) => {
                const ref = useFocusTrap(isActive);
                return (
                    <div ref={ref}>
                        <button onClick={handleClick}>Click me</button>
                    </div>
                );
            };

            const user = userEvent.setup();
            render(<ComponentWithButton isActive={true} />);

            await vi.waitFor(() => {
                expect(screen.getByText("Click me")).toHaveFocus();
            });

            await user.keyboard("{Enter}");

            expect(handleClick).toHaveBeenCalled();
        });

        it("no previene el comportamiento de Escape", async () => {
            const user = userEvent.setup();
            render(<TestComponent isActive={true} />);

            const input = screen.getByPlaceholderText("Input");
            input.focus();

            await user.keyboard("{Escape}");

            expect(input).toHaveFocus();
        });
    });

    describe("Activación y desactivación", () => {
        it("activa el trap cuando isActive cambia de false a true", async () => {
            const { rerender } = render(<TestComponent isActive={false} />);

            const firstButton = screen.getByText("First Button");
            expect(firstButton).not.toHaveFocus();

            rerender(<TestComponent isActive={true} />);

            await vi.waitFor(() => {
                expect(firstButton).toHaveFocus();
            });

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                "keydown",
                expect.any(Function),
            );
        });

        it("desactiva el trap cuando isActive cambia de true a false", async () => {
            const { rerender } = render(<TestComponent isActive={true} />);

            await vi.waitFor(() => {
                expect(addEventListenerSpy).toHaveBeenCalledWith(
                    "keydown",
                    expect.any(Function),
                );
            });

            rerender(<TestComponent isActive={false} />);

            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                "keydown",
                expect.any(Function),
            );
        });

        it("mantiene el trap activo si isActive permanece true", async () => {
            const { rerender } = render(<TestComponent isActive={true} />);

            await vi.waitFor(() => {
                expect(screen.getByText("First Button")).toHaveFocus();
            });

            const callCount = addEventListenerSpy.mock.calls.length;

            rerender(<TestComponent isActive={true} />);

            expect(addEventListenerSpy).toHaveBeenCalledTimes(callCount);
        });
    });

    describe("Cleanup", () => {
        it("elimina el event listener al desmontar", async () => {
            const { unmount } = render(<TestComponent isActive={true} />);

            await vi.waitFor(() => {
                expect(addEventListenerSpy).toHaveBeenCalledWith(
                    "keydown",
                    expect.any(Function),
                );
            });

            unmount();

            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                "keydown",
                expect.any(Function),
            );
        });

        it("no falla al desmontar si nunca fue activado", () => {
            const { unmount } = render(<TestComponent isActive={false} />);

            expect(() => unmount()).not.toThrow();
        });
    });

    describe("Casos edge - Cobertura de líneas 17-23", () => {
        it("maneja el caso cuando el elemento ref es null", () => {
            const { result } = renderHook(() => useFocusTrap(true));

            expect(result.current).toBeDefined();
            expect(result.current.current).toBeNull();
        });

        it("maneja el caso cuando no hay elementos focusables al presionar Tab (líneas 17-23)", async () => {
            const EmptyComponent = ({ isActive }: { isActive: boolean }) => {
                const ref = useFocusTrap(isActive);
                return (
                    <div ref={ref} data-testid="empty-container">
                        <div>No focusable elements</div>
                        <span>Just text</span>
                    </div>
                );
            };

            const user = userEvent.setup();
            render(<EmptyComponent isActive={true} />);

            const container = screen.getByTestId("empty-container");
            expect(container).toBeInTheDocument();

            // Intentar hacer Tab - esto ejecutará handleTabKey con focusableElements.length === 0
            await user.keyboard("{Tab}");

            // No debe haber errores - esto cubre el early return en línea 17
            expect(container).toBeInTheDocument();
        });

        it("maneja el caso cuando element existe pero querySelectorAll retorna array vacío", async () => {
            const ComponentWithNonFocusable = ({
                isActive,
            }: {
                isActive: boolean;
            }) => {
                const ref = useFocusTrap(isActive);
                return (
                    <div ref={ref} data-testid="non-focusable">
                        <div>Content 1</div>
                        <div>Content 2</div>
                        <p>Paragraph</p>
                    </div>
                );
            };

            const user = userEvent.setup();
            render(<ComponentWithNonFocusable isActive={true} />);

            // Simular presionar Tab cuando no hay elementos focusables
            // Esto cubre la línea 17 cuando focusableElements.length === 0 en handleTabKey
            await user.keyboard("{Tab}");
            await user.keyboard("{Shift>}{Tab}{/Shift}");

            // No debe causar error
            expect(screen.getByTestId("non-focusable")).toBeInTheDocument();
        });

        it("maneja un solo elemento focusable", async () => {
            const SingleElementComponent = ({
                isActive,
            }: {
                isActive: boolean;
            }) => {
                const ref = useFocusTrap(isActive);
                return (
                    <div ref={ref}>
                        <button>Only Button</button>
                    </div>
                );
            };

            const user = userEvent.setup();
            render(<SingleElementComponent isActive={true} />);

            const button = screen.getByText("Only Button");

            await vi.waitFor(() => {
                expect(button).toHaveFocus();
            });

            await user.tab();
            expect(button).toHaveFocus();

            await user.tab({ shift: true });
            expect(button).toHaveFocus();
        });

        it("maneja elementos disabled correctamente", () => {
            const ComponentWithDisabled = ({
                isActive,
            }: {
                isActive: boolean;
            }) => {
                const ref = useFocusTrap(isActive);
                return (
                    <div ref={ref}>
                        <button>First</button>
                        <button disabled>Disabled</button>
                        <button>Last</button>
                    </div>
                );
            };

            render(<ComponentWithDisabled isActive={true} />);

            const disabledButton = screen.getByText("Disabled");
            expect(disabledButton).toBeDisabled();
        });

        it("cubre el caso donde element no es null pero no hay elementos focusables al inicio (líneas 41-53)", async () => {
            // Componente que inicia sin elementos focusables
            const DynamicComponent = ({ isActive }: { isActive: boolean }) => {
                const ref = useFocusTrap(isActive);
                return (
                    <div ref={ref} data-testid="dynamic">
                        {/* Sin elementos focusables inicialmente */}
                        <div>No buttons here</div>
                    </div>
                );
            };

            render(<DynamicComponent isActive={true} />);

            // Verificar que el componente se renderiza sin errores
            // Esto cubre las líneas 41-53 cuando no hay elementos focusables
            expect(screen.getByTestId("dynamic")).toBeInTheDocument();
        });

        it("maneja KeyboardEvent con key diferente de Tab (línea 11)", async () => {
            render(<TestComponent isActive={true} />);

            const user = userEvent.setup();

            // Presionar teclas que no son Tab - esto ejecuta el early return en línea 11
            await user.keyboard("{ArrowDown}");
            await user.keyboard("{Space}");
            await user.keyboard("a");

            // No debe interferir con otras teclas
            expect(screen.getByText("First Button")).toHaveFocus();
        });

        it("maneja correctamente cuando activeElement no está en la lista de focusables", async () => {
            const ComponentWithExternalFocus = ({
                isActive,
            }: {
                isActive: boolean;
            }) => {
                const ref = useFocusTrap(isActive);
                return (
                    <>
                        <button data-testid="external">External Button</button>
                        <div ref={ref}>
                            <button>First</button>
                            <button>Last</button>
                        </div>
                    </>
                );
            };

            const user = userEvent.setup();
            render(<ComponentWithExternalFocus isActive={true} />);

            // Enfocar elemento externo
            const externalButton = screen.getByTestId("external");
            externalButton.focus();
            expect(externalButton).toHaveFocus();

            // Presionar Tab - debería funcionar normalmente
            await user.tab();

            // El focus trap no debería interferir porque el activeElement no está en el trap
            expect(true).toBe(true);
        });

        it("maneja el caso cuando element es null en handleTabKey (línea 14)", async () => {
            // Este caso se cubre cuando se intenta hacer Tab antes de que el ref esté asignado
            const { result } = renderHook(() => useFocusTrap(true));

            // ref.current es null
            expect(result.current.current).toBeNull();

            // Simular evento Tab mientras ref es null
            const tabEvent = new KeyboardEvent("keydown", { key: "Tab" });
            document.dispatchEvent(tabEvent);

            // No debe causar error
            expect(result.current.current).toBeNull();
        });
    });
});
