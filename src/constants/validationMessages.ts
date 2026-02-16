// Extraer mensajes a constante
export const VALIDATION_MESSAGES = {
    name: {
        required: "Por favor ingresá tu nombre",
        length: "El nombre debe tener entre 2 y 80 caracteres",
        invalid: "El nombre solo puede contener letras y espacios",
    },
    email: {
        required: "Por favor ingresá tu email",
        invalid: "Ingresá un email válido",
    },
    phone: {
        required: "Por favor ingresá tu teléfono",
        hasLetters: "El teléfono contiene caracteres inválidos",
        tooShort: "El teléfono debe tener al menos 8 dígitos",
    },
    message: {
        required: "Por favor escribí tu mensaje",
        tooShort: "El mensaje debe tener al menos 20 caracteres",
        tooLong: "El mensaje es demasiado largo",
        noHtml: "No se permiten etiquetas HTML",
    },
} as const;
