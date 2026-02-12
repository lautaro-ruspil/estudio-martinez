import { useEffect, useRef } from "react";

/**
 * Hook para hacer focus trap en modales/menus móviles
 * Mantiene el foco dentro del elemento mientras está abierto
 */
export function useFocusTrap(isActive: boolean) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) return;

        const element = elementRef.current;
        if (!element) return;

        const focusableElements = element.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus first element on open
        firstElement?.focus();

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        document.addEventListener("keydown", handleTabKey);

        return () => {
            document.removeEventListener("keydown", handleTabKey);
        };
    }, [isActive]);

    return elementRef;
}
