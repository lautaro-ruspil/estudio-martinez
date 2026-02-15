import { render, screen, act } from "@testing-library/react";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";

vi.mock("../../config/site", () => ({
    BUSINESS_INFO: {
        contact: {
            whatsapp: "https://wa.me/5492284225443",
        },
    },
}));

vi.mock("../../constants/iconSizes", () => ({
    ICON_SIZES: {
        lg: "w-7 h-7",
    },
}));

vi.mock("./WhatsAppIcon", () => ({
    WhatsAppIcon: ({ className }: { className: string }) => (
        <svg data-testid="whatsapp-icon" className={className} />
    ),
}));

describe("WhatsAppFloat", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    test("renderiza link de WhatsApp con aria-label correcto", () => {
        render(<WhatsAppFloat />);

        const link = screen.getByRole("link", {
            name: /contactar por whatsapp/i,
        });

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("aria-label", "Contactar por WhatsApp");
    });

    test("link tiene href correcto con mensaje pre-llenado", () => {
        render(<WhatsAppFloat />);

        const link = screen.getByRole("link", {
            name: /contactar por whatsapp/i,
        });

        const expectedMessage = encodeURIComponent(
            "Hola, me gustaría obtener más información sobre sus servicios contables.",
        );

        expect(link).toHaveAttribute(
            "href",
            `https://wa.me/5492284225443?text=${expectedMessage}`,
        );
    });

    test("link abre en nueva pestaña con seguridad", () => {
        render(<WhatsAppFloat />);

        const link = screen.getByRole("link", {
            name: /contactar por whatsapp/i,
        });

        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    test("renderiza icono de WhatsApp", () => {
        render(<WhatsAppFloat />);

        const icon = screen.getByTestId("whatsapp-icon");

        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass("w-7 h-7");
    });

    test("NO muestra pulse animation al inicio", () => {
        render(<WhatsAppFloat />);

        const pulse = document.querySelector(".animate-ping");

        expect(pulse).not.toBeInTheDocument();
    });

    test("muestra pulse animation después de 5 segundos", async () => {
        render(<WhatsAppFloat />);

        // Al inicio no debe estar
        expect(document.querySelector(".animate-ping")).not.toBeInTheDocument();

        // Avanzar 5 segundos dentro de act
        await act(async () => {
            vi.advanceTimersByTime(5000);
        });

        // Ahora debe aparecer
        expect(document.querySelector(".animate-ping")).toBeInTheDocument();
    });

    test("pulse animation NO aparece antes de 5 segundos", () => {
        render(<WhatsAppFloat />);

        // Avanzar solo 4 segundos
        vi.advanceTimersByTime(4000);

        expect(document.querySelector(".animate-ping")).not.toBeInTheDocument();
    });

    test("limpia timeout al desmontar componente", () => {
        const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

        const { unmount } = render(<WhatsAppFloat />);

        unmount();

        expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    test("link tiene clases CSS correctas", () => {
        render(<WhatsAppFloat />);

        const link = screen.getByRole("link", {
            name: /contactar por whatsapp/i,
        });

        expect(link).toHaveClass("fixed", "bottom-6", "right-6", "z-40");
    });

    test("contenedor de icono tiene estilos correctos", () => {
        render(<WhatsAppFloat />);

        const container = document.querySelector(
            ".bg-whatsapp.rounded-full.p-4",
        );

        expect(container).toBeInTheDocument();
        expect(container).toHaveClass("relative", "shadow-strong");
    });
});
