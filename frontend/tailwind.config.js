/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                primary: {
                    50: "#f0f9f4",
                    100: "#d9f0e3",
                    500: "#00813c",
                    600: "#006d33",
                    700: "#005a2b",
                },
                secondary: {
                    50: "#fff8f0",
                    100: "#ffe9d1",
                    500: "#d4a257",
                    600: "#bf8d3d",
                    700: "#96682d",
                },
                neutral: {
                    50: "#f8fafc",
                    100: "#f1f5f9",
                    200: "#e2e8f0",
                    700: "#334155",
                    800: "#1e293b",
                    900: "#0f172a",
                },
            },
        },
    },
} 