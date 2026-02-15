import { useCallback } from "react";

export function useScrollToSection() {
    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        // Habilitar smooth scroll temporalmente
        document.documentElement.classList.add("smooth-scroll");

        // Calcular altura del navbar dinámicamente
        const navbar = document.querySelector("nav");

        const navbarHeight = navbar ? navbar.offsetHeight : 80;

        // Agregar padding extra para mobile (mejor UX)
        const isMobile = window.innerWidth < 768;
        const extraPadding = isMobile ? 16 : 8;

        const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
            top: elementPosition - navbarHeight - extraPadding,
            behavior: "smooth",
        });

        // Desactivar smooth scroll después de la animación
        setTimeout(() => {
            document.documentElement.classList.remove("smooth-scroll");
        }, 1000);
    }, []);

    return scrollToSection;
}
