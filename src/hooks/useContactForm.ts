import { useState, useCallback, useEffect } from "react";
import type { ContactFormData, FormErrors } from "../types";

/* ===============================
   VALIDATION RULES
================================= */

const NAME_REGEX =
    /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[\s'-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const PHONE_ALLOWED_CHARS = /^[0-9+\-()\s]+$/;

/* ===============================
   HELPERS
================================= */

function sanitizeText(value: string) {
    return value.replace(/\s+/g, " ").trim();
}

function containsHTML(value: string) {
    return /<\/?[a-z][\s\S]*>/i.test(value);
}

function countDigits(value: string) {
    return (value.match(/\d/g) || []).length;
}

/* ===============================
   HOOK
================================= */

export function useContactForm() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
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

    /* ===============================
       FIELD VALIDATION
    ================================= */

    const validateField = useCallback(
        (field: keyof ContactFormData, value: string): string | undefined => {
            const sanitized = sanitizeText(value);

            switch (field) {
                case "name":
                    if (!sanitized) return "Por favor ingresá tu nombre";

                    if (sanitized.length < 2 || sanitized.length > 80)
                        return "El nombre debe tener entre 2 y 80 caracteres";

                    if (!NAME_REGEX.test(sanitized))
                        return "El nombre solo puede contener letras y espacios";

                    return undefined;

                case "email":
                    if (!sanitized) return "Por favor ingresá tu email";

                    if (sanitized.length > 120)
                        return "El email es demasiado largo";

                    if (!EMAIL_REGEX.test(sanitized))
                        return "Ingresá un email válido";

                    return undefined;

                case "phone":
                    if (!sanitized) return "Por favor ingresá tu teléfono";

                    if (!PHONE_ALLOWED_CHARS.test(sanitized))
                        return "El teléfono contiene caracteres inválidos";

                    if (countDigits(sanitized) < 8)
                        return "El teléfono debe tener al menos 8 dígitos";

                    return undefined;

                case "message":
                    if (!sanitized) return "Por favor escribí tu mensaje";

                    if (sanitized.length < 20)
                        return "El mensaje debe tener al menos 20 caracteres";

                    if (sanitized.length > 1000)
                        return "El mensaje es demasiado largo";

                    if (containsHTML(sanitized))
                        return "No se permiten etiquetas HTML";

                    if (/^(.)\1{15,}$/.test(sanitized))
                        return "El mensaje no es válido";

                    return undefined;

                default:
                    return undefined;
            }
        },
        [],
    );

    /* ===============================
       VALIDATE FORM
    ================================= */

    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        (Object.keys(formData) as Array<keyof ContactFormData>).forEach(
            (field) => {
                const error = validateField(field, formData[field]);
                if (error) newErrors[field] = error;
            },
        );

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }, [formData, validateField]);

    /* ===============================
       HANDLERS
    ================================= */

    const handleChange = useCallback(
        (field: keyof ContactFormData, value: string) => {
            // NO sanitizar durante la escritura, solo guardar el valor
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));

            if (touched[field]) {
                // Validar con el valor sanitizado, pero NO actualizar el campo con él
                const sanitized = sanitizeText(value);
                const error = validateField(field, sanitized);
                setErrors((prev) => ({
                    ...prev,
                    [field]: error,
                }));
            }
        },
        [touched, validateField],
    );

    const handleBlur = useCallback(
        (field: keyof ContactFormData) => {
            // Sanitizar SOLO cuando el usuario sale del campo
            const sanitized = sanitizeText(formData[field]);
            setFormData((prev) => ({
                ...prev,
                [field]: sanitized,
            }));

            setTouched((prev) => ({ ...prev, [field]: true }));
            const error = validateField(field, sanitized);
            setErrors((prev) => ({
                ...prev,
                [field]: error,
            }));
        },
        [formData, validateField],
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const allTouched = {
                name: true,
                email: true,
                phone: true,
                message: true,
            };

            setTouched(allTouched);

            if (!validateForm()) return;

            setIsSubmitting(true);
            setSubmitStatus("idle");

            try {
                await new Promise((resolve) => setTimeout(resolve, 1500));

                setSubmitStatus("success");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    message: "",
                });
                setTouched({
                    name: false,
                    email: false,
                    phone: false,
                    message: false,
                });
                setErrors({});
            } catch {
                setSubmitStatus("error");
            } finally {
                setIsSubmitting(false);
            }
        },
        [validateForm],
    );

    useEffect(() => {
        if (submitStatus === "success") {
            const timer = setTimeout(() => {
                setSubmitStatus("idle");
            }, 5000); // 5 segundos

            return () => clearTimeout(timer);
        }
    }, [submitStatus]);

    return {
        formData,
        errors,
        touched,
        isSubmitting,
        submitStatus,
        handleSubmit,
        handleChange,
        handleBlur,
    };
}
