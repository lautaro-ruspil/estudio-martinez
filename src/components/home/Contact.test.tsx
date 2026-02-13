import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Contact } from "./Contact";
import { describe, expect, test, afterEach } from "vitest";

describe("Contact integration", () => {
    afterEach(() => {
        // Limpiar flag de testing
        delete (window as any).__TEST_FORCE_ERROR__;
    });

    test("permite completar y enviar el formulario y muestra AMBOS párrafos del mensaje de éxito", async () => {
        render(<Contact />);

        fireEvent.change(screen.getByLabelText(/nombre completo/i), {
            target: { value: "Juan Pérez" },
        });

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "juan@test.com" },
        });

        fireEvent.change(screen.getByLabelText(/teléfono/i), {
            target: { value: "1123456789" },
        });

        fireEvent.change(screen.getByLabelText(/¿en qué podemos ayudarte/i), {
            target: {
                value: "Necesito asesoramiento contable con más de 20 caracteres.",
            },
        });

        fireEvent.click(
            screen.getByRole("button", { name: /enviar consulta/i }),
        );

        // Esperar PRIMER párrafo (línea 99)
        await waitFor(() => {
            expect(
                screen.getByText("¡Mensaje enviado con éxito!"),
            ).toBeInTheDocument();
        });

        // Verificar SEGUNDO párrafo (línea 99)
        expect(
            screen.getByText("Te vamos a responder a la brevedad."),
        ).toBeInTheDocument();
    });

    test("muestra AMBOS párrafos del mensaje de error cuando falla el envío", async () => {
        // Forzar error en el hook
        (window as any).__TEST_FORCE_ERROR__ = true;

        render(<Contact />);

        fireEvent.change(screen.getByLabelText(/nombre completo/i), {
            target: { value: "Juan Pérez" },
        });

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "juan@test.com" },
        });

        fireEvent.change(screen.getByLabelText(/teléfono/i), {
            target: { value: "1123456789" },
        });

        fireEvent.change(screen.getByLabelText(/¿en qué podemos ayudarte/i), {
            target: {
                value: "Necesito asesoramiento contable con más de 20 caracteres.",
            },
        });

        fireEvent.click(
            screen.getByRole("button", { name: /enviar consulta/i }),
        );

        // Esperar PRIMER párrafo (línea 119)
        await waitFor(
            () => {
                expect(
                    screen.getByText("Ocurrió un error al enviar el mensaje."),
                ).toBeInTheDocument();
            },
            { timeout: 3000 },
        );

        // Verificar SEGUNDO párrafo (línea 119)
        expect(
            screen.getByText("Por favor intentá nuevamente."),
        ).toBeInTheDocument();
    });

    test("marca campos como touched y muestra validación visual", () => {
        render(<Contact />);

        const nameInput = screen.getByLabelText(/nombre completo/i);

        fireEvent.blur(nameInput);
        fireEvent.change(nameInput, {
            target: { value: "Juan Pérez" },
        });
        fireEvent.blur(nameInput);

        expect(nameInput).toBeInTheDocument();
    });

    test("muestra error si el email es inválido", () => {
        render(<Contact />);

        const emailInput = screen.getByLabelText(/email/i);

        fireEvent.change(emailInput, {
            target: { value: "email-invalido" },
        });

        fireEvent.blur(emailInput);

        expect(screen.getByRole("alert")).toHaveTextContent(
            /ingresá un email válido/i,
        );
    });

    test("renderiza el componente con estado inicial idle", () => {
        render(<Contact />);

        expect(
            screen.queryByText(/mensaje enviado con éxito/i),
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText(/ocurrió un error al enviar el mensaje/i),
        ).not.toBeInTheDocument();
    });

    test("links externos tienen rel='noopener noreferrer' para seguridad", () => {
        render(<Contact />);

        const googleMapsLink = screen
            .getByText(/ver en google maps/i)
            .closest("a");
        expect(googleMapsLink).toHaveAttribute("rel", "noopener noreferrer");
        expect(googleMapsLink).toHaveAttribute("target", "_blank");
        expect(googleMapsLink).toHaveAttribute(
            "href",
            expect.stringContaining("google.com/maps"),
        );

        const whatsappLink = screen
            .getByText(/enviarnos un whatsapp/i)
            .closest("a");
        expect(whatsappLink).toHaveAttribute("rel", "noopener noreferrer");
        expect(whatsappLink).toHaveAttribute("target", "_blank");
        expect(whatsappLink).toHaveAttribute(
            "href",
            expect.stringContaining("wa.me"),
        );
    });

    test("campo phone ejecuta handleBlur correctamente", () => {
        render(<Contact />);

        const phoneInput = screen.getByLabelText(/teléfono/i);

        // Escribir valor inválido
        fireEvent.change(phoneInput, {
            target: { value: "123" },
        });

        // Hacer blur (línea 99 de Contact.tsx)
        fireEvent.blur(phoneInput);

        // Debería mostrar error porque tiene menos de 8 dígitos
        expect(
            screen.getByText(/el teléfono debe tener al menos 8 dígitos/i),
        ).toBeInTheDocument();
    });

    test("campo message ejecuta handleBlur correctamente", () => {
        render(<Contact />);

        const messageInput = screen.getByLabelText(/¿en qué podemos ayudarte/i);

        // Escribir valor inválido
        fireEvent.change(messageInput, {
            target: { value: "Corto" },
        });

        // Hacer blur (línea 119 de Contact.tsx)
        fireEvent.blur(messageInput);

        // Debería mostrar error porque tiene menos de 20 caracteres
        expect(
            screen.getByText(/el mensaje debe tener al menos 20 caracteres/i),
        ).toBeInTheDocument();
    });
});
