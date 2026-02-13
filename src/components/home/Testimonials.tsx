import { Quote, Star } from "lucide-react";
import { testimonials } from "../../data/testimonials";

export function Testimonials() {
    return (
        <section
            id="testimonials"
            className="section-spacing bg-slate-50"
            aria-labelledby="testimonials-heading"
        >
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2
                        id="testimonials-heading"
                        className="text-h2 text-secondary-800 mb-4"
                    >
                        Lo que dicen nuestros clientes
                    </h2>
                    <p className="text-body-lg text-slate-600 max-w-2xl mx-auto">
                        La confianza construida durante más de 30 años es
                        nuestro mayor respaldo.
                    </p>
                </div>

                <ul
                    role="list"
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                >
                    {testimonials.map((testimonial) => {
                        const rating = Math.min(testimonial.rating, 5);

                        return (
                            <li key={testimonial.id}>
                                <article className="relative bg-white rounded-2xl p-8 border border-slate-100 shadow-soft transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
                                    <Quote
                                        className="absolute top-6 right-6 w-12 h-12 text-primary-50"
                                        strokeWidth={1}
                                        aria-hidden="true"
                                    />

                                    <blockquote className="relative z-10 mb-8">
                                        <p className="text-slate-700 leading-relaxed">
                                            "{testimonial.content}"
                                        </p>
                                    </blockquote>

                                    <div className="flex items-center gap-1 mb-6">
                                        {Array.from({ length: rating }).map(
                                            (_, i) => (
                                                <Star
                                                    key={i}
                                                    className="w-4 h-4 text-amber-400 fill-amber-400"
                                                    aria-hidden="true"
                                                />
                                            ),
                                        )}
                                    </div>

                                    <footer className="border-t border-slate-100 pt-4">
                                        <p className="font-semibold text-slate-900">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {testimonial.business}
                                        </p>
                                    </footer>
                                </article>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
