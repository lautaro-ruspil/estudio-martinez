import { useEffect, useRef } from "react";

/**
 * Hook para hacer focus trap en modales/menus móviles
 * Mantiene el foco dentro del elemento mientras está abierto
 */
export function useFocusTrap(isActive: boolean) {
    const elementRef = useRef<HTMLDivElement>(null);
    const previousElementRef = useRef<HTMLDivElement | null>(null);
    const previousIsActiveRef = useRef<boolean>(false);

    useEffect(() => {
        const element = elementRef.current;

        // Only setup if isActive changed or element changed
        const elementChanged = element !== previousElementRef.current;
        const isActiveChanged = isActive !== previousIsActiveRef.current;

        previousElementRef.current = element;
        previousIsActiveRef.current = isActive;

        if (!isActive || !element) return;
        if (!elementChanged && !isActiveChanged) return;

        const focusableElements = element.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])',
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus first element on open
        if (firstElement) {
            firstElement.focus();
        }

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
    });

    return elementRef;
}
