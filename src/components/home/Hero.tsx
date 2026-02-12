import { MapPin, Clock, MessageCircle, CheckCircle } from "lucide-react";
import { useScrollToSection } from "../../hooks/useScrollToSection";
import { Button } from "../ui";
import { BUSINESS_INFO } from "../../config/site";
import { WhatsAppIcon } from "../ui/WhatsAppIcon";

export function Hero() {
    const scrollToSection = useScrollToSection();

    return (
        <section
            className="relative bg-gradient-to-br from-white via-slate-50 to-primary-50"
            aria-labelledby="hero-heading"
        >
            <div className="container-custom min-h-[calc(100svh-80px)] flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center w-full">
                    {/* LEFT CONTENT */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-secondary-50 text-secondary-700 px-4 py-2 rounded-full text-body-sm font-medium border border-secondary-200">
                            <CheckCircle
                                className="w-4 h-4"
                                aria-hidden="true"
                            />
                            <span>
                                +{BUSINESS_INFO.experience} años de experiencia
                                local
                            </span>
                        </div>

                        {/* Heading */}
                        <h1
                            id="hero-heading"
                            className="text-h1 text-secondary-900 max-w-3xl"
                        >
                            Tu contador de confianza en Olavarría
                        </h1>

                        {/* Description */}
                        <p className="text-body text-slate-600 max-w-xl">
                            Más de {BUSINESS_INFO.experience} años ayudando a
                            comercios, monotributistas y empresas de la zona a
                            mantener sus impuestos al día. Sin vueltas, con
                            atención personalizada y asesoramiento claro.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => scrollToSection("contacto")}
                                className="shadow-md hover:shadow-lg transition-all"
                            >
                                Consultá sin cargo
                            </Button>

                            <a
                                href={BUSINESS_INFO.contact.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Contactar por WhatsApp"
                                className="inline-flex"
                            >
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                >
                                    <WhatsAppIcon
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                    />
                                    WhatsApp
                                </Button>
                            </a>
                        </div>
                    </div>

                    {/* RIGHT INFO CARD */}
                    <div className="hidden lg:block">
                        <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-medium border border-slate-200/70">
                            <div className="space-y-8">
                                <InfoItem
                                    icon={<MapPin className="w-5 h-5" />}
                                    title="Ubicación céntrica"
                                    text={`${BUSINESS_INFO.address.street}, ${BUSINESS_INFO.address.city}`}
                                />

                                <InfoItem
                                    icon={<Clock className="w-5 h-5" />}
                                    title="Horarios flexibles"
                                    text={`Lun–Vie ${BUSINESS_INFO.schedule.weekdays}`}
                                />

                                <InfoItem
                                    icon={<MessageCircle className="w-5 h-5" />}
                                    title="Atención personalizada"
                                    text="Consultas claras y acompañamiento profesional."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function InfoItem({
    icon,
    title,
    text,
}: {
    icon: React.ReactNode;
    title: string;
    text: string;
}) {
    return (
        <div className="flex items-start gap-4">
            <div
                className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center"
                aria-hidden="true"
            >
                {icon}
            </div>
            <div>
                <h3 className="text-h4 text-secondary-900 mb-1">{title}</h3>
                <p className="text-body-sm text-slate-600">{text}</p>
            </div>
        </div>
    );
}
