(function($){
    if (typeof $.Popbox === "undefined" || parseInt($.Popbox.prototype.version,10) != 3) {
        console.log("Error: Popbox v3 not found.");
        return;
    }

    var extend_animations = {
        'slide':{
            'open':'',
            'close':''
        },
        'slideDown':{
            'open':'',
            'close':''
        },
        'slideUp':{
            'open':'',
            'close':''
        },
        'zoom':{
            'open':'',
            'close':''
        },
        'zoomBig':{
            'open':'',
            'close':''
        },
        'zoomSmall':{
            'open':'',
            'close':''
        }
    };

    $.extend(true,$.Popbox.prototype.animations,extend_animations);

})(jQuery);