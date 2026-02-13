import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("El elemento root no existe en el DOM");
}

createRoot(rootElement).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
