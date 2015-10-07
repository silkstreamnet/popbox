(function($,window){

    var minimum_required_popbox_version = '3.0.0'.split('.');
    var popbox_version = (typeof $.Popbox === "undefined" || typeof $.Popbox.prototype.version === "undefined") ? false : $.Popbox.prototype.version.split('.');

    if (!popbox_version || parseInt(popbox_version[0],10) < 3) {
        console.log("Error: Popbox "+minimum_required_popbox_version+"+ required.");
        return;
    }


})(jQuery,window);