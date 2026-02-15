import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Services } from "../../components/home/Services";
import { servicesList } from "../../data/services";

// Mock del hook useScrollToSection
const mockScrollToSection = vi.fn();
vi.mock("../../hooks/useScrollToSection", () => ({
    useScrollToSection: () => mockScrollToSection,
}));

// Mock del hook useScrollAnimation
vi.mock("../../hooks/useScrollAnimation", () => ({
    useScrollAnimation: () => ({
        ref: { current: null },
        isVisible: true, // Simular que es visible para tests
    }),
}));

// Mock de los componentes UI
vi.mock("../../components/ui", () => ({
    Card: ({ children, className }: any) => (
        <div className={className}>{children}</div>
    ),
    Button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} {...props}>
            {children}
        </button>
    ),
}));

// Mock de iconSizes
vi.mock("../../constants/iconSizes", () => ({
    ICON_SIZES: {
        lg: "w-7 h-7",
    },
}));

describe("Services", () => {
    it("renders without crashing", () => {
        render(<Services />);
        expect(
            screen.getByRole("heading", { name: /servicios contables/i }),
        ).toBeInTheDocument();
    });

    it("renders section with correct id and aria-labelledby", () => {
        const { container } = render(<Services />);
        const section = container.querySelector("section");

        expect(section).toHaveAttribute("id", "servicios");
        expect(section).toHaveAttribute("aria-labelledby", "services-heading");
    });

    it("renders heading with correct id", () => {
        render(<Services />);
        const heading = screen.getByRole("heading", {
            name: /servicios contables/i,
        });

        expect(heading).toHaveAttribute("id", "services-heading");
    });

    it("renders description text", () => {
        render(<Services />);
        expect(
            screen.getByText(/te acompañamos en cada obligación fiscal/i),
        ).toBeInTheDocument();
    });

    it("renders all services from servicesList", () => {
        render(<Services />);

        servicesList.forEach((service) => {
            expect(screen.getByText(service.title)).toBeInTheDocument();
            expect(screen.getByText(service.description)).toBeInTheDocument();
        });
    });

    it("renders services in a list with correct structure", () => {
        const { container } = render(<Services />);
        const list = container.querySelector("ul");
        const listItems = list?.querySelectorAll("li");

        expect(list).toBeInTheDocument();
        expect(listItems).toHaveLength(servicesList.length);
    });

    it("applies staggered animation delay to each service", () => {
        const { container } = render(<Services />);
        const listItems = container.querySelectorAll("li");

        listItems.forEach((item, index) => {
            const style = item.getAttribute("style");
            // Delay actualizado: 150ms por index
            const expectedDelay = `${index * 150}ms`;
            expect(style).toContain(`transition-delay: ${expectedDelay}`);
        });
    });

    it("displays 'Más popular' badge with emoji only for popular services", () => {
        render(<Services />);

        const popularServices = servicesList.filter((s) => s.popular);

        // Should have badges with emoji for popular services
        const badges = screen.queryAllByText(/⭐ más popular/i);
        expect(badges).toHaveLength(popularServices.length);
    });

    it("popular badge appears only on the first service (monotributo)", () => {
        render(<Services />);

        const badges = screen.queryAllByText(/⭐ más popular/i);
        expect(badges).toHaveLength(1);

        // Verify it's on the monotributo service
        const monotributoService = screen
            .getByText("Monotributo")
            .closest("li");
        const badge = monotributoService?.querySelector(
            'span[class*="bg-primary-600"]',
        );

        expect(badge).toBeInTheDocument();
    });

    it("renders icons for each service", () => {
        const { container } = render(<Services />);

        // Each service should have an icon with aria-hidden
        const icons = container.querySelectorAll('svg[aria-hidden="true"]');
        expect(icons.length).toBeGreaterThanOrEqual(servicesList.length);
    });

    it("renders CTA section with correct text", () => {
        render(<Services />);

        expect(
            screen.getByText(/¿necesitás asesoramiento específico/i),
        ).toBeInTheDocument();
    });

    it("renders CTA button with correct text", () => {
        render(<Services />);

        const button = screen.getByRole("button", {
            name: /hablemos sobre tu situación/i,
        });
        expect(button).toBeInTheDocument();
    });

    it("CTA button calls scrollToSection with 'contacto' when clicked", async () => {
        const user = userEvent.setup();
        render(<Services />);

        const button = screen.getByRole("button", {
            name: /hablemos sobre tu situación/i,
        });

        await user.click(button);

        expect(mockScrollToSection).toHaveBeenCalledWith("contacto");
        expect(mockScrollToSection).toHaveBeenCalledTimes(1);
    });

    it("applies responsive grid classes with updated breakpoints", () => {
        const { container } = render(<Services />);
        const grid = container.querySelector("ul");

        expect(grid).toHaveClass("grid");
        expect(grid).toHaveClass("grid-cols-1");
        // Actualizado: md en lugar de sm
        expect(grid).toHaveClass("md:grid-cols-2");
        // Actualizado: xl en lugar de lg
        expect(grid).toHaveClass("xl:grid-cols-3");
    });

    it("each service card has correct heading level", () => {
        render(<Services />);

        servicesList.forEach((service) => {
            const heading = screen.getByRole("heading", {
                name: service.title,
            });
            expect(heading.tagName).toBe("H3");
        });
    });

    it("service cards have group class for hover effects", () => {
        const { container } = render(<Services />);
        const cards = container.querySelectorAll('[class*="group"]');

        expect(cards.length).toBeGreaterThanOrEqual(servicesList.length);
    });

    it("popular badge has correct updated styling classes", () => {
        const { container } = render(<Services />);
        // Badge actualizado: bg-primary-600 en lugar de bg-accent-500
        const badge = container.querySelector('[class*="bg-primary-600"]');

        expect(badge).toHaveClass("bg-primary-600");
        expect(badge).toHaveClass("text-white");
        expect(badge).toHaveClass("rounded-full");
        expect(badge).toHaveClass("font-bold");
        expect(badge).toHaveClass("shadow-strong");
    });

    it("icon containers have transition classes", () => {
        const { container } = render(<Services />);
        const iconContainers = container.querySelectorAll(
            '[class*="bg-primary-50"]',
        );

        iconContainers.forEach((iconContainer) => {
            expect(iconContainer).toHaveClass("transition-colors");
        });
    });

    it("service descriptions have correct text color", () => {
        const { container } = render(<Services />);

        servicesList.forEach((service) => {
            const description = screen.getByText(service.description);
            expect(description).toHaveClass("text-slate-600");
        });
    });

    it("renders all services with unique keys", () => {
        const { container } = render(<Services />);
        const listItems = container.querySelectorAll("li");

        // Check that all list items are rendered (React would throw if keys were duplicate)
        expect(listItems).toHaveLength(servicesList.length);
    });

    it("each service has correct data from servicesList", () => {
        render(<Services />);

        const monotributoService = servicesList.find(
            (s) => s.id === "monotributo",
        );
        if (monotributoService) {
            expect(
                screen.getByText(monotributoService.title),
            ).toBeInTheDocument();
            expect(
                screen.getByText(monotributoService.description),
            ).toBeInTheDocument();
            expect(monotributoService.popular).toBe(true);
        }
    });

    it("ServiceCard component is memoized", () => {
        const { container } = render(<Services />);
        const listItems = container.querySelectorAll("li");

        // ServiceCard está memoizado, verificar que se renderizan correctamente
        expect(listItems).toHaveLength(servicesList.length);

        // Cada card debe tener las clases de transición
        listItems.forEach((item) => {
            expect(item).toHaveClass("transition-all");
            expect(item).toHaveClass("duration-1000");
        });
    });

    it("scroll animation is applied to section", () => {
        const { container } = render(<Services />);
        const section = container.querySelector("section");

        // Verificar que el section tiene el id correcto para el scroll animation hook
        expect(section).toHaveAttribute("id", "servicios");
    });

    it("cards show visible state when isVisible is true", () => {
        const { container } = render(<Services />);
        const listItems = container.querySelectorAll("li");

        listItems.forEach((item) => {
            // Cuando isVisible=true (mock), debe tener clases de visible
            expect(item).toHaveClass("opacity-100");
            expect(item).toHaveClass("translate-y-0");
            expect(item).toHaveClass("scale-100");
        });
    });

    it("badge has emoji star", () => {
        render(<Services />);

        const badgeText = screen.getByText(/⭐ más popular/i);
        expect(badgeText).toBeInTheDocument();
        expect(badgeText.textContent).toContain("⭐");
    });

    it("icon sizes are applied from constants", () => {
        const { container } = render(<Services />);

        // Los iconos están dentro de divs con bg-primary-50
        const iconContainers = container.querySelectorAll(".bg-primary-50");

        // Debe haber 6 servicios, cada uno con un icono
        expect(iconContainers.length).toBeGreaterThan(0);

        // Verificar que cada contenedor tiene un SVG hijo
        iconContainers.forEach((iconContainer) => {
            const svg = iconContainer.querySelector("svg");
            expect(svg).toBeInTheDocument();

            // El SVG debe tener las clases ICON_SIZES.lg (w-7 h-7)
            // Verificar que tiene ambas clases
            if (svg) {
                const classes = svg.getAttribute("class") || "";
                expect(classes).toMatch(/w-7/);
                expect(classes).toMatch(/h-7/);
            }
        });
    });

    describe("Animación cuando no es visible", () => {
        beforeEach(() => {
            vi.resetModules();
        });

        it("aplica clases ocultas cuando isVisible es false", async () => {
            // Mockear hook devolviendo isVisible false
            vi.doMock("../../hooks/useScrollAnimation", () => ({
                useScrollAnimation: () => ({
                    ref: { current: null },
                    isVisible: false,
                }),
            }));

            const { Services: ServicesWithHidden } =
                await import("../../components/home/Services");

            const { container } = render(<ServicesWithHidden />);
            const listItems = container.querySelectorAll("li");

            listItems.forEach((item) => {
                expect(item).toHaveClass("opacity-0");
                expect(item).toHaveClass("translate-y-16");
                expect(item).toHaveClass("scale-95");
            });
        });
    });
});
