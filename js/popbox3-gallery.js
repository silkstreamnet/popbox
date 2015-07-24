(function($){
    if (typeof $.Popbox === "undefined" || parseInt($.Popbox.prototype.version,10) != 3) {
        console.log("Error: Popbox v3 not found.");
        return;
    }

    var extend_settings = {
        gallery:{ // mode must be set to gallery for this to be used
            loading:'<div>Loading...</div>',
            error:'<div>There was an error loading the image.</div>',
            name:'',
            next:'<span>&#x25B6;</span>',
            prev:'<span>&#x25C0;</span>'
        }
    };

    $.Popbox.prototype.modes.gallery = {};

    $.Popbox.prototype.modes.gallery.adjust = function(){

    };

    $.extend(true,$.Popbox.prototype.default_settings,extend_settings);

})(jQuery);