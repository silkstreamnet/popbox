(function($,window){
    (function () {var minimum_required_popbox_version = '3.0.0'.split('.');for (var pvi = 0, pvl = $.Popbox.prototype.version.split('.'); pvi < pvl.length; pvi++) {if ((+pvl[pvi]) < (+minimum_required_popbox_version[pvi])) {console.log("Error: Popbox " + minimum_required_popbox_version.join('.') + "+ required.");}}})();

    // check in "update" function for if the ajax url is specified in the new settings and make the request
    var _static = $.Popbox.prototype._static,
        extend_default_settings = {
        ajax:{
            url:'', // the url for the ajax call
            cache:false, // cache ajax call determines whether to run just once or every time popbox is opened
            data:'', // data to send with the ajax call
            selector:'', // get content directly from selected items in the html returned (only for html received and set_content is true)
            set_content:true // set the content of popbox to the returned value from the call
            // support ajax call options like complete/success/error/beforeSend
        }
    };

    $.extend(true,$.Popbox.prototype.default_settings,extend_default_settings);

    // add a "timeout" option to the jquery ajax call? http://api.jquery.com/jquery.ajax/

    _static.addHook('after_update_dom',function(){
        // ajax call to retrieve content from url provided
        // store whether this has run, only run more than once on open if cache is false
    });

    $.Popbox.prototype.plugins.ajax = '1.0.0';

})(jQuery,window);