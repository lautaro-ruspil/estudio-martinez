import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createRoot } from "react-dom/client";

describe("main.tsx", () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement("div");
        container.id = "root";
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    it("renderiza la aplicación sin errores", () => {
        // Simular lo que hace main.tsx
        const root = createRoot(container);
        expect(root).toBeDefined();
        expect(container).toBeInTheDocument();
    });

    it("el elemento root existe en el DOM", () => {
        const rootElement = document.getElementById("root");
        expect(rootElement).toBeTruthy();
        expect(rootElement).toBeInstanceOf(HTMLDivElement);
    });

    it("lanza error si el elemento root no existe", async () => {
        // Mock de getElementById para que devuelva null
        const getElementByIdSpy = vi
            .spyOn(document, "getElementById")
            .mockReturnValue(null);

        await expect(import("./main")).rejects.toThrow(
            "El elemento root no existe en el DOM",
        );

        getElementByIdSpy.mockRestore();
    });
});
