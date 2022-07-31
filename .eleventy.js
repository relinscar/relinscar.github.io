module.exports = function (eleventyConfig) {
    eleventyConfig.addWatchTarget("./src/scss/");
    eleventyConfig.addWatchTarget("./src/js/");
    eleventyConfig.addPassthroughCopy({"./src/img": "img"});

    eleventyConfig.setBrowserSyncConfig({
        open: true,
    });

    // Return your Object options:
    return {
        dir: {
            input: "src/views",
            output: "public",
            includes: "_includes",
            layouts: "_layouts",
        },
    };
};
