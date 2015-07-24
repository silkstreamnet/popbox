(function($,window){

    var $window = $(window),
        $body = $('body'),
        _instances = [],
        _static = {},
        _event_namespace = 'Popbox'; // event namespace - evna

    _static.param = function(parameter,_default) {
        return (typeof parameter !== 'undefined' ? parameter : _default);
    };
    _static.regexEscape = function(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    _static.isSet = function(value) {
        return typeof value !== "undefined";
    };
    _static.isNumber = function(number,required) {
        return ! isNaN (number-0) && number != null && number != "" && (!_static.param(required,false) || number > 0);
    };
    _static.isString = function(string,required) {
        return typeof string === "string" && string != null && (!_static.param(required,false) || string != '');
    };
    _static.getAttributeString = function($object,attr) {
        var val = $object.attr(attr);
        return (typeof val === 'undefined' || val === false || val === '') ? '' : val;
    };
    _static.applyDataToSettings = function($object,defaults,settings,stage) {
        stage = param(stage,'');

        for (var property in defaults) {
            if (defaults.hasOwnProperty(property)) {
                var data_property = stage+property.toLowerCase().replace('_','-');

                if (typeof defaults[property] === 'object') {
                    if (typeof settings[property] !== 'object') settings[p] = {};
                    _static.applyDataToSettings($object,defaults[p],settings[p],data_property+'-');
                }
                else {
                    var data = $object.data(data_property);
                    if (typeof data !== 'undefined') {
                        var data_float = parseFloat(data);
                        if (data == 'true') data = !0;
                        else if (data == 'false') data = !1;
                        else if (data_float == data) data = data_float;

                        settings[p] = data;
                    }
                }
            }
        }
    };
    _static.indexOf = function(value,array,strict) {
        strict = strict || false;

        if (array instanceof Array) {
            for (var i=0; i<array.length; i++) {
                if (strict) {
                    if (array[i] === value) {
                        return i;
                    }
                }
                else if (array[i] == value) {
                    return i;
                }
            }
        }
        return -1;
    };
    _static.getInlineStyle = function($object,style)
    {
        var full_inline_style = _static.getAttributeString($object,'style');
        if (style && full_inline_style) {
            var r = new RegExp('(^|;)\\s*'+_static.regexEscape(style)+'\\s*:');
            if (full_inline_style.match(r)) {
                return $object.css(style);
            }
        }
        return '';
    };



    $window.on('resize.'+_event_namespace,function(){
        if (_instances.length) {
            for (var i=0; i<_instances.length; i++) {
                if (_instances[i].isOpen()) {
                    _instances[i].adjust();
                }
            }
        }
    });

    var Popbox = function(settings){
        var _Popbox = this;

        _Popbox.settings = $.extend(true,{},_Popbox.default_settings,_static.param(settings,{}));
        _Popbox.properties = {
            is_open:false
        };

        if (_static.isString(_Popbox.settings.mode) && _static.isSet(_Popbox.prototype.modes[_Popbox.settings.mode])) {
            for (var method in _Popbox.prototype.modes[_Popbox.settings.mode]) {
                if (_Popbox.prototype.modes[_Popbox.settings.mode].hasOwnProperty(method)) {
                    _Popbox[method] = _Popbox.prototype.modes[_Popbox.settings.mode][method];
                }
            }
        }
    };

    Popbox.prototype.version = '3.0.0';

    Popbox.prototype.default_settings = {
        width:false, //auto
        height:false, //auto
        max_width:false, //none
        max_height:false, //none
        container:false, //specify an alternate container to body
        animation:'fade',
        animation_duration:400,
        switch_animation:'fade', // for when content is changed, can accept special 'replace'
        open_animation:'fade',
        close_animation:'fade',
        content:'',
        close:'',
        title:'',
        href:'', //can be used for none-anchor elements to grab content
        mode:false, //normal, can be 'gallery'
        on_open:false,
        after_open:false,
        on_close:false,
        after_close:false
    };

    Popbox.prototype.animations = {
        'fade':{
            'open':'',
            'close':''
        },
        'fadeIn':{
            'open':''
        },
        'fadeOut':{
            'close':''
        }
    };

    Popbox.prototype.modes = {}; // override prototype functions

    Popbox.prototype._private = {};

    Popbox.prototype.update = function(settings){
        var _Popbox = this;
        $.extend(true,_Popbox.settings,_static.param(settings,{}));
    };

    Popbox.prototype.open = function(){

    };

    Popbox.prototype.close = function(){

    };

    Popbox.prototype.adjust = function(){

    };

    Popbox.prototype.isOpen = function(){
        return this.properties.is_open;
        // could check for element length and is(':visible') for more robust result
    };

    $.fn.PopBox = function(settings) {

        settings = _static.param(settings,{});
        var $elements = $(this);

        if ($elements.length) {
            $elements.each(function() {
                var $element = $(this),
                    _popbox = new PopBox(settings);

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
    };

    $.Popbox = Popbox;

    $('.popbox-auto').PopBox();

})(jQuery,window);