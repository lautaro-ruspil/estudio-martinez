import { render, screen, fireEvent } from "@testing-library/react";
import { Hero } from "./Hero";
import { describe, expect, it, vi } from "vitest";

const mockScroll = vi.fn();

vi.mock("../../hooks/useScrollToSection", () => ({
    useScrollToSection: () => mockScroll,
}));

vi.mock("../../config/site", () => ({
    BUSINESS_INFO: {
        experience: 25,
        contact: {
            whatsapp: "https://wa.me/test",
        },
        address: {
            street: "Calle Falsa 123",
            city: "Olavarría",
        },
        schedule: {
            weekdays: "8 a 17",
            saturday: "9 a 12",
        },
    },
}));

vi.mock("lucide-react", () => ({
    MapPin: () => <svg />,
    Clock: () => <svg />,
    MessageCircle: () => <svg />,
    CheckCircle: () => <svg />,
}));

vi.mock("../ui", () => ({
    Button: ({ children, onClick }: any) => (
        <button onClick={onClick}>{children}</button>
    ),
}));

vi.mock("../ui/WhatsAppIcon", () => ({
    WhatsAppIcon: () => <svg data-testid="whatsapp-icon" />,
}));

describe("Hero", () => {
    it("renderiza el heading principal correctamente", () => {
        render(<Hero />);
        expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("muestra el badge con los años de experiencia", () => {
        render(<Hero />);
        expect(
            screen.getByText(/\+25 años de experiencia local/i),
        ).toBeInTheDocument();
    });

    it("renderiza el botón 'Consultá sin cargo'", () => {
        render(<Hero />);
        expect(
            screen.getByRole("button", { name: /consultá sin cargo/i }),
        ).toBeInTheDocument();
    });

    it("al hacer click en 'Consultá sin cargo' llama a scrollToSection con 'contacto'", () => {
        render(<Hero />);
        fireEvent.click(
            screen.getByRole("button", { name: /consultá sin cargo/i }),
        );

        expect(mockScroll).toHaveBeenCalledWith("contacto");
    });

    it("renderiza el botón de WhatsApp con el href correcto", () => {
        render(<Hero />);
        const link = screen.getByRole("link", {
            name: /contactar por whatsapp/i,
        });

        expect(link).toHaveAttribute("href", "https://wa.me/test");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute(
            "rel",
            expect.stringContaining("noopener"),
        );
    });

    it("renderiza la tarjeta informativa con ubicación y horarios", () => {
        render(<Hero />);

        expect(
            screen.getByText(/calle falsa 123, olavarría/i),
        ).toBeInTheDocument();

        expect(screen.getByText(/lun–vie 8 a 17/i)).toBeInTheDocument();
    });

    it("botón WhatsApp tiene el link correcto", () => {
        render(<Hero />);

        const whatsappLink = screen.getByRole("link", {
            name: /contactar por whatsapp/i,
        });

        expect(whatsappLink).toHaveAttribute(
            "href",
            expect.stringContaining("wa.me"),
        );
        expect(whatsappLink).toHaveAttribute("target", "_blank");
        expect(whatsappLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("botón WhatsApp contiene el texto correcto", () => {
        render(<Hero />);

        const whatsappBtn = screen.getByRole("button", {
            name: /whatsapp/i,
        });

        expect(whatsappBtn).toBeInTheDocument();
        expect(whatsappBtn.closest("a")).toHaveAttribute(
            "href",
            expect.stringContaining("wa.me"),
        );
    });

    it("muestra el badge con años de experiencia dinámicamente", () => {
        render(<Hero />);

        const badge = screen.getByText(/años de experiencia local/i);

        expect(badge).toBeInTheDocument();
        expect(badge.textContent).toMatch(/\+\d+\s+años de experiencia local/);
    });
});
