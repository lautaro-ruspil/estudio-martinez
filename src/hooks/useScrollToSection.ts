import { useCallback } from "react";
import { logger } from "../utils/logger";

/**
 * Hook para scroll suave a secciones, calculando offset del navbar dinámicamente.
 *
 * @returns Función para hacer scroll a una sección por ID
 *
 * @example
 * ```tsx
 * const scrollToSection = useScrollToSection();
 * <button onClick={() => scrollToSection('contacto')}>Contacto</button>
 * ```
 */
export function useScrollToSection() {
    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (!element) {
            logger.warn(`Section with id "${sectionId}" not found`);
            return;
        }

        // Calcular altura del navbar dinámicamente
        const navbar = document.querySelector("#main-navbar");
        const navbarHeight = navbar?.getBoundingClientRect().height ?? 80;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
            elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
    }, []);

    return scrollToSection;
}
