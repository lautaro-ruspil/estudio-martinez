import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/utils";
import { Input } from "./Input";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("Input", () => {
    describe("Renderizado básico", () => {
        it("renderiza correctamente con label", () => {
            render(<Input label="Nombre" id="name" />);

            expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
        });

        it("asocia correctamente label con input mediante id", () => {
            render(<Input label="Email" id="email" />);

            const label = screen.getByText("Email");
            const input = screen.getByLabelText("Email");

            expect(label).toHaveAttribute("for", "email");
            expect(input).toHaveAttribute("id", "email");
        });

        it("renderiza sin errores cuando no se pasa error", () => {
            render(<Input label="Campo" id="field" />);

            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        });
    });

    describe("Estados de validación", () => {
        it("muestra mensaje de error cuando se proporciona", () => {
            render(<Input label="Email" id="email" error="Email inválido" />);

            expect(screen.getByRole("alert")).toHaveTextContent(
                "Email inválido",
            );
        });

        it("aplica aria-invalid cuando hay error", () => {
            render(
                <Input label="Campo" id="field" error="Error de validación" />,
            );

            const input = screen.getByLabelText("Campo");
            expect(input).toHaveAttribute("aria-invalid", "true");
        });

        it("aplica aria-describedby cuando hay error", () => {
            render(
                <Input label="Campo" id="field" error="Error de validación" />,
            );

            const input = screen.getByLabelText("Campo");
            expect(input).toHaveAttribute("aria-describedby", "field-error");
        });

        it("no aplica aria-describedby cuando no hay error", () => {
            render(<Input label="Campo" id="field" />);

            const input = screen.getByLabelText("Campo");
            expect(input).not.toHaveAttribute("aria-describedby");
        });

        it("muestra ícono de validación cuando isValid es true", () => {
            const { container } = render(
                <Input label="Campo" id="field" isValid={true} />,
            );

            // Buscar el ícono CheckCircle (lucide-react lo renderiza como svg)
            const checkIcon = container.querySelector(
                'svg[aria-hidden="true"]',
            );
            expect(checkIcon).toBeInTheDocument();
        });

        it("no muestra ícono de validación cuando hay error", () => {
            const { container } = render(
                <Input label="Campo" id="field" isValid={true} error="Error" />,
            );

            // El ícono de check no debería aparecer si hay error
            const checkIcon = container.querySelector(".text-slate-400");
            expect(checkIcon).not.toBeInTheDocument();
        });

        it("no muestra ícono de validación cuando isValid es false", () => {
            const { container } = render(
                <Input label="Campo" id="field" isValid={false} />,
            );

            const icons = container.querySelectorAll('svg[aria-hidden="true"]');
            expect(icons).toHaveLength(0);
        });
    });

    describe("Estilos de error", () => {
        it("aplica estilos de borde rojo cuando hay error", () => {
            render(<Input label="Campo" id="field" error="Error" />);

            const input = screen.getByLabelText("Campo");
            expect(input).toHaveClass("border-red-400");
        });

        it("aplica estilos de borde normal cuando no hay error", () => {
            render(<Input label="Campo" id="field" />);

            const input = screen.getByLabelText("Campo");
            expect(input).toHaveClass("border-slate-300");
        });

        it("muestra ícono de error junto al mensaje", () => {
            const { container } = render(
                <Input label="Campo" id="field" error="Error de validación" />,
            );

            const errorMessage = screen.getByRole("alert");
            const errorIcon = errorMessage.querySelector("svg");

            expect(errorIcon).toBeInTheDocument();
        });
    });

    describe("Interacciones del usuario", () => {
        it("permite escribir texto", async () => {
            const user = userEvent.setup();
            render(<Input label="Nombre" id="name" />);

            const input = screen.getByLabelText("Nombre");
            await user.type(input, "Juan Pérez");

            expect(input).toHaveValue("Juan Pérez");
        });

        it("ejecuta onChange cuando el usuario escribe", async () => {
            const handleChange = vi.fn();
            const user = userEvent.setup();

            render(<Input label="Campo" id="field" onChange={handleChange} />);

            const input = screen.getByLabelText("Campo");
            await user.type(input, "test");

            expect(handleChange).toHaveBeenCalled();
            expect(handleChange).toHaveBeenCalledTimes(4); // Una vez por cada letra
        });

        it("ejecuta onBlur cuando pierde el foco", async () => {
            const handleBlur = vi.fn();
            const user = userEvent.setup();

            render(<Input label="Campo" id="field" onBlur={handleBlur} />);

            const input = screen.getByLabelText("Campo");
            await user.click(input);
            await user.tab(); // Salir del campo

            expect(handleBlur).toHaveBeenCalledTimes(1);
        });

        it("ejecuta onFocus cuando recibe el foco", async () => {
            const handleFocus = vi.fn();
            const user = userEvent.setup();

            render(<Input label="Campo" id="field" onFocus={handleFocus} />);

            const input = screen.getByLabelText("Campo");
            await user.click(input);

            expect(handleFocus).toHaveBeenCalledTimes(1);
        });
    });

    describe("Atributos HTML nativos", () => {
        it("soporta placeholder", () => {
            render(
                <Input label="Email" id="email" placeholder="tu@email.com" />,
            );

            const input = screen.getByPlaceholderText("tu@email.com");
            expect(input).toBeInTheDocument();
        });

        it("soporta type", () => {
            render(<Input label="Contraseña" id="password" type="password" />);

            const input = screen.getByLabelText("Contraseña");
            expect(input).toHaveAttribute("type", "password");
        });

        it("soporta required", () => {
            render(<Input label="Campo" id="field" required />);

            const input = screen.getByLabelText("Campo");
            expect(input).toBeRequired();
        });

        it("soporta disabled", () => {
            render(<Input label="Campo" id="field" disabled />);

            const input = screen.getByLabelText("Campo");
            expect(input).toBeDisabled();
        });

        it("soporta readonly", () => {
            render(<Input label="Campo" id="field" readOnly />);

            const input = screen.getByLabelText("Campo");
            expect(input).toHaveAttribute("readonly");
        });

        it("soporta maxLength", () => {
            render(<Input label="Código" id="code" maxLength={5} />);

            const input = screen.getByLabelText("Código");
            expect(input).toHaveAttribute("maxLength", "5");
        });

        it("soporta minLength", () => {
            render(<Input label="Username" id="username" minLength={3} />);

            const input = screen.getByLabelText("Username");
            expect(input).toHaveAttribute("minLength", "3");
        });

        it("soporta pattern", () => {
            render(<Input label="Código postal" id="zip" pattern="[0-9]{5}" />);

            const input = screen.getByLabelText("Código postal");
            expect(input).toHaveAttribute("pattern", "[0-9]{5}");
        });
    });

    describe("Estilos personalizados", () => {
        it("aplica className personalizado", () => {
            render(<Input label="Campo" id="field" className="custom-class" />);

            const input = screen.getByLabelText("Campo");
            expect(input).toHaveClass("custom-class");
        });

        it("mantiene clases base con className personalizado", () => {
            render(<Input label="Campo" id="field" className="custom-class" />);

            const input = screen.getByLabelText("Campo");
            expect(input).toHaveClass("w-full", "px-4", "custom-class");
        });
    });

    describe("Ref forwarding", () => {
        it("permite acceder al elemento input mediante ref", () => {
            const ref = { current: null };

            render(<Input label="Campo" id="field" ref={ref} />);

            expect(ref.current).toBeInstanceOf(HTMLInputElement);
        });

        it("permite ejecutar métodos del input mediante ref", () => {
            const ref: React.RefObject<HTMLInputElement | null> = {
                current: null,
            };

            render(<Input label="Campo" id="field" ref={ref} />);

            ref.current?.focus();

            expect(ref.current).toHaveFocus();
        });

        it("permite acceder al valor mediante ref", async () => {
            const ref: React.RefObject<HTMLInputElement | null> = {
                current: null,
            };
            const user = userEvent.setup();

            render(<Input label="Campo" id="field" ref={ref} />);

            const input = screen.getByLabelText("Campo");
            await user.type(input, "test value");

            expect(ref.current?.value).toBe("test value");
        });
    });

    describe("Accesibilidad", () => {
        it("el mensaje de error tiene role='alert'", () => {
            render(
                <Input label="Campo" id="field" error="Error de validación" />,
            );

            const alert = screen.getByRole("alert");
            expect(alert).toBeInTheDocument();
        });

        it("el ícono de check tiene aria-hidden='true'", () => {
            const { container } = render(
                <Input label="Campo" id="field" isValid={true} />,
            );

            const checkIcon = container.querySelector(
                'svg[aria-hidden="true"]',
            );
            expect(checkIcon).toHaveAttribute("aria-hidden", "true");
        });

        it("tiene estilos de focus visibles", () => {
            render(<Input label="Campo" id="field" />);

            const input = screen.getByLabelText("Campo");
            expect(input).toHaveClass("focus:outline-none", "focus:ring-2");
        });
    });

    describe("Casos edge", () => {
        it("maneja valores vacíos correctamente", async () => {
            const user = userEvent.setup();
            render(<Input label="Campo" id="field" />);

            const input = screen.getByLabelText("Campo");
            await user.type(input, "test");
            await user.clear(input);

            expect(input).toHaveValue("");
        });

        it("maneja caracteres especiales", async () => {
            const user = userEvent.setup();
            render(<Input label="Campo" id="field" />);

            const input = screen.getByLabelText("Campo");
            await user.type(input, "Ñoño@123!#$");

            expect(input).toHaveValue("Ñoño@123!#$");
        });

        it("puede mostrar error e isValid=false simultáneamente", () => {
            const { container } = render(
                <Input
                    label="Campo"
                    id="field"
                    error="Error"
                    isValid={false}
                />,
            );

            expect(screen.getByRole("alert")).toBeInTheDocument();
            const checkIcon = container.querySelector(".text-slate-400");
            expect(checkIcon).not.toBeInTheDocument();
        });
    });

    describe("HelpText", () => {
        it("muestra helpText cuando se proporciona y no hay error", () => {
            render(
                <Input
                    label="Campo"
                    id="field"
                    helpText="Este es un texto de ayuda"
                />,
            );

            expect(
                screen.getByText("Este es un texto de ayuda"),
            ).toBeInTheDocument();
        });

        it("no muestra helpText cuando hay error", () => {
            render(
                <Input
                    label="Campo"
                    id="field"
                    helpText="Texto de ayuda"
                    error="Hay un error"
                />,
            );

            expect(
                screen.queryByText("Texto de ayuda"),
            ).not.toBeInTheDocument();
            expect(screen.getByText("Hay un error")).toBeInTheDocument();
        });

        it("asocia helpText con aria-describedby cuando no hay error", () => {
            render(
                <Input label="Campo" id="field" helpText="Texto de ayuda" />,
            );

            const input = screen.getByLabelText("Campo");
            expect(input).toHaveAttribute("aria-describedby", "field-help");
        });
    });

    it("no muestra CheckCircle cuando isValid pero hay error", () => {
        render(
            <Input
                label="Test Input"
                id="test-input"
                isValid={true}
                error="Error message"
                value=""
                onChange={() => {}}
            />,
        );

        const input = screen.getByLabelText("Test Input");
        const container = input.parentElement;

        // El CheckCircle no debería estar presente
        const checkIcon = container?.querySelector(
            'svg[class*="w-4 h-4 text-slate-400"]',
        );
        expect(checkIcon).toBeNull();

        // Pero el error sí debería estar visible
        expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("muestra CheckCircle solo cuando isValid y sin error", () => {
        render(
            <Input
                label="Test Input"
                id="test-input"
                isValid={true}
                error={undefined}
                value="Valid value"
                onChange={() => {}}
            />,
        );

        const input = screen.getByLabelText("Test Input");
        const container = input.parentElement;

        // El CheckCircle debería estar presente
        const checkIcon = container?.querySelector(
            'svg[class*="w-4 h-4 text-slate-400"]',
        );
        expect(checkIcon).toBeInTheDocument();
    });
});
