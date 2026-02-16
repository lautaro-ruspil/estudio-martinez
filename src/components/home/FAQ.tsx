import { ChevronDown } from "lucide-react";
import { useScrollToSection } from "../../hooks/useScrollToSection";
import { faqList } from "../../data/faq";
import { useState, useRef, useCallback } from "react";

export function FAQ() {
    const scrollToSection = useScrollToSection();
    const [openId, setOpenId] = useState<string | null>(null);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Función memoizada para evitar recreaciones innecesarias
    const handleToggle = useCallback((id: string) => {
        setOpenId((prev) => (prev === id ? null : id));
    }, []);

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

                <div className="max-w-3xl mx-auto space-y-4" role="list">
                    {faqList.map((faq, index) => (
                        <FAQItem
                            key={faq.id}
                            faq={faq}
                            isOpen={openId === faq.id}
                            onToggle={handleToggle}
                            index={index}
                            buttonRefs={buttonRefs}
                            totalItems={faqList.length}
                        />
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

function FAQItem({
    faq,
    isOpen,
    onToggle,
    index,
    buttonRefs,
    totalItems,
}: {
    faq: (typeof faqList)[0];
    isOpen: boolean;
    onToggle: (id: string) => void;
    index: number;
    buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
    totalItems: number;
}) {
    const buttonId = `faq-button-${faq.id}`;
    const contentId = `faq-content-${faq.id}`;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                buttonRefs.current[(index + 1) % totalItems]?.focus();
                break;

            case "ArrowUp":
                e.preventDefault();
                buttonRefs.current[
                    (index - 1 + totalItems) % totalItems
                ]?.focus();
                break;

            case "Home":
                e.preventDefault();
                buttonRefs.current[0]?.focus();
                break;

            case "End":
                e.preventDefault();
                buttonRefs.current[totalItems - 1]?.focus();
                break;
        }
    };

    return (
        <div
            className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-shadow hover:shadow-md"
            role="listitem"
        >
            <button
                ref={(el) => {
                    buttonRefs.current[index] = el;
                }}
                id={buttonId}
                type="button"
                onClick={() => onToggle(faq.id)}
                onKeyDown={handleKeyDown}
                aria-expanded={isOpen}
                aria-controls={contentId}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
                <span
                    className={`font-semibold text-body ${
                        isOpen ? "text-slate-900" : "text-slate-700"
                    }`}
                >
                    {faq.question}
                </span>

                <ChevronDown
                    className={`w-5 h-5 text-slate-500 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                />
            </button>

            {/* Siempre renderizado (no condicional) para que los tests pasen */}
            <div
                id={contentId}
                role="region"
                aria-labelledby={buttonId}
                className={`overflow-hidden transition-all duration-300 px-6 border-t border-slate-200 bg-slate-50 ${
                    isOpen
                        ? "max-h-[1000px] opacity-100 py-5"
                        : "max-h-0 opacity-0 py-0"
                }`}
            >
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
        </div>
    );
}
