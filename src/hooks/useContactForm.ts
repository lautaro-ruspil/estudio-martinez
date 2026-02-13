import { useState } from "react";

interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
}

interface UseContactFormReturn {
    formData: FormData;
    errors: FormErrors;
    touched: Record<keyof FormData, boolean>;
    loading: boolean;
    isSubmitting: boolean;
    submitStatus: "idle" | "success" | "error";
    handleChange: (field: keyof FormData, value: string) => void;
    handleBlur: (field: keyof FormData) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    resetForm: () => void;
}

export function useContactForm(): UseContactFormReturn {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
        name: false,
        email: false,
        phone: false,
        message: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<
        "idle" | "success" | "error"
    >("idle");

    const validateField = (
        field: keyof FormData,
        value: string,
    ): string | undefined => {
        switch (field) {
            case "name": {
                const name = value.trim().replace(/\s+/g, " ");
                if (!name) return "Por favor ingresá tu nombre";
                if (name.length < 2 || name.length > 80)
                    return "El nombre debe tener entre 2 y 80 caracteres";
                const nameRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1' -]+$/;
                if (!nameRegex.test(name))
                    return "El nombre solo puede contener letras y espacios";
                return undefined;
            }

            case "email": {
                if (!value) return "Por favor ingresá tu email";
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return "Ingresá un email válido";
                return undefined;
            }

            case "phone": {
                if (!value) return "Por favor ingresá tu teléfono";
                // Primero verificar si contiene letras (caracteres inválidos)
                if (/[a-zA-Z]/.test(value))
                    return "El teléfono contiene caracteres inválidos";
                const digitsOnly = value.replace(/\D/g, "");
                if (digitsOnly.length < 8)
                    return "El teléfono debe tener al menos 8 dígitos";
                return undefined;
            }

            case "message": {
                if (!value) return "Por favor escribí tu mensaje";
                if (value.length < 20)
                    return "El mensaje debe tener al menos 20 caracteres";
                if (value.length > 1000) return "El mensaje es demasiado largo";
                if (/<[a-z][\s\S]*>/i.test(value))
                    return "No se permiten etiquetas HTML";
                return undefined;
            }

            default:
                return undefined;
        }
    };

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (touched[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: validateField(field, value),
            }));
        }
    };

    const handleBlur = (field: keyof FormData) => {
        setTouched((prev) => ({ ...prev, [field]: true }));

        setFormData((prev) => {
            let value = prev[field];
            if (field === "name") {
                value = value.trim().replace(/\s+/g, " ");
            }

            // Actualizar errores después de sanitizar
            setErrors((prevErrors) => ({
                ...prevErrors,
                [field]: validateField(field, value),
            }));

            return field === "name" ? { ...prev, name: value } : prev;
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Marcar todos los campos como touched
        setTouched({ name: true, email: true, phone: true, message: true });

        // Validar todos los campos
        const newErrors: FormErrors = {
            name: validateField("name", formData.name),
            email: validateField("email", formData.email),
            phone: validateField("phone", formData.phone),
            message: validateField("message", formData.message),
        };
        setErrors(newErrors);

        // Verificar si hay errores
        const hasErrors = Object.values(newErrors).some(Boolean);
        if (hasErrors) {
            return;
        }

        // Iniciar envío
        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            // Simular envío - puede fallar para testing (línea 96)
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Permitir testing del estado de error
                    if ((window as any).__TEST_FORCE_ERROR__) {
                        reject(new Error("Test error"));
                    } else {
                        resolve(undefined);
                    }
                }, 50);
            });
            setSubmitStatus("success");
            resetForm();
        } catch {
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: "", email: "", phone: "", message: "" });
        setErrors({});
        setTouched({ name: false, email: false, phone: false, message: false });
    };

    return {
        formData,
        errors,
        touched,
        loading: isSubmitting,
        isSubmitting,
        submitStatus,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
    };
}
