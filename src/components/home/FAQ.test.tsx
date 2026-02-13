import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FAQ } from "../../components/home/FAQ";
import { faqList } from "../../data/faq";

// Mock del hook
const mockScrollToSection = vi.fn();
vi.mock("../../hooks/useScrollToSection", () => ({
    useScrollToSection: () => mockScrollToSection,
}));

describe("FAQ", () => {
    it("renders without crashing", () => {
        render(<FAQ />);
        expect(
            screen.getByRole("heading", { name: /preguntas frecuentes/i }),
        ).toBeInTheDocument();
    });

    it("renders section with correct id and aria-labelledby", () => {
        const { container } = render(<FAQ />);
        const section = container.querySelector("section");

        expect(section).toHaveAttribute("id", "preguntas");
        expect(section).toHaveAttribute("aria-labelledby", "faq-heading");
    });

    it("renders heading with correct id", () => {
        render(<FAQ />);
        const heading = screen.getByRole("heading", {
            name: /preguntas frecuentes/i,
        });

        expect(heading).toHaveAttribute("id", "faq-heading");
    });

    it("renders all FAQ items from data", () => {
        render(<FAQ />);

        faqList.forEach((faq) => {
            expect(screen.getByText(faq.question)).toBeInTheDocument();
        });
    });

    it("initially renders all FAQ answers hidden", () => {
        render(<FAQ />);

        faqList.forEach((faq) => {
            const button = screen.getByRole("button", { name: faq.question });
            expect(button).toHaveAttribute("aria-expanded", "false");
        });
    });

    it("toggles FAQ item when clicked", async () => {
        const user = userEvent.setup();
        render(<FAQ />);

        const firstQuestion = faqList[0].question;
        const button = screen.getByRole("button", { name: firstQuestion });

        // Initially closed
        expect(button).toHaveAttribute("aria-expanded", "false");

        // Click to open
        await user.click(button);
        expect(button).toHaveAttribute("aria-expanded", "true");

        // Click to close
        await user.click(button);
        expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("displays FAQ answer when expanded", async () => {
        const user = userEvent.setup();
        render(<FAQ />);

        const firstFaq = faqList[0];
        const button = screen.getByRole("button", { name: firstFaq.question });

        await user.click(button);

        expect(screen.getByText(firstFaq.answer)).toBeVisible();
    });

    it("each FAQ button has correct aria-controls", () => {
        render(<FAQ />);

        faqList.forEach((faq) => {
            const button = screen.getByRole("button", { name: faq.question });
            const controlsId = button.getAttribute("aria-controls");

            expect(controlsId).toBe(`faq-content-${faq.id}`);
        });
    });

    it("each FAQ content region has correct id", () => {
        const { container } = render(<FAQ />);

        faqList.forEach((faq) => {
            const region = container.querySelector(`#faq-content-${faq.id}`);
            expect(region).toBeInTheDocument();
            expect(region).toHaveAttribute("role", "region");
        });
    });

    it("FAQ content region has aria-labelledby pointing to button", () => {
        const { container } = render(<FAQ />);

        faqList.forEach((faq) => {
            const button = screen.getByRole("button", { name: faq.question });
            const buttonId = `faq-button-${faq.id}`;
            const region = container.querySelector(`#faq-content-${faq.id}`);

            expect(button).toHaveAttribute("id", buttonId);
            expect(region).toHaveAttribute("aria-labelledby", buttonId);
        });
    });

    it("renders ChevronDown icon for each FAQ item", () => {
        const { container } = render(<FAQ />);

        const icons = container.querySelectorAll('svg[aria-hidden="true"]');
        expect(icons.length).toBeGreaterThanOrEqual(faqList.length);
    });

    it("ChevronDown icon rotates when FAQ is expanded", async () => {
        const user = userEvent.setup();
        const { container } = render(<FAQ />);

        const firstButton = screen.getByRole("button", {
            name: faqList[0].question,
        });
        const icon = firstButton.querySelector("svg");

        // Initially not rotated
        expect(icon).not.toHaveClass("rotate-180");

        // Click to expand
        await user.click(firstButton);
        expect(icon).toHaveClass("rotate-180");
    });

    it("only one FAQ can be open at a time (independent toggles)", async () => {
        const user = userEvent.setup();
        render(<FAQ />);

        const firstButton = screen.getByRole("button", {
            name: faqList[0].question,
        });
        const secondButton = screen.getByRole("button", {
            name: faqList[1].question,
        });

        // Open first
        await user.click(firstButton);
        expect(firstButton).toHaveAttribute("aria-expanded", "true");
        expect(secondButton).toHaveAttribute("aria-expanded", "false");

        // Open second (first should stay open - independent toggles)
        await user.click(secondButton);
        expect(firstButton).toHaveAttribute("aria-expanded", "true");
        expect(secondButton).toHaveAttribute("aria-expanded", "true");
    });

    it("renders CTA section with correct text", () => {
        render(<FAQ />);

        expect(
            screen.getByText("¿Tenés otra consulta específica?"),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /envíanos tu consulta/i }),
        ).toBeInTheDocument();
    });

    it("CTA button calls scrollToSection with 'contacto'", async () => {
        const user = userEvent.setup();
        render(<FAQ />);

        const ctaButton = screen.getByRole("button", {
            name: /envíanos tu consulta/i,
        });

        await user.click(ctaButton);

        expect(mockScrollToSection).toHaveBeenCalledWith("contacto");
    });

    it("CTA button has correct accessibility attributes", () => {
        render(<FAQ />);

        const ctaButton = screen.getByRole("button", {
            name: /envíanos tu consulta/i,
        });

        expect(ctaButton).toHaveAttribute("type", "button");
    });

    it("FAQ list has role='list'", () => {
        const { container } = render(<FAQ />);
        const list = container.querySelector('[role="list"]');

        expect(list).toBeInTheDocument();
    });

    it("each FAQ item has role='listitem'", () => {
        const { container } = render(<FAQ />);
        const listItems = container.querySelectorAll('[role="listitem"]');

        expect(listItems).toHaveLength(faqList.length);
    });

    it("applies correct CSS classes for animation", async () => {
        const user = userEvent.setup();
        const { container } = render(<FAQ />);

        const firstButton = screen.getByRole("button", {
            name: faqList[0].question,
        });
        const contentRegion = container.querySelector(
            `#faq-content-${faqList[0].id}`,
        );

        // Initially has max-h-0 and opacity-0
        expect(contentRegion).toHaveClass("max-h-0");
        expect(contentRegion).toHaveClass("opacity-0");

        // After click
        await user.click(firstButton);
        expect(contentRegion).toHaveClass("max-h-96");
        expect(contentRegion).toHaveClass("opacity-100");
    });

    it("question text changes color when expanded", async () => {
        const user = userEvent.setup();
        const { container } = render(<FAQ />);

        const firstButton = screen.getByRole("button", {
            name: faqList[0].question,
        });
        const questionSpan = firstButton.querySelector("span");

        // Initially text-slate-700
        expect(questionSpan).toHaveClass("text-slate-700");

        // After expansion text-slate-900
        await user.click(firstButton);
        expect(questionSpan).toHaveClass("text-slate-900");
    });
});
