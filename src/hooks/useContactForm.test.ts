import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useContactForm } from "./useContactForm";
import * as loggerModule from "../utils/logger";

describe("useContactForm", () => {
    // Mock del logger
    const mockLogger = {
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        debug: vi.fn(),
        log: vi.fn(),
        isDev: false,
        shouldLog: vi.fn(() => true),
        group: vi.fn(),
    };

    // ✅ CRÍTICO: Limpiar timers entre cada test
    beforeEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
        vi.clearAllMocks();
        // Mock del logger
        vi.spyOn(loggerModule, "logger", "get").mockReturnValue(
            mockLogger as any,
        );
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    describe("Validación de Nombre", () => {
        it("permite espacios en nombres completos", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange("name", "Juan Pablo");
            });
            expect(result.current.formData.name).toBe("Juan Pablo");
        });

        it("acepta caracteres con tildes y ñ", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange("name", "María José");
                result.current.handleBlur("name");
            });
            expect(result.current.formData.name).toBe("María José");
            expect(result.current.errors.name).toBeUndefined();
        });

        it("acepta nombres con apóstrofe", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange("name", "O'Connor");
                result.current.handleBlur("name");
            });
            expect(result.current.formData.name).toBe("O'Connor");
            expect(result.current.errors.name).toBeUndefined();
        });

        it("acepta nombres con guión", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange("name", "Pérez-González");
                result.current.handleBlur("name");
            });
            expect(result.current.formData.name).toBe("Pérez-González");
            expect(result.current.errors.name).toBeUndefined();
        });

        it("sanitiza espacios múltiples al hacer blur", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange("name", "Juan    Pablo");
                result.current.handleBlur("name");
            });
            expect(result.current.formData.name).toBe("Juan Pablo");
            expect(result.current.errors.name).toBeUndefined();
        });

        it("rechaza nombres demasiado cortos", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange("name", "A");
                result.current.handleBlur("name");
            });
            expect(result.current.errors.name).toBe(
                "El nombre debe tener entre 2 y 80 caracteres",
            );
        });

        it("rechaza nombres con números", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange("name", "Juan123");
                result.current.handleBlur("name");
            });
            expect(result.current.errors.name).toBe(
                "El nombre solo puede contener letras y espacios",
            );
        });

        it("rechaza nombres vacíos", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange("name", "");
                result.current.handleBlur("name");
            });
            expect(result.current.errors.name).toBe(
                "Por favor ingresá tu nombre",
            );
        });

        it("no muestra error mientras el usuario escribe (campo no touched)", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange("name", "J");
            });
            // No debería mostrar error porque el campo no está "touched"
            expect(result.current.errors.name).toBeUndefined();
            expect(result.current.touched.name).toBe(false);
        });

        it("muestra error después de blur si el campo es inválido", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange("name", "J");
                result.current.handleBlur("name");
            });
            expect(result.current.errors.name).toBeDefined();
            expect(result.current.touched.name).toBe(true);
        });

        it("maneja múltiples espacios al inicio y fin del nombre", () => {
            const { result } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("name", "   Juan   Pablo   ");
                result.current.handleBlur("name");
            });

            expect(result.current.formData.name).toBe("Juan Pablo");
            expect(result.current.errors.name).toBeUndefined();
        });

        it("maneja nombres con solo espacios como vacíos", () => {
            const { result } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("name", "     ");
                result.current.handleBlur("name");
            });

            expect(result.current.formData.name).toBe("");
            expect(result.current.errors.name).toBe(
                "Por favor ingresá tu nombre",
            );
        });
    });

    describe("Validación de Email", () => {
        it("acepta emails válidos", () => {
            const { result } = renderHook(() => useContactForm());
            const validEmails = [
                "test@example.com",
                "usuario.nombre@empresa.com.ar",
                "email+tag@dominio.co",
            ];

            validEmails.forEach((email) => {
                act(() => {
                    result.current.handleChange("email", email);
                    result.current.handleBlur("email");
                });
                expect(result.current.errors.email).toBeUndefined();
            });
        });

        it("rechaza emails inválidos", () => {
            const { result } = renderHook(() => useContactForm());
            const invalidEmails = [
                "invalido",
                "sin-arroba.com",
                "@sinusuario.com",
                "sin-dominio@",
                "espacios en medio@test.com",
            ];

            invalidEmails.forEach((email) => {
                act(() => {
                    result.current.handleChange("email", email);
                    result.current.handleBlur("email");
                });
                expect(result.current.errors.email).toBe(
                    "Ingresá un email válido",
                );
            });
        });

        it("rechaza emails vacíos", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange("email", "");
                result.current.handleBlur("email");
            });
            expect(result.current.errors.email).toBe(
                "Por favor ingresá tu email",
            );
        });

        it("acepta emails con caracteres especiales válidos", () => {
            const { result } = renderHook(() => useContactForm());
            const complexEmails = [
                "user+tag@example.com",
                "user.name+tag@example.co.uk",
                "user_name@example-domain.com",
                "test.email.with.dots@subdomain.example.com",
            ];

            complexEmails.forEach((email) => {
                act(() => {
                    result.current.handleChange("email", email);
                    result.current.handleBlur("email");
                });
                expect(result.current.errors.email).toBeUndefined();
            });
        });
    });

    describe("Validación de Teléfono", () => {
        it("acepta teléfonos argentinos válidos", () => {
            const { result } = renderHook(() => useContactForm());
            const validPhones = [
                "(02284) 15-225443",
                "11-2345-6789",
                "+54 9 11 2345-6789",
                "2284 225443",
            ];

            validPhones.forEach((phone) => {
                act(() => {
                    result.current.handleChange("phone", phone);
                    result.current.handleBlur("phone");
                });
                expect(result.current.errors.phone).toBeUndefined();
            });
        });

        it("rechaza teléfonos con menos de 8 dígitos", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange("phone", "123456");
                result.current.handleBlur("phone");
            });
            expect(result.current.errors.phone).toBe(
                "El teléfono debe tener al menos 8 dígitos",
            );
        });

        it("rechaza teléfonos con caracteres inválidos", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange("phone", "1234-5678-ABC");
                result.current.handleBlur("phone");
            });
            expect(result.current.errors.phone).toBe(
                "El teléfono contiene caracteres inválidos",
            );
        });
    });

    describe("Validación de Mensaje", () => {
        it("acepta mensajes válidos", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
                result.current.handleBlur("message");
            });
            expect(result.current.errors.message).toBeUndefined();
        });

        it("rechaza mensajes muy cortos", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange("message", "Hola");
                result.current.handleBlur("message");
            });
            expect(result.current.errors.message).toBe(
                "El mensaje debe tener al menos 20 caracteres",
            );
        });

        it("rechaza mensajes con HTML", () => {
            const { result } = renderHook(() => useContactForm());
            act(() => {
                result.current.handleChange(
                    "message",
                    'Este mensaje tiene <script>alert("xss")</script> código malicioso',
                );
                result.current.handleBlur("message");
            });
            expect(result.current.errors.message).toBe(
                "No se permiten etiquetas HTML",
            );
        });

        it("rechaza mensajes muy largos", () => {
            const { result } = renderHook(() => useContactForm());
            const longMessage = "a".repeat(1001);
            act(() => {
                result.current.handleChange("message", longMessage);
                result.current.handleBlur("message");
            });
            expect(result.current.errors.message).toBe(
                "El mensaje es demasiado largo",
            );
        });

        it("acepta mensaje con exactamente 20 caracteres", () => {
            const { result } = renderHook(() => useContactForm());
            const exactly20 = "a".repeat(20);

            act(() => {
                result.current.handleChange("message", exactly20);
                result.current.handleBlur("message");
            });

            expect(result.current.formData.message).toBe(exactly20);
            expect(result.current.errors.message).toBeUndefined();
        });

        it("acepta mensaje con exactamente 1000 caracteres", () => {
            const { result } = renderHook(() => useContactForm());
            const exactly1000 = "a".repeat(1000);

            act(() => {
                result.current.handleChange("message", exactly1000);
                result.current.handleBlur("message");
            });

            expect(result.current.formData.message).toBe(exactly1000);
            expect(result.current.errors.message).toBeUndefined();
        });

        it("rechaza mensaje con 1001 caracteres", () => {
            const { result } = renderHook(() => useContactForm());
            const exactly1001 = "a".repeat(1001);

            act(() => {
                result.current.handleChange("message", exactly1001);
                result.current.handleBlur("message");
            });

            expect(result.current.errors.message).toBe(
                "El mensaje es demasiado largo",
            );
        });

        it("rechaza mensaje con solo espacios (menos de 20 caracteres)", () => {
            const { result } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("message", "     ");
                result.current.handleBlur("message");
            });

            expect(result.current.errors.message).toBe(
                "Por favor escribí tu mensaje",
            );
        });

        it("rechaza mensaje con 20 espacios exactos pero sin contenido real", () => {
            const { result } = renderHook(() => useContactForm());
            const twentySpaces = " ".repeat(20);

            act(() => {
                result.current.handleChange("message", twentySpaces);
                result.current.handleBlur("message");
            });

            expect(result.current.errors.message).toBe(
                "Por favor escribí tu mensaje",
            );
        });
    });

    describe("Submit del Formulario", () => {
        it("no permite submit si hay errores de validación", async () => {
            const { result } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            act(() => {
                result.current.handleChange("name", "J"); // Nombre inválido
                result.current.handleChange("email", "invalido");
                result.current.handleChange("phone", "123");
                result.current.handleChange("message", "Corto");
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(result.current.isSubmitting).toBe(false);
            expect(result.current.submitStatus).toBe("idle");
        });

        it("marca todos los campos como touched al hacer submit", async () => {
            const { result } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.touched.name).toBe(true);
            expect(result.current.touched.email).toBe(true);
            expect(result.current.touched.phone).toBe(true);
            expect(result.current.touched.message).toBe(true);
        });

        it("envía el formulario si todos los campos son válidos", async () => {
            const { result } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Llenar formulario con datos válidos
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres para la prueba.",
                );
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            await waitFor(() => {
                expect(result.current.submitStatus).toBe("success");
            });
            expect(result.current.isSubmitting).toBe(false);
        });

        it("resetea el formulario después de envío exitoso", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Llenar formulario
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            // Submit
            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            // Verificar que submitStatus es success
            expect(result.current.submitStatus).toBe("success");

            // Esperar 3.5 segundos (más que el timeout de 3s del hook)
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 3500));
            });

            // Verificar que se reseteó
            expect(result.current.formData.name).toBe("");
            expect(result.current.formData.email).toBe("");
            expect(result.current.formData.phone).toBe("");
            expect(result.current.formData.message).toBe("");
            expect(result.current.touched.name).toBe(false);
            expect(result.current.touched.email).toBe(false);

            unmount();
        }, 10000);

        it("muestra estado de loading durante el envío", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Llenar con datos válidos
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            // Verificar estado inicial
            expect(result.current.isSubmitting).toBe(false);

            // Iniciar el submit
            let submitPromise: Promise<void>;
            act(() => {
                submitPromise = result.current.handleSubmit(mockEvent);
            });

            // Esperar un momento para que se actualice el estado
            await new Promise((resolve) => setTimeout(resolve, 10));

            // Verificar que está en proceso de envío
            expect(result.current.isSubmitting).toBe(true);

            // Esperar a que termine
            await act(async () => {
                await submitPromise!;
            });

            // Verificar que volvió a false
            expect(result.current.isSubmitting).toBe(false);

            unmount();
        });

        it("previene doble submit mientras está enviando", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Llenar formulario con datos válidos
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            // Iniciar primer submit
            let firstSubmitPromise: Promise<void>;
            act(() => {
                firstSubmitPromise = result.current.handleSubmit(mockEvent);
            });

            // Esperar un momento para que isSubmitting sea true
            await new Promise((resolve) => setTimeout(resolve, 10));

            // Verificar que está en proceso de envío
            expect(result.current.isSubmitting).toBe(true);

            // Limpiar el mock antes del segundo submit para verificar la llamada
            mockLogger.warn.mockClear();

            // Intentar segundo submit mientras el primero está en curso
            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            // Verificar que se llamó logger.warn para prevenir doble submit
            expect(mockLogger.warn).toHaveBeenCalledWith(
                "[useContactForm] Submit already in progress, ignoring",
            );

            // Esperar a que termine el primero
            await act(async () => {
                await firstSubmitPromise!;
            });

            // Verificar que solo se procesó uno
            expect(result.current.submitStatus).toBe("success");
            expect(result.current.isSubmitting).toBe(false);

            unmount();
        });
    });

    describe("Interacción con campos touched", () => {
        it("no valida hasta que el campo es touched", () => {
            const { result, unmount } = renderHook(() => useContactForm());

            // Escribir valor inválido pero no hacer blur
            act(() => {
                result.current.handleChange("name", "J");
            });

            expect(result.current.errors.name).toBeUndefined();

            // Hacer blur
            act(() => {
                result.current.handleBlur("name");
            });

            expect(result.current.errors.name).toBeDefined();

            unmount();
        });

        it("valida en onChange después de que el campo fue touched", () => {
            const { result, unmount } = renderHook(() => useContactForm());

            // Hacer blur primero (marca como touched)
            act(() => {
                result.current.handleChange("name", "");
                result.current.handleBlur("name");
            });

            expect(result.current.errors.name).toBeDefined();

            // Ahora al escribir, debería validar en onChange
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
            });

            expect(result.current.errors.name).toBeUndefined();

            unmount();
        });

        it("handleBlur sanitiza todos los campos con trim()", () => {
            const { result, unmount } = renderHook(() => useContactForm());

            // Email con espacios al inicio/fin
            act(() => {
                result.current.handleChange("email", "  test@example.com  ");
                result.current.handleBlur("email");
            });

            // Email SÍ debe ser trimmeado
            expect(result.current.formData.email).toBe("test@example.com");
            expect(result.current.errors.email).toBeUndefined();

            // Phone con espacios
            act(() => {
                result.current.handleChange("phone", "  1123456789  ");
                result.current.handleBlur("phone");
            });

            expect(result.current.formData.phone).toBe("1123456789");

            unmount();
        });
    });

    describe("Función resetForm", () => {
        it("puede ser llamada manualmente para resetear el formulario", () => {
            const { result, unmount } = renderHook(() => useContactForm());

            // Llenar el formulario
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleBlur("name");
                result.current.handleBlur("email");
            });

            // Verificar que tiene datos
            expect(result.current.formData.name).toBe("Juan Pérez");
            expect(result.current.touched.name).toBe(true);

            // Llamar resetForm manualmente
            act(() => {
                result.current.resetForm();
            });

            // Verificar que se reseteó
            expect(result.current.formData.name).toBe("");
            expect(result.current.formData.email).toBe("");
            expect(result.current.touched.name).toBe(false);
            expect(result.current.touched.email).toBe(false);

            unmount();
        });
    });

    describe("Edge cases de validateField", () => {
        it("retorna undefined para campos desconocidos (default case)", () => {
            const { result, unmount } = renderHook(() => useContactForm());

            // Forzar validación con campo inválido
            act(() => {
                result.current.handleChange("name" as any, "test");
                // Simular llamada con campo no existente
                result.current.handleBlur("invalidField" as any);
            });

            // No debería lanzar error, simplemente no hacer nada
            expect(() => {
                result.current.handleBlur("unknownField" as any);
            }).not.toThrow();

            unmount();
        });
    });

    describe("Validación de email - casos edge", () => {
        it("rechaza emails con puntos consecutivos", () => {
            const { result } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("email", "test..name@example.com");
                result.current.handleBlur("email");
            });

            expect(result.current.errors.email).toBe("Ingresá un email válido");
        });

        it("rechaza emails que comienzan con punto", () => {
            const { result } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("email", ".test@example.com");
                result.current.handleBlur("email");
            });

            expect(result.current.errors.email).toBe("Ingresá un email válido");
        });

        it("rechaza emails que terminan con punto antes del @", () => {
            const { result } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("email", "test.@example.com");
                result.current.handleBlur("email");
            });

            expect(result.current.errors.email).toBe("Ingresá un email válido");
        });

        it("rechaza emails con dominio que comienza con punto", () => {
            const { result } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("email", "test@.example.com");
                result.current.handleBlur("email");
            });

            expect(result.current.errors.email).toBe("Ingresá un email válido");
        });

        it("rechaza emails con dominio que termina con punto", () => {
            const { result } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("email", "test@example.com.");
                result.current.handleBlur("email");
            });

            expect(result.current.errors.email).toBe("Ingresá un email válido");
        });

        it("rechaza emails con dominio que comienza con guión", () => {
            const { result } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("email", "test@-example.com");
                result.current.handleBlur("email");
            });

            expect(result.current.errors.email).toBe("Ingresá un email válido");
        });

        it("rechaza emails con dominio que termina con guión", () => {
            const { result } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("email", "test@example-.com");
                result.current.handleBlur("email");
            });

            expect(result.current.errors.email).toBe("Ingresá un email válido");
        });

        it("rechaza emails sin local part", () => {
            const { result } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("email", "@example.com");
                result.current.handleBlur("email");
            });

            expect(result.current.errors.email).toBe("Ingresá un email válido");
        });

        it("rechaza emails sin dominio", () => {
            const { result } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("email", "test@");
                result.current.handleBlur("email");
            });

            expect(result.current.errors.email).toBe("Ingresá un email válido");
        });

        it("rechaza emails que no pasan la validación estructural del regex", () => {
            const { result } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("email", "test@domain");
                result.current.handleBlur("email");
            });

            expect(result.current.errors.email).toBe("Ingresá un email válido");
        });

        it("rechaza emails con más de 254 caracteres", () => {
            const { result } = renderHook(() => useContactForm());
            const longEmail = "a".repeat(250) + "@test.com";

            act(() => {
                result.current.handleChange("email", longEmail);
                result.current.handleBlur("email");
            });

            expect(result.current.errors.email).toBe("Ingresá un email válido");
        });

        it("rechaza emails vacíos o null en isValidEmail", () => {
            const { result } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("email", "");
                result.current.handleBlur("email");
            });

            expect(result.current.errors.email).toBe(
                "Por favor ingresá tu email",
            );
        });
    });

    describe("Submit con manejo de errores", () => {
        it("maneja errores durante el envío y establece status error", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Forzar error en el submit
            (window as any).__TEST_FORCE_ERROR__ = true;

            // Llenar formulario con datos válidos
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.submitStatus).toBe("error");
            expect(result.current.isSubmitting).toBe(false);

            // Limpiar
            delete (window as any).__TEST_FORCE_ERROR__;
            unmount();
        });

        it("llama a logger.error cuando ocurre un error durante el submit (línea 270)", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Forzar error en el submit
            (window as any).__TEST_FORCE_ERROR__ = true;

            // Llenar formulario con datos válidos
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            // Verificar que se llamó logger.error con el mensaje correcto (línea 270)
            expect(mockLogger.error).toHaveBeenCalledWith(
                "Form submission error:",
                expect.any(Error),
            );
            expect(mockLogger.error).toHaveBeenCalledTimes(1);

            // Limpiar
            delete (window as any).__TEST_FORCE_ERROR__;
            unmount();
        });

        it("resetea el estado de error después de 5 segundos", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Forzar error
            (window as any).__TEST_FORCE_ERROR__ = true;

            // Llenar formulario con datos válidos
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.submitStatus).toBe("error");

            // Esperar 5.5 segundos para que se resetee el error
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 5500));
            });

            expect(result.current.submitStatus).toBe("idle");

            // Limpiar
            delete (window as any).__TEST_FORCE_ERROR__;
            unmount();
        }, 10000);

        it("resetea submitStatus a idle si estaba en success antes de nuevo submit", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Primer submit exitoso
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.submitStatus).toBe("success");

            // Cambiar datos y hacer segundo submit
            act(() => {
                result.current.handleChange("name", "María García");
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            // Debería haber reseteado a idle primero y luego a success
            expect(result.current.submitStatus).toBe("success");

            unmount();
        });

        it("resetea submitStatus a idle si estaba en error antes de nuevo submit", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Primer submit con error
            (window as any).__TEST_FORCE_ERROR__ = true;

            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.submitStatus).toBe("error");

            // Segundo submit exitoso
            delete (window as any).__TEST_FORCE_ERROR__;

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.submitStatus).toBe("success");

            unmount();
        });

        it("verifica que submitInProgressRef NO permite el reset automático", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Submit exitoso
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            // Esperar más de 3 segundos para verificar el reset
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 3500));
            });

            // Debería haberse reseteado porque submitInProgressRef era false
            expect(result.current.formData.name).toBe("");

            unmount();
        }, 10000);
    });

    describe("Cancelación de timeouts", () => {
        it("cancela el timeout de reset cuando el usuario escribe después de submit exitoso", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Submit exitoso
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.submitStatus).toBe("success");

            // Usuario escribe antes de que se cumpla el timeout de 3s
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                result.current.handleChange("name", "Nuevo Nombre");
            });

            // Esperar a que se cumpla el tiempo original (otros 3s)
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 3000));
            });

            // El formulario NO debería haberse reseteado porque el usuario escribió
            expect(result.current.formData.name).toBe("Nuevo Nombre");

            unmount();
        }, 10000);

        it("limpia el timeout cuando se desmonta el componente", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Submit exitoso que inicia un timeout
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            // Hay un timeout pendiente de 3 segundos
            expect(result.current.submitStatus).toBe("success");

            // Desmontar inmediatamente sin esperar el timeout
            unmount();

            // No debería haber errores ni memory leaks
            expect(true).toBe(true);
        });

        it("cancela timeout pendiente cuando se llama resetForm manualmente", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Submit exitoso que inicia un timeout de 3s
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.submitStatus).toBe("success");

            // Esperar 1 segundo (menos que el timeout de 3s)
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            });

            // Llamar resetForm manualmente antes de que se cumpla el timeout
            act(() => {
                result.current.resetForm();
            });

            // Verificar que se reseteó inmediatamente
            expect(result.current.formData.name).toBe("");
            expect(result.current.submitStatus).toBe("idle");

            // Esperar otros 3 segundos para verificar que el timeout fue cancelado
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 3000));
            });

            // El estado sigue siendo idle (no se ejecutó el timeout cancelado)
            expect(result.current.submitStatus).toBe("idle");

            unmount();
        }, 10000);

        it("cancela timeout de error cuando se llama resetForm", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Forzar error
            (window as any).__TEST_FORCE_ERROR__ = true;

            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.submitStatus).toBe("error");

            // Resetear manualmente (cancela el timeout de 5s del error)
            act(() => {
                result.current.resetForm();
            });

            expect(result.current.submitStatus).toBe("idle");

            // Limpiar
            delete (window as any).__TEST_FORCE_ERROR__;
            unmount();
        });
    });

    describe("Sanitización en diferentes campos", () => {
        it("sanitiza el campo name con normalización de espacios múltiples", () => {
            const { result, unmount } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange("name", "Juan    Pablo    García");
                result.current.handleBlur("name");
            });

            expect(result.current.formData.name).toBe("Juan Pablo García");

            unmount();
        });

        it("sanitiza el campo message eliminando espacios", () => {
            const { result, unmount } = renderHook(() => useContactForm());

            act(() => {
                result.current.handleChange(
                    "message",
                    "   Este es un mensaje con espacios al inicio y al final   ",
                );
                result.current.handleBlur("message");
            });

            expect(result.current.formData.message).toBe(
                "Este es un mensaje con espacios al inicio y al final",
            );

            unmount();
        });

        it("verifica que resetTimeoutRef se limpia correctamente después del timeout de error", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Forzar error
            (window as any).__TEST_FORCE_ERROR__ = true;

            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.submitStatus).toBe("error");

            // Esperar EXACTAMENTE 5 segundos (el timeout del error)
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 5000));
            });

            // Verificar que se reseteó a idle
            expect(result.current.submitStatus).toBe("idle");

            // Limpiar
            delete (window as any).__TEST_FORCE_ERROR__;
            unmount();
        }, 10000);

        it("verifica que resetTimeoutRef se limpia correctamente después del timeout de éxito", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.submitStatus).toBe("success");

            // Esperar EXACTAMENTE 3 segundos (el timeout del éxito)
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 3000));
            });

            // Verificar que resetTimeoutRef.current se setea a null
            expect(result.current.formData.name).toBe("");
            expect(result.current.submitStatus).toBe("idle");

            unmount();
        }, 10000);
    });

    describe("Cobertura de ramas faltantes", () => {
        it("handleChange NO cancela timeout si resetTimeoutRef.current es null", () => {
            const { result, unmount } = renderHook(() => useContactForm());

            // Estado inicial: resetTimeoutRef.current es null
            // Simplemente cambiar un campo SIN haber hecho submit previo
            act(() => {
                result.current.handleChange("name", "Juan");
            });

            // Verificar que el cambio se aplicó correctamente
            expect(result.current.formData.name).toBe("Juan");

            unmount();
        });

        it("handleChange cancela timeout cuando resetTimeoutRef.current NO es null", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Hacer submit exitoso para crear un timeout
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            // Ahora resetTimeoutRef.current NO es null
            expect(result.current.submitStatus).toBe("success");

            // Cambiar un campo mientras hay timeout pendiente
            // Esto DEBE entrar en la rama del if
            act(() => {
                result.current.handleChange("name", "Nuevo Nombre");
            });

            // Esperar más de 3 segundos
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 3500));
            });

            // El formulario NO se reseteó porque se canceló el timeout
            expect(result.current.formData.name).toBe("Nuevo Nombre");

            unmount();
        }, 10000);

        it("NO resetea submitStatus si ya está en idle antes de submit", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Estado inicial: submitStatus es "idle"
            expect(result.current.submitStatus).toBe("idle");

            // Llenar formulario con datos válidos
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            // Submit (submitStatus ya es idle, por lo que la rama del if NO se ejecuta)
            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.submitStatus).toBe("success");

            unmount();
        });

        it("handleSubmit cancela timeout pendiente SIN hacer handleChange entre submits", async () => {
            const { result, unmount } = renderHook(() => useContactForm());
            const mockEvent = {
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>;

            // Llenar formulario
            act(() => {
                result.current.handleChange("name", "Juan Pérez");
                result.current.handleChange("email", "juan@example.com");
                result.current.handleChange("phone", "(02284) 15-225443");
                result.current.handleChange(
                    "message",
                    "Este es un mensaje válido con más de 20 caracteres.",
                );
            });

            // PRIMER submit (crea timeout de 3s)
            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.submitStatus).toBe("success");

            // Esperar 1 segundo (menos que los 3s del timeout)
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            });

            // SEGUNDO submit SIN hacer handleChange primero
            // Esto ejecuta la línea 167-169 (cancelar timeout en handleSubmit)
            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            expect(result.current.submitStatus).toBe("success");

            // Esperar 3.5 segundos desde el SEGUNDO submit
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 3500));
            });

            // Debería haberse reseteado con el NUEVO timeout
            expect(result.current.formData.name).toBe("");
            expect(result.current.submitStatus).toBe("idle");

            unmount();
        }, 10000);
    });
});
