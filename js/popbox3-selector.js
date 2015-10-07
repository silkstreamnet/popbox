(function($,window){

    var minimum_required_popbox_version = '3.0.0'.split('.');
    var popbox_version = (typeof $.Popbox === "undefined" || typeof $.Popbox.prototype.version === "undefined") ? false : $.Popbox.prototype.version.split('.');

    if (!popbox_version || parseInt(popbox_version[0],10) < 3) {
        console.log("Error: Popbox "+minimum_required_popbox_version+"+ required.");
        return;
    }

    var _static = $.Popbox.prototype._static;
    $.fn.PopBox = function(settings) {
        settings = _static.param(settings,{});
        var $elements = $(this);
        if ($elements.length) {
            $elements.each(function() {
                var $element = $(this),
                    _popbox = new $.Popbox(settings);
                $element.on('click.'+_event_namespace,function(e){
                    e.preventDefault();
                    // update data settings
                    // process video or image link
                    // display popup
                    return false;
                });
                // bind created popbox to element
                $element.data('Popbox',_popbox);
            });
        }
        return this;
    };
})(jQuery,window);