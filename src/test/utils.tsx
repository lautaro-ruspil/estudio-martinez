import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";

/**
 * Custom render que incluye providers si es necesario en el futuro
 * Por ahora es un wrapper simple, pero facilita agregar Context providers después
 */
function customRender(
    ui: ReactElement,
    options?: Omit<RenderOptions, "wrapper">,
) {
    return render(ui, { ...options });
}

// Re-exportar todo de testing-library
export * from "@testing-library/react";
export { customRender as render };
