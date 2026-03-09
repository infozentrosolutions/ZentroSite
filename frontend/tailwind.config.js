/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Modern sans-serif font
            },
            colors: {
                primary: {
                    DEFAULT: '#4f46e5', // Indigo 600
                    light: '#6366f1',
                    dark: '#4338ca',
                },
                accent: {
                    DEFAULT: '#eab308', // Yellow 500
                    light: '#facc15',
                    dark: '#ca8a04',
                }
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
}
