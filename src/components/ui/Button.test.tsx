import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/utils";
import { Button } from "./Button";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("Button", () => {
    describe("Renderizado", () => {
        it("renderiza correctamente con children", () => {
            render(<Button>Click me</Button>);

            expect(
                screen.getByRole("button", { name: /click me/i }),
            ).toBeInTheDocument();
        });

        it("aplica la variante primary por defecto", () => {
            render(<Button>Primary Button</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveClass("bg-primary-600");
        });

        it("aplica la variante secondary cuando se especifica", () => {
            render(<Button variant="secondary">Secondary Button</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveClass("bg-secondary-700");
        });

        it("aplica la variante outline cuando se especifica", () => {
            render(<Button variant="outline">Outline Button</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveClass("border-2", "border-secondary-600");
        });

        it("aplica la variante ghost cuando se especifica", () => {
            render(<Button variant="ghost">Ghost Button</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveClass("text-slate-700", "hover:bg-slate-100");
        });

        it("aplica el tamaño md por defecto", () => {
            render(<Button>Medium Button</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveClass("px-4", "py-2");
        });

        it("aplica el tamaño sm cuando se especifica", () => {
            render(<Button size="sm">Small Button</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveClass("px-3", "py-1.5", "text-sm");
        });

        it("aplica el tamaño lg cuando se especifica", () => {
            render(<Button size="lg">Large Button</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveClass("px-8", "py-3", "text-lg");
        });
    });

    describe("Estados", () => {
        it("se deshabilita cuando disabled es true", () => {
            render(<Button disabled>Disabled Button</Button>);

            const button = screen.getByRole("button");
            expect(button).toBeDisabled();
        });

        it("se deshabilita cuando isLoading es true", () => {
            render(<Button isLoading>Loading Button</Button>);

            const button = screen.getByRole("button");
            expect(button).toBeDisabled();
            expect(button).toHaveAttribute("aria-busy", "true");
        });

        it("no está deshabilitado por defecto", () => {
            render(<Button>Normal Button</Button>);

            const button = screen.getByRole("button");
            expect(button).not.toBeDisabled();
        });

        it("aplica estilos de deshabilitado cuando está disabled", () => {
            render(<Button disabled>Disabled</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
        });
    });

    describe("Interacciones", () => {
        it("ejecuta onClick cuando se hace click", async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Button onClick={handleClick}>Click me</Button>);

            const button = screen.getByRole("button");
            await user.click(button);

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it("no ejecuta onClick cuando está disabled", async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(
                <Button onClick={handleClick} disabled>
                    Disabled
                </Button>,
            );

            const button = screen.getByRole("button");
            await user.click(button);

            expect(handleClick).not.toHaveBeenCalled();
        });

        it("no ejecuta onClick cuando está en loading", async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(
                <Button onClick={handleClick} isLoading>
                    Loading
                </Button>,
            );

            const button = screen.getByRole("button");
            await user.click(button);

            expect(handleClick).not.toHaveBeenCalled();
        });

        it("se puede activar con Enter", async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Button onClick={handleClick}>Press Enter</Button>);

            const button = screen.getByRole("button");
            button.focus();
            await user.keyboard("{Enter}");

            expect(handleClick).toHaveBeenCalled();
        });

        it("se puede activar con Space", async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Button onClick={handleClick}>Press Space</Button>);

            const button = screen.getByRole("button");
            button.focus();
            await user.keyboard(" ");

            expect(handleClick).toHaveBeenCalled();
        });
    });

    describe("Tipo de botón", () => {
        it('tiene type="button" por defecto', () => {
            render(<Button>Default Type</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveAttribute("type", "button");
        });

        it('puede ser type="submit"', () => {
            render(<Button type="submit">Submit</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveAttribute("type", "submit");
        });

        it('puede ser type="reset"', () => {
            render(<Button type="reset">Reset</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveAttribute("type", "reset");
        });
    });

    describe("Accesibilidad", () => {
        it("tiene focus visible", () => {
            render(<Button>Focus me</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveClass("focus:outline-none", "focus:ring-2");
        });

        it("soporta className personalizado", () => {
            render(<Button className="custom-class">Custom</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveClass("custom-class");
        });

        it("mantiene todas las clases base con className personalizado", () => {
            render(<Button className="custom-class">Custom</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveClass(
                "inline-flex",
                "items-center",
                "custom-class",
            );
        });

        it("pasa props adicionales al elemento button", () => {
            render(
                <Button aria-label="Custom label" data-testid="custom-button">
                    Button
                </Button>,
            );

            const button = screen.getByRole("button", {
                name: /custom label/i,
            });
            expect(button).toBeInTheDocument();
            expect(button).toHaveAttribute("data-testid", "custom-button");
        });
    });

    describe("Contenido", () => {
        it("renderiza contenido texto simple", () => {
            render(<Button>Simple text</Button>);

            expect(screen.getByText("Simple text")).toBeInTheDocument();
        });

        it("renderiza contenido con íconos", () => {
            render(
                <Button>
                    <span data-testid="icon">🔍</span>
                    Search
                </Button>,
            );

            expect(screen.getByTestId("icon")).toBeInTheDocument();
            expect(screen.getByText("Search")).toBeInTheDocument();
        });

        it("aplica gap entre elementos hijos", () => {
            render(<Button>Multi Content</Button>);

            const button = screen.getByRole("button");
            expect(button).toHaveClass("gap-2");
        });
    });

    describe("Ref forwarding", () => {
        it("permite acceder al elemento DOM mediante ref", () => {
            const ref = { current: null };

            render(<Button ref={ref}>With Ref</Button>);

            expect(ref.current).toBeInstanceOf(HTMLButtonElement);
        });

        it("permite ejecutar métodos del elemento mediante ref", () => {
            const ref: React.RefObject<HTMLButtonElement | null> = {
                current: null,
            };

            render(<Button ref={ref}>Focus me</Button>);

            ref.current?.focus();

            expect(ref.current).toHaveFocus();
        });
    });
});
