import { render, screen, fireEvent } from "@testing-library/react";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { describe, expect, test, vi } from "vitest";

vi.mock("lucide-react", () => ({
    MessageCircle: () => <svg data-testid="message-icon" />,
    X: () => <svg data-testid="close-icon" />,
}));

vi.mock("../../config/site", () => ({
    BUSINESS_INFO: {
        contact: {
            whatsapp: "https://wa.me/5492284225443",
        },
    },
}));

describe("WhatsAppFloat", () => {
    test("renderiza botón principal colapsado", () => {
        render(<WhatsAppFloat />);

        const button = screen.getByRole("button", {
            name: /contactar por whatsapp/i,
        });

        expect(button).toBeInTheDocument();
    });

    test("expande al hacer click", () => {
        render(<WhatsAppFloat />);

        fireEvent.click(
            screen.getByRole("button", {
                name: /contactar por whatsapp/i,
            }),
        );

        expect(screen.getByText(/martínez & asociados/i)).toBeInTheDocument();

        expect(
            screen.getByRole("link", { name: /iniciar chat/i }),
        ).toBeInTheDocument();
    });

    test("colapsa al hacer click en cerrar", () => {
        render(<WhatsAppFloat />);

        fireEvent.click(
            screen.getByRole("button", {
                name: /contactar por whatsapp/i,
            }),
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: /cerrar mensaje/i,
            }),
        );

        expect(
            screen.queryByText(/martínez & asociados/i),
        ).not.toBeInTheDocument();
    });

    test("link de WhatsApp correcto", () => {
        render(<WhatsAppFloat />);

        fireEvent.click(
            screen.getByRole("button", {
                name: /contactar por whatsapp/i,
            }),
        );

        const link = screen.getByRole("link", {
            name: /iniciar chat/i,
        });

        expect(link).toHaveAttribute("href", "https://wa.me/5492284225443");

        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute(
            "rel",
            expect.stringContaining("noopener"),
        );
        expect(link).toHaveAttribute(
            "rel",
            expect.stringContaining("noreferrer"),
        );
    });

    test("aplica animación al expandirse", () => {
        render(<WhatsAppFloat />);

        fireEvent.click(
            screen.getByRole("button", {
                name: /contactar por whatsapp/i,
            }),
        );

        const panel = document.querySelector(".animate-slide-down");

        expect(panel).toBeInTheDocument();
    });
});
