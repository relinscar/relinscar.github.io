const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    // prettier-ignore
    content: [
        "./src/views/**/*.njk",
        "./src/js/**/*.js"
    ],
    theme: {
        extend: {
        },
    },
    plugins: [],
};
