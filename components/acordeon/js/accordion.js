"use strict";

$(function() {
	$(".js-accordion").find(".js-acs-title").click(function(e) {
		e.preventDefault();

		// Grab current anchor value
		var currentAttrValue = $(this).attr("href");

		if($(e.target).is(".active")) {
			close_accordion_section();
		} else {
			close_accordion_section();

			// Add active class to section title
			$(this).addClass("active");
			// Open up the hidden content panel
			$(".js-accordion").find(currentAttrValue).slideDown(300).addClass("open");
		}
	});

	function close_accordion_section() {
		var $acord = $(".js-accordion");
		$acord.find(".js-acs-title").removeClass("active");
		$acord.find(".js-acs-content").slideUp(300).removeClass("open");
	}
});