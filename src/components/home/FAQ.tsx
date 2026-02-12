import { ChevronDown } from "lucide-react";
import { useToggle } from "../../hooks/useToggle";
import { useScrollToSection } from "../../hooks/useScrollToSection";
import { faqList } from "../../data/faq";

export function FAQ() {
    const scrollToSection = useScrollToSection();

    return (
        <section
            id="preguntas"
            className="section-spacing bg-slate-50"
            aria-labelledby="faq-heading"
        >
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2
                        id="faq-heading"
                        className="text-h2 text-secondary-800 mb-4"
                    >
                        Preguntas Frecuentes
                    </h2>

                    <p className="text-body-lg text-slate-600 max-w-2xl mx-auto">
                        Resolvemos las dudas más habituales para que puedas
                        tomar decisiones con claridad y tranquilidad.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto" role="list">
                    {faqList.map((faq) => (
                        <FAQItem key={faq.id} faq={faq} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-600 mb-4">
                        ¿Tenés otra consulta específica?
                    </p>

                    <button
                        type="button"
                        onClick={() => scrollToSection("contacto")}
                        className="inline-flex items-center font-semibold text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                    >
                        Envíanos tu consulta →
                    </button>
                </div>
            </div>
        </section>
    );
}

function FAQItem({ faq }: { faq: (typeof faqList)[0] }) {
    const [isOpen, toggle] = useToggle(false);

    const buttonId = `faq-button-${faq.id}`;
    const contentId = `faq-content-${faq.id}`;

    return (
        <div className="border-b border-slate-200" role="listitem">
            <h3>
                <button
                    id={buttonId}
                    type="button"
                    onClick={toggle}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    className={`
                        w-full py-6 flex justify-between items-start text-left 
                        transition-all duration-200 rounded-md
                        hover:bg-slate-100
                        focus:outline-none focus-visible:outline 
                        focus-visible:outline-2 focus-visible:outline-slate-400
                    `}
                >
                    <span
                        className={`font-medium text-base md:text-lg transition-colors duration-200 ${
                            isOpen ? "text-slate-900" : "text-slate-700"
                        }`}
                    >
                        {faq.question}
                    </span>

                    <ChevronDown
                        className={`w-5 h-5 mt-1 transition-all duration-300 ${
                            isOpen
                                ? "rotate-180 text-slate-600"
                                : "text-slate-400"
                        }`}
                        aria-hidden="true"
                    />
                </button>
            </h3>

            <div
                id={contentId}
                role="region"
                aria-labelledby={buttonId}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="pb-6 pr-8 text-slate-600 leading-relaxed">
                    {faq.answer}
                </div>
            </div>
        </div>
    );
}
