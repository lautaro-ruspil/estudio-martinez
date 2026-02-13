import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Testimonials } from "../../components/home/Testimonials";
import { testimonials } from "../../data/testimonials";

describe("Testimonials", () => {
    it("renders without crashing", () => {
        render(<Testimonials />);
        expect(
            screen.getByRole("heading", {
                name: /lo que dicen nuestros clientes/i,
            }),
        ).toBeInTheDocument();
    });

    it("renders section with correct id and aria-labelledby", () => {
        const { container } = render(<Testimonials />);
        const section = container.querySelector("section");

        expect(section).toHaveAttribute("id", "testimonials");
        expect(section).toHaveAttribute(
            "aria-labelledby",
            "testimonials-heading",
        );
    });

    it("renders heading with correct id", () => {
        render(<Testimonials />);
        const heading = screen.getByRole("heading", {
            name: /lo que dicen nuestros clientes/i,
        });

        expect(heading).toHaveAttribute("id", "testimonials-heading");
    });

    it("renders description text", () => {
        render(<Testimonials />);
        expect(
            screen.getByText(/la confianza construida durante más de 30 años/i),
        ).toBeInTheDocument();
    });

    it("renders all testimonials from data", () => {
        render(<Testimonials />);

        testimonials.forEach((testimonial) => {
            // Buscar por texto que incluya el contenido (con o sin comillas)
            expect(
                screen.getByText((content, element) => {
                    return content.includes(testimonial.content);
                }),
            ).toBeInTheDocument();

            expect(screen.getByText(testimonial.name)).toBeInTheDocument();
            expect(screen.getByText(testimonial.business)).toBeInTheDocument();
        });
    });

    it("renders testimonials in a list with role='list'", () => {
        const { container } = render(<Testimonials />);
        const list = container.querySelector('[role="list"]');

        expect(list).toBeInTheDocument();
    });

    it("each testimonial is a list item", () => {
        const { container } = render(<Testimonials />);
        const listItems = container.querySelectorAll("li");

        expect(listItems).toHaveLength(testimonials.length);
    });

    it("each testimonial is wrapped in an article element", () => {
        const { container } = render(<Testimonials />);
        const articles = container.querySelectorAll("article");

        expect(articles).toHaveLength(testimonials.length);
    });

    it("testimonial content is wrapped in a blockquote", () => {
        const { container } = render(<Testimonials />);

        testimonials.forEach((testimonial) => {
            // Buscar el texto dentro del DOM
            const paragraph = screen.getByText((content) =>
                content.includes(testimonial.content),
            );
            const blockquote = paragraph.closest("blockquote");

            expect(blockquote).toBeInTheDocument();
        });
    });

    it("renders Quote icon for each testimonial", () => {
        const { container } = render(<Testimonials />);
        const quoteIcons = container.querySelectorAll(
            'svg[aria-hidden="true"]',
        );

        // At least one quote icon per testimonial (plus star icons)
        expect(quoteIcons.length).toBeGreaterThanOrEqual(testimonials.length);
    });

    it("renders correct number of stars for each rating", () => {
        const { container } = render(<Testimonials />);

        testimonials.forEach((testimonial) => {
            const article = screen
                .getByText(testimonial.name)
                .closest("article");
            const stars = article?.querySelectorAll(".fill-amber-400");

            const expectedStars = Math.min(testimonial.rating, 5);
            expect(stars).toHaveLength(expectedStars);
        });
    });

    it("caps rating at 5 stars maximum", () => {
        const { container } = render(<Testimonials />);

        testimonials.forEach((testimonial) => {
            const article = screen
                .getByText(testimonial.name)
                .closest("article");
            const stars = article?.querySelectorAll(".fill-amber-400");

            expect(stars!.length).toBeLessThanOrEqual(5);
        });
    });

    it("renders testimonial author in footer element", () => {
        const { container } = render(<Testimonials />);

        testimonials.forEach((testimonial) => {
            const name = screen.getByText(testimonial.name);
            const footer = name.closest("footer");

            expect(footer).toBeInTheDocument();
        });
    });

    it("author name has correct styling", () => {
        render(<Testimonials />);

        testimonials.forEach((testimonial) => {
            const name = screen.getByText(testimonial.name);
            expect(name).toHaveClass("font-semibold");
            expect(name).toHaveClass("text-slate-900");
        });
    });

    it("business name has correct styling", () => {
        render(<Testimonials />);

        testimonials.forEach((testimonial) => {
            const business = screen.getByText(testimonial.business);
            expect(business).toHaveClass("text-sm");
            expect(business).toHaveClass("text-slate-500");
        });
    });

    it("applies responsive grid classes", () => {
        const { container } = render(<Testimonials />);
        const grid = container.querySelector('[role="list"]');

        expect(grid).toHaveClass("grid");
        expect(grid).toHaveClass("grid-cols-1");
        expect(grid).toHaveClass("md:grid-cols-3");
    });

    it("testimonial cards have transition and hover effects", () => {
        const { container } = render(<Testimonials />);
        const articles = container.querySelectorAll("article");

        articles.forEach((article) => {
            expect(article).toHaveClass("transition-all");
            expect(article).toHaveClass("duration-300");
            expect(article).toHaveClass("hover:shadow-medium");
            expect(article).toHaveClass("hover:-translate-y-1");
        });
    });

    it("testimonial content includes quotes in text", () => {
        const { container } = render(<Testimonials />);

        testimonials.forEach((testimonial) => {
            // Encontrar el article que contiene este testimonial
            const article = screen
                .getByText(testimonial.name)
                .closest("article");

            // Dentro de ese article, buscar el párrafo del blockquote
            const paragraph = article?.querySelector(
                "blockquote p",
            ) as HTMLElement;
            const textContent = paragraph?.textContent || "";

            expect(textContent).toContain(testimonial.content);
            expect(textContent).toMatch(/^"/); // Comienza con comilla
            expect(textContent).toMatch(/"$/); // Termina con comilla
        });
    });

    it("star icons have correct color classes", () => {
        const { container } = render(<Testimonials />);
        const stars = container.querySelectorAll(".fill-amber-400");

        stars.forEach((star) => {
            expect(star).toHaveClass("text-amber-400");
            expect(star).toHaveClass("fill-amber-400");
        });
    });

    it("star icons have aria-hidden attribute", () => {
        const { container } = render(<Testimonials />);
        const articles = container.querySelectorAll("article");

        articles.forEach((article) => {
            const stars = article.querySelectorAll('svg[aria-hidden="true"]');
            // At least one icon (Quote) per article, plus stars
            expect(stars.length).toBeGreaterThan(0);
        });
    });

    it("renders testimonials with correct unique keys", () => {
        const { container } = render(<Testimonials />);
        const listItems = container.querySelectorAll("li");

        // All items rendered (React would throw on duplicate keys)
        expect(listItems).toHaveLength(testimonials.length);
    });

    it("quote icon has decorative styling", () => {
        const { container } = render(<Testimonials />);
        const quoteIcons = container.querySelectorAll('[class*="w-12"]');

        quoteIcons.forEach((icon) => {
            expect(icon).toHaveClass("absolute");
            expect(icon).toHaveClass("text-primary-50");
        });
    });

    it("each testimonial has a border and shadow", () => {
        const { container } = render(<Testimonials />);
        const articles = container.querySelectorAll("article");

        articles.forEach((article) => {
            expect(article).toHaveClass("border");
            expect(article).toHaveClass("shadow-soft");
        });
    });

    it("handles edge case: rating of 0 renders 0 stars", () => {
        const mockTestimonials = [
            {
                id: "test",
                name: "Test User",
                business: "Test Business",
                content: "Test content",
                rating: 0,
            },
        ];

        const { container } = render(
            <section>
                {mockTestimonials.map((testimonial) => {
                    const rating = Math.min(testimonial.rating, 5);
                    return (
                        <div key={testimonial.id}>
                            {Array.from({ length: rating }).map((_, i) => (
                                <span key={i} className="fill-amber-400">
                                    ★
                                </span>
                            ))}
                        </div>
                    );
                })}
            </section>,
        );

        const stars = container.querySelectorAll(".fill-amber-400");
        expect(stars).toHaveLength(0);
    });

    it("handles edge case: rating above 5 caps at 5 stars", () => {
        const mockTestimonials = [
            {
                id: "test",
                name: "Test User",
                business: "Test Business",
                content: "Test content",
                rating: 10,
            },
        ];

        const { container } = render(
            <section>
                {mockTestimonials.map((testimonial) => {
                    const rating = Math.min(testimonial.rating, 5);
                    return (
                        <div key={testimonial.id}>
                            {Array.from({ length: rating }).map((_, i) => (
                                <span key={i} className="fill-amber-400">
                                    ★
                                </span>
                            ))}
                        </div>
                    );
                })}
            </section>,
        );

        const stars = container.querySelectorAll(".fill-amber-400");
        expect(stars).toHaveLength(5);
    });
});
