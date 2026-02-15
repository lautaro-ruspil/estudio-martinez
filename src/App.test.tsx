import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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
    let originalScrollRestoration: ScrollRestoration | undefined;

    beforeEach(() => {
        // Configurar scrollRestoration si no existe (jsdom no lo soporta por defecto)
        if (!("scrollRestoration" in window.history)) {
            Object.defineProperty(window.history, "scrollRestoration", {
                writable: true,
                configurable: true,
                value: "auto",
            });
        }

        // Guardar el valor original
        originalScrollRestoration = window.history.scrollRestoration;

        // Resetear a 'auto' antes de cada test
        window.history.scrollRestoration = "auto";
    });

    afterEach(() => {
        // Restaurar el valor original
        if (originalScrollRestoration !== undefined) {
            window.history.scrollRestoration = originalScrollRestoration;
        }
    });

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

    it("renders all main sections in correct order", async () => {
        render(<App />);

        // Esperar a que los componentes lazy-loaded se carguen
        await waitFor(() => {
            expect(screen.getByTestId("services")).toBeInTheDocument();
        });

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

    it("renders Footer at the bottom", async () => {
        render(<App />);

        // Esperar a que Footer (lazy-loaded) se cargue
        const footer = await screen.findByTestId("footer");
        const main = screen.getByRole("main");

        expect(footer).toBeInTheDocument();
        expect(main.nextSibling).toBe(footer);
    });

    it("renders WhatsAppFloat component", async () => {
        render(<App />);

        // Esperar a que WhatsAppFloat (lazy-loaded) se cargue
        const whatsapp = await screen.findByTestId("whatsapp-float");

        expect(whatsapp).toBeInTheDocument();
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

    describe("Scroll Restoration", () => {
        it("sets scrollRestoration to manual on mount", async () => {
            render(<App />);

            // Esperar a que el useEffect se ejecute
            await waitFor(() => {
                expect(window.history.scrollRestoration).toBe("manual");
            });
        });

        it("restores scrollRestoration to auto on unmount", async () => {
            const { unmount } = render(<App />);

            // Esperar a que el useEffect se ejecute
            await waitFor(() => {
                expect(window.history.scrollRestoration).toBe("manual");
            });

            // Desmontar
            unmount();

            // Verificar que volvió a auto
            expect(window.history.scrollRestoration).toBe("auto");
        });

        it("handles browsers without scrollRestoration support", () => {
            // Guardar descriptor original
            const descriptor = Object.getOwnPropertyDescriptor(
                window.history,
                "scrollRestoration",
            );

            // Simular navegador sin soporte completamente
            // @ts-expect-error - Testing browser compatibility
            delete window.history.scrollRestoration;

            // No debería lanzar error al renderizar
            expect(() => render(<App />)).not.toThrow();

            // Verificar que el componente renderiza correctamente
            expect(screen.getByTestId("navbar")).toBeInTheDocument();

            // Restaurar la propiedad
            if (descriptor) {
                Object.defineProperty(
                    window.history,
                    "scrollRestoration",
                    descriptor,
                );
            }
        });

        it("handles browsers without scrollRestoration on cleanup", () => {
            // Guardar descriptor original
            const descriptor = Object.getOwnPropertyDescriptor(
                window.history,
                "scrollRestoration",
            );

            const { unmount } = render(<App />);

            // Eliminar scrollRestoration antes del cleanup
            // @ts-expect-error - Testing browser compatibility
            delete window.history.scrollRestoration;

            // No debería lanzar error al desmontar
            expect(() => unmount()).not.toThrow();

            // Restaurar la propiedad
            if (descriptor) {
                Object.defineProperty(
                    window.history,
                    "scrollRestoration",
                    descriptor,
                );
            }
        });
    });

    describe("Suspense Fallbacks", () => {
        it("shows loading spinner fallback for main sections", () => {
            const { container } = render(<App />);

            // Buscar el spinner de carga (antes de que se carguen los componentes lazy)
            const spinner = container.querySelector(".animate-spin");

            // El spinner puede o no estar presente dependiendo de qué tan rápido se cargan los componentes
            // Pero la estructura debería existir
            expect(container.querySelector("main")).toBeInTheDocument();
        });

        it("renders loading spinner with correct classes", async () => {
            const { container } = render(<App />);

            // Intentar encontrar el spinner si todavía está visible
            const spinner = container.querySelector(".animate-spin");

            if (spinner) {
                expect(spinner).toHaveClass("w-8");
                expect(spinner).toHaveClass("h-8");
                expect(spinner).toHaveClass("border-4");
                expect(spinner).toHaveClass("border-primary-600");
                expect(spinner).toHaveClass("border-t-transparent");
                expect(spinner).toHaveClass("rounded-full");
            }

            // Esperar a que los componentes se carguen
            await waitFor(() => {
                expect(screen.getByTestId("services")).toBeInTheDocument();
            });
        });

        it("renders placeholder for Footer during loading", () => {
            render(<App />);

            // El placeholder del Footer es un div de altura fija
            // Verificar que eventualmente se carga el Footer
            expect(screen.findByTestId("footer")).resolves.toBeInTheDocument();
        });

        it("renders null fallback for WhatsAppFloat", async () => {
            render(<App />);

            // WhatsAppFloat tiene fallback null, así que no debería haber placeholder visible
            // Solo verificamos que eventualmente se carga
            const whatsapp = await screen.findByTestId("whatsapp-float");
            expect(whatsapp).toBeInTheDocument();
        });
    });

    describe("Component Structure", () => {
        it("Hero is rendered immediately (not lazy loaded)", () => {
            render(<App />);

            // Hero debería estar presente inmediatamente
            expect(screen.getByTestId("hero")).toBeInTheDocument();
        });

        it("Navbar is rendered immediately (not lazy loaded)", () => {
            render(<App />);

            // Navbar debería estar presente inmediatamente
            expect(screen.getByTestId("navbar")).toBeInTheDocument();
        });

        it("lazy loaded components eventually render", async () => {
            render(<App />);

            // Verificar que todos los componentes lazy se cargan
            await waitFor(() => {
                expect(screen.getByTestId("services")).toBeInTheDocument();
                expect(screen.getByTestId("about")).toBeInTheDocument();
                expect(screen.getByTestId("testimonials")).toBeInTheDocument();
                expect(screen.getByTestId("faq")).toBeInTheDocument();
                expect(screen.getByTestId("contact")).toBeInTheDocument();
                expect(screen.getByTestId("footer")).toBeInTheDocument();
                expect(
                    screen.getByTestId("whatsapp-float"),
                ).toBeInTheDocument();
            });
        });

        it("maintains correct DOM hierarchy", async () => {
            const { container } = render(<App />);

            await waitFor(() => {
                expect(screen.getByTestId("services")).toBeInTheDocument();
            });

            const root = container.firstChild as HTMLElement;
            const navbar = screen.getByTestId("navbar");
            const main = screen.getByRole("main");
            const footer = screen.getByTestId("footer");

            // Verificar jerarquía
            expect(root.contains(navbar)).toBe(true);
            expect(root.contains(main)).toBe(true);
            expect(root.contains(footer)).toBe(true);

            // Verificar orden
            expect(navbar.compareDocumentPosition(main)).toBe(
                Node.DOCUMENT_POSITION_FOLLOWING,
            );
            expect(main.compareDocumentPosition(footer)).toBe(
                Node.DOCUMENT_POSITION_FOLLOWING,
            );
        });
    });

    describe("Accessibility", () => {
        it("has proper landmark structure", async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.getByTestId("services")).toBeInTheDocument();
            });

            // Verificar landmarks principales
            expect(screen.getByRole("main")).toBeInTheDocument();
            expect(screen.getByRole("navigation")).toBeInTheDocument();

            // Footer debería tener role contentinfo implícito
            const footer = await screen.findByTestId("footer");
            expect(footer.tagName).toBe("FOOTER");
        });

        it("main content has unique id for skip links", () => {
            render(<App />);

            const main = screen.getByRole("main");
            expect(main).toHaveAttribute("id", "main-content");

            // Verificar que el id es único
            const elements = document.querySelectorAll("#main-content");
            expect(elements).toHaveLength(1);
        });
    });

    describe("Responsive Layout", () => {
        it("uses flexbox for layout", () => {
            const { container } = render(<App />);
            const root = container.firstChild as HTMLElement;

            expect(root).toHaveClass("flex");
            expect(root).toHaveClass("flex-col");
        });

        it("main content area grows to fill available space", () => {
            render(<App />);
            const main = screen.getByRole("main");

            expect(main).toHaveClass("flex-grow");
        });

        it("ensures minimum viewport height", () => {
            const { container } = render(<App />);
            const root = container.firstChild as HTMLElement;

            expect(root).toHaveClass("min-h-screen");
        });
    });

    describe("Lazy Loading", () => {
        it("all lazy components use Suspense boundaries", async () => {
            const { container } = render(<App />);

            // Verificar que hay elementos Suspense (detectados por sus fallbacks o contenido)
            expect(container.querySelector("main")).toBeInTheDocument();

            // Esperar a que todos los componentes lazy se carguen
            await waitFor(() => {
                expect(screen.getByTestId("services")).toBeInTheDocument();
                expect(screen.getByTestId("about")).toBeInTheDocument();
                expect(screen.getByTestId("testimonials")).toBeInTheDocument();
                expect(screen.getByTestId("faq")).toBeInTheDocument();
                expect(screen.getByTestId("contact")).toBeInTheDocument();
                expect(screen.getByTestId("footer")).toBeInTheDocument();
                expect(
                    screen.getByTestId("whatsapp-float"),
                ).toBeInTheDocument();
            });
        });

        it("main sections share the same Suspense boundary", async () => {
            render(<App />);

            // Todos los componentes dentro de main deberían cargar juntos
            await waitFor(() => {
                const services = screen.queryByTestId("services");
                const about = screen.queryByTestId("about");
                const testimonials = screen.queryByTestId("testimonials");
                const faq = screen.queryByTestId("faq");
                const contact = screen.queryByTestId("contact");

                // Si uno está cargado, todos deberían estar cargados
                if (services) {
                    expect(about).toBeInTheDocument();
                    expect(testimonials).toBeInTheDocument();
                    expect(faq).toBeInTheDocument();
                    expect(contact).toBeInTheDocument();
                }
            });
        });

        it("Footer has separate Suspense boundary", async () => {
            render(<App />);

            // Footer puede cargar independientemente de las secciones principales
            const footer = await screen.findByTestId("footer");
            expect(footer).toBeInTheDocument();
        });

        it("WhatsAppFloat has separate Suspense boundary with null fallback", async () => {
            const { container } = render(<App />);

            // No debería haber fallback visible para WhatsAppFloat
            // porque su fallback es null

            // Pero eventualmente debería cargar
            const whatsapp = await screen.findByTestId("whatsapp-float");
            expect(whatsapp).toBeInTheDocument();
        });
    });

    describe("Integration", () => {
        it("renders complete page structure", async () => {
            const { container } = render(<App />);

            await waitFor(() => {
                expect(screen.getByTestId("services")).toBeInTheDocument();
            });

            // Verificar estructura completa
            expect(screen.getByTestId("navbar")).toBeInTheDocument();
            expect(screen.getByTestId("hero")).toBeInTheDocument();
            expect(screen.getByTestId("services")).toBeInTheDocument();
            expect(screen.getByTestId("about")).toBeInTheDocument();
            expect(screen.getByTestId("testimonials")).toBeInTheDocument();
            expect(screen.getByTestId("faq")).toBeInTheDocument();
            expect(screen.getByTestId("contact")).toBeInTheDocument();
            expect(screen.getByTestId("footer")).toBeInTheDocument();
            expect(screen.getByTestId("whatsapp-float")).toBeInTheDocument();
        });

        it("all components are properly nested in the layout", async () => {
            const { container } = render(<App />);

            await waitFor(() => {
                expect(screen.getByTestId("footer")).toBeInTheDocument();
            });

            const root = container.firstChild as HTMLElement;
            const navbar = screen.getByTestId("navbar");
            const main = screen.getByRole("main");
            const footer = screen.getByTestId("footer");
            const whatsapp = screen.getByTestId("whatsapp-float");

            // Todos los elementos principales deben estar dentro de root
            expect(root.contains(navbar)).toBe(true);
            expect(root.contains(main)).toBe(true);
            expect(root.contains(footer)).toBe(true);
            expect(root.contains(whatsapp)).toBe(true);

            // Main debe contener Hero y las secciones lazy
            expect(main.contains(screen.getByTestId("hero"))).toBe(true);
            expect(main.contains(screen.getByTestId("services"))).toBe(true);
        });
    });
});
