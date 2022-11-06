$("#js-nav-toggle").on("click", function () {
    if ($("#js-nav-toggle-target").is(":visible")) {
        $("#js-nav-toggle-target").slideUp(250, $.bez([0.7, 0, 0.5, 1]));
        $("#js-nav-open").show();
        $("#js-nav-close").hide();
    } else {
        $("#js-nav-toggle-target").slideDown(250, $.bez([0.7, 0, 0.5, 1]));
        $("#js-nav-open").hide();
        $("#js-nav-close").show();
    }
});
