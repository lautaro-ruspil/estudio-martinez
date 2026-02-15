import { describe, it, expect, vi, beforeEach } from "vitest";

// Mockear createRoot
vi.mock("react-dom/client", () => {
    return {
        createRoot: vi.fn(() => ({
            render: vi.fn(),
        })),
    };
});

describe("main.tsx (real execution)", () => {
    beforeEach(() => {
        vi.resetModules(); // CLAVE para re-ejecutar el entry
        document.body.innerHTML = "";
    });

    it("renderiza la app cuando root existe", async () => {
        document.body.innerHTML = `<div id="root"></div>`;

        await import("./main");

        const { createRoot } = await import("react-dom/client");

        expect(createRoot).toHaveBeenCalledTimes(1);
    });

    it("lanza error cuando root no existe", async () => {
        document.body.innerHTML = "";

        await expect(import("./main")).rejects.toThrow(
            "El elemento root no existe en el DOM",
        );
    });
});
