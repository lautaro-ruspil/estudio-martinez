import { describe, it, expect } from "vitest";
import { SITE_CONFIG, BUSINESS_INFO } from "./site";

describe("site.ts - SITE_CONFIG", () => {
    it("tiene todos los campos requeridos", () => {
        expect(SITE_CONFIG.name).toBeDefined();
        expect(SITE_CONFIG.description).toBeDefined();
        expect(SITE_CONFIG.url).toBeDefined();
        expect(SITE_CONFIG.locale).toBeDefined();
        expect(SITE_CONFIG.keywords).toBeDefined();
    });

    it("url tiene formato válido", () => {
        expect(SITE_CONFIG.url).toMatch(/^https?:\/\/.+/);
    });

    it("locale tiene formato válido", () => {
        expect(SITE_CONFIG.locale).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    });

    it("keywords es un array no vacío", () => {
        expect(Array.isArray(SITE_CONFIG.keywords)).toBe(true);
        expect(SITE_CONFIG.keywords.length).toBeGreaterThan(0);
    });
});

describe("site.ts - BUSINESS_INFO", () => {
    it("tiene todos los campos principales", () => {
        expect(BUSINESS_INFO.legalName).toBeDefined();
        expect(BUSINESS_INFO.owner).toBeDefined();
        expect(BUSINESS_INFO.title).toBeDefined();
        expect(BUSINESS_INFO.license).toBeDefined();
        expect(BUSINESS_INFO.established).toBeDefined();
        expect(BUSINESS_INFO.clientCount).toBeDefined();
        expect(BUSINESS_INFO.experience).toBeDefined();
    });

    it("established es un año válido", () => {
        expect(typeof BUSINESS_INFO.established).toBe("number");
        expect(BUSINESS_INFO.established).toBeGreaterThan(1900);
        expect(BUSINESS_INFO.established).toBeLessThanOrEqual(
            new Date().getFullYear(),
        );
    });

    it("address tiene todos los campos requeridos", () => {
        expect(BUSINESS_INFO.address.street).toBeDefined();
        expect(BUSINESS_INFO.address.city).toBeDefined();
        expect(BUSINESS_INFO.address.state).toBeDefined();
        expect(BUSINESS_INFO.address.country).toBeDefined();
        expect(BUSINESS_INFO.address.reference).toBeDefined();
        expect(BUSINESS_INFO.address.coordinates).toBeDefined();
    });

    it("coordenadas están en rango válido", () => {
        const { lat, lng } = BUSINESS_INFO.address.coordinates;

        // Latitud: -90 a 90
        expect(lat).toBeGreaterThanOrEqual(-90);
        expect(lat).toBeLessThanOrEqual(90);

        // Longitud: -180 a 180
        expect(lng).toBeGreaterThanOrEqual(-180);
        expect(lng).toBeLessThanOrEqual(180);
    });

    it("contact.email tiene formato válido", () => {
        expect(BUSINESS_INFO.contact.email).toMatch(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        );
    });

    it("contact.whatsapp tiene formato válido", () => {
        expect(BUSINESS_INFO.contact.whatsapp).toMatch(/^https:\/\/wa\.me\/.+/);
    });

    it("contact.googleMaps tiene formato válido", () => {
        expect(BUSINESS_INFO.contact.googleMaps).toMatch(
            /^https:\/\/www\.google\.com\/maps.+/,
        );
    });

    it("contact.phone y phoneRaw son consistentes", () => {
        expect(BUSINESS_INFO.contact.phone).toBeDefined();
        expect(BUSINESS_INFO.contact.phoneRaw).toBeDefined();
        expect(typeof BUSINESS_INFO.contact.phoneRaw).toBe("string");
    });

    it("schedule tiene todos los campos requeridos", () => {
        expect(BUSINESS_INFO.schedule.weekdays).toBeDefined();
        expect(BUSINESS_INFO.schedule.saturday).toBeDefined();
        expect(BUSINESS_INFO.schedule.sunday).toBeDefined();
        expect(BUSINESS_INFO.schedule.note).toBeDefined();
    });
});
