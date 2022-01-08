import $ from "jquery"

export const addAnimationsPlugin = function(Popbox){
    const extend_animations = {
        'slide_up':{
            'open':[{
                'transform':'translateY(2000px)'
            },{
                'transform':'translateY(0px)'
            }],
            'close':[{
                'transform':'translateY(0px)'
            },{
                'transform':'translateY(-2000px)'
            }]
        },
        'slide_down':{
            'open':[{
                'transform':'translateY(-2000px)'
            },{
                'transform':'translateY(0px)'
            }],
            'close':[{
                'transform':'translateY(0px)'
            },{
                'transform':'translateY(2000px)'
            }]
        },
        'float_up':{
            'open':[{
                'opacity':'0',
                'transform':'translateY(100px)'
            },{
                'opacity':'1',
                'transform':'translateY(0px)'
            }],
            'close':[{
                'opacity':'1',
                'transform':'translateY(0px)'
            },{
                'opacity':'0',
                'transform':'translateY(-100px)'
            }]
        },
        'float_down':{
            'open':[{
                'opacity':'0',
                'transform':'translateY(-100px)'
            },{
                'opacity':'1',
                'transform':'translateY(0px)'
            }],
            'close':[{
                'opacity':'1',
                'transform':'translateY(0px)'
            },{
                'opacity':'0',
                'transform':'translateY(100px)'
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
        // zoom big / zoom small
        'fold':{
            'open':[{
                'opacity':'0',
                'transform':'rotateX(5deg) scale(0.9)'
            },{
                'opacity':'1',
                'transform':'rotateX(0deg) scale(1)'
            }],
            'close':[{
                'opacity':'1',
                'transform':'rotateX(0deg) scale(1)'
            },{
                'opacity':'0',
                'transform':'rotateX(5deg) scale(0.9)'
            }]
        }
    };

    $.extend(true,Popbox.prototype.animations,extend_animations);
    Popbox.prototype.plugins.animations = __VERSION__;
};
