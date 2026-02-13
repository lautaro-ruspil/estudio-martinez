import { useEffect, useRef, useState } from "react";

interface UseCounterOptions {
    end: number;
    duration?: number;
}

export function useCounter({ end, duration = 1500 }: UseCounterOptions) {
    const [count, setCount] = useState<number>(0);
    const ref = useRef<HTMLDivElement | null>(null);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const rafRef = useRef<number | null>(null);

    const hasAnimatedRef = useRef(false);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        const element = ref.current;

        if (!element) return;
        if (hasAnimatedRef.current) return;

        const finalValue = Math.floor(end);

        const prefersReducedMotion =
            window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ??
            false;

        const handleIntersection: IntersectionObserverCallback = (entries) => {
            const entry = entries[0];

            if (!entry?.isIntersecting) return;
            if (hasAnimatedRef.current) return;

            hasAnimatedRef.current = true;

            // 🔥 CAMBIO CLAVE: Desconectar inmediatamente después de detectar visibilidad
            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            // Reduced motion o end = 0 → valor inmediato
            if (prefersReducedMotion || finalValue === 0) {
                setCount(finalValue);
                return;
            }

            const animate = (time: number) => {
                if (startTimeRef.current === null) {
                    startTimeRef.current = 0;
                }

                const elapsed = time - startTimeRef.current;
                const progress = Math.min(elapsed / duration, 1);

                const value = Math.floor(progress * finalValue);
                setCount(value);

                if (progress < 1) {
                    rafRef.current = requestAnimationFrame(animate);
                } else {
                    setCount(finalValue); // garantiza valor exacto
                }
            };

            rafRef.current = requestAnimationFrame(animate);
        };

        const ObserverConstructor = globalThis.IntersectionObserver as any;
        observerRef.current = new ObserverConstructor(handleIntersection);

        if (observerRef.current) {
            observerRef.current.observe(element);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
            observerRef.current = null;

            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [end, duration, ref.current]);

    return { count, ref };
}
