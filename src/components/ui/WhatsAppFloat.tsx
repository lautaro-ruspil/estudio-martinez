import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { BUSINESS_INFO } from "../../config/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function WhatsAppFloat() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {isExpanded && (
                <div className="absolute bottom-20 right-0 w-64 bg-white rounded-2xl shadow-2xl p-4 mb-2 animate-slide-down border border-slate-200">
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                        aria-label="Cerrar mensaje"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-whatsapp rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 text-sm mb-1">
                                Martínez & Asociados
                            </p>
                            <p className="text-xs text-slate-600 mb-3">
                                ¿Tenés alguna consulta? Escribinos y te
                                respondemos al instante.
                            </p>
                            <a
                                href={BUSINESS_INFO.contact.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-whatsapp text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-whatsapp-dark transition-colors"
                            >
                                Iniciar chat
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-16 h-16 bg-whatsapp hover:bg-whatsapp-dark text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
                aria-label="Contactar por WhatsApp"
            >
                <WhatsAppIcon className="w-8 h-8" aria-hidden="true" />

                {/* Pulse animation */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-whatsapp opacity-75 animate-ping" />
            </button>
        </div>
    );
}
