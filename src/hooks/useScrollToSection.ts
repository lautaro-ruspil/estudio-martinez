import { useCallback } from "react";

export function useScrollToSection() {
    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        const navbarHeight = 80;
        const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
            top: elementPosition - navbarHeight,
            behavior: "smooth",
        });
    }, []);

    return scrollToSection;
}
