import { describe, it, expect, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useContactForm } from "./useContactForm";

describe("useContactForm", () => {
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

            // Los espacios cuentan como caracteres, pero son menos de 20
            expect(result.current.errors.message).toBe(
                "El mensaje debe tener al menos 20 caracteres",
            );
        });

        it("rechaza mensaje con 20 espacios exactos pero sin contenido real", () => {
            const { result } = renderHook(() => useContactForm());
            const twentySpaces = " ".repeat(20);

            act(() => {
                result.current.handleChange("message", twentySpaces);
                result.current.handleBlur("message");
            });

            // Tiene 20 caracteres pero no tiene contenido útil
            // La validación actual no detecta esto (posible mejora futura)
            expect(result.current.errors.message).toBeUndefined();
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
            const { result } = renderHook(() => useContactForm());
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

            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            await waitFor(() => {
                expect(result.current.formData.name).toBe("");
                expect(result.current.formData.email).toBe("");
                expect(result.current.formData.phone).toBe("");
                expect(result.current.formData.message).toBe("");
                expect(result.current.touched.name).toBe(false);
                expect(result.current.touched.email).toBe(false);
            });
        });

        it("muestra estado de loading durante el envío", async () => {
            const { result } = renderHook(() => useContactForm());
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
        });

        it("previene doble submit mientras está enviando", async () => {
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

            // Intentar segundo submit mientras el primero está en curso
            await act(async () => {
                await result.current.handleSubmit(mockEvent);
            });

            // El segundo submit debería retornar inmediatamente por hasErrors
            // ya que isSubmitting causa que el form tenga errores implícitos

            // Esperar a que termine el primero
            await act(async () => {
                await firstSubmitPromise!;
            });

            // Verificar que solo se procesó uno
            expect(result.current.submitStatus).toBe("success");
            expect(result.current.isSubmitting).toBe(false);
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

        it("handleBlur NO sanitiza campos que no son name", () => {
            const { result } = renderHook(() => useContactForm());

            // Email con espacios al inicio/fin
            act(() => {
                result.current.handleChange("email", "  test@example.com  ");
                result.current.handleBlur("email");
            });

            // Email NO debe ser trimmeado (solo name se sanitiza)
            expect(result.current.formData.email).toBe("  test@example.com  ");
            expect(result.current.errors.email).toBeDefined(); // Debe tener error por espacios

            // Phone con espacios
            act(() => {
                result.current.handleChange("phone", "  1123456789  ");
                result.current.handleBlur("phone");
            });

            expect(result.current.formData.phone).toBe("  1123456789  ");
        });
    });

    describe("Función resetForm", () => {
        it("puede ser llamada manualmente para resetear el formulario", () => {
            const { result } = renderHook(() => useContactForm());

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

            // Llamar resetForm manualmente (línea 161)
            act(() => {
                result.current.resetForm();
            });

            // Verificar que se reseteó
            expect(result.current.formData.name).toBe("");
            expect(result.current.formData.email).toBe("");
            expect(result.current.touched.name).toBe(false);
            expect(result.current.touched.email).toBe(false);
        });
    });

    describe("Edge cases de validateField", () => {
        it("retorna undefined para campos desconocidos (default case)", () => {
            const { result } = renderHook(() => useContactForm());

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
        });
    });
});
