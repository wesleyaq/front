"use strict";

$(function() {
	$('[data-wco]').wcollapse();

	$('[data-wco]')
	.on('beforeshow', function () {
		console.log('beforeshow', this);
	})
	.on('show', function () {
  	console.log('show', this);
	})
	.on('hidden', function () {
  	console.log('hidden', this);
	});
	
	$('[data-wco-group]').wcollapse({
		open: ''
	});

	$('.js-wc-open').on('click', function(e) {
		e.preventDefault();
		$('[data-wco-group]:eq(1)').wcollapse('show');
	});

	$('.js-wc-close').on('click', function(e) {
		e.preventDefault();
		$('[data-wco-group]:eq(1)').wcollapse('hide');
	});

	$('.js-wc-toggle').on('click', function(e) {
		e.preventDefault();
		$('[data-wco-group]:eq(1)').wcollapse('toggle');
	});
});

(function($) {
	$.fn.wcollapse = function(options) {
		var $tg = $(this),
		opt = $.extend({}, {
			open 				: 'none',
			dtCont 			: 'data-open',
			dtGroupOpen : 'data-wc-go',
			dtGroupCont : 'data-wc-gc',
			active 			: 'active'
		}, options);

		if(typeof options == 'string') {
			return this.each(function(i, t) {
	    	var $t = $(t);

	    	if(options == 'show') {
	    		close($t, 'open');
	    		open($t);

	    	} else if(options == 'hide') {
	    		close($t, 'close');

	    	} else if(options == 'toggle') {
	    		toggle($t);
	    	}
	    });

		} else {
			return this.each(function(i, t) {
	    	var $t = $(t);

	    	if(!$t.data('active')) {
		    	$t.on('click', onClick);

		    	if(opt.open != 'none' && opt.open != '') {
			    	if(opt.open == 'first' && i == 0) {
			    		open($t);

			    	} else if(opt.open == 'all') {
			    		open($t);
			    	}
			    }
			    $t.data('active', true);
		    }
	    });	
		}

    function onClick(e) {
			e.preventDefault();
			var $t = $(this);

			toggle($t);
    }

    function open($t) {
    	var cont = $t.attr(opt.dtCont),
			$cont = $(cont);

			if($cont.length) {
				$t.trigger('beforeshow');
				$t.addClass(opt.active);
				$cont.slideDown(300, function() {
					$t.trigger('show');
				})
				.addClass(opt.active);
			}
    }

    function close($t, option) {
    	$t = $t? $t: null;
    	option = option? option: null;
    	var cont = $t.attr(opt.dtCont),
    	$cont = $(cont);

    	if($t.is('['+opt.dtGroupOpen+']')) {
    		var group = $t.attr(opt.dtGroupOpen),
    		$go = null,
    		$gc = null;

    		if(option == null || option == 'open') {
    			$go = $('['+opt.dtGroupOpen+'="'+group+'"]');
    			$gc = $('['+opt.dtGroupCont+'="'+group+'"]');

    			if($cont.length && option == 'open') {
	    			$go = $go.not($t);
	    			$gc = $gc.not($cont);
    			}
    		} else if(option == 'close') {
    			$go = $t;
    			$gc = $cont;
    		}

    		if($gc.length) {
    			$go.removeClass(opt.active);
    			$gc.slideUp(300, function() {
						$t.trigger('hidden');
					})
					.removeClass(opt.active);
    		}
    	} else {
	    	if($cont.length) {
		    	$t.removeClass(opt.active);
					$cont.slideUp(300, function() {
						$t.trigger('hidden');
					})
					.removeClass(opt.active);
				}
			}
    }

    function toggle($t) {
    	if($t.hasClass(opt.active)) {
				close($t);

			} else {
				close($t);
				open($t);
			}
    }
	};
}(jQuery));
