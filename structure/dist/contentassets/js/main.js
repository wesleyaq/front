/* ===========
 * Project: Template
 * Start Date: 2016-09-26
 * By: wesleyaltamiranda@gmail.com
 * ======== */

var jq = $.noConflict();

var resizeTimer,
BREAKPOINT_XS = 360,
BREAKPOINT_SM = 767,
BREAKPOINT_MD = 992,
BREAKPOINT_LG = 1200;

jq(function() {

	/**
	 *  Dropdown Menu
	 *  Use: Main Menu
	 */
	menuDropdown.init(jq('.js-btn-menu-products'));

	/**
	*  Menu Items Mobile
	*  By: wesleyaltamiranda@gmail.com
	*/
	jq('.btn-menu-items').on('click', function() {
		var $this = jq(this),
		opt = $this.attr('data-option');

		if($this.attr('data-event') == 'click') {
			jq('.btn-menu-items').not($this).removeClass('selected');
			$this.toggleClass('selected');

			if(opt == "open") {
				$this.attr('data-option', 'close');

			} else if(opt == 'close') {
				$this.attr('data-option', 'open');
			}
		}
	});

	/**
	 * Resize
	 * Use: For Responsive
	 */
	jq(window).on('load resize', function() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(resizeFunction, 250);
	});

	// Fin jq(document).ready();
});

