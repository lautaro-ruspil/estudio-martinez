// components/home/Services.tsx - VERSIÓN CORREGIDA

import { servicesList } from "../../data/services";
import { useScrollToSection } from "../../hooks/useScrollToSection";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { Card, Button } from "../ui";
import { ICON_SIZES } from "../../constants/iconSizes";
// ✅ FIX: Remover memo import (ya no se usa)

interface ServiceCardProps {
    service: (typeof servicesList)[number];
    index: number;
    isVisible: boolean;
}

// ✅ FIX: Remover memo - no tiene beneficio aquí
function ServiceCard({ service, index, isVisible }: ServiceCardProps) {
    const Icon = service.icon;

    return (
        <li
            className={`transition-all duration-1000 ease-out ${
                isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-16 scale-95"
            }`}
            style={{
                transitionDelay: `${index * 150}ms`,
            }}
        >
            <Card className="h-full p-8 group hover:shadow-strong hover:-translate-y-2 transition-all duration-300 hover:border-primary-200">
                {service.popular && (
                    <span className="absolute -top-3 right-4 bg-primary-600 text-white text-sm md:text-base font-bold px-4 py-1 rounded-full shadow-strong flex items-center gap-2">
                        ⭐ Más popular
                    </span>
                )}

                <div className="mb-6">
                    <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center transition-colors duration-300 group-hover:bg-primary-100">
                        <Icon
                            className={`${ICON_SIZES.lg} text-primary-600`}
                            aria-hidden="true"
                        />
                    </div>
                </div>

                <h3 className="text-h5 mb-4">{service.title}</h3>

                <p className="text-body-sm text-slate-600 leading-relaxed">
                    {service.description}
                </p>
            </Card>
        </li>
    );
}

export function Services() {
    const scrollToSection = useScrollToSection();
    const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

    return (
        <section
            id="servicios"
            ref={ref}
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
                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {servicesList.map((service, index) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            index={index}
                            isVisible={isVisible}
                        />
                    ))}
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
