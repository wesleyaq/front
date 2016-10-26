"use strict";

$(function() {
    $(".js-tabs-menu a").click(function(e) {
        e.preventDefault();
        var $parent = $(this).parent();
        $parent.addClass("current");
        $parent.siblings().removeClass("current");
        var tab = $(this).attr("href");
        $(".js-tab-content").not(tab).css("display", "none");
        $(tab).fadeIn();
    });
});