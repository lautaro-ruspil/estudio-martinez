import { useState, useCallback, useRef, useEffect } from "react";
import type { ContactFormData, ContactFormErrors } from "../types/index";
import { VALIDATION_MESSAGES } from "../constants/validationMessages";
import { logger } from "../utils/logger";

interface UseContactFormReturn {
    formData: ContactFormData;
    errors: ContactFormErrors;
    touched: Record<keyof ContactFormData, boolean>;
    isSubmitting: boolean;
    submitStatus: "idle" | "success" | "error";
    handleChange: (field: keyof ContactFormData, value: string) => void;
    handleBlur: (field: keyof ContactFormData) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    resetForm: () => void;
}

/**
 * Valida un email con reglas más estrictas pero mantenibles.
 *
 * Criterios:
 * - Longitud máxima 254 caracteres (RFC estándar)
 * - Un solo "@"
 * - No puntos consecutivos
 * - Dominio con al menos un punto
 * - TLD mínimo 2 caracteres
 * - No permite comenzar o terminar con punto
 */
const isValidEmail = (email: string): boolean => {
    if (!email || email.length > 254) return false;

    // Debe contener un solo "@"
    const parts = email.split("@");
    if (parts.length !== 2) return false;

    const [localPart, domain] = parts;

    if (!localPart || !domain) return false;

    // No puntos consecutivos
    if (email.includes("..")) return false;

    // No comenzar o terminar con punto
    if (
        localPart.startsWith(".") ||
        localPart.endsWith(".") ||
        domain.startsWith(".") ||
        domain.endsWith(".")
    ) {
        return false;
    }

    // Validación estructural
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) return false;

    // Dominio no puede comenzar ni terminar con guion
    const domainParts = domain.split(".");
    for (const part of domainParts) {
        if (part.startsWith("-") || part.endsWith("-")) {
            return false;
        }
    }

    return true;
};

const validateField = (
    field: keyof ContactFormData,
    value: string,
): string | undefined => {
    const sanitizedValue = sanitizeField(field, value);

    switch (field) {
        case "name": {
            if (!sanitizedValue) return VALIDATION_MESSAGES.name.required;
            if (sanitizedValue.length < 2 || sanitizedValue.length > 80)
                return VALIDATION_MESSAGES.name.length;
            const nameRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1' -]+$/;
            if (!nameRegex.test(sanitizedValue))
                return VALIDATION_MESSAGES.name.invalid;
            return undefined;
        }

        case "email": {
            if (!sanitizedValue) return VALIDATION_MESSAGES.email.required;

            if (!isValidEmail(sanitizedValue))
                return VALIDATION_MESSAGES.email.invalid;

            return undefined;
        }

        case "phone": {
            if (!sanitizedValue) return VALIDATION_MESSAGES.phone.required;
            if (/[a-zA-Z]/.test(sanitizedValue))
                return VALIDATION_MESSAGES.phone.hasLetters;
            const digitsOnly = sanitizedValue.replace(/\D/g, "");
            if (digitsOnly.length < 8)
                return VALIDATION_MESSAGES.phone.tooShort;
            return undefined;
        }

        case "message": {
            if (!sanitizedValue) return VALIDATION_MESSAGES.message.required;
            if (sanitizedValue.length < 20)
                return VALIDATION_MESSAGES.message.tooShort;
            if (sanitizedValue.length > 1000)
                return VALIDATION_MESSAGES.message.tooLong;
            if (/<[a-z][\s\S]*>/i.test(sanitizedValue))
                return VALIDATION_MESSAGES.message.noHtml;
            return undefined;
        }

        default:
            return undefined;
    }
};

const sanitizeField = (field: keyof ContactFormData, value: string): string => {
    switch (field) {
        case "name":
            return value.trim().replace(/\s+/g, " ");
        case "email":
            return value.trim();
        case "phone":
            return value.trim();
        case "message":
            return value.trim();
        default:
            return value;
    }
};

