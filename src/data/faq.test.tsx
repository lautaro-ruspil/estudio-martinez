import { describe, it, expect } from "vitest";
import { faqList } from "./faq";

describe("faq.ts", () => {
    it("todos los items tienen campos requeridos", () => {
        faqList.forEach((item) => {
            expect(item.id).toBeTruthy();
            expect(item.question).toBeTruthy();
            expect(item.answer).toBeTruthy();
        });
    });

    it("IDs son únicos", () => {
        const ids = faqList.map((item) => item.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    it("no hay preguntas duplicadas", () => {
        const questions = faqList.map((item) => item.question);
        const uniqueQuestions = new Set(questions);
        expect(uniqueQuestions.size).toBe(questions.length);
    });

    it("tiene al menos 5 preguntas", () => {
        expect(faqList.length).toBeGreaterThanOrEqual(5);
    });

    it("preguntas no están vacías", () => {
        faqList.forEach((item) => {
            expect(item.question.trim().length).toBeGreaterThan(5);
        });
    });

    it("respuestas no están vacías", () => {
        faqList.forEach((item) => {
            expect(item.answer.trim().length).toBeGreaterThan(10);
        });
    });

    it("todos los IDs son lowercase y sin espacios", () => {
        faqList.forEach((item) => {
            expect(item.id).toBe(item.id.toLowerCase());
            expect(item.id).not.toMatch(/\s/);
        });
    });

    it("preguntas terminan con signo de interrogación", () => {
        faqList.forEach((item) => {
            expect(item.question.trim()).toMatch(/\?$/);
        });
    });

    it("respuestas tienen longitud razonable", () => {
        faqList.forEach((item) => {
            expect(item.answer.length).toBeGreaterThan(20);
            expect(item.answer.length).toBeLessThan(1000);
        });
    });
});
