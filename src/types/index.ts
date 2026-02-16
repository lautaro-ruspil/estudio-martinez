// types/index.ts - VERSIÓN CORREGIDA

import type { LucideIcon } from "lucide-react";

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    popular?: boolean; // ✅ FIX: Opcional (Problema #14)
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

// Type helper para errores
export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;
