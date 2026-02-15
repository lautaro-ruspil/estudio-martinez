import { ChevronDown } from "lucide-react";
import { useScrollToSection } from "../../hooks/useScrollToSection";
import { faqList } from "../../data/faq";
import { useState, useRef } from "react";

export function FAQ() {
    const scrollToSection = useScrollToSection();
    const [openId, setOpenId] = useState<string | null>(null);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
                            onToggle={() =>
                                setOpenId((prev) =>
                                    prev === faq.id ? null : faq.id,
                                )
                            }
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
    onToggle: () => void;
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
            role="listitem"
            className={`
                rounded-xl border transition-all duration-300
                ${
                    isOpen
                        ? "bg-white border-primary-300 shadow-medium"
                        : "bg-white border-slate-200 shadow-soft hover:shadow-medium"
                }
            `}
        >
            <h3>
                <button
                    id={buttonId}
                    type="button"
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    ref={(el) => {
                        buttonRefs.current[index] = el;
                    }}
                    onKeyDown={handleKeyDown}
                    className="
                        w-full px-6 py-6 flex justify-between items-start text-left
                        transition-all duration-200 rounded-xl
                        hover:bg-slate-50
                        focus:outline-none focus-visible:outline
                        focus-visible:outline-2 focus-visible:outline-primary-400
                    "
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
                                ? "rotate-180 text-primary-600"
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
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed">
                    {faq.answer}
                </div>
            </div>
        </div>
    );
}
