import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "../../components/home/About";
import { BUSINESS_INFO } from "../../config/site";
import { createRef } from "react";

// Mock del hook useCounter
const mockUseCounter = vi.fn();
vi.mock("../../hooks/useCounter", () => ({
    useCounter: (config: any) => mockUseCounter(config),
}));

// Mock de la imagen
vi.mock("../../assets/roberto-martinez.webp", () => ({
    default: "/mock-image.webp",
}));

describe("About", () => {
    beforeEach(() => {
        mockUseCounter.mockReturnValue({
            count: 0,
            ref: { current: null },
        });
    });

    it("renderiza correctamente sin errores", () => {
        render(<About />);
        expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("renderiza la sección con id y aria-labelledby correctos", () => {
        const { container } = render(<About />);
        const section = container.querySelector("section");

        expect(section).toHaveAttribute("id", "nosotros");
        expect(section).toHaveAttribute("aria-labelledby", "about-heading");
    });

    it("renderiza el heading principal con el texto correcto", () => {
        render(<About />);
        const heading = screen.getByRole("heading", { level: 2 });

        expect(heading).toHaveTextContent(
            `Más de ${BUSINESS_INFO.experience} años acompañando a emprendedores de ${BUSINESS_INFO.address.city}`,
        );
        expect(heading).toHaveAttribute("id", "about-heading");
    });

    it("muestra la foto del contador con los atributos correctos", () => {
        render(<About />);
        const img = screen.getByRole("img");

        expect(img).toHaveAttribute(
            "alt",
            `${BUSINESS_INFO.owner}, ${BUSINESS_INFO.title}`,
        );
        expect(img).toHaveAttribute("loading", "lazy");
        expect(img).toHaveAttribute("width", "208");
        expect(img).toHaveAttribute("height", "208");
    });

    it("muestra correctamente la información del contador", () => {
        render(<About />);

        expect(screen.getByText(BUSINESS_INFO.owner)).toBeInTheDocument();
        expect(screen.getByText(BUSINESS_INFO.title)).toBeInTheDocument();
        expect(screen.getByText(BUSINESS_INFO.license)).toBeInTheDocument();
    });

    it("muestra la información de la empresa desde BUSINESS_INFO", () => {
        render(<About />);

        expect(
            screen.getByText((content) =>
                content.includes(String(BUSINESS_INFO.established)),
            ),
        ).toBeInTheDocument();

        expect(
            screen.getByText((content) =>
                content.includes(BUSINESS_INFO.clientCount),
            ),
        ).toBeInTheDocument();
    });

    it("inicializa el contador de clientes con el valor correcto", () => {
        render(<About />);
        expect(mockUseCounter).toHaveBeenCalledWith({ end: 120 });
    });

    it("inicializa el contador de años con el valor correcto", () => {
        render(<About />);
        expect(mockUseCounter).toHaveBeenCalledWith({ end: 30 });
    });

    it("muestra los valores del contador cuando el hook los provee", () => {
        mockUseCounter
            .mockReturnValueOnce({
                count: 120,
                ref: { current: null },
            })
            .mockReturnValueOnce({
                count: 30,
                ref: { current: null },
            });

        render(<About />);

        expect(screen.getByText("120+")).toBeInTheDocument();
        expect(screen.getByText("30")).toBeInTheDocument();
    });

    it("muestra las etiquetas de los contadores", () => {
        render(<About />);

        expect(screen.getByText("Clientes activos")).toBeInTheDocument();
        expect(screen.getByText("Años de trayectoria")).toBeInTheDocument();
    });

    it("adjunta correctamente los refs del hook useCounter a los elementos del DOM", () => {
        const clientsRef = createRef<HTMLDivElement>();
        const yearsRef = createRef<HTMLDivElement>();

        mockUseCounter
            .mockReturnValueOnce({
                count: 0,
                ref: clientsRef,
            })
            .mockReturnValueOnce({
                count: 0,
                ref: yearsRef,
            });

        render(<About />);

        expect(clientsRef.current).not.toBeNull();
        expect(yearsRef.current).not.toBeNull();
    });

    it("renderiza los párrafos descriptivos de la empresa", () => {
        render(<About />);

        expect(
            screen.getByText((content) =>
                content.includes("Fundé este estudio"),
            ),
        ).toBeInTheDocument();

        expect(
            screen.getByText((content) =>
                content.includes("A lo largo de estos años"),
            ),
        ).toBeInTheDocument();

        expect(
            screen.getByText((content) =>
                content.includes("Creemos en explicar cada trámite"),
            ),
        ).toBeInTheDocument();
    });

    it("mantiene una estructura HTML semánticamente correcta", () => {
        const { container } = render(<About />);

        const section = container.querySelector("section");
        const h2 = container.querySelector("h2");
        const h3 = container.querySelector("h3");

        expect(section).toBeInTheDocument();
        expect(h2).toBeInTheDocument();
        expect(h3).toBeInTheDocument();
    });

    it("aplica correctamente las clases responsivas del layout", () => {
        const { container } = render(<About />);
        const grid = container.querySelector(".grid");

        expect(grid).toHaveClass("grid-cols-1");
        expect(grid).toHaveClass("lg:grid-cols-2");
    });
});
