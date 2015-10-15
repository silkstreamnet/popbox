(function($,window){
    var minimum_required_popbox_version = '3.0.0'.split('.');
    var popbox_version = (typeof $.Popbox === "undefined" || typeof $.Popbox.prototype.version === "undefined") ? false : $.Popbox.prototype.version.split('.');

    if (!popbox_version || parseInt(popbox_version[0],10) < 3) {
        console.log("Error: Popbox "+minimum_required_popbox_version+"+ required.");
        return;
    }

    var _static = $.Popbox.prototype._static,
        extend_default_settings = {
        gallery:{ // mode must be set to gallery for this to be used
            loading:'<div>Loading...</div>',
            error:'<div>There was an error loading the image.</div>',
            name:'', // class to get images, either is the image or the first image inside
            next:'<span>&#x25B6;</span>',
            prev:'<span>&#x25C0;</span>'
        }
    };

    $.extend(true,$.Popbox.prototype.default_settings,extend_default_settings);

    _static.addHook('after_update_dom',function(){
        var popbox = this;
        if (popbox.settings.mode === 'gallery') {
            // put the next and previous buttons in the popbox
            if (!popbox.elements.$popbox_gallery_next) {
                popbox.elements.$popbox_gallery_next = $('<div/>',{
                    'class':'popbox-gallery-next'
                }).html(popbox.settings.gallery.next).appendTo(popbox.elements.$popbox_container);
            }
            if (!popbox.elements.$popbox_gallery_prev) {
                popbox.elements.$popbox_gallery_prev = $('<div/>',{
                    'class':'popbox-gallery-prev'
                }).html(popbox.settings.gallery.prev).appendTo(popbox.elements.$popbox_container);
            }
        }
        else {
            // remove the next and previous buttons from the popbox if they exist
            if (popbox.elements.$popbox_gallery_next) {
                popbox.elements.$popbox_gallery_next.remove();
                popbox.elements.$popbox_gallery_next = false;
            }
            if (popbox.elements.$popbox_gallery_prev) {
                popbox.elements.$popbox_gallery_prev.remove();
                popbox.elements.$popbox_gallery_prev = false;
            }
        }
    });

    _static.addHook('after_update_dom',function(){
        var popbox = this;
        popbox.elements.$popbox_gallery_next = false;
        popbox.elements.$popbox_gallery_prev = false;
    });

    // replace the main content with the error

    /*$.Popbox.prototype.modes.gallery = {
        _private:{}
    };

    $.Popbox.prototype.modes.gallery._private.initiate = function(){

    };*/

})(jQuery,window);