/**
*  Dropdown Menu
*  By: wesleyaltamiranda@gmail.com
*/
var menuDropdown = {
	$button: null,
	$menuContent: null,
	setInterOpen: null,
	setInterClose: null,
	setInterSM: null,
	time: 800,
	$btnSMbackMain: null,
	$btnSubItemBack: null,
	touchSW: false,

	init: function($button) {
		this.$button = $button,
		this.$menuContent = jq(this.$button.attr('data-items')),
		this.$btnSMbackMain = this.$menuContent.find('.js-btn-menu-main'),
		this.$btnSubItemBack = this.$menuContent.find('.subitem');

		this.$button.on('mouseenter click', function(e) {
			e.preventDefault();
			var $this = jq(this);

			if($this.attr('data-event') == 'click' && e.type == 'click') {

				if(!$this.hasClass('selected')) {
					menuDropdown.open($this, 'click');

				} else {
					menuDropdown.close($this);
				}

			} else if($this.attr('data-event') == 'hover') {
				var winwidth = jq(window).width();

				if(winwidth > BREAKPOINT_MD) {
					menuDropdown.open($this);

				} else {
					if($this.next(menuDropdown.$menuContent).is(':hidden')) {
						menuDropdown.open($this);

					} else {
						menuDropdown.close($this);
					}
				}
			}
		});

		this.$button.on('mouseleave', function() {
			var winwidth = jq(window).width();

			if(winwidth > BREAKPOINT_MD) {
				menuDropdown.close(jq(this));
			}
		});

		this.$menuContent.on('mouseenter', function() {
			clearTimeout(menuDropdown.setInterClose);
		});

		this.$menuContent.on('mouseleave', function() {
			var winwidth = jq(window).width();

			if(winwidth > BREAKPOINT_MD) {
				menuDropdown.close(jq(this));
			}
		});

		this.$menuContent.find('> ul > li').on('mouseenter', function(e) {
			e.preventDefault();

			menuDropdown.touchSW = false;
			menuDropdown.subMenuOpen(jq(this), 2);
			setTimeout(function() {
				menuDropdown.touchSW = true;
			}, 400);
		});

		this.$menuContent.find('> ul > li .title').on('mouseenter', function(e) {
			e.preventDefault();
			var winwidth = jq(window).width();

			if(winwidth <= BREAKPOINT_MD && menuDropdown.touchSW) {
				menuDropdown.subMenuOpen(jq(this), 3);
			}
		});

		this.$btnSMbackMain.on('click', function(e) {
			e.preventDefault();

			if(jq(this).is(':visible')) {
				menuDropdown.subMenuBack('main');
			}
		});

		jq(document).on('click', this.$btnSubItemBack.selector,function(e) {
			e.preventDefault();

			if(jq(this).is(':visible')) {
				menuDropdown.subMenuBack('subitem');
			}
		});

		this.$menuContent.find('> ul > li > a, .submenu-content').on('mouseenter', function(e) {
			clearTimeout(menuDropdown.setInterSM);
		});

		this.$menuContent.find('> ul > li > a').on('mouseleave', function(e) {
			var winwidth = jq(window).width();

			if(winwidth > BREAKPOINT_MD) {
				menuDropdown.subMenuClose(jq(this));
			}
		});
	},

	open: function($this, event) {
		var winwidth = jq(window).width(),
		ltime = winwidth <= BREAKPOINT_MD? 80: 300;
		clearTimeout(this.setInterClose);

		this.setInterOpen = setTimeout(function() {
			var winwidth = jq(window).width();
			menuDropdown.$menuContent.show();
			menuDropdown.$button.addClass('selected');

			if(winwidth <= BREAKPOINT_MD) {
				menuDropdown.subMenuHeight();
			}
			overlay.close();

			if(event == 'click') {
				overlay.open('#content, .js-header-fixed');
			} else {
				overlay.open('#content');
			}
		}, ltime);
	},

	close: function($this) {
		var winwidth = jq(window).width(),
		ltime = winwidth <= BREAKPOINT_MD? 80: this.time;
		clearTimeout(menuDropdown.setInterOpen);

		this.setInterClose = setTimeout(function() {
			var winwidth = jq(window).width();
			menuDropdown.$button.removeClass('selected');
			menuDropdown.$menuContent.hide();

			if(winwidth > BREAKPOINT_MD) {
				menuDropdown.$menuContent.find('> ul > li > a').removeClass('active');
			}

			if(!jq('.js-btn-quickcart, .js-btn-user').hasClass('active')) {
				overlay.close();
			}
		}, ltime);
	},

	subMenuOpen: function($this, level) {
		var winwidth = jq(window).width();

		if(level == 2) {
			$items = menuDropdown.$menuContent.find('> ul > li');

			$items.find('> a').removeClass('active');
			$this.find('> a').addClass('active');

			if(winwidth <= BREAKPOINT_MD) {
				$items.addClass('hidden');
				$this.removeClass('hidden');

				if($this.index() == 0) {
					setTimeout(function() {
						menuDropdown.$btnSMbackMain.removeClass('hidden');
					}, 1);

				} else {
					menuDropdown.$btnSMbackMain.removeClass('hidden');
				}
			}
		} else if(level == 3) {
			$this.parents('.submenu-content').prev().addClass('subitem');
			$this.parents('ul').siblings('ul').hide();
			$this.parents('.col').siblings('.col').hide();
			$this.addClass('active').siblings('li').show();
		}
	},

	subMenuClose: function($this) {
		this.setInterSM = setTimeout(function() {
			$this.removeClass('active');
		}, 300); //this.time
	},

	subMenuBack: function(option) {
		if(option == 'main') {
			this.$btnSMbackMain.addClass('hidden');
			this.$menuContent.find('> ul > li > a').removeClass('active');
			this.$menuContent.find('> ul > li').removeClass('hidden');
			this.$menuContent.find('.submenu-content .col, .submenu-content ul, .submenu-content li').css('display', '');
			this.$menuContent.find('.subitem').removeClass('subitem');
			this.$menuContent.find('.title').removeClass('active').siblings('li').hide();

		} else if(option == 'subitem') {
			this.$menuContent.find('.subitem').removeClass('subitem');
			this.$menuContent.find('.submenu-content .col, .submenu-content ul, .submenu-content li').css('display', '');
			this.$menuContent.find('.title').removeClass('active');
		}
	},

	subMenuHeight: function(option) {
		if(option == 'remove') {
			this.$menuContent.css({'overflow-y': '', 'height': ''});

		} else {
			var top = 97, //this.$menuContent.position().top,
			height = jq(window).height();
			height = height - top;
			this.$menuContent.css({'overflow-y': 'auto', 'height': height});
		}
	},

	subMenuReset: function() {
		this.subMenuHeight('remove');
		this.$btnSMbackMain.addClass('hidden');
		this.$menuContent.find('> ul > li').removeClass('hidden');
		this.$menuContent.find('.submenu-content ul, .submenu-content li, .submenu-content .col').css('display', '');
		this.$menuContent.find('.subitem').removeClass('subitem');
		this.$menuContent.find('.title').removeClass('active');
	},

	subMenuWidth: function(option) {
		if(option == 'remove') {
			this.$menuContent.find('.submenu-content').css({'width': ''});

		} else {
			var width = this.$menuContent.parents('.container').width();
			width = width - this.$menuContent.parents('#header-menu-products').width();
			this.$menuContent.find('.submenu-content').css({'width': width});
		}
	},

	responsive: function(device) {
		if(device == 'mobile') {
			if(this.$menuContent.is(':visible')) {
				overlay.open('#content, .js-header-fixed');

				if(this.$menuContent.find('> ul > li > a').hasClass('active')) {
					this.$btnSMbackMain.removeClass('hidden');
				}
			}
		} else if(device == 'tablet') {
			if(this.$menuContent.is(':visible')) {
				if(this.$menuContent.find('> ul > li > a').hasClass('active')) {
					this.$btnSMbackMain.removeClass('hidden');
				}
				overlay.close('.js-header-fixed');
			}
		} else if(device == 'desktop') {
			if(this.$menuContent.is(':visible')) {
				overlay.close('.js-header-fixed');
			}
		}
	}
}

