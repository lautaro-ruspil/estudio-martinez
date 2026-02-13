import { render, screen, within } from "@testing-library/react";
import { Footer } from "./Footer";
import { describe, it, expect, vi } from "vitest";

vi.mock("../../config/site", () => ({
    BUSINESS_INFO: {
        legalName: "Martínez & Asociados",
        experience: 25,
        license: "Mat. Prof. 12345",
        address: {
            street: "Calle Falsa 123",
            city: "Olavarría",
        },
        contact: {
            phone: "2284 123456",
            email: "info@test.com",
            googleMaps: "https://maps.google.com/test",
            whatsapp: "https://wa.me/5492284123456",
        },
        schedule: {
            weekdays: "8:00 a 16:00",
            saturday: "9:00 a 12:00",
            note: "Atención con turno previo",
        },
    },
}));

describe("Footer", () => {
    it("renderiza el nombre del estudio en el encabezado principal", () => {
        render(<Footer />);

        const heading = screen.getByRole("heading", {
            name: "Martínez & Asociados",
        });

        expect(heading).toBeInTheDocument();
    });

    it("muestra el año actual en el texto de copyright", () => {
        render(<Footer />);

        const year = new Date().getFullYear().toString();
        const copyright = screen.getByText(new RegExp(`©\\s*${year}`));

        expect(copyright).toBeInTheDocument();
    });

    it("renderiza los enlaces externos con atributos de seguridad adecuados", () => {
        render(<Footer />);
        const links = screen.getAllByRole("link");

        links.forEach((link) => {
            if (link.getAttribute("target") === "_blank") {
                expect(link).toHaveAttribute(
                    "rel",
                    expect.stringContaining("noopener"),
                );
                expect(link).toHaveAttribute(
                    "rel",
                    expect.stringContaining("noreferrer"),
                );
            }
        });
    });

    it("renderiza correctamente la información de contacto dentro de la sección correspondiente", () => {
        render(<Footer />);

        const seccionContacto = screen.getByRole("heading", {
            name: "Contacto",
        }).parentElement as HTMLElement;

        const utils = within(seccionContacto);

        expect(utils.getByText("2284 123456")).toBeInTheDocument();
        expect(utils.getByText("info@test.com")).toBeInTheDocument();
        expect(utils.getByText(/calle falsa 123/i)).toBeInTheDocument();
        expect(utils.getByText(/olavarría/i)).toBeInTheDocument();
    });
});
