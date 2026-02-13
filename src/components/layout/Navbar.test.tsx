import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "./Navbar";
import { describe, expect, test, vi } from "vitest";

const mockScroll = vi.fn();

vi.mock("../../hooks/useScrollToSection", () => ({
    useScrollToSection: () => mockScroll,
}));

vi.mock("../../hooks/useToggle", async () => {
    const React = await vi.importActual<typeof import("react")>("react");

    return {
        useToggle: (initial: boolean) => {
            const [state, setState] = React.useState(initial);
            const toggle = () => setState((prev: boolean) => !prev);
            return [state, toggle, setState];
        },
    };
});

vi.mock("../../hooks/useFocusTrap", () => ({
    useFocusTrap: () => ({ current: null }),
}));

vi.mock("../../config/site", () => ({
    BUSINESS_INFO: {
        legalName: "Martínez & Asociados",
    },
}));

vi.mock("../../assets/logo-martinez.svg", () => ({
    default: "logo.svg",
}));

describe("Navbar", () => {
    test("renderiza logo", () => {
        render(<Navbar />);
        expect(screen.getByRole("img")).toBeInTheDocument();
    });

    test("renderiza items desktop", () => {
        render(<Navbar />);
        expect(screen.getByText("Servicios")).toBeInTheDocument();
        expect(screen.getByText("Nosotros")).toBeInTheDocument();
    });

    test("llama scrollToSection en desktop", () => {
        render(<Navbar />);
        fireEvent.click(screen.getByText("Servicios"));
        expect(mockScroll).toHaveBeenCalledWith("servicios");
    });

    test("botón contacto llama scrollToSection('contacto')", () => {
        render(<Navbar />);
        fireEvent.click(screen.getAllByText("Contacto")[0]);
        expect(mockScroll).toHaveBeenCalledWith("contacto");
    });

    test("abre y cierra menú mobile", () => {
        render(<Navbar />);

        const toggleBtn = screen.getByRole("button", {
            name: /abrir menú/i,
        });

        expect(toggleBtn).toHaveAttribute("aria-expanded", "false");

        fireEvent.click(toggleBtn);

        expect(toggleBtn).toHaveAttribute("aria-expanded", "true");
        expect(screen.getAllByText("Servicios")[1]).toBeInTheDocument();

        fireEvent.click(toggleBtn);

        expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
    });

    test("click en item mobile cierra el menú", () => {
        render(<Navbar />);

        const toggleBtn = screen.getByRole("button", {
            name: /abrir menú/i,
        });

        fireEvent.click(toggleBtn);

        const mobileItem = screen.getAllByText("Servicios")[1];

        fireEvent.click(mobileItem);

        expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
        expect(mockScroll).toHaveBeenCalledWith("servicios");
    });

    test("botón contacto en menú mobile llama scrollToSection", () => {
        render(<Navbar />);

        const toggleBtn = screen.getByRole("button", {
            name: /abrir menú/i,
        });

        fireEvent.click(toggleBtn);

        // El segundo botón Contacto es el del menú mobile
        fireEvent.click(screen.getAllByText("Contacto")[1]);

        expect(mockScroll).toHaveBeenCalledWith("contacto");
    });

    test("botón Contacto en menú mobile cierra el menú", () => {
        render(<Navbar />);

        const toggleBtn = screen.getByRole("button", {
            name: /abrir menú/i,
        });

        // Abrir menú mobile
        fireEvent.click(toggleBtn);
        expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

        // Click en botón Contacto del menú mobile (el segundo)
        const contactBtn = screen.getAllByText("Contacto")[1];
        fireEvent.click(contactBtn);

        // El menú debería cerrarse
        expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
        expect(mockScroll).toHaveBeenCalledWith("contacto");
    });

    test("logo tiene link a main-content para accesibilidad", () => {
        render(<Navbar />);

        const logo = screen.getByAltText("Martínez & Asociados");
        const logoLink = logo.closest("a");

        expect(logoLink).toHaveAttribute("href", "#main-content");
    });
});
