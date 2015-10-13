(function($,window){
    var minimum_required_popbox_version = '3.0.0'.split('.');
    var popbox_version = (typeof $.Popbox === "undefined" || typeof $.Popbox.prototype.version === "undefined") ? false : $.Popbox.prototype.version.split('.');

    if (!popbox_version || parseInt(popbox_version[0],10) < 3) {
        console.log("Error: Popbox "+minimum_required_popbox_version+"+ required.");
        return;
    }

    var extend_default_settings = {
        gallery:{ // mode must be set to gallery for this to be used
            loading:'<div>Loading...</div>',
            error:'<div>There was an error loading the image.</div>',
            name:'', // class to get images, either is the image or the first image inside
            next:'<span>&#x25B6;</span>',
            prev:'<span>&#x25C0;</span>'
        }
    };

    // put the next and previous buttons in the popbox
    // replace the main content with the error

    $.Popbox.prototype.modes.gallery = {
        _private:{}
    };

    $.Popbox.prototype.modes.gallery._private.initiate = function(){

    };

    $.Popbox.prototype.modes.gallery.adjust = function(){

    };

    $.extend(true,$.Popbox.prototype.default_settings,extend_default_settings);

})(jQuery,window);