/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#f0fdf9",
                    100: "#ccf7e3",
                    200: "#99eed1",
                    300: "#66e4be",
                    400: "#33d9aa",
                    500: "#00c896",
                    600: "#00a37a",
                    700: "#007d5e",
                    800: "#005742",
                    900: "#003527",
                },
                secondary: {
                    50: "#f5f7fa",
                    100: "#e1e7f0",
                    200: "#c7d1e3",
                    300: "#a9b9d5",
                    400: "#8ba1c7",
                    500: "#5c7aa7",
                    600: "#486090",
                    700: "#354873",
                    800: "#222f56",
                    900: "#10183a",
                },
                accent: {
                    500: "#f0b429",
                    600: "#d78f1c",
                },
                whatsapp: {
                    DEFAULT: "#128C7E",
                    dark: "#075E54",
                    light: "#25D366",
                },
            },
            fontSize: {
                h1: [
                    "clamp(2.2rem, 1.5rem + 3vw, 4.5rem)",
                    {
                        lineHeight: "1.05",
                        letterSpacing: "-0.02em",
                        fontWeight: "700",
                    },
                ],
                h2: [
                    "clamp(1.8rem, 1.2rem + 2vw, 3rem)",
                    {
                        lineHeight: "1.15",
                        letterSpacing: "-0.015em",
                        fontWeight: "700",
                    },
                ],
                h3: [
                    "clamp(1.4rem, 1rem + 1vw, 2.25rem)",
                    { lineHeight: "1.25", fontWeight: "600" },
                ],
                h4: [
                    "clamp(1.2rem, 0.9rem + 0.5vw, 1.5rem)",
                    { lineHeight: "1.3", fontWeight: "600" },
                ],
                h5: [
                    "clamp(1.1rem, 0.85rem + 0.3vw, 1.25rem)",
                    { lineHeight: "1.4", fontWeight: "600" },
                ],
                body: [
                    "clamp(1rem, 0.9rem + 0.3vw, 1.125rem)",
                    { lineHeight: "1.75" },
                ],
                "body-lg": [
                    "clamp(1.05rem, 0.95rem + 0.35vw, 1.2rem)",
                    { lineHeight: "1.75" },
                ],
                "body-sm": [
                    "clamp(0.85rem, 0.8rem + 0.2vw, 0.95rem)",
                    { lineHeight: "1.6" },
                ],
            },
            boxShadow: {
                soft: "0 1px 3px rgb(0 0 0 / 0.1)",
                medium: "0 4px 6px rgb(0 0 0 / 0.1)",
                strong: "0 10px 15px rgb(0 0 0 / 0.15)",
            },
            animation: {
                "fade-in": "fadeIn 0.4s ease-out forwards",
                "slide-down": "slideDown 0.3s ease-out forwards",
                shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideDown: {
                    "0%": { opacity: "0", transform: "translateY(-10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                shake: {
                    "10%, 90%": { transform: "translateX(-1px)" },
                    "20%, 80%": { transform: "translateX(2px)" },
                    "30%, 50%, 70%": { transform: "translateX(-4px)" },
                    "40%, 60%": { transform: "translateX(4px)" },
                },
            },
        },
    },
    plugins: [],
};
