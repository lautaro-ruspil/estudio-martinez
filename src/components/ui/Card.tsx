import { type ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = "" }: CardProps) {
    return (
        <div
            className={`relative bg-white rounded-2xl border border-slate-200 shadow-soft transition-all duration-300 ${className}`}
        >
            {children}
        </div>
    );
}
