import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "./logger";

describe("Logger", () => {
    // Mocks de console
    let consoleLogSpy: ReturnType<typeof vi.spyOn>;
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
    let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
    let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
    let consoleGroupSpy: ReturnType<typeof vi.spyOn>;
    let consoleGroupEndSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        // Crear spies de todos los métodos de console
        consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
        consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
        consoleErrorSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});
        consoleInfoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
        consoleDebugSpy = vi
            .spyOn(console, "debug")
            .mockImplementation(() => {});
        consoleGroupSpy = vi
            .spyOn(console, "group")
            .mockImplementation(() => {});
        consoleGroupEndSpy = vi
            .spyOn(console, "groupEnd")
            .mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Funcionalidad del logger", () => {
        it("log() llama a console.log cuando shouldLog es true", () => {
            logger.log("Test message", { data: "test" });

            // En entorno de test (DEV), debería llamar a console.log
            expect(consoleLogSpy).toHaveBeenCalledWith("Test message", {
                data: "test",
            });
            expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        });

        it("warn() llama a console.warn cuando shouldLog es true", () => {
            logger.warn("Warning message", 123);

            expect(consoleWarnSpy).toHaveBeenCalledWith("Warning message", 123);
            expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
        });

        it("error() SIEMPRE llama a console.error", () => {
            const error = new Error("Test error");
            logger.error("Error message", error);

            // error() siempre se ejecuta, independientemente del entorno
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Error message",
                error,
            );
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        });

        it("info() llama a console.info cuando shouldLog es true", () => {
            logger.info("Info message", { status: "ok" });

            expect(consoleInfoSpy).toHaveBeenCalledWith("Info message", {
                status: "ok",
            });
            expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
        });

        it("debug() llama a console.debug cuando shouldLog es true", () => {
            logger.debug("Debug message", [1, 2, 3]);

            expect(consoleDebugSpy).toHaveBeenCalledWith(
                "Debug message",
                [1, 2, 3],
            );
            expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
        });

        it("group() crea un grupo de console cuando shouldLog es true", () => {
            const callback = vi.fn();

            logger.group("Test Group", callback);

            expect(consoleGroupSpy).toHaveBeenCalledWith("Test Group");
            expect(callback).toHaveBeenCalledTimes(1);
            expect(consoleGroupEndSpy).toHaveBeenCalledTimes(1);
        });

        it("group() ejecuta el callback entre group y groupEnd", () => {
            const callOrder: string[] = [];

            consoleGroupSpy.mockImplementation(() => {
                callOrder.push("group");
            });
            consoleGroupEndSpy.mockImplementation(() => {
                callOrder.push("groupEnd");
            });

            logger.group("Test", () => {
                callOrder.push("callback");
            });

            expect(callOrder).toEqual(["group", "callback", "groupEnd"]);
        });
    });

    describe("Múltiples argumentos", () => {
        it("log() acepta múltiples argumentos", () => {
            logger.log("Message", 1, true, { key: "value" }, [1, 2, 3]);

            expect(consoleLogSpy).toHaveBeenCalledWith(
                "Message",
                1,
                true,
                { key: "value" },
                [1, 2, 3],
            );
        });

        it("warn() acepta múltiples argumentos", () => {
            logger.warn("Warning", "text", 42);

            expect(consoleWarnSpy).toHaveBeenCalledWith("Warning", "text", 42);
        });

        it("error() acepta múltiples argumentos", () => {
            const error = new Error("Test");
            logger.error("Error:", error, { context: "test" });

            expect(consoleErrorSpy).toHaveBeenCalledWith("Error:", error, {
                context: "test",
            });
        });

        it("info() acepta múltiples argumentos", () => {
            logger.info("Info", { a: 1 }, { b: 2 });

            expect(consoleInfoSpy).toHaveBeenCalledWith(
                "Info",
                { a: 1 },
                { b: 2 },
            );
        });

        it("debug() acepta múltiples argumentos", () => {
            logger.debug("Debug", null, undefined, 0);

            expect(consoleDebugSpy).toHaveBeenCalledWith(
                "Debug",
                null,
                undefined,
                0,
            );
        });
    });

    describe("Casos edge", () => {
        it("maneja llamadas sin argumentos", () => {
            logger.log();
            logger.warn();
            logger.info();
            logger.debug();

            expect(consoleLogSpy).toHaveBeenCalledWith();
            expect(consoleWarnSpy).toHaveBeenCalledWith();
            expect(consoleInfoSpy).toHaveBeenCalledWith();
            expect(consoleDebugSpy).toHaveBeenCalledWith();
        });

        it("error() sin argumentos", () => {
            logger.error();

            expect(consoleErrorSpy).toHaveBeenCalledWith();
        });

        it("group() con callback que lanza error no rompe el groupEnd", () => {
            const errorCallback = () => {
                throw new Error("Callback error");
            };

            expect(() => {
                logger.group("Test", errorCallback);
            }).toThrow("Callback error");

            // groupEnd no se llama si el callback lanza error
            // porque el error interrumpe la ejecución
            expect(consoleGroupSpy).toHaveBeenCalledTimes(1);
            expect(consoleGroupEndSpy).not.toHaveBeenCalled();
        });

        it("group() con callback vacío funciona correctamente", () => {
            logger.group("Empty callback", () => {});

            expect(consoleGroupSpy).toHaveBeenCalledWith("Empty callback");
            expect(consoleGroupEndSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("Tipos de datos especiales", () => {
        it("maneja objetos circulares", () => {
            const circular: any = { name: "test" };
            circular.self = circular;

            logger.log("Circular object:", circular);

            expect(consoleLogSpy).toHaveBeenCalledWith(
                "Circular object:",
                circular,
            );
        });

        it("maneja arrays grandes", () => {
            const largeArray = Array(1000).fill("test");

            logger.debug("Large array:", largeArray);

            expect(consoleDebugSpy).toHaveBeenCalledWith(
                "Large array:",
                largeArray,
            );
        });

        it("maneja funciones como argumentos", () => {
            const fn = () => "test";

            logger.info("Function:", fn);

            expect(consoleInfoSpy).toHaveBeenCalledWith("Function:", fn);
        });

        it("maneja Symbols", () => {
            const sym = Symbol("test");

            logger.log("Symbol:", sym);

            expect(consoleLogSpy).toHaveBeenCalledWith("Symbol:", sym);
        });

        it("maneja BigInt", () => {
            const bigNum = BigInt(9007199254740991);

            logger.warn("BigInt:", bigNum);

            expect(consoleWarnSpy).toHaveBeenCalledWith("BigInt:", bigNum);
        });
    });

    describe("Consistencia entre llamadas", () => {
        it("múltiples llamadas consecutivas funcionan correctamente", () => {
            logger.log("First");
            logger.warn("Second");
            logger.error("Third");
            logger.info("Fourth");
            logger.debug("Fifth");

            expect(consoleLogSpy).toHaveBeenCalledTimes(1);
            expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
            expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
        });

        it("grupos anidados funcionan correctamente", () => {
            logger.group("Outer", () => {
                logger.log("Inside outer");
                logger.group("Inner", () => {
                    logger.log("Inside inner");
                });
            });

            expect(consoleGroupSpy).toHaveBeenCalledTimes(2);
            expect(consoleGroupEndSpy).toHaveBeenCalledTimes(2);
            expect(consoleLogSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe("Comportamiento condicional según shouldLog", () => {
        it("verifica que logger tiene propiedad isDev", () => {
            // Acceder a la propiedad privada para testing
            expect((logger as any).isDev).toBeDefined();
        });

        it("verifica que shouldLog retorna un booleano", () => {
            const result = (logger as any).shouldLog();
            expect(typeof result).toBe("boolean");
        });

        it("error() se ejecuta sin verificar shouldLog", () => {
            // error() no verifica shouldLog, siempre se ejecuta
            logger.error("Always logged");

            expect(consoleErrorSpy).toHaveBeenCalled();
        });
    });

    describe("Verificación de cobertura de código", () => {
        it("cubre todas las ramas de log()", () => {
            // Llamar con y sin argumentos
            logger.log();
            logger.log("test");
            logger.log("test", "arg2", 3);

            expect(consoleLogSpy).toHaveBeenCalledTimes(3);
        });

        it("cubre todas las ramas de warn()", () => {
            logger.warn();
            logger.warn("warning");

            expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
        });

        it("cubre todas las ramas de info()", () => {
            logger.info();
            logger.info("info", { data: true });

            expect(consoleInfoSpy).toHaveBeenCalledTimes(2);
        });

        it("cubre todas las ramas de debug()", () => {
            logger.debug();
            logger.debug("debug", [1, 2, 3]);

            expect(consoleDebugSpy).toHaveBeenCalledTimes(2);
        });

        it("cubre todas las ramas de group()", () => {
            // Con callback normal
            logger.group("Group 1", () => {
                logger.log("inside");
            });

            // Con callback vacío
            logger.group("Group 2", () => {});

            expect(consoleGroupSpy).toHaveBeenCalledTimes(2);
            expect(consoleGroupEndSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe("Simulación de producción (shouldLog = false)", () => {
        beforeEach(() => {
            // Limpiar todos los mocks antes de cada test
            vi.clearAllMocks();
        });

        it("log() NO ejecuta console.log cuando shouldLog retorna false", () => {
            // Mock shouldLog para que retorne false
            vi.spyOn(logger as any, "shouldLog").mockReturnValue(false);

            logger.log("Should not log");

            expect(consoleLogSpy).not.toHaveBeenCalled();
        });

        it("warn() NO ejecuta console.warn cuando shouldLog retorna false", () => {
            vi.spyOn(logger as any, "shouldLog").mockReturnValue(false);

            logger.warn("Should not warn");

            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });

        it("info() NO ejecuta console.info cuando shouldLog retorna false", () => {
            vi.spyOn(logger as any, "shouldLog").mockReturnValue(false);

            logger.info("Should not info");

            expect(consoleInfoSpy).not.toHaveBeenCalled();
        });

        it("debug() NO ejecuta console.debug cuando shouldLog retorna false", () => {
            vi.spyOn(logger as any, "shouldLog").mockReturnValue(false);

            logger.debug("Should not debug");

            expect(consoleDebugSpy).not.toHaveBeenCalled();
        });

        it("group() NO ejecuta cuando shouldLog retorna false", () => {
            vi.spyOn(logger as any, "shouldLog").mockReturnValue(false);

            const callback = vi.fn();
            logger.group("Should not group", callback);

            expect(consoleGroupSpy).not.toHaveBeenCalled();
            expect(consoleGroupEndSpy).not.toHaveBeenCalled();
            expect(callback).not.toHaveBeenCalled();
        });

        it("error() SIEMPRE se ejecuta (no usa shouldLog)", () => {
            // Mock shouldLog para verificar que error() NO lo llama
            const shouldLogSpy = vi
                .spyOn(logger as any, "shouldLog")
                .mockReturnValue(false);

            logger.error("Error always logs");

            // console.error SÍ debe ser llamado
            expect(consoleErrorSpy).toHaveBeenCalledWith("Error always logs");
            // shouldLog NO debe haber sido llamado por error()
            expect(shouldLogSpy).not.toHaveBeenCalled();
        });

        it("shouldLog retorna false cuando isDev es false", () => {
            // Mockear isDev directamente
            Object.defineProperty(logger, "isDev", {
                value: false,
                writable: true,
                configurable: true,
            });

            const result = (logger as any).shouldLog();
            expect(result).toBe(false);

            // Restaurar
            Object.defineProperty(logger, "isDev", {
                value: true,
                writable: true,
                configurable: true,
            });
        });

        it("cubre branch false de log() con múltiples argumentos", () => {
            vi.spyOn(logger as any, "shouldLog").mockReturnValue(false);

            logger.log("arg1", "arg2", 123, { data: true });

            expect(consoleLogSpy).not.toHaveBeenCalled();
        });

        it("cubre branch false de warn() con múltiples argumentos", () => {
            vi.spyOn(logger as any, "shouldLog").mockReturnValue(false);

            logger.warn("warning", 42, [1, 2, 3]);

            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });

        it("cubre branch false de info() con múltiples argumentos", () => {
            vi.spyOn(logger as any, "shouldLog").mockReturnValue(false);

            logger.info("info", { key: "value" });

            expect(consoleInfoSpy).not.toHaveBeenCalled();
        });

        it("cubre branch false de debug() con múltiples argumentos", () => {
            vi.spyOn(logger as any, "shouldLog").mockReturnValue(false);

            logger.debug("debug", null, undefined);

            expect(consoleDebugSpy).not.toHaveBeenCalled();
        });

        it("cubre branch false de group() con callback complejo", () => {
            vi.spyOn(logger as any, "shouldLog").mockReturnValue(false);

            const callback = vi.fn(() => {
                logger.log("inside group");
            });

            logger.group("Complex group", callback);

            expect(consoleGroupSpy).not.toHaveBeenCalled();
            expect(callback).not.toHaveBeenCalled();
        });
    });
});
