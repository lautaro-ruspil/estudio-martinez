import { useEffect, useRef, useState } from "react";

interface UseCounterOptions {
    end: number;
    duration?: number;
}

export function useCounter({ end, duration = 1500 }: UseCounterOptions) {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.4 },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!hasStarted) return;

        // Accesibilidad
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
            setCount(end);
            return;
        }

        let startTimestamp: number | null = null;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;

            const progress = timestamp - startTimestamp;
            const progressRatio = Math.min(progress / duration, 1);

            setCount(Math.floor(progressRatio * end));

            if (progress < duration) {
                requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(step);
    }, [hasStarted, end, duration]);

    return { count, ref };
}
