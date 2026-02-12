import type { LucideIcon } from "lucide-react";

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    popular: boolean;
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

export interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
}
