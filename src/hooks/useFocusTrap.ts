import { useEffect, useRef } from "react";

/**
 * Hook para hacer focus trap en modales/menus móviles
 * Mantiene el foco dentro del elemento mientras está abierto
 */
export function useFocusTrap(isActive: boolean) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) return;

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;

            const element = elementRef.current;
            if (!element) return;

            const focusableElements = element.querySelectorAll<HTMLElement>(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])',
            );

            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

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

        // 🔥 Focus inicial (después de montar)
        const element = elementRef.current;
        if (element) {
            const focusableElements = element.querySelectorAll<HTMLElement>(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])',
            );

            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }

        return () => {
            document.removeEventListener("keydown", handleTabKey);
        };
    }, [isActive]);

    return elementRef;
}
