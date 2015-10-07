(function($,window){
    var minimum_required_popbox_version = '3.0.0'.split('.');
    var popbox_version = (typeof $.Popbox === "undefined" || typeof $.Popbox.prototype.version === "undefined") ? false : $.Popbox.prototype.version.split('.');

    if (!popbox_version || parseInt(popbox_version[0],10) < 3) {
        console.log("Error: Popbox "+minimum_required_popbox_version+"+ required.");
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

    $.Popbox.prototype.modes.gallery = {
        _private:{}
    };

    $.Popbox.prototype.modes.gallery._private.initiate = function(){

    };

    $.Popbox.prototype.modes.gallery.adjust = function(){

    };

    $.extend(true,$.Popbox.prototype.default_settings,extend_settings);

})(jQuery,window);