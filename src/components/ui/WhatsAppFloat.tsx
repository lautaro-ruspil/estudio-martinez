import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { BUSINESS_INFO } from "../../config/site";
import { ICON_SIZES } from "../../constants/iconSizes";
import { WhatsAppIcon } from "./WhatsAppIcon";

/**
 * Botón flotante de WhatsApp con efecto pulse
 * Cumple WCAG 2.1 AA con aria-label descriptivo
 */
export function WhatsAppFloat() {
    const [showPulse, setShowPulse] = useState(false);

    const message = encodeURIComponent(
        "Hola, me gustaría obtener más información sobre sus servicios contables.",
    );
    const whatsappUrl = `${BUSINESS_INFO.contact.whatsapp}?text=${message}`;

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPulse(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="fixed bottom-6 right-6 z-40 group"
        >
            {/* Pulse effect - solo después de 5 segundos */}
            {showPulse && (
                <span className="absolute inset-0 bg-whatsapp rounded-full animate-ping opacity-75" />
            )}

            {/* Button */}
            <div className="relative bg-whatsapp hover:bg-whatsapp-dark text-white rounded-full p-4 shadow-strong transition-all duration-300 hover:scale-110">
                <WhatsAppIcon className={`${ICON_SIZES.lg} text-white`} />
            </div>
        </a>
    );
}
