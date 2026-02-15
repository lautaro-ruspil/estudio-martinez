import { useCallback, useEffect, useRef, useState } from "react";

interface UseCounterOptions {
    end: number;
    duration?: number;
}

export function useCounter({ end, duration = 2000 }: UseCounterOptions) {
    const [count, setCount] = useState<number>(0);
    const [element, setElement] = useState<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const rafRef = useRef<number | null>(null);
    const hasAnimatedRef = useRef(false);

    // Callback ref to capture when element is set
    const ref = useCallback((node: HTMLDivElement | null) => {
        setElement(node);
    }, []);

    useEffect(() => {
        if (!element || hasAnimatedRef.current) return;

        const finalValue = Math.floor(end);
        const prefersReducedMotion =
            window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ??
            false;

        const handleIntersection: IntersectionObserverCallback = (entries) => {
            const entry = entries[0];
            if (!entry?.isIntersecting || hasAnimatedRef.current) return;

            hasAnimatedRef.current = true;
            observerRef.current?.disconnect();

            if (prefersReducedMotion || finalValue === 0) {
                setCount(finalValue);
                return;
            }

            const startTime = performance.now();

            const animate = () => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentValue = Math.floor(progress * finalValue);

                setCount(currentValue);

                if (progress < 1) {
                    rafRef.current = requestAnimationFrame(animate);
                } else {
                    setCount(finalValue);
                    rafRef.current = null;
                }
            };

            rafRef.current = requestAnimationFrame(animate);
        };

        observerRef.current = new IntersectionObserver(handleIntersection, {
            threshold: 0.3,
            rootMargin: "0px",
        });

        observerRef.current.observe(element);

        return () => {
            observerRef.current?.disconnect();
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [element, end, duration]);

    return { count, ref };
}
