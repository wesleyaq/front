var Coloring;
(function (Coloring) {
    var GreenifyOptions = (function () {
        function GreenifyOptions(color, backgroundColor) {
            this.color = color;
            this.backgroundColor = backgroundColor;
        }
        return GreenifyOptions;
    }());
    Coloring.GreenifyOptions = GreenifyOptions;
    var Greenify = (function () {
        function Greenify(element, options) {
            this.element = element;
            this.options = options;
            this.onCreate();
        }
        Greenify.prototype.onCreate = function () {
            this.element.css('color', this.options.color).css('background-color', this.options.backgroundColor);
        };
        return Greenify;
    }());
    Coloring.Greenify = Greenify;
})(Coloring || (Coloring = {}));
//jquery plugin wrapper.
(function (w, $) {
    if (!$)
        return false;
    $.fn.extend({
        Coloring: function (opts) {
            //defaults
            var defaults = new Coloring.GreenifyOptions('#0F0', '#000');
            var opts = $.extend(defaults, opts);
            return this.each(function () {
                var o = opts, obj = $(this);
                new Coloring.Greenify(obj, o);
            });
        }
    });
})(window, jQuery);
$(function () {
    var $a = $('a').Coloring(), $p = $('p').Coloring({ color: '#F0F', backgroundColor: '#FFF' });
});
