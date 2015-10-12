(function($,window){

    var minimum_required_popbox_version = '3.0.0'.split('.');
    var popbox_version = (typeof $.Popbox === "undefined" || typeof $.Popbox.prototype.version === "undefined") ? false : $.Popbox.prototype.version.split('.');

    if (!popbox_version || parseInt(popbox_version[0],10) < 3) {
        console.log("Error: Popbox "+minimum_required_popbox_version+"+ required.");
        return;
    }

    // check in "update" function for if the ajax url is specified in the new settings and make the request

    var extend_default_settings = {
        ajax:{
            url:'', // the url for the ajax call
            reload:false, // resend ajax call every time popbox opens
            data:'', // data to send with the ajax call
            selector:'', // get content directly from selected items in the html returned
            set_content:true // set the content of popbox to the returned value from the call
            // support ajax call options like complete/success/error/beforeSend
        }
    };

    // add a "timeout" option to the jquery ajax call? http://api.jquery.com/jquery.ajax/

})(jQuery,window);