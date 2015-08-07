(function($,window){

    var $window = $(window),
        $body = $('body'),
        _event_namespace = 'Popbox',
        _next_instance_id = 0,
        _instances = {length:0},
        _static = {},
        _support = {},
        _speeds = {
            '_default':300,
            'fast':300,
            'medium':600,
            'slow':1000
        },
        _eases = {
            '_default':       'ease',
            'in':             'ease-in',
            'out':            'ease-out',
            'in-out':         'ease-in-out',
            'snap':           'cubic-bezier(0,1,.5,1)',
            // Penner equations
            'easeInCubic':    'cubic-bezier(.550,.055,.675,.190)',
            'easeOutCubic':   'cubic-bezier(.215,.61,.355,1)',
            'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
            'easeInCirc':     'cubic-bezier(.6,.04,.98,.335)',
            'easeOutCirc':    'cubic-bezier(.075,.82,.165,1)',
            'easeInOutCirc':  'cubic-bezier(.785,.135,.15,.86)',
            'easeInExpo':     'cubic-bezier(.95,.05,.795,.035)',
            'easeOutExpo':    'cubic-bezier(.19,1,.22,1)',
            'easeInOutExpo':  'cubic-bezier(1,0,0,1)',
            'easeInQuad':     'cubic-bezier(.55,.085,.68,.53)',
            'easeOutQuad':    'cubic-bezier(.25,.46,.45,.94)',
            'easeInOutQuad':  'cubic-bezier(.455,.03,.515,.955)',
            'easeInQuart':    'cubic-bezier(.895,.03,.685,.22)',
            'easeOutQuart':   'cubic-bezier(.165,.84,.44,1)',
            'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
            'easeInQuint':    'cubic-bezier(.755,.05,.855,.06)',
            'easeOutQuint':   'cubic-bezier(.23,1,.32,1)',
            'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
            'easeInSine':     'cubic-bezier(.47,0,.745,.715)',
            'easeOutSine':    'cubic-bezier(.39,.575,.565,1)',
            'easeInOutSine':  'cubic-bezier(.445,.05,.55,.95)',
            'easeInBack':     'cubic-bezier(.6,-.28,.735,.045)',
            'easeOutBack':    'cubic-bezier(.175, .885,.32,1.275)',
            'easeInOutBack':  'cubic-bezier(.68,-.55,.265,1.55)'
        },
        transition_end_event_names = {
            'transition':       'transitionend',
            'MozTransition':    'transitionend',
            'OTransition':      'oTransitionEnd',
            'WebkitTransition': 'webkitTransitionEnd',
            'msTransition':     'MSTransitionEnd'
        },
        test_div = document.createElement('div');

    function getVendorPropertyName(prop) {
        if (prop in test_div.style) return prop;

        var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
        var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

        for (var i=0; i<prefixes.length; ++i) {
            var vendorProp = prefixes[i] + prop_;
            if (vendorProp in test_div.style) { return vendorProp; }
        }
    }

    _support.transition         = getVendorPropertyName('transition');
    _support.transform          = getVendorPropertyName('transform');
    _support.transform_origin   = getVendorPropertyName('transformOrigin');
    _support.transition_end     = transition_end_event_names[_support.transition] || null;

    test_div = null;

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
    _static.elementPadding = function($object,dimension,include_margin) {
        dimension = _static.param(dimension,'');
        include_margin = _static.param(include_margin,false);
        if (dimension == 'width') {
            return $object.outerWidth(include_margin)-$object.width();
        }
        else if (dimension == 'height') {
            return $object.outerHeight(include_margin)-$object.height();
        }
        return 0;
    };
    _static.transition = function($object,properties,duration,easing,complete){
        properties = _static.param(properties,{});
        duration = _static.param(duration,_speeds._default);
        easing = _static.param(easing,_eases._default);

        var property,
            transitions = [],
            property_difference = false,
            transitioning = false;

        if (_support.transition_end) {
            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    //TODO jquery converts required prefix for css3, but the property pushed to transition needs to be retrieved e.g. transform, margin, padding
                    transitions.push(property+' '+duration+'ms '+easing);
                    if ($object.css(property) != properties[property]) {
                        property_difference = true;
                    }
                }
            }

            if (transitions.length && property_difference) {

                setTimeout(function(){
                    $object.css('transition',transitions.join(', '));
                    //$object.each(function(){this.offsetWidth = this.offsetWidth;}); // repaint // commented out because repaint probably occurs due to property evaluation in loop above
                    $object.css(properties).addClass('popbox-animating');
                    console.log($object.css('transform'));

                    setTimeout(function(){
                        $object.off('.popbox_auto_transition_end').on(_support.transition_end+'.popbox_auto_transition_end',function(){
                            $object.removeClass('popbox-animating');
                            if (!$object.hasClass('popbox-popup')) $object.css('transition','');
                            $(this).off('.popbox_auto_transition_end');
                        });

                        if (_static.isFunction(complete)) {
                            _static.onTransitionEnd($object,complete);
                        }
                    },1);
                },1);

                transitioning = true;
            }
        }

        if (!transitioning) {

            $object.css(properties);

            if (_static.isFunction(complete)) {
                complete();
            }
        }
    };
    _static.onTransitionEnd = function($object,func) {
        $object.off('.popbox_transition_end').on(_support.transition_end+'.popbox_transition_end',function(){
            if (_static.isFunction(func)) func();
            $(this).off('.popbox_transition_end');
        });
    };
    _static.offTransitionEnd = function($object) {
        $object.off('.popbox_transitionend');
    };

    var Popbox = function(settings){
        var self = this;

        self._private.self = self;

        self.settings = $.extend(true,{},self.default_settings,_static.param(settings,{}));
        self.properties = {
            instance_id:_next_instance_id
        };
        self.elements = {
            $popbox_overlay:null
        };

        self._private.reset();
        self._private.applyMode();

        _next_instance_id++;
    };

    Popbox.prototype.version = '3.0.0';
    Popbox.prototype.default_settings = {
        //width:false, //auto
        //height:false, //auto
        max_width:false, // false|true = 100%, number = pixels
        max_height:false, // false = none, true = 100%, number = pixels. if set, scroll inner is used
        container:false, //specify an alternate container to body
        animation:'fade',
        animation_speed:_speeds._default,
        animation_ease:_eases._default,
        open_animation:null,
        open_animation_speed:null,
        open_animation_ease:null,
        close_animation:null,
        close_animation_speed:null,
        close_animation_ease:null,
        overlay_animation_speed:_speeds._default, // set to true to match the relevant popup animation speed
        overlay_animation_ease:_eases._default,
        open_overlay_animation_speed:null,
        open_overlay_animation_ease:null,
        close_overlay_animation_speed:null,
        close_overlay_animation_ease:null,
        content:'',
        close:'X', // TODO: if set to FALSE, set element to display none
        title:'', // TODO: if set to FALSE, set element to display none
        loading:'',
        href:'', //can be used for none-anchor elements to grab content
        cache:false,
        width_padding:0.1,
        height_padding:0.1,
        mode:false, //normal, can be 'gallery' if extension is available
        on_open:false,
        after_open:false,
        on_close:false,
        after_close:false
    };
    Popbox.prototype.modes = {}; // override prototype functions
    Popbox.prototype.animations = {
        'fade':{
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
    Popbox.prototype._static = _static;
    Popbox.prototype._private = {};

    Popbox.prototype._private.reset = function() {
        var self = this.self;

        if (_static.isString(self.settings.mode) && _static.isSet(self.modes[self.settings.mode])) {
            var mode_data = self.modes[self.settings.mode],
                method;

            for (method in mode_data) {
                if (mode_data.hasOwnProperty(method) && _static.isSet(self[method])) {
                    delete self[method];
                }
            }

            if (_static.isSet(mode_data._private)){
                for (method in mode_data._private) {
                    if (mode_data._private.hasOwnProperty(method) && _static.isSet(self._private[method])) {
                        delete self._private[method];
                    }
                }
            }
        }

        self.properties = {
            is_open:false,
            is_loading:false,
            instance_id:self.properties.instance_id
        };
        self.elements = {
            $popbox:null,
            $popbox_overlay:self.elements.$popbox_overlay, // not part of individual popbox
            $popbox_loading:null,
            $popbox_popup:null,
            $popbox_wrapper:null,
            $popbox_container:null,
            $popbox_title:null,
            $popbox_close:null,
            $popbox_content:null,
            $popbox_bottom_push:null
        };
    };

    Popbox.prototype._private.applyMode = function(){
        var self = this.self;

        // check if mode exists and has override methods
        if (_static.isString(self.settings.mode) && _static.isSet(self.modes[self.settings.mode])) {
            var mode_data = self.modes[self.settings.mode],
                method;

            for (method in mode_data) {
                if (mode_data.hasOwnProperty(method) && _static.isFunction(mode_data[method])) {
                    self[method] = mode_data[method];
                }
            }

            if (_static.isSet(mode_data._private)){
                for (method in mode_data._private) {
                    if (mode_data._private.hasOwnProperty(method) && _static.isFunction(mode_data._private[method])) {
                        self._private[method] = mode_data._private[method];
                    }
                }

                if (_static.isFunction(mode_data._private.initiate)) {
                    mode_data._private.initiate();
                }
            }
        }
    };

    Popbox.prototype._private.createOverlay = function(){
        var self = this.self;
        // add close button to overlay?

        var $container = (self.settings.container) ? $(self.settings.container) : $body,
            $existing_popbox_overlay = $container.children('.popbox-overlay');

        if ($existing_popbox_overlay.length) {
            self.elements.$popbox_overlay = $existing_popbox_overlay;
        }
        else {
            self.elements.$popbox_overlay = $('<a/>',{
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
            }).data('is_open',false).appendTo($container);
        }

        self.elements.$popbox_overlay.off('click.'+_event_namespace).on('click.'+_event_namespace,function(e){
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
        var self = this.self;
        if (_instances.length <= 0 && self.elements.$popbox_overlay) {
            self.elements.$popbox_overlay.remove();
            self.elements.$popbox_overlay = null;
        }
    };

    Popbox.prototype._private.openOverlay = function(){
        var self = this.self;

        if (!self.elements.$popbox_overlay) {
            self._private.createOverlay();
        }

        if (self.elements.$popbox_overlay.data('is_open') === false) {

            self.elements.$popbox_overlay.css({
                'display':'block',
                'opacity':'0'
            });

            _static.transition(
                self.elements.$popbox_overlay,
                {'opacity':'1'},
                self._private.getOverlayAnimationSpeed('open'),
                self._private.getOverlayAnimationEase('open')
            );

            self.elements.$popbox_overlay.data('is_open',true);
        }
    };

    Popbox.prototype._private.closeOverlay = function(){
        var self = this.self;

        if (self.elements.$popbox_overlay) {

            if (self.elements.$popbox_overlay.data('is_open') === true) {
                self.elements.$popbox_overlay.css({'opacity':'1'});

                _static.transition(
                    self.elements.$popbox_overlay,
                    {'opacity':'0'},
                    self._private.getOverlayAnimationSpeed('close'),
                    self._private.getOverlayAnimationEase('close'),
                    function(){
                        if (self.elements.$popbox_overlay) {
                            self.elements.$popbox_overlay.css({
                                'display':'none'
                            });
                        }
                        self._private.destroyOverlay();
                    }
                );

                self.elements.$popbox_overlay.data('is_open',false);
            }
            else if (!self.elements.$popbox_overlay.hasClass('popbox-animating')) {
                self._private.destroyOverlay();
            }
        }
    };

    Popbox.prototype._private.getAnimationStartProperties = function(type){
        var self = this.self;
        return (_static.isSet(self.animations[self.settings.animation])) ? self.animations[self.settings.animation][type][0] : self.animations['fade'][type][0];
    };

    Popbox.prototype._private.getAnimationEndProperties = function(type){
        var self = this.self;
        return (_static.isSet(self.animations[self.settings.animation])) ? self.animations[self.settings.animation][type][self.animations[self.settings.animation][type].length-1] : self.animations['fade'][type][self.animations['fade'][type].length-1];
    };

    Popbox.prototype._private.getAnimationSpeed = function(type){
        var self = this.self;
        return self.settings[type+'_animation_speed'] || self.settings.animation_speed || _speeds._default;
    };

    Popbox.prototype._private.getAnimationEase = function(type){
        var self = this.self;
        return self.settings[type+'_animation_ease'] || self.settings.animation_ease || _eases._default;
    };

    Popbox.prototype._private.getOverlayAnimationSpeed = function(type){
        var self = this.self;
        if (self.settings[type+'_overlay_animation_speed'] === true) return self._private.getAnimationSpeed(type);
        return self.settings[type+'_overlay_animation_speed'] || self.settings.overlay_animation_speed || self._private.getAnimationSpeed(type);
    };

    Popbox.prototype._private.getOverlayAnimationEase = function(type){
        var self = this.self;
        if (self.settings[type+'_overlay_animation_ease'] === true) return self._private.getAnimationEase(type);
        return self.settings[type+'_overlay_animation_ease'] || self.settings.overlay_animation_ease || self._private.getAnimationEase(type);
    };

    Popbox.prototype.create = function(){
        var self = this;

        self.destroy();
        self._private.createOverlay();

        var $container = (self.settings.container) ? $(self.settings.container) : $body;

        self.elements.$popbox = $('<div/>',{
            'class':'popbox',
            'css':{
                'display':'none',
                'position':'fixed',
                'width':'100%',
                'height':'100%',
                'top':'0px',
                'left':'0px',
                'overflow-y':'auto',
                'overflow-x':'hidden'
            }
        });

        self.elements.$popbox_bottom_push = $('<div/>',{
            'class':'popbox-bottom-push',
            'css':{
                'position':'absolute',
                'top':'0px',
                'left':'0px',
                'height':'1px',
                'width':'1px'
            }
        }).appendTo(self.elements.$popbox);

        self.elements.$popbox_popup = $('<div/>',{
            'class':'popbox-popup',
            'css':{
                'display':'none',
                'position':'absolute',
                'top':'50%',
                'left':'50%',
                'bottom':'auto',
                'right':'auto',
                'width':'0px',
                'height':'0px',
                'overflow':'hidden'
            }
        }).appendTo(self.elements.$popbox);

        self.elements.$popbox_loading = $('<div/>',{
            'class':'popbox-loading',
            'css':{
                'display':'none'
            }
        }).html(self.settings.loading).appendTo(self.elements.$popbox_popup);

        self.elements.$popbox_wrapper = $('<div/>',{
            'class':'popbox-wrapper'
        }).appendTo(self.elements.$popbox_popup);

        self.elements.$popbox_container = $('<div/>',{
            'class':'popbox-container'
        }).appendTo(self.elements.$popbox_wrapper);

        self.elements.$popbox_close = $('<a/>',{
            'class':'popbox-close',
            'href':'javascript:void(0);'
        }).html(self.settings.close).appendTo(self.elements.$popbox_container);

        self.elements.$popbox_title = $('<div/>',{
            'class':'popbox-title'
        }).html(self.settings.title).appendTo(self.elements.$popbox_container);

        self.elements.$popbox_content = $('<div/>',{
            'class':'popbox-content',
            'css':{

            }
        }).html(self.settings.content).appendTo(self.elements.$popbox_container);

        // events
        self.elements.$popbox_close.on('click.'+_event_namespace,function(e){
            e.preventDefault();
            self.close();
            return false;
        });

        self.elements.$popbox.on('click.'+_event_namespace,function(e){
            if ($(e.target).closest('.popbox-popup').length === 0) {
                e.preventDefault();
                self.close();
                return false;
            }
        });


        self.elements.$popbox.appendTo($container);

        _instances[self.properties.instance_id] = self;
        _instances.length++;
    };

    Popbox.prototype.destroy = function(){
        var self = this;

        if (self.elements.$popbox) {
            self.elements.$popbox.remove();
            self.elements.$popbox = null;

            if (_static.isSet(_instances[self.properties.instance_id])) {
                delete _instances[self.properties.instance_id];
                _instances.length--;
            }

            self._private.closeOverlay();
            //self._private.destroyOverlay();
            self._private.reset();
            self._private.applyMode();
        }
    };

    Popbox.prototype.update = function(settings){
        var self = this;

        // can't change mode in this function
        if (_static.isSet(settings.mode)) delete settings.mode;

        var existing_settings = {
            close:self.settings.close,
            title:self.settings.title,
            content:self.settings.content
        };

        $.extend(true,self.settings,_static.param(settings,{}));

        if (self.isCreated()) {
            var update_elements = function(){
                if (existing_settings.close !== self.settings.close) {
                    self.elements.$popbox_close.html(self.settings.close);
                }
                if (existing_settings.title !== self.settings.title) {
                    self.elements.$popbox_title.html(self.settings.title);
                }
                if (existing_settings.content !== self.settings.content) {
                    self.elements.$popbox_content.html(self.settings.content);
                }
            };

            if (self.isOpen()) {
                self.showLoading(function(){
                    update_elements();

                    // perform an adjust
                    self.adjust();
                });
            }
            else {
                update_elements();
            }
        }
    };

    Popbox.prototype.changeMode = function(new_mode){
        var self = this;

        if (!self.isOpen()) {
            // erase existing mode functions
            self._private.reset();
            self.settings.mode = new_mode || false;
            self._private.applyMode();
        }
    };

    Popbox.prototype.open = function(){
        var self = this;

        if (!self.isOpen()) {
            if (!self.elements.$popbox) {
                self.create();
            }

            if (_static.isFunction(self.settings.on_open)) self.settings.on_open();

            // show elements
            self._private.openOverlay();
            self.elements.$popbox_wrapper.css({
                'visibility':'hidden'
            });
            self.elements.$popbox_popup.css({
                'display':'block',
                'visibility':'hidden'
            });
            self.elements.$popbox.css({
                'display':'block'
            });

            self.properties.is_open = true;

            // adjust
            self.adjust(false);

            self.elements.$popbox_popup.css({
                'visibility':'visible'
            });

            // prepare animation
            self.elements.$popbox_popup.css(self._private.getAnimationStartProperties('open'));

            // do animation
            _static.transition(
                self.elements.$popbox_popup,
                self._private.getAnimationEndProperties('open'),
                self._private.getAnimationSpeed('open'),
                self._private.getAnimationEase('open')
            );

            self.elements.$popbox_wrapper.css({
                'visibility':''
            });

            if (_static.isFunction(self.settings.after_open)) self.settings.after_open();
        }
    };

    Popbox.prototype.close = function(destroy){
        var self = this;

        if (self.isOpen()) {

            if (_static.isFunction(self.settings.on_close)) self.settings.on_close();

            self.properties.is_open = false;

            // prepare animation
            self.elements.$popbox_popup.css(self._private.getAnimationStartProperties('close'));

            // do animation
            _static.transition(
                self.elements.$popbox_popup,
                self._private.getAnimationEndProperties('close'),
                self._private.getAnimationSpeed('close'),
                self._private.getAnimationEase('close'),
                function(){
                    self.elements.$popbox_popup.css(self._private.getAnimationStartProperties('open'));

                    self.elements.$popbox.css({
                        'display':'none'
                    });

                    if (destroy || !self.settings.cache) {
                        self.destroy();
                    }
                }
            );

            self._private.closeOverlay();

            if (_static.isFunction(self.settings.after_close)) self.settings.after_close();
        }
    };

    Popbox.prototype.adjust = function(animate){
        var self = this;

        animate = _static.param(animate,true);

        if (self.isOpen()) {

            var adjust_elements = function(animate) {

                var windowWidth = $window.width(),
                    windowHeight = $window.height(),
                    popboxWidthPadding = _static.elementPadding(self.elements.$popbox_popup,'width'),
                    popboxHeightPadding = _static.elementPadding(self.elements.$popbox_popup,'height'),
                    maxPopboxWidth = ((self.settings.width_padding > 0) ? windowWidth-(windowWidth*self.settings.width_padding) : windowWidth)-popboxWidthPadding,
                    maxPopboxHeight = ((self.settings.height_padding > 0) ? windowHeight-(windowHeight*self.settings.height_padding) : windowHeight)-popboxHeightPadding,
                    newPopboxWidth,
                    newPopboxHeight,
                    newPopboxTop,
                    newPopboxLeft;

                if (_static.isNumber(self.settings.max_width,true) && maxPopboxWidth > self.settings.max_width) {
                    maxPopboxWidth = self.settings.max_width;
                }

                self.elements.$popbox_wrapper.css({
                    'position':'absolute',
                    'top':'0px',
                    'left':'0px',
                    'width':maxPopboxWidth+'px',
                    'height':'auto'
                });

                self.elements.$popbox_container.css({
                    'position':'absolute',
                    'top':'0px',
                    'left':'0px',
                    'width':'auto',
                    'height':'auto'
                });

                newPopboxWidth = self.elements.$popbox_container.width()+1;
                newPopboxHeight = self.elements.$popbox_container.height()+1;
                newPopboxLeft = (windowWidth-(newPopboxWidth+popboxWidthPadding))/2;
                newPopboxTop = (windowHeight-(newPopboxHeight+popboxHeightPadding))/2;

                if (newPopboxHeight > maxPopboxHeight) {
                    newPopboxTop = (self.settings.height_padding > 0) ? windowHeight*self.settings.height_padding : 0;
                }

                self.elements.$popbox_wrapper.css({
                    'position':'',
                    'top':'',
                    'left':'',
                    'width':'',
                    'height':''
                });

                self.elements.$popbox_container.css({
                    'position':'',
                    'top':'',
                    'left':'',
                    'width':'',
                    'height':''
                });

                if (animate) {
                    _static.transition(
                        self.elements.$popbox_bottom_push,
                        {
                            'top':(newPopboxHeight+popboxHeightPadding+(newPopboxTop*2)-1)+'px'
                        },
                        _speeds.fast,
                        _eases.easeInOutQuad
                    );

                    _static.transition(
                        self.elements.$popbox_popup,
                        {
                            'width':newPopboxWidth+'px',
                            'height':newPopboxHeight+'px',
                            'top':newPopboxTop+'px',
                            'left':newPopboxLeft+'px'
                        },
                        200,
                        _eases.easeInOutQuad,
                        function(){
                            self.showContent();

                            // fail safe in case padding changes on popbox
                            self.elements.$popbox_bottom_push.css({
                                'top':(self.elements.$popbox_popup.outerHeight(false)+(self.elements.$popbox_popup.position().top*2)-1)+'px'
                            });
                        }
                    );
                }
                else {
                    self.elements.$popbox_popup.css({
                        'width':newPopboxWidth+'px',
                        'height':newPopboxHeight+'px',
                        'top':newPopboxTop+'px',
                        'left':newPopboxLeft+'px'
                    });

                    self.elements.$popbox_bottom_push.css({
                        'top':(self.elements.$popbox_popup.outerHeight(false)+(self.elements.$popbox_popup.position().top*2)-1)+'px'
                    });
                }
            };

            if (!animate || self.isLoading()) {
                adjust_elements(animate);
            }
            else {
                // TODO need to add queues for showloading and showcontent so that when they are ready, callbacks are run (full proof)
                self.showLoading(function(){
                    adjust_elements(true);
                });
            }
        }
    };

    Popbox.prototype.showLoading = function(ready){
        var self = this;
        if (self.isLoading()){
            if (!self.elements.$popbox_loading.hasClass('popbox-animating') && !self.elements.$popbox_wrapper.hasClass('popbox-animating') && _static.isFunction(ready)) ready();
            return;
        }

        self.elements.$popbox_wrapper.css({
            'opacity':'1'
        });
        _static.transition(
            self.elements.$popbox_wrapper,
            {'opacity':'0'},
            200,
            'ease',
            function(){
                self.elements.$popbox_wrapper.css({
                    'visibility':'hidden'
                });

                self.elements.$popbox_loading.css({
                    'opacity':'0',
                    'display':'block'
                });

                _static.transition(
                    self.elements.$popbox_loading,
                    {'opacity':'1'},
                    200,
                    'ease',
                    function(){
                        if (_static.isFunction(ready)) ready();
                    }
                );
            }
        );


        self.properties.is_loading = true;
    };

    Popbox.prototype.showContent = function(ready){
        var self = this;
        if (!self.isLoading()){
            if (!self.elements.$popbox_popup.hasClass('popbox-animating') && !self.elements.$popbox_loading.hasClass('popbox-animating') && !self.elements.$popbox_wrapper.hasClass('popbox-animating') && _static.isFunction(ready)) ready();
            return;
        }

        self.elements.$popbox_loading.css({
            'opacity':'1'
        });
        _static.transition(
            self.elements.$popbox_loading,
            {'opacity':'0'},
            200,
            'ease',
            function(){
                self.elements.$popbox_loading.css({
                    'display':'none'
                });

                self.elements.$popbox_wrapper.css({
                    'opacity':'0',
                    'visibility':'visible'
                });

                _static.transition(
                    self.elements.$popbox_wrapper,
                    {'opacity':'1'},
                    200,
                    'ease',
                    function(){
                        if (_static.isFunction(ready)) ready();
                    }
                );
            }
        );

        self.properties.is_loading = false;
    };

    Popbox.prototype.isLoading = function(){
        var self = this;
        return self.properties.is_loading;
    };

    Popbox.prototype.isOpen = function(){
        var self = this;
        return self.properties.is_open;
    };

    Popbox.prototype.isCreated = function(){
        var self = this;
        return self.elements.$popbox;
    };


    // global events
    $window.on('resize.'+_event_namespace,function(){
        if (_instances.length > 0) {
            for (var i in _instances) {
                if (_instances.hasOwnProperty(i)) {
                    if (_instances[i] instanceof Popbox && _instances[i].isOpen()) {
                        _instances[i].adjust(false);
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

        return this;
    };

    $.Popbox = Popbox;

    $('.create-popbox').PopBox();

})(jQuery,window);