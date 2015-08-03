(function($){

    var minimum_required_popbox_version = '3.0.0'.split('.');
    var popbox_version = (typeof $.Popbox === "undefined") ? false : $.Popbox.prototype.version.split('.');

    if (!popbox_version || parseInt(popbox_version[0],10) < 3) {
        console.log("Error: Popbox "+minimum_required_popbox_version+"+ required.");
        return;
    }

    var extend_animations = {
        'slide_up':{
            'open':[{
                'opacity':'0',
                'transform':'translateY(100px)'
            },{
                'opacity':'1',
                'transform':'translateY(0)'
            }],
            'close':[{
                'opacity':'1',
                'transform':'translateY(0)'
            },{
                'opacity':'0',
                'transform':'translateY(-100px)'
            }]
        },
        'zoom':{
            'open':[{
                'opacity':'0',
                'transform':'scale(0.5)'
            },{
                'opacity':'1',
                'transform':'scale(1)'
            }],
            'close':[{
                'opacity':'1',
                'transform':'scale(1)'
            },{
                'opacity':'0',
                'transform':'scale(0.5)'
            }]
        },
        'fold':{
            'open':[{
                'opacity':'0'
            },{
                'opacity':'1'
            }],
            'close':[{
                'opacity':'1'
            },{
                'opacity':'0'
            }]
        }
    };

    $.extend(true,$.Popbox.prototype.animations,extend_animations);

})(jQuery);