/**
*  Overlay
*  By: wesleyaltamiranda@gmail.com
*/
var overlay = {
	objOverlay: 'js-overlay',

	open: function(obj) {
		jq(obj).each(function() {
			var $this = jq(this);
			if(!$this.find('.'+overlay.objOverlay).length) {
				$this.append('<div class="overlay '+overlay.objOverlay+'"></div>');
				jq('body').addClass("modal-open");
			}
		});
	},
	close: function(obj) {
		if(obj) {
			jq(obj).find('.'+this.objOverlay).remove();

		} else {
			jq('.'+this.objOverlay).remove();
		}
		jq('body').removeClass("modal-open");
	}
}

/**
*  Ini Fixed Scroll
*  By: wesleyaltamiranda@gmail.com
*/
var elementFixed = {
	$obj: null,

	init: function ($object, top) {
		this.$obj=$object;

		this.$obj.sticky({
			topSpacing: top,
	    getWidthFrom: jq('body'),
	    responsiveWidth: true
		});
	},

	destroy: function($object) {
		$object.unsticky();
	}
}

/**
*  User Box User
*  By: wesleyaltamiranda@gmail.com
*/
var boxUser = {
	$button: null,
	$content: null,

	init: function(button) {
		this.$button = jq(button);

		this.$button.on('click', function(e) {
		  if(!jq(e.target).hasClass('btn-link')) {
		  	e.preventDefault();
		  	boxUser.$button.toggleClass('active');

		    if(boxUser.$button.hasClass('active')) {
		      boxUser.open('.js-box-user');

		    } else {
		    	boxUser.close('.js-box-user');
		    }
		  }
		});

		jq(document).on('click', '.js-overlay', function() {
			if(jq('.js-box-user').is(':visible')) {
				boxUser.close('.js-box-user');
			}
		});
	},

	open: function(content) {
		jq(content).removeClass('hidden');
    overlay.close();
    overlay.open('#content, .js-header-fixed');
    jq('.js-btn-menu-products').next().hide();
	},

	close: function(content) {
		this.$button.removeClass('active');
    jq(content).addClass('hidden');
    overlay.close();
	},

	responsiveOpen: function() {
		if(this.$button.hasClass('active')) {
			overlay.open('#content, .js-header-fixed');
		}
	},

	responsiveClose: function() {
		if(this.$button.hasClass('active')) {
			overlay.close();
		}
	}
}

/**
*  Resize
*  By: wesleyaltamiranda@gmail.com
*/
function resizeFunction() {
  var $win = jq(window),
  wwidth = $win.width();

  if(wwidth <= BREAKPOINT_SM) {
  	/**
		*  Slider Options
	  *  Use: header.jade
	  */
		menuDropdown.subMenuHeight();
		menuDropdown.subMenuWidth('remove');
		menuDropdown.responsive('mobile');
		//boxSearch.inputMobileOpen();
		//boxUser.responsiveClose();

  } else if(wwidth <= BREAKPOINT_MD) {
  	menuDropdown.subMenuHeight();
  	menuDropdown.subMenuWidth('remove');
  	menuDropdown.responsive('tablet');
  	// boxSearch.inputMobileClose();
  	// boxUser.responsiveOpen();

  } else if(wwidth <= BREAKPOINT_LG) {
  	menuDropdown.subMenuReset('remove');
  	menuDropdown.subMenuWidth('remove');
  	menuDropdown.responsive('desktop');
  	// boxSearch.inputMobileClose();
  	// boxUser.responsiveOpen();

  } else {
  	menuDropdown.subMenuReset('remove');
  	menuDropdown.subMenuWidth();
  	menuDropdown.responsive('desktop');
  	// boxSearch.inputMobileClose();
  	// boxUser.responsiveOpen();
  }
}
