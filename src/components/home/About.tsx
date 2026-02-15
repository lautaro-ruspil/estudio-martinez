import { BUSINESS_INFO } from "../../config/site";
import RobertoMartinezPhoto from "../../assets/roberto-martinez.webp";
import { useCounter } from "../../hooks/useCounter";

export function About() {
    const clientsCounter = useCounter({ end: 120 });
    const yearsCounter = useCounter({ end: 30 });

    return (
        <section
            id="nosotros"
            className="bg-slate-50 scroll-mt-28 min-h-[calc(100vh-90px)] flex items-center"
            aria-labelledby="about-heading"
        >
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Columna izquierda */}
                    <div className="flex justify-center lg:justify-start">
                        <div className="bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl p-10 shadow-lg max-w-sm w-full text-center">
                            <img
                                src={RobertoMartinezPhoto}
                                alt={`${BUSINESS_INFO.owner}, ${BUSINESS_INFO.title}`}
                                className="w-52 h-52 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-md"
                                loading="lazy"
                                decoding="async"
                                width="208"
                                height="208"
                                sizes="(max-width: 640px) 160px, 208px"
                            />

                            <h3 className="text-xl font-semibold text-slate-900">
                                {BUSINESS_INFO.owner}
                            </h3>

                            <p className="text-base text-slate-700">
                                {BUSINESS_INFO.title}
                            </p>

                            <p className="text-sm text-slate-600 mt-1">
                                {BUSINESS_INFO.license}
                            </p>
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="max-w-2xl">
                        <h2
                            id="about-heading"
                            className="font-bold text-secondary-900 mb-6 leading-tight
              text-[clamp(2rem,2.5vw+1rem,3rem)]"
                        >
                            Más de {BUSINESS_INFO.experience} años acompañando a
                            emprendedores de {BUSINESS_INFO.address.city}
                        </h2>

                        <div className="space-y-5 text-slate-700 leading-relaxed text-[clamp(1rem,0.4vw+0.9rem,1.125rem)]">
                            <p>
                                Fundé este estudio en{" "}
                                {BUSINESS_INFO.established} con una visión
                                clara: ofrecer un servicio contable cercano,
                                transparente y profesional para comerciantes y
                                empresas locales.
                            </p>

                            <p>
                                A lo largo de estos años acompañamos a más de{" "}
                                {BUSINESS_INFO.clientCount}
                                negocios, ayudándolos a crecer con seguridad
                                fiscal y planificación estratégica.
                            </p>

                            <p>
                                Creemos en explicar cada trámite en lenguaje
                                simple, en estar disponibles cuando nuestros
                                clientes nos necesitan y en generar relaciones
                                de largo plazo basadas en confianza.
                            </p>
                        </div>

                        <div className="mt-8 flex gap-12">
                            <div ref={clientsCounter.ref}>
                                <div className="text-4xl md:text-5xl font-extrabold text-primary-600 leading-none">
                                    {clientsCounter.count}+
                                </div>
                                <div className="text-xs uppercase tracking-wider text-slate-600 mt-1">
                                    Clientes activos
                                </div>
                            </div>

                            <div ref={yearsCounter.ref}>
                                <div className="text-4xl md:text-5xl font-extrabold text-primary-600 leading-none">
                                    {yearsCounter.count}
                                </div>
                                <div className="text-xs uppercase tracking-wider text-slate-600 mt-1">
                                    Años de trayectoria
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
