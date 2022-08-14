// Because we're so attached to sass but we want to take advantage of tailwind as a framework we
// put in some extra effort to retrieve the tailwind theme variables and insert them into sass.
// We'll do this using style dictionary
const resolveConfig = require("tailwindcss/resolveConfig");
const tailwindConfig = require("./tailwind.config.js");
const StyleDictionary = require("style-dictionary");
const _ = require("lodash");

// Grab just the theme data from the Tailwind config.
const { theme } = resolveConfig(tailwindConfig);

// This changes a config to one compatible with style-dictionary
const formatConfig = (themeConfig, name = null) => {
    const formattedConfig = {};
    if (name) formattedConfig[name] = {};
    Object.entries(themeConfig).forEach(([key1, value1]) => {
        name ? (formattedConfig[name][key1] = {}) : (formattedConfig[key1] = {});
        if (typeof value1 != "object") {
            name ? (formattedConfig[name][key1]["value"] = value1) : (formattedConfig[key1]["value"] = value1);
        } else {
            Object.entries(value1).forEach(([key2, value2]) => {
                name ? (formattedConfig[name][key1][key2] = {}) : (formattedConfig[key1][key2] = {});
                if (typeof value2 != "object") {
                    name
                        ? (formattedConfig[name][key1][key2]["value"] = value2)
                        : (formattedConfig[key1][key2]["value"] = value2);
                } else {
                    Object.entries(theme.colors).forEach(([key3, value3]) => {
                        name
                            ? (formattedConfig[name][key1][key2][key3] = {})
                            : (formattedConfig[key1][key2][key3] = {});
                        if (typeof value3 != "object") {
                            name
                                ? (formattedConfig[name][key1][key2][key3]["value"] = value3)
                                : (formattedConfig[key1][key2][key3]["value"] = value3);
                        }
                    });
                }
            });
        }
    });
    return formattedConfig;
};





// This changes a config to one compatible with style-dictionary
const formatConfigRecursive = (themeConfig, name = null) => {
    const formattedConfig = {};
    if (name) {
        formattedConfig[name] = {};
        formattedConfig[name] = formatConfigRecursive(themeConfig);
    } else {
        Object.entries(themeConfig).forEach(([key, value]) => {
            formattedConfig[key] = {};
            if (typeof value != "object") {
                formattedConfig[key]["value"] = value;
            } else {
                formattedConfig[key] = formatConfigRecursive(themeConfig);
            }
        });
    }
    return formattedConfig;
};






// const tokens = formatConfig(theme);
const themeScreens = formatConfig(theme.screens);
const themeColors = formatConfig(theme.colors, "color");

const themeScreensRecursive = formatConfigRecursive(theme.screens);
console.log(themeScreens);
console.log(themeScreensRecursive);


// Build the breakpoints as a flat map
StyleDictionary.extend({
    tokens: themeScreens,
    platforms: {
        scss: {
            transformGroup: "scss",
            buildPath: "src/scss/theme/",
            files: [
                {
                    destination: "_screens.scss",
                    format: "scss/map-flat",
                    mapName: "breakpoints",
                },
            ],
        },
    },
}).buildAllPlatforms();

// Build all the colours as individual variables
StyleDictionary.extend({
    tokens: themeColors,
    platforms: {
        scss: {
            transformGroup: "scss",
            buildPath: "src/scss/theme/",
            files: [
                {
                    destination: "_colors.scss",
                    format: "scss/variables",
                },
            ],
        },
    },
}).buildAllPlatforms();

// Ok now we can do our mix stuff
// webpack.mix.js
let mix = require("laravel-mix");

// Then we compile our sass
mix.sass(
    "src/scss/app.scss",
    "public/css",
    {
        implementation: require("sass"),
        sassOptions: {
            outputStyle: mix.inProduction() ? "compressed" : "expanded",
            sourceMap: !mix.inProduction(),
        },
    },
    [require("tailwindcss")]
).options({ processCssUrls: false });

// Mix the javascript together
mix.js("src/js/app.js", "public/js");

// Make source maps if developing
if (!mix.inProduction()) {
    mix.sourceMaps();
}
