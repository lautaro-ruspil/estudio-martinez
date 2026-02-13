import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../test/utils";
import { Textarea } from "./Textarea";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { createRef, useState } from "react";

describe("Textarea", () => {
    describe("Renderizado básico", () => {
        it("renderiza correctamente con label", () => {
            render(<Textarea label="Mensaje" />);

            expect(screen.getByLabelText("Mensaje")).toBeInTheDocument();
        });

        it("asocia correctamente label con textarea mediante id", () => {
            render(<Textarea label="Comentario" id="comment" />);

            const label = screen.getByText("Comentario");
            const textarea = screen.getByLabelText("Comentario");

            expect(label).toHaveAttribute("for", "comment");
            expect(textarea).toHaveAttribute("id", "comment");
        });

        it("genera un id automático basado en el label si no se proporciona", () => {
            render(<Textarea label="Mi Mensaje Especial" />);

            const textarea = screen.getByLabelText("Mi Mensaje Especial");
            expect(textarea).toHaveAttribute(
                "id",
                "textarea-mi-mensaje-especial",
            );
        });

        it("usa el id proporcionado en lugar de generarlo", () => {
            render(<Textarea label="Mensaje" id="custom-id" />);

            const textarea = screen.getByLabelText("Mensaje");
            expect(textarea).toHaveAttribute("id", "custom-id");
        });

        it("renderiza sin errores cuando no se pasa error", () => {
            render(<Textarea label="Campo" />);

            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        });
    });

    describe("Estados de validación", () => {
        it("muestra mensaje de error cuando se proporciona", () => {
            render(<Textarea label="Mensaje" error="Campo requerido" />);

            expect(screen.getByRole("alert")).toHaveTextContent(
                "Campo requerido",
            );
        });

        it("aplica aria-invalid cuando hay error", () => {
            render(<Textarea label="Campo" error="Error" />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toHaveAttribute("aria-invalid", "true");
        });

        it("no aplica aria-invalid cuando no hay error", () => {
            render(<Textarea label="Campo" />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toHaveAttribute("aria-invalid", "false");
        });

        it("aplica aria-describedby al errorId cuando hay error", () => {
            render(<Textarea label="Campo" id="field" error="Error" />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toHaveAttribute("aria-describedby", "field-error");
        });

        it("aplica aria-describedby al helpId cuando hay helpText", () => {
            render(<Textarea label="Campo" id="field" helpText="Ayuda" />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toHaveAttribute("aria-describedby", "field-help");
        });

        it("prioriza error sobre helpText en aria-describedby", () => {
            render(
                <Textarea
                    label="Campo"
                    id="field"
                    error="Error"
                    helpText="Ayuda"
                />,
            );

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toHaveAttribute("aria-describedby", "field-error");
        });

        it("no aplica aria-describedby cuando no hay error ni helpText", () => {
            render(<Textarea label="Campo" />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).not.toHaveAttribute("aria-describedby");
        });

        it("muestra ícono de validación cuando isValid es true", () => {
            const { container } = render(
                <Textarea label="Campo" isValid={true} />,
            );

            // Buscar el CheckCircle icon
            const checkIcon = container.querySelector(".text-slate-400");
            expect(checkIcon).toBeInTheDocument();
        });

        it("no muestra ícono de validación cuando hay error", () => {
            const { container } = render(
                <Textarea label="Campo" isValid={true} error="Error" />,
            );

            // No debería mostrar CheckCircle cuando hay error
            const checkIcon = container.querySelector(".text-slate-400");
            expect(checkIcon).not.toBeInTheDocument();
        });

        it("muestra ícono de error cuando hay error", () => {
            const { container } = render(
                <Textarea label="Campo" error="Error" />,
            );

            const errorIcon = container.querySelector(".text-red-500");
            expect(errorIcon).toBeInTheDocument();
        });
    });

    describe("Help text", () => {
        it("muestra helpText cuando se proporciona", () => {
            render(<Textarea label="Campo" helpText="Máximo 500 caracteres" />);

            expect(
                screen.getByText("Máximo 500 caracteres"),
            ).toBeInTheDocument();
        });

        it("no muestra helpText cuando hay error", () => {
            render(
                <Textarea
                    label="Campo"
                    error="Error"
                    helpText="Texto de ayuda"
                />,
            );

            expect(
                screen.queryByText("Texto de ayuda"),
            ).not.toBeInTheDocument();
            expect(screen.getByRole("alert")).toBeInTheDocument();
        });

        it("helpText tiene el id correcto", () => {
            render(<Textarea label="Campo" id="field" helpText="Ayuda" />);

            const helpText = screen.getByText("Ayuda");
            expect(helpText).toHaveAttribute("id", "field-help");
        });

        it("helpText tiene estilos apropiados", () => {
            render(<Textarea label="Campo" helpText="Ayuda" />);

            const helpText = screen.getByText("Ayuda");
            expect(helpText).toHaveClass("text-sm", "text-slate-500");
        });
    });

    describe("Estilos de error", () => {
        it("aplica estilos de borde rojo cuando hay error", () => {
            render(<Textarea label="Campo" error="Error" />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toHaveClass("border-red-400");
        });

        it("aplica estilos de borde normal cuando no hay error", () => {
            render(<Textarea label="Campo" />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toHaveClass("border-slate-300");
        });

        it("error tiene role='alert'", () => {
            render(<Textarea label="Campo" error="Error de validación" />);

            const alert = screen.getByRole("alert");
            expect(alert).toHaveTextContent("Error de validación");
        });

        it("error tiene estilos apropiados", () => {
            render(<Textarea label="Campo" error="Error" />);

            const errorMsg = screen.getByRole("alert");
            expect(errorMsg).toHaveClass("text-sm", "text-red-600");
        });
    });

    describe("Interacciones del usuario", () => {
        it("permite escribir texto", async () => {
            const user = userEvent.setup();
            render(<Textarea label="Mensaje" />);

            const textarea = screen.getByLabelText("Mensaje");
            await user.type(textarea, "Este es un mensaje largo");

            expect(textarea).toHaveValue("Este es un mensaje largo");
        });

        it("permite escribir múltiples líneas", async () => {
            const user = userEvent.setup();
            render(<Textarea label="Mensaje" />);

            const textarea = screen.getByLabelText("Mensaje");
            await user.type(textarea, "Línea 1{Enter}Línea 2{Enter}Línea 3");

            expect(textarea).toHaveValue("Línea 1\nLínea 2\nLínea 3");
        });

        it("ejecuta onChange cuando el usuario escribe", async () => {
            const handleChange = vi.fn();
            const user = userEvent.setup();

            render(<Textarea label="Campo" onChange={handleChange} />);

            const textarea = screen.getByLabelText("Campo");
            await user.type(textarea, "test");

            expect(handleChange).toHaveBeenCalled();
            expect(handleChange).toHaveBeenCalledTimes(4);
        });

        it("ejecuta onBlur cuando pierde el foco", async () => {
            const handleBlur = vi.fn();
            const user = userEvent.setup();

            render(<Textarea label="Campo" onBlur={handleBlur} />);

            const textarea = screen.getByLabelText("Campo");
            await user.click(textarea);
            await user.tab();

            expect(handleBlur).toHaveBeenCalledTimes(1);
        });

        it("ejecuta onFocus cuando recibe el foco", async () => {
            const handleFocus = vi.fn();
            const user = userEvent.setup();

            render(<Textarea label="Campo" onFocus={handleFocus} />);

            const textarea = screen.getByLabelText("Campo");
            await user.click(textarea);

            expect(handleFocus).toHaveBeenCalledTimes(1);
        });
    });

    describe("Atributos HTML nativos", () => {
        it("soporta placeholder", () => {
            render(
                <Textarea
                    label="Mensaje"
                    placeholder="Escribe tu mensaje aquí..."
                />,
            );

            const textarea = screen.getByPlaceholderText(
                "Escribe tu mensaje aquí...",
            );
            expect(textarea).toBeInTheDocument();
        });

        it("soporta rows", () => {
            render(<Textarea label="Mensaje" rows={5} />);

            const textarea = screen.getByLabelText("Mensaje");
            expect(textarea).toHaveAttribute("rows", "5");
        });

        it("soporta cols", () => {
            render(<Textarea label="Mensaje" cols={50} />);

            const textarea = screen.getByLabelText("Mensaje");
            expect(textarea).toHaveAttribute("cols", "50");
        });

        it("soporta required", () => {
            render(<Textarea label="Campo" required />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toBeRequired();
        });

        it("soporta disabled", () => {
            render(<Textarea label="Campo" disabled />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toBeDisabled();
        });

        it("aplica estilos disabled cuando está deshabilitado", () => {
            render(<Textarea label="Campo" disabled />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toHaveClass("disabled:bg-slate-100");
            expect(textarea).toHaveClass("disabled:cursor-not-allowed");
        });

        it("soporta readonly", () => {
            render(<Textarea label="Campo" readOnly />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toHaveAttribute("readonly");
        });

        it("soporta maxLength", () => {
            render(<Textarea label="Mensaje" maxLength={500} />);

            const textarea = screen.getByLabelText("Mensaje");
            expect(textarea).toHaveAttribute("maxLength", "500");
        });

        it("soporta minLength", () => {
            render(<Textarea label="Mensaje" minLength={10} />);

            const textarea = screen.getByLabelText("Mensaje");
            expect(textarea).toHaveAttribute("minLength", "10");
        });
    });

    describe("Características específicas de textarea", () => {
        it("tiene resize-none por defecto", () => {
            render(<Textarea label="Campo" />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toHaveClass("resize-none");
        });

        it("puede manejar texto largo", async () => {
            const longText = "a".repeat(1000);

            render(<Textarea label="Texto largo" defaultValue={longText} />);

            const textarea = screen.getByLabelText(
                "Texto largo",
            ) as HTMLTextAreaElement;

            expect(textarea.value).toBe(longText);
        });

        it("preserva saltos de línea", async () => {
            render(
                <Textarea
                    label="Multilínea"
                    defaultValue={`Párrafo 1

Párrafo 2`}
                />,
            );

            const textarea = screen.getByLabelText(
                "Multilínea",
            ) as HTMLTextAreaElement;

            expect(textarea).toHaveValue("Párrafo 1\n\nPárrafo 2");
        });
    });

    describe("Estilos personalizados", () => {
        it("aplica className personalizado", () => {
            render(<Textarea label="Campo" className="custom-class" />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toHaveClass("custom-class");
        });

        it("mantiene clases base con className personalizado", () => {
            render(<Textarea label="Campo" className="custom-class" />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toHaveClass("w-full", "px-4", "custom-class");
        });

        it("funciona sin className", () => {
            render(<Textarea label="Campo" />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toHaveClass("w-full", "px-4");
        });
    });

    describe("Ref forwarding", () => {
        it("permite acceder al elemento textarea mediante ref", () => {
            const ref = { current: null };

            render(<Textarea label="Campo" ref={ref} />);

            expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
        });

        it("permite ejecutar métodos del textarea mediante ref", () => {
            const ref: React.RefObject<HTMLTextAreaElement | null> = {
                current: null,
            };

            render(<Textarea label="Campo" ref={ref} />);

            ref.current?.focus();

            expect(ref.current).toHaveFocus();
        });

        it("permite acceder al valor mediante ref", async () => {
            const ref = createRef<HTMLTextAreaElement>();

            render(
                <Textarea
                    label="Con ref"
                    ref={ref}
                    defaultValue="test value"
                />,
            );

            expect(ref.current?.value).toBe("test value");
        });

        it("permite establecer el valor mediante ref", () => {
            const ref: React.RefObject<HTMLTextAreaElement | null> = {
                current: null,
            };

            render(<Textarea label="Campo" ref={ref} />);

            if (ref.current) {
                ref.current.value = "Valor establecido por ref";
            }

            expect(ref.current?.value).toBe("Valor establecido por ref");
        });
    });

    describe("Accesibilidad", () => {
        it("el mensaje de error tiene role='alert'", () => {
            render(<Textarea label="Campo" error="Error" />);

            const alert = screen.getByRole("alert");
            expect(alert).toBeInTheDocument();
        });

        it("tiene estilos de focus visibles", () => {
            render(<Textarea label="Campo" />);

            const textarea = screen.getByLabelText("Campo");
            expect(textarea).toHaveClass("focus:outline-none", "focus:ring-2");
        });

        it("el label es accesible", () => {
            render(<Textarea label="Mensaje importante" />);

            expect(
                screen.getByLabelText("Mensaje importante"),
            ).toBeInTheDocument();
        });

        it("los íconos tienen posicionamiento absoluto correcto", () => {
            const { container } = render(
                <Textarea label="Campo" isValid={true} />,
            );

            const icon = container.querySelector(".absolute");
            expect(icon).toHaveClass("right-3", "top-3");
        });
    });

    describe("Casos edge", () => {
        it("maneja valores vacíos correctamente", async () => {
            render(<Textarea label="Vacío" defaultValue="" />);

            const textarea = screen.getByLabelText(
                "Vacío",
            ) as HTMLTextAreaElement;

            expect(textarea).toHaveValue("");
        });

        it("maneja caracteres especiales", async () => {
            render(<Textarea label="Especiales" defaultValue="Ñoño@123!#$%" />);

            const textarea = screen.getByLabelText(
                "Especiales",
            ) as HTMLTextAreaElement;

            expect(textarea).toHaveValue("Ñoño@123!#$%");
        });

        it("maneja emojis", async () => {
            render(<Textarea label="Emojis" defaultValue="Hola 👋 🎉" />);

            const textarea = screen.getByLabelText(
                "Emojis",
            ) as HTMLTextAreaElement;

            expect(textarea).toHaveValue("Hola 👋 🎉");
        });

        it("puede mostrar error e isValid=false simultáneamente", () => {
            const { container } = render(
                <Textarea label="Campo" error="Error" isValid={false} />,
            );

            expect(screen.getByRole("alert")).toBeInTheDocument();
            const checkIcon = container.querySelector(".text-slate-400");
            expect(checkIcon).not.toBeInTheDocument();
        });

        it("genera diferentes ids para labels diferentes", () => {
            const { rerender } = render(<Textarea label="Campo Uno" />);
            const textarea1 = screen.getByLabelText("Campo Uno");
            const id1 = textarea1.getAttribute("id");

            rerender(<Textarea label="Campo Dos" />);
            const textarea2 = screen.getByLabelText("Campo Dos");
            const id2 = textarea2.getAttribute("id");

            expect(id1).not.toBe(id2);
        });

        it("maneja labels con caracteres especiales en la generación de id", () => {
            render(<Textarea label="¿Mensaje Especial?" />);

            const textarea = screen.getByLabelText("¿Mensaje Especial?");
            // El id debería eliminar caracteres especiales y convertir a minúsculas
            expect(textarea).toHaveAttribute(
                "id",
                "textarea-¿mensaje-especial?",
            );
        });

        it("no muestra íconos cuando no hay isValid ni error", () => {
            const { container } = render(<Textarea label="Campo" />);

            const icons = container.querySelectorAll(".absolute");
            expect(icons).toHaveLength(0);
        });
    });

    describe("Valor controlado vs no controlado", () => {
        it("funciona como componente no controlado", async () => {
            const user = userEvent.setup();
            render(<Textarea label="Campo" />);

            const textarea = screen.getByLabelText("Campo");
            await user.type(textarea, "valor no controlado");

            expect(textarea).toHaveValue("valor no controlado");
        });

        it("funciona como componente controlado", async () => {
            const user = userEvent.setup();
            const TestComponent = () => {
                const [value, setValue] = useState("");

                return (
                    <Textarea
                        label="Campo"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                );
            };

            render(<TestComponent />);

            const textarea = screen.getByLabelText("Campo");
            await user.type(textarea, "valor controlado");

            expect(textarea).toHaveValue("valor controlado");
        });
    });
});
