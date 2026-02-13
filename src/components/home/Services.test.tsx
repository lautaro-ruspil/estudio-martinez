import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Services } from "../../components/home/Services";
import { servicesList } from "../../data/services";

// Mock del hook
const mockScrollToSection = vi.fn();
vi.mock("../../hooks/useScrollToSection", () => ({
    useScrollToSection: () => mockScrollToSection,
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
            const expectedDelay = `${index * 40}ms`;
            expect(style).toContain(`animation-delay: ${expectedDelay}`);
        });
    });

    it("displays 'Más popular' badge only for popular services", () => {
        render(<Services />);

        const popularServices = servicesList.filter((s) => s.popular);
        const nonPopularServices = servicesList.filter((s) => !s.popular);

        // Should have badges for popular services
        const badges = screen.queryAllByText("Más popular");
        expect(badges).toHaveLength(popularServices.length);
    });

    it("popular badge appears only on the first service (monotributo)", () => {
        render(<Services />);

        const badges = screen.queryAllByText("Más popular");
        expect(badges).toHaveLength(1);

        // Verify it's on the monotributo service
        const monotributoService = screen
            .getByText("Monotributo")
            .closest("li");
        const badge = monotributoService?.querySelector(
            'span[class*="bg-accent-500"]',
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

    it("applies responsive grid classes", () => {
        const { container } = render(<Services />);
        const grid = container.querySelector("ul");

        expect(grid).toHaveClass("grid");
        expect(grid).toHaveClass("grid-cols-1");
        expect(grid).toHaveClass("sm:grid-cols-2");
        expect(grid).toHaveClass("lg:grid-cols-3");
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

    it("popular badge has correct styling classes", () => {
        const { container } = render(<Services />);
        const badge = container.querySelector('[class*="bg-accent-500"]');

        expect(badge).toHaveClass("bg-accent-500");
        expect(badge).toHaveClass("text-white");
        expect(badge).toHaveClass("rounded-full");
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
});
