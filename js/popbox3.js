(function($,window){

    var $window = $(window),
        $body = $('body'),
        _next_instance_id = 0,
        _instances = {length:0},
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
    _static.isFunction = function(func) {
        return typeof func === "function";
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

    var Popbox = function(settings){
        var _Popbox = this;

        _Popbox._private._Popbox = _Popbox;

        _Popbox.settings = $.extend(true,{},_Popbox.default_settings,_static.param(settings,{}));
        _Popbox.properties = {
            instance_id:_next_instance_id
        };

        _Popbox._private.eraseMode();
        _Popbox._private.applyMode();

        _next_instance_id++;
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
        close:'X',
        title:'',
        href:'', //can be used for none-anchor elements to grab content
        cache:false,
        mode:false, //normal, can be 'gallery'
        on_open:false,
        after_open:false,
        on_close:false,
        after_close:false
    };
    Popbox.prototype.modes = {}; // override prototype functions
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
    Popbox.prototype._private = {};

    Popbox.prototype._private.eraseMode = function() {
        var _Popbox = this._Popbox;

        if (_static.isString(_Popbox.settings.mode) && _static.isSet(_Popbox.modes[_Popbox.settings.mode])) {
            var mode_data = _Popbox.modes[_Popbox.settings.mode],
                method;

            for (method in mode_data) {
                if (mode_data.hasOwnProperty(method) && _static.isSet(_Popbox[method])) {
                    delete _Popbox[method];
                }
            }

            if (_static.isSet(mode_data._private)){
                for (method in mode_data._private) {
                    if (mode_data._private.hasOwnProperty(method) && _static.isSet(_Popbox._private[method])) {
                        delete _Popbox._private[method];
                    }
                }
            }
        }

        _Popbox.properties = {
            is_open:false,
            instance_id:_Popbox.properties.instance_id
        };
        _Popbox.elements = {
            $popbox:false,
            $popbox_overlay:false,
            $popbox_title:false,
            $popbox_close:false,
            $popbox_content:false
        };
    };

    Popbox.prototype._private.applyMode = function(){
        var _Popbox = this._Popbox;

        // check if mode exists and has override methods
        if (_static.isString(_Popbox.settings.mode) && _static.isSet(_Popbox.modes[_Popbox.settings.mode])) {
            var mode_data = _Popbox.modes[_Popbox.settings.mode],
                method;

            for (method in mode_data) {
                if (mode_data.hasOwnProperty(method) && _static.isFunction(mode_data[method])) {
                    _Popbox[method] = mode_data[method];
                }
            }

            if (_static.isSet(mode_data._private)){
                for (method in mode_data._private) {
                    if (mode_data._private.hasOwnProperty(method) && _static.isFunction(mode_data._private[method])) {
                        _Popbox._private[method] = mode_data._private[method];
                    }
                }

                if (_static.isFunction(mode_data._private.initiate)) {
                    mode_data._private.initiate();
                }
            }
        }
    };

    Popbox.prototype._private.createOverlay = function(){
        var _Popbox = this._Popbox;
        // add close button to overlay?

        var $container = (_Popbox.settings.container) ? $(_Popbox.settings.container) : $body,
            $existing_popbox_overlay = $container.children('.popbox-overlay');

        if ($existing_popbox_overlay.length) {
            _Popbox.elements.$popbox_overlay = $existing_popbox_overlay;
        }
        else {
            _Popbox.elements.$popbox_overlay = $('<a/>',{
                'class':'popbox-overlay',
                'href':'javascript:void(0);',
                'css':{
                    'display':'none',
                    'position':'fixed',
                    'top':'0',
                    'right':'0',
                    'bottom':'0',
                    'left':'0'
                }
            }).appendTo($container);
        }

        _Popbox.elements.$popbox_overlay.on('click.'+_event_namespace,function(e){
            e.preventDefault();
            for (var i in _instances) {
                if (_instances.hasOwnProperty(i)) {
                    if (_instances[i] instanceof Popbox && _instances[i].isOpen()) {
                        _instances[i].close();
                    }
                }
            }
            return false;
        });
    };

    Popbox.prototype._private.destroyOverlay = function(){
        var _Popbox = this._Popbox;

        if (_instances.length <= 0 && _Popbox.elements.$popbox_overlay) {
            _Popbox.elements.$popbox_overlay.remove();
        }
    };

    Popbox.prototype._private.showOverlay = function(){
        var _Popbox = this._Popbox;

        if (!_Popbox.isOpen()) {
            if (!_Popbox.elements.$popbox_overlay) {
                _Popbox._private.createOverlay();
            }

            _Popbox.elements.$popbox_overlay.css({
                'display':'block'
            });
        }
    };

    Popbox.prototype._private.hideOverlay = function(){
        var _Popbox = this._Popbox;

        if (_Popbox.isOpen() && _Popbox.elements.$popbox_overlay) {
            _Popbox.elements.$popbox_overlay.css({
                'display':'none'
            });
        }
    };

    Popbox.prototype.create = function(){
        var _Popbox = this;

        _Popbox.destroy();
        _Popbox._private.createOverlay();

        var $container = (_Popbox.settings.container) ? $(_Popbox.settings.container) : $body;

        _Popbox.elements.$popbox = $('<div/>',{
            'class':'popbox',
            'css':{
                'display':'none',
                'position':'absolute',
                'top':'0',
                'left':'0'
            }
        });

        _Popbox.elements.$popbox_close = $('<a/>',{
            'class':'popbox-close',
            'href':'javascript:void(0);'
        }).html(_Popbox.settings.close).appendTo(_Popbox.elements.$popbox);

        _Popbox.elements.$popbox_title = $('<div/>',{
            'class':'popbox-title'
        }).html(_Popbox.settings.title).appendTo(_Popbox.elements.$popbox);

        _Popbox.elements.$popbox_popup_content = $('<div/>',{
            'class':'popbox-content'
        }).html(_Popbox.settings.content).appendTo(_Popbox.elements.$popbox);

        // events
        _Popbox.elements.$popbox_close.on('click.'+_event_namespace,function(e){
            e.preventDefault();
            _Popbox.close();
            return false;
        });


        _Popbox.elements.$popbox.appendTo($container);

        _instances[_Popbox.properties.instance_id] = _Popbox;
        _instances.length++;
    };

    Popbox.prototype.destroy = function(){
        var _Popbox = this;

        if (_Popbox.elements.$popbox) {
            _Popbox.elements.$popbox.remove();

            if (_static.isSet(_instances[_Popbox.properties.instance_id])) {
                delete _instances[_Popbox.properties.instance_id];
                _instances.length--;
            }

            _Popbox._private.destroyOverlay();
            _Popbox._private.eraseMode();
        }
    };

    Popbox.prototype.update = function(settings){
        var _Popbox = this;

        // can't change mode in this function
        if (_static.isSet(settings.mode)) delete settings.mode;

        $.extend(true,_Popbox.settings,_static.param(settings,{}));

        // perform an adjust
        _Popbox.adjust();
    };

    Popbox.prototype.changeMode = function(new_mode){
        var _Popbox = this;

        if (!_Popbox.isOpen()) {
            // erase existing mode functions
            _Popbox._private.eraseMode();
            _Popbox.settings.mode = new_mode || false;
            _Popbox._private.applyMode();
        }
    };

    Popbox.prototype.open = function(){
        var _Popbox = this;

        if (!_Popbox.isOpen()) {
            if (!_Popbox.elements.$popbox) {
                _Popbox.create();
            }

            _Popbox._private.showOverlay();

            _Popbox.elements.$popbox.css({
                'display':'block'
            });

            _Popbox.properties.is_open = true;
        }
    };

    Popbox.prototype.close = function(destroy){
        var _Popbox = this;

        if (_Popbox.isOpen()) {

            _Popbox.elements.$popbox.css({
                'display':'none'
            });

            _Popbox._private.hideOverlay();

            if (destroy || !_Popbox.settings.cache) {
                _Popbox.destroy();
            }

            _Popbox.properties.is_open = false;
        }
    };

    Popbox.prototype.adjust = function(){
        var _Popbox = this;

    };

    Popbox.prototype.isOpen = function(){
        var _Popbox = this;
        return _Popbox.properties.is_open;
    };


    // global events
    $window.on('resize.'+_event_namespace,function(){
        if (_instances.length > 0) {
            for (var i in _instances) {
                if (_instances.hasOwnProperty(i)) {
                    if (_instances[i] instanceof Popbox && _instances[i].isOpen()) {
                        _instances[i].adjust();
                    }
                }
            }
        }
    });


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

    $('.create-popbox').PopBox();

})(jQuery,window);