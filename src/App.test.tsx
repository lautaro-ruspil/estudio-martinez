import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

// Mock de todos los componentes hijos para test de integración
vi.mock("./components/layout/Navbar", () => ({
    Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("./components/home/Hero", () => ({
    Hero: () => <section data-testid="hero">Hero</section>,
}));

vi.mock("./components/home/Services", () => ({
    Services: () => <section data-testid="services">Services</section>,
}));

vi.mock("./components/home/About", () => ({
    About: () => <section data-testid="about">About</section>,
}));

vi.mock("./components/home/FAQ", () => ({
    FAQ: () => <section data-testid="faq">FAQ</section>,
}));

vi.mock("./components/home/Contact", () => ({
    Contact: () => <section data-testid="contact">Contact</section>,
}));

vi.mock("./components/home/Testimonials", () => ({
    Testimonials: () => (
        <section data-testid="testimonials">Testimonials</section>
    ),
}));

vi.mock("./components/layout/Footer", () => ({
    Footer: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("./components/ui/WhatsAppFloat", () => ({
    WhatsAppFloat: () => <div data-testid="whatsapp-float">WhatsApp</div>,
}));

describe("App", () => {
    it("renders without crashing", () => {
        render(<App />);
        expect(screen.getByTestId("navbar")).toBeInTheDocument();
    });

    it("renders main container with correct structure", () => {
        render(<App />);
        const container = screen.getByRole("main");

        expect(container).toBeInTheDocument();
        expect(container).toHaveAttribute("id", "main-content");
        expect(container).toHaveClass("flex-grow");
    });

    it("renders all main sections in correct order", () => {
        render(<App />);

        const main = screen.getByRole("main");
        const sections = main.querySelectorAll("[data-testid]");

        expect(sections).toHaveLength(6);
        expect(sections[0]).toHaveAttribute("data-testid", "hero");
        expect(sections[1]).toHaveAttribute("data-testid", "services");
        expect(sections[2]).toHaveAttribute("data-testid", "about");
        expect(sections[3]).toHaveAttribute("data-testid", "testimonials");
        expect(sections[4]).toHaveAttribute("data-testid", "faq");
        expect(sections[5]).toHaveAttribute("data-testid", "contact");
    });

    it("renders Navbar at the top", () => {
        const { container } = render(<App />);
        const navbar = screen.getByTestId("navbar");
        const main = screen.getByRole("main");

        expect(container.firstChild?.firstChild).toBe(navbar);
        expect(navbar.nextSibling).toBe(main);
    });

    it("renders Footer at the bottom", () => {
        render(<App />);
        const footer = screen.getByTestId("footer");
        const main = screen.getByRole("main");

        expect(main.nextSibling).toBe(footer);
    });

    it("renders WhatsAppFloat component", () => {
        render(<App />);
        expect(screen.getByTestId("whatsapp-float")).toBeInTheDocument();
    });

    it("applies correct layout classes", () => {
        const { container } = render(<App />);
        const wrapper = container.firstChild as HTMLElement;

        expect(wrapper).toHaveClass("min-h-screen");
        expect(wrapper).toHaveClass("flex");
        expect(wrapper).toHaveClass("flex-col");
    });

    it("has accessible main landmark", () => {
        render(<App />);
        const main = screen.getByRole("main");

        expect(main).toHaveAttribute("id", "main-content");
    });
});
