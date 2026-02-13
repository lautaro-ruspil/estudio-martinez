import { describe, it, expect } from "vitest";
import { servicesList } from "./services";

describe("services.ts", () => {
    it("todos los servicios tienen campos requeridos", () => {
        servicesList.forEach((service) => {
            expect(service.id).toBeTruthy();
            expect(service.title).toBeTruthy();
            expect(service.description).toBeTruthy();
            expect(service.icon).toBeDefined();
            expect(typeof service.popular).toBe("boolean");
        });
    });

    it("IDs son únicos", () => {
        const ids = servicesList.map((s) => s.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    it("no hay servicios duplicados", () => {
        const titles = servicesList.map((s) => s.title);
        const uniqueTitles = new Set(titles);
        expect(uniqueTitles.size).toBe(titles.length);
    });

    it("al menos un servicio es popular", () => {
        const hasPopular = servicesList.some((s) => s.popular === true);
        expect(hasPopular).toBe(true);
    });

    it("tiene al menos 3 servicios", () => {
        expect(servicesList.length).toBeGreaterThanOrEqual(3);
    });

    it("todos los servicios tienen descripciones de longitud razonable", () => {
        servicesList.forEach((service) => {
            expect(service.description.length).toBeGreaterThan(20);
            expect(service.description.length).toBeLessThan(300);
        });
    });

    it("todos los IDs son lowercase y sin espacios", () => {
        servicesList.forEach((service) => {
            expect(service.id).toBe(service.id.toLowerCase());
            expect(service.id).not.toMatch(/\s/);
        });
    });

    it("icons son componentes válidos de lucide-react", () => {
        servicesList.forEach((service) => {
            // Los iconos de lucide-react son objetos con propiedades específicas
            expect(service.icon).toBeDefined();
            expect(typeof service.icon).toBe("object");
        });
    });
});
