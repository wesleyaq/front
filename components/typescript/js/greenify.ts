module Coloring {
  interface IGreenifyOptions {
    color: string;
    backgroundColor: string;
  }

  export class GreenifyOptions implements IGreenifyOptions {
    // Fields
    color: string;
    backgroundColor: string;

    constructor(color: string, backgroundColor: string) {
      this.color = color;
      this.backgroundColor = backgroundColor;
    }
  }

  export class Greenify {
    // Fields
    element: jQuery;
    options: GreenifyOptions;

    constructor(element: jQuery, options: GreenifyOptions) {
      this.element = element;
      this.options = options;

      this.onCreate();
    }

    onCreate() {
      this.element.css('color', this.options.color).css('background-color', this.options.backgroundColor);
    }
  }
}

//jquery plugin wrapper.
(function(w,$) {
  if(!$) return false;
  
  $.fn.extend({
    Coloring: function(opts) {
        
      //defaults
      var defaults: Coloring.GreenifyOptions = new Coloring.GreenifyOptions('#0F0', '#000');
      
      var opts = $.extend(defaults, opts);
      
      return this.each(function() {
        var o = opts,
        obj = $(this);
        new Coloring.Greenify(obj, o);
          
      });
    }        
  });
})(window, jQuery);

$(function() {
	var $a = $('a').Coloring(),
  $p = $('p').Coloring({ color: '#F0F', backgroundColor: '#FFF' });
});