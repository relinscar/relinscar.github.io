// Because we're so attached to sass but we want to take advantage of tailwind as a framework we
// put in some extra effort to retrieve the tailwind theme variables and insert them into sass.
// We'll do this using style dictionary
const resolveConfig = require( "tailwindcss/resolveConfig" );
const tailwindConfig = require( "./tailwind.config.js" );
const StyleDictionary = require( "style-dictionary" );
const _ = require( "lodash" );

// Grab just the theme data from the Tailwind config.
const { theme } = resolveConfig( tailwindConfig );

// This changes a config to one compatible with style-dictionary
const formatConfig = ( themeConfig, name = null ) => {
    const formattedConfig = {};
    if ( name ) {
        formattedConfig[ name ] = {};
        formattedConfig[ name ] = formatConfig( themeConfig );
    } else {
        Object.entries( themeConfig ).forEach( ( [ key, value ] ) => {
            formattedConfig[ key ] = {};
            if ( typeof value != "object" ) {
                formattedConfig[ key ][ "value" ] = value;
            } else {
                formattedConfig[ key ] = formatConfig( value );
            }
        } );
    }
    return formattedConfig;
};

// const tokens = formatConfig(theme);
const themeScreens = formatConfig( theme.screens );
const themeColors = formatConfig( theme.colors, "color" );

// Build the breakpoints as a flat map
StyleDictionary.extend( {
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
                    options: {
                        fileHeader: ( defaultMessage ) => {
                            return [
                                `Do not edit directly`,
                                `See src/scss/theme/_breakpoints.scss for more information`
                            ]
                        }
                    }
                },
            ],
        },
    },
} ).buildAllPlatforms();

// Build all the colours as individual variables
StyleDictionary.extend( {
    tokens: themeColors,
    platforms: {
        scss: {
            transformGroup: "scss",
            buildPath: "src/scss/theme/",
            files: [
                {
                    destination: "_colors.scss",
                    format: "scss/variables",
                    options: {
                        fileHeader: ( defaultMessage ) => {
                            return [
                                `Do not edit directly`,
                                `These colour variables are extracted from tailwind`
                            ]
                        }
                    }
                },
            ],
        },
    },
} ).buildAllPlatforms();

// Ok now we can do our mix stuff
// webpack.mix.js
let mix = require( "laravel-mix" );

// Then we compile our sass
mix.sass(
    "src/scss/app.scss",
    "public/css",
    {
        implementation: require( "sass" ),
        sassOptions: {
            outputStyle: mix.inProduction() ? "compressed" : "expanded",
            sourceMap: !mix.inProduction(),
        },
    },
    [ require( "tailwindcss" ) ]
).options( { processCssUrls: false } );

// Mix the javascript together
mix.combine( [
    "src/js/jquery-3.6.1.min.js",
    "src/js/jquery.bez.min.js",
    "src/js/app.js"
], "public/js/app.js" );

// Make source maps if developing
if ( !mix.inProduction() ) {
    mix.sourceMaps();
}
