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

describe("Componente FAQ", () => {
    it("renderiza correctamente sin romper", () => {
        render(<FAQ />);
        expect(
            screen.getByRole("heading", { name: /preguntas frecuentes/i }),
        ).toBeInTheDocument();
    });

    it("renderiza la sección con id y aria-labelledby correctos", () => {
        const { container } = render(<FAQ />);
        const section = container.querySelector("section");

        expect(section).toHaveAttribute("id", "preguntas");
        expect(section).toHaveAttribute("aria-labelledby", "faq-heading");
    });

    it("renderiza el encabezado con el id correcto", () => {
        render(<FAQ />);
        const heading = screen.getByRole("heading", {
            name: /preguntas frecuentes/i,
        });

        expect(heading).toHaveAttribute("id", "faq-heading");
    });

    it("renderiza todos los ítems del FAQ desde los datos", () => {
        render(<FAQ />);

        faqList.forEach((faq) => {
            expect(screen.getByText(faq.question)).toBeInTheDocument();
        });
    });

    it("inicialmente todas las respuestas están colapsadas", () => {
        render(<FAQ />);

        faqList.forEach((faq) => {
            const button = screen.getByRole("button", { name: faq.question });
            expect(button).toHaveAttribute("aria-expanded", "false");
        });
    });

    it("expande y colapsa un ítem al hacer clic", async () => {
        const user = userEvent.setup();
        render(<FAQ />);

        const primeraPregunta = faqList[0].question;
        const button = screen.getByRole("button", { name: primeraPregunta });

        expect(button).toHaveAttribute("aria-expanded", "false");

        await user.click(button);
        expect(button).toHaveAttribute("aria-expanded", "true");

        await user.click(button);
        expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("muestra la respuesta cuando el ítem está expandido", async () => {
        const user = userEvent.setup();
        render(<FAQ />);

        const primerFaq = faqList[0];
        const button = screen.getByRole("button", {
            name: primerFaq.question,
        });

        await user.click(button);

        expect(screen.getByText(primerFaq.answer)).toBeVisible();
    });

    it("cada botón tiene el atributo aria-controls correcto", () => {
        render(<FAQ />);

        faqList.forEach((faq) => {
            const button = screen.getByRole("button", { name: faq.question });
            expect(button).toHaveAttribute(
                "aria-controls",
                `faq-content-${faq.id}`,
            );
        });
    });

    it("cada región de contenido tiene el id y role correctos", () => {
        const { container } = render(<FAQ />);

        faqList.forEach((faq) => {
            const region = container.querySelector(`#faq-content-${faq.id}`);
            expect(region).toBeInTheDocument();
            expect(region).toHaveAttribute("role", "region");
        });
    });

    it("la región de contenido referencia correctamente al botón con aria-labelledby", () => {
        const { container } = render(<FAQ />);

        faqList.forEach((faq) => {
            const buttonId = `faq-button-${faq.id}`;
            const region = container.querySelector(`#faq-content-${faq.id}`);

            expect(region).toHaveAttribute("aria-labelledby", buttonId);
        });
    });

    it("renderiza el ícono ChevronDown en cada ítem", () => {
        const { container } = render(<FAQ />);
        const iconos = container.querySelectorAll('svg[aria-hidden="true"]');

        expect(iconos.length).toBeGreaterThanOrEqual(faqList.length);
    });

    it("rota el ícono cuando el ítem está expandido", async () => {
        const user = userEvent.setup();
        render(<FAQ />);

        const button = screen.getByRole("button", {
            name: faqList[0].question,
        });

        const icono = button.querySelector("svg");
        expect(icono).not.toHaveClass("rotate-180");

        await user.click(button);
        expect(icono).toHaveClass("rotate-180");
    });

    it("solo permite un ítem abierto a la vez (comportamiento acordeón)", async () => {
        const user = userEvent.setup();
        render(<FAQ />);

        const primerBoton = screen.getByRole("button", {
            name: faqList[0].question,
        });
        const segundoBoton = screen.getByRole("button", {
            name: faqList[1].question,
        });

        await user.click(primerBoton);
        expect(primerBoton).toHaveAttribute("aria-expanded", "true");

        await user.click(segundoBoton);
        expect(primerBoton).toHaveAttribute("aria-expanded", "false");
        expect(segundoBoton).toHaveAttribute("aria-expanded", "true");
    });

    it("renderiza correctamente la sección CTA", () => {
        render(<FAQ />);

        expect(
            screen.getByText("¿Tenés otra consulta específica?"),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /envíanos tu consulta/i,
            }),
        ).toBeInTheDocument();
    });

    it("el botón CTA ejecuta scrollToSection con 'contacto'", async () => {
        const user = userEvent.setup();
        render(<FAQ />);

        const botonCTA = screen.getByRole("button", {
            name: /envíanos tu consulta/i,
        });

        await user.click(botonCTA);

        expect(mockScrollToSection).toHaveBeenCalledWith("contacto");
    });

    it("la lista principal tiene role='list'", () => {
        const { container } = render(<FAQ />);
        expect(container.querySelector('[role="list"]')).toBeInTheDocument();
    });

    it("cada ítem tiene role='listitem'", () => {
        const { container } = render(<FAQ />);
        const items = container.querySelectorAll('[role="listitem"]');

        expect(items).toHaveLength(faqList.length);
    });

    it("aplica correctamente las clases de animación al expandir", async () => {
        const user = userEvent.setup();
        const { container } = render(<FAQ />);

        const button = screen.getByRole("button", {
            name: faqList[0].question,
        });

        const region = container.querySelector(`#faq-content-${faqList[0].id}`);

        expect(region).toHaveClass("max-h-0");
        expect(region).toHaveClass("opacity-0");

        await user.click(button);

        expect(region).toHaveClass("max-h-[1000px]");
        expect(region).toHaveClass("opacity-100");
    });

    it("cambia el color del texto de la pregunta al expandirse", async () => {
        const user = userEvent.setup();
        render(<FAQ />);

        const button = screen.getByRole("button", {
            name: faqList[0].question,
        });

        const spanPregunta = button.querySelector("span");

        expect(spanPregunta).toHaveClass("text-slate-700");

        await user.click(button);

        expect(spanPregunta).toHaveClass("text-slate-900");
    });

    it("navega al siguiente ítem con ArrowDown", async () => {
        const user = userEvent.setup();
        render(<FAQ />);

        const botones = faqList.map((faq) =>
            screen.getByRole("button", { name: faq.question }),
        );

        botones[0].focus();
        await user.keyboard("{ArrowDown}");

        expect(botones[1]).toHaveFocus();
    });

    it("navega al ítem anterior con ArrowUp", async () => {
        const user = userEvent.setup();
        render(<FAQ />);

        const botones = faqList.map((faq) =>
            screen.getByRole("button", { name: faq.question }),
        );

        botones[1].focus();
        await user.keyboard("{ArrowUp}");

        expect(botones[0]).toHaveFocus();
    });

    it("mueve el foco al primer ítem con la tecla Home", async () => {
        const user = userEvent.setup();
        render(<FAQ />);

        const botones = faqList.map((faq) =>
            screen.getByRole("button", { name: faq.question }),
        );

        botones[botones.length - 1].focus();
        await user.keyboard("{Home}");

        expect(botones[0]).toHaveFocus();
    });

    it("mueve el foco al último ítem con la tecla End", async () => {
        const user = userEvent.setup();
        render(<FAQ />);

        const botones = faqList.map((faq) =>
            screen.getByRole("button", { name: faq.question }),
        );

        botones[0].focus();
        await user.keyboard("{End}");

        expect(botones[botones.length - 1]).toHaveFocus();
    });
});
