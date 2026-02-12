import { servicesList } from "../../data/services";
import { useScrollToSection } from "../../hooks/useScrollToSection";
import { Card, Button } from "../ui";

export function Services() {
    const scrollToSection = useScrollToSection();

    return (
        <section
            id="servicios"
            className="section-spacing bg-white"
            aria-labelledby="services-heading"
        >
            <div className="container-custom">
                {/* Header */}
                <div className="max-w-2xl mx-auto text-center heading-spacing">
                    <h2 id="services-heading" className="text-h2 mb-6">
                        Servicios Contables
                    </h2>

                    <p className="text-body text-slate-600">
                        Te acompañamos en cada obligación fiscal para que puedas
                        enfocarte en hacer crecer tu negocio con tranquilidad.
                    </p>
                </div>

                {/* Grid */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {servicesList.map((service, index) => {
                        const Icon = service.icon;

                        return (
                            <li
                                key={service.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 40}ms` }}
                            >
                                <Card className="h-full p-8 group hover:shadow-medium transition-all duration-300">
                                    {service.popular && (
                                        <span className="absolute top-6 right-6 bg-accent-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                                            Más popular
                                        </span>
                                    )}

                                    <div className="mb-6">
                                        <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center transition-colors duration-300 group-hover:bg-primary-100">
                                            <Icon
                                                className="w-7 h-7 text-primary-600"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>

                                    <h3 className="text-h5 mb-4">
                                        {service.title}
                                    </h3>

                                    <p className="text-body-sm text-slate-600 leading-relaxed">
                                        {service.description}
                                    </p>
                                </Card>
                            </li>
                        );
                    })}
                </ul>

                {/* Footer CTA */}
                <div className="mt-20 text-center max-w-xl mx-auto">
                    <p className="text-body text-slate-600 mb-6">
                        ¿Necesitás asesoramiento específico para tu caso?
                    </p>

                    <Button
                        variant="link"
                        size="lg"
                        onClick={() => scrollToSection("contacto")}
                    >
                        Hablemos sobre tu situación →
                    </Button>
                </div>
            </div>
        </section>
    );
}
