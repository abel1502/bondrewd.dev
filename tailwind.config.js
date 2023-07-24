/** @type {import("tailwindcss").Config} */
module.exports = {
    content: [
        "./_pages/**/*.{html,md}",
        "./_includes/**/*.{html,md}",
        "./_layouts/**/*.{html,md}",
        "./_posts/**/*.{html,md}",
        "./_drafts/**/*.{html,md}",
        "./*.{html,md}",
        // "./static/styles/*.css",
    ],
    theme: {
        extend: {
            colors: {
                "primary-dark": "#353535",
                "primary": "#454545",
                "primary-light": "#555555",
                "tint": "#9f6cd2",
                "contrast": "#e8e8e8",
                "contrast-less": "#b0b0b0",
            },
            fontFamily: {
                "fira-sans": ["Fira Sans", "sans-serif"],
                "segoe-ui": ["Segoe UI", "sans-serif"],
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                    },
                },
            }),
        },
    },
    darkMode: "class",
    plugins: [
        require("@tailwindcss/typography"),
    ],
}

