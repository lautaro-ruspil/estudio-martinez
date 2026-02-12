import { MapPin, Phone, Mail } from "lucide-react";
import { BUSINESS_INFO } from "../../config/site";

export function Footer() {
    return (
        <footer className="bg-slate-900 text-white" role="contentinfo">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* ABOUT */}
                    <div>
                        <h2 className="font-semibold text-lg mb-4 text-white">
                            {BUSINESS_INFO.legalName}
                        </h2>
                        <p className="text-slate-400 text-sm mb-4">
                            Estudio contable con más de{" "}
                            {BUSINESS_INFO.experience} años de trayectoria en{" "}
                            {BUSINESS_INFO.address.city}.
                        </p>
                        <p className="text-slate-400 text-sm">
                            {BUSINESS_INFO.license}
                        </p>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h2 className="font-semibold text-base mb-4 text-white">
                            Contacto
                        </h2>

                        <div className="space-y-3 text-sm text-slate-400">
                            <a
                                href={BUSINESS_INFO.contact.googleMaps}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-3 hover:text-white transition-colors focus:outline-none focus:underline"
                            >
                                <MapPin
                                    className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0"
                                    aria-hidden="true"
                                />
                                <span>
                                    {BUSINESS_INFO.address.street},{" "}
                                    {BUSINESS_INFO.address.city}
                                </span>
                            </a>

                            <a
                                href={BUSINESS_INFO.contact.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-3 hover:text-white transition-colors focus:outline-none focus:underline"
                            >
                                <Phone
                                    className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0"
                                    aria-hidden="true"
                                />
                                <span>{BUSINESS_INFO.contact.phone}</span>
                            </a>

                            <a
                                href={`mailto:${BUSINESS_INFO.contact.email}`}
                                className="flex items-start gap-3 hover:text-white transition-colors focus:outline-none focus:underline"
                            >
                                <Mail
                                    className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0"
                                    aria-hidden="true"
                                />
                                <span>{BUSINESS_INFO.contact.email}</span>
                            </a>
                        </div>
                    </div>

                    {/* SCHEDULE */}
                    <div>
                        <h2 className="font-semibold text-base mb-4 text-white">
                            Horarios
                        </h2>
                        <div className="space-y-2 text-sm text-slate-400">
                            <p>
                                <strong className="text-slate-300">
                                    Lunes a Viernes:
                                </strong>{" "}
                                {BUSINESS_INFO.schedule.weekdays}
                            </p>
                            <p>
                                <strong className="text-slate-300">
                                    Sábados:
                                </strong>{" "}
                                {BUSINESS_INFO.schedule.saturday}
                            </p>
                            <p className="text-primary-400 font-medium mt-3">
                                {BUSINESS_INFO.schedule.note}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
                    <p>
                        © {new Date().getFullYear()} {BUSINESS_INFO.legalName}.
                        Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
