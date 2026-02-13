import { describe, it, expect } from "vitest";
import { testimonials } from "./testimonials";

describe("testimonials.ts", () => {
    it("todos los testimonials tienen campos requeridos", () => {
        testimonials.forEach((testimonial) => {
            expect(testimonial.id).toBeDefined();
            expect(testimonial.name).toBeTruthy();
            expect(testimonial.business).toBeTruthy();
            expect(testimonial.content).toBeTruthy();
            expect(testimonial.rating).toBeDefined();
        });
    });

    it("IDs son únicos", () => {
        const ids = testimonials.map((t) => t.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    it("ratings están entre 1 y 5", () => {
        testimonials.forEach((testimonial) => {
            expect(testimonial.rating).toBeGreaterThanOrEqual(1);
            expect(testimonial.rating).toBeLessThanOrEqual(5);
        });
    });

    it("ratings son números enteros", () => {
        testimonials.forEach((testimonial) => {
            expect(Number.isInteger(testimonial.rating)).toBe(true);
        });
    });

    it("tiene al menos 2 testimonials", () => {
        expect(testimonials.length).toBeGreaterThanOrEqual(2);
    });

    it("nombres no están vacíos", () => {
        testimonials.forEach((testimonial) => {
            expect(testimonial.name.trim().length).toBeGreaterThan(3);
        });
    });

    it("contenido tiene longitud razonable", () => {
        testimonials.forEach((testimonial) => {
            expect(testimonial.content.length).toBeGreaterThan(20);
            expect(testimonial.content.length).toBeLessThan(500);
        });
    });

    it("business no está vacío", () => {
        testimonials.forEach((testimonial) => {
            expect(testimonial.business.trim().length).toBeGreaterThan(2);
        });
    });

    it("al menos un testimonio tiene rating 5", () => {
        const hasFiveStars = testimonials.some((t) => t.rating === 5);
        expect(hasFiveStars).toBe(true);
    });
});