export function useContactForm(): UseContactFormReturn {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [errors, setErrors] = useState<ContactFormErrors>({});

    const [touched, setTouched] = useState<
        Record<keyof ContactFormData, boolean>
    >({
        name: false,
        email: false,
        phone: false,
        message: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<
        "idle" | "success" | "error"
    >("idle");

    // useRef para evitar stale closures
    const touchedRef = useRef(touched);
    touchedRef.current = touched;

    // Ref para trackear si hay submit en progreso
    const submitInProgressRef = useRef(false);

    // Ref para cancelar reset si usuario está escribiendo
    // Usar number en vez de NodeJS.Timeout (compatible con browser)
    const resetTimeoutRef = useRef<number | null>(null);

    const handleChange = useCallback(
        (field: keyof ContactFormData, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));

            if (touchedRef.current[field]) {
                setErrors((prev) => ({
                    ...prev,
                    [field]: validateField(field, value),
                }));
            }

            // Si usuario está escribiendo, cancelar reset pendiente
            if (resetTimeoutRef.current !== null) {
                clearTimeout(resetTimeoutRef.current);
                resetTimeoutRef.current = null;
            }
        },
        [],
    );

    const handleBlur = useCallback((field: keyof ContactFormData) => {
        setTouched((prev) => ({ ...prev, [field]: true }));

        setFormData((prev) => {
            const sanitizedValue = sanitizeField(field, prev[field]);
            const error = validateField(field, sanitizedValue);

            setErrors((prevErrors) => ({
                ...prevErrors,
                [field]: error,
            }));

            return { ...prev, [field]: sanitizedValue };
        });
    }, []);

    const handleSubmit = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            // Guard más robusto con ref
            if (isSubmitting || submitInProgressRef.current) {
                logger.warn(
                    "[useContactForm] Submit already in progress, ignoring",
                );
                return;
            }

            // Cancelar cualquier reset pendiente
            if (resetTimeoutRef.current !== null) {
                clearTimeout(resetTimeoutRef.current);
                resetTimeoutRef.current = null;
            }

            // Marcar todos los campos como touched
            setTouched({ name: true, email: true, phone: true, message: true });

            // Validar todos los campos
            const currentFormData = formData;
            const newErrors: ContactFormErrors = {
                name: validateField("name", currentFormData.name),
                email: validateField("email", currentFormData.email),
                phone: validateField("phone", currentFormData.phone),
                message: validateField("message", currentFormData.message),
            };

            setErrors(newErrors);

            const hasErrors = Object.values(newErrors).some(Boolean);
            if (hasErrors) {
                return;
            }

            // Marcar submit en progreso ANTES de setState
            submitInProgressRef.current = true;
            setIsSubmitting(true);

            // Solo resetear submitStatus si NO está en success/error
            if (submitStatus !== "idle") {
                setSubmitStatus("idle");
            }

            try {
                // Simular envío
                await new Promise<void>((resolve, reject) => {
                    setTimeout(() => {
                        if ((window as any).__TEST_FORCE_ERROR__) {
                            reject(new Error("Test error"));
                        } else {
                            resolve();
                        }
                    }, 50);
                });

                setSubmitStatus("success");

                // ✅ FIX: Reset con delay MÁS LARGO y cancelable
                resetTimeoutRef.current = window.setTimeout(() => {
                    // ✅ FIX: Verificar si usuario NO está escribiendo
                    if (!submitInProgressRef.current) {
                        setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            message: "",
                        });
                        setErrors({});
                        setTouched({
                            name: false,
                            email: false,
                            phone: false,
                            message: false,
                        });
                        setSubmitStatus("idle");
                        resetTimeoutRef.current = null;
                    }
                }, 3000); // ✅ 3 segundos para que usuario vea el mensaje
            } catch (error) {
                logger.error("Form submission error:", error);
                setSubmitStatus("error");

                // ✅ Error también resetea después de un tiempo
                resetTimeoutRef.current = window.setTimeout(() => {
                    setSubmitStatus("idle");
                    resetTimeoutRef.current = null;
                }, 5000); // 5 segundos para errores
            } finally {
                setIsSubmitting(false);
                submitInProgressRef.current = false;
            }
        },
        [formData, isSubmitting, submitStatus],
    );

    const resetForm = useCallback(() => {
        // ✅ FIX: Cancelar timeout pendiente
        if (resetTimeoutRef.current !== null) {
            clearTimeout(resetTimeoutRef.current);
            resetTimeoutRef.current = null;
        }

        setFormData({ name: "", email: "", phone: "", message: "" });
        setErrors({});
        setTouched({ name: false, email: false, phone: false, message: false });
        setSubmitStatus("idle");
        submitInProgressRef.current = false;
    }, []);

    // ✅ FIX: Cleanup en unmount
    useEffect(() => {
        return () => {
            if (resetTimeoutRef.current !== null) {
                clearTimeout(resetTimeoutRef.current);
            }
        };
    }, []);

    return {
        formData,
        errors,
        touched,
        isSubmitting,
        submitStatus,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
    };
}
