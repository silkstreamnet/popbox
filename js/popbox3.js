(function($,window){

    var $window = $(window),
        $html = $('html'),
        $body = $('body'),
        _event_namespace = 'Popbox',
        _next_instance_id = 0,
        _instances = {length:0},
        _static = {},
        _private = function(){},
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
        return typeof number === "number" && (!_static.param(required,false) || number > 0);
    };
    _static.isString = function(string,required) {
        return typeof string === "string" && (!_static.param(required,false) || string != '');
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
    _static.trim = function (string) {
        return (_static.isString(string)) ? string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : string;
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
    _static.splitOutside = function(delimiter,string,container_start,container_end){
        if (typeof container_start === 'undefined') container_start = '';
        if (typeof container_end === 'undefined') container_end = container_start;
        if (!(container_start instanceof Array)) container_start = [container_start];
        if (!(container_end instanceof Array)) container_end = [container_end];

        var results = [],
            parts = string.split(delimiter),
            inside = false,
            current = 0,
            container_start_i = container_start[current],
            container_end_i = container_end[current];

        for (var i=0; i<parts.length; i++) {

            var part_handled = false;

            for (var j=0; j<container_start.length; j++) {
                container_start_i = container_start[j];
                container_end_i = container_end[current];

                var container_start_ie = container_start_i.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
                    container_end_ie = container_end_i.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
                    start_match = parts[i].match(new RegExp('['+container_start_ie+'][^'+container_end_ie+']*')),
                    end_match = parts[i].match(new RegExp('[^'+container_start_ie+']*['+container_end_ie+']'));

                if (inside !== false) {
                    if (j == current) {
                        inside += parts[i];
                        if (end_match) {
                            results.push(inside);
                            inside = false;
                        }
                        else {
                            inside += delimiter;
                        }
                        part_handled = true;
                    }
                }
                else if (start_match) {
                    inside = parts[i]+delimiter;
                    current = (j < container_end.length) ? j : 0;
                    part_handled = true;
                }
            }

            if (!part_handled) {
                results.push(parts[i]);
            }
        }

        return results;
    };
    _static.elementPaddingWidth = function($object,include_margin) {
        return ($object && $object.length) ? $object.outerWidth(!!_static.param(include_margin,false))-$object.width() : 0;
    };
    _static.elementPaddingHeight = function($object,include_margin) {
        return ($object && $object.length) ? $object.outerHeight(!!_static.param(include_margin,false))-$object.height() : 0;
    };
    _static.transition = function($object,properties,duration,easing,complete){
        properties = _static.param(properties,{});
        duration = _static.param(duration,_speeds._default);
        easing = _static.param(easing,_eases._default);

        var property,
            transitions = [],
            property_difference = false,
            transitioning = false;

        if (_support.transition_end && duration > 25) {

            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    //TODO jquery converts required prefix for css3, but the property pushed to transition needs to be retrieved e.g. transform, margin, padding
                    transitions.push(property+' '+duration+'ms '+easing);

                    // round number values to 1 decimal place for comparison
                    var cur_property_val = $object.css(property),
                        new_property_val = properties[property];

                    if (_static.isString(cur_property_val,true)) {
                        cur_property_val = cur_property_val.trim();
                        if (cur_property_val.match(/^[0-9]+(?:\.[0-9]+)?\s*.{0,4}$/)) {
                            cur_property_val = parseFloat(cur_property_val);
                        }
                    }
                    if (_static.isString(new_property_val,true)) {
                        new_property_val = new_property_val.trim();
                        if (new_property_val.match(/^[0-9]+(?:\.[0-9]+)?\s*.{0,4}$/)) {
                            new_property_val = parseFloat(new_property_val);
                        }
                    }

                    if (_static.isNumber(cur_property_val,true)) {
                        cur_property_val = Math.round(cur_property_val);
                    }

                    if (_static.isNumber(new_property_val,true)) {
                        new_property_val = Math.round(new_property_val);
                    }

                    if (cur_property_val != new_property_val) {
                        property_difference = true;
                    }
                }
            }

            var existing_transitions = _static.splitOutside(',',$object.css('transition'),'(',')');
            for (var j=0; j<existing_transitions.length; j++) {
                var existing_transition = _static.trim(existing_transitions[j]),
                    existing_update = false;

                if (existing_transition && !existing_transition.match(/all 0(?:\.[0]+)?[^0-9]/)) {
                    for (property in properties) {
                        if (properties.hasOwnProperty(property)) {
                            if (_static.isString(property,true) && existing_transitions[j].match(new RegExp(_static.regexEscape(property)))) {
                                existing_update = true;
                                break;
                            }
                        }
                    }

                    if (!existing_update) {
                        transitions.push(existing_transition);
                        property_difference = true;
                    }
                }
            }

            var pre_functions = $object.data('popbox-transition-end-functions');
            var already_animating = $object.hasClass('popbox-animating');

            if (transitions.length && property_difference) {

                $object.off('.popbox_auto_transition_end');

                // add function to list
                if (_static.isFunction(complete)) {
                    if (pre_functions) pre_functions.push(complete);
                    else pre_functions = [complete];
                    $object.data('popbox-transition-end-functions',pre_functions);
                }

                $object.css('transition',transitions.join(', '));
                $object.css(properties).addClass('popbox-animating');

                setTimeout(function(){
                    var lazy_timeout_catchup = false;
                    $object.off('.popbox_auto_transition_end').on(_support.transition_end+'.popbox_auto_transition_end',function(){
                        if (lazy_timeout_catchup !== false) {
                            clearTimeout(lazy_timeout_catchup);
                            lazy_timeout_catchup = false;
                        }

                        $object.off('.popbox_auto_transition_end');
                        $object.css('transition','').removeClass('popbox-animating');

                        var live_functions = $object.data('popbox-transition-end-functions');
                        if (live_functions) {
                            for (var i=0; i<live_functions.length; i++) {
                                if (_static.isFunction(live_functions[i])) live_functions[i]();
                            }
                        }

                        _static.clearTransition($object);
                    });
                    lazy_timeout_catchup = setTimeout(function(){$object.trigger('.popbox_auto_transition_end');lazy_timeout_catchup=false;},duration+100);
                },0);

                transitioning = true;
            }
        }

        if (!transitioning) {

            $object.css(properties);

            if (already_animating) {
                // add function to list
                if (_static.isFunction(complete)) {
                    if (pre_functions) pre_functions.push(complete);
                    else pre_functions = [complete];
                    $object.data('popbox-transition-end-functions',pre_functions);
                }
            }
            else {
                if (_static.isFunction(complete)) {
                    setTimeout(function(){complete();},0);
                }
            }
        }
    };
    _static.clearTransition = function($object) {
        $object.data('popbox-transition-end-functions',false);
    };
    _static.getTrueWidth = function($object) {
        return ($object && $object.length) ? $object.get(0).getBoundingClientRect().width : 0;
    };
    _static.getTrueHeight = function($object) {
        return ($object && $object.length) ? $object.get(0).getBoundingClientRect().height : 0;
    };



    _private.prototype.reset = function() {
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

        if (self.properties.disable_background_click_timer !== false) {
            clearTimeout(self.properties.disable_background_click_timer);
        }

        self.properties = {
            is_open:false,
            is_loading:false,
            disable_background_click:false,
            disable_background_click_timer:false,
            image_cache:{},
            interface_image_cache_pending:0,
            content_image_cache_pending:0,
            instance_id:self.properties.instance_id,
            last_html_overflow:false,
            last_html_margin_right:false
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

    _private.prototype.applyMode = function(){
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

    _private.prototype.createOverlay = function(){
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

    _private.prototype.destroyOverlay = function(){
        var self = this.self;
        if (_instances.length <= 0 && self.elements.$popbox_overlay) {
            self.elements.$popbox_overlay.remove();
            self.elements.$popbox_overlay = null;
        }
    };

    _private.prototype.openOverlay = function(){
        var self = this.self;

        if (!self.elements.$popbox_overlay) {
            self._private.createOverlay();
        }

        if (self.elements.$popbox_overlay.data('is_open') === false) {

            self.elements.$popbox_overlay.css({
                'display':'block',
                'opacity':'0'
            });
            _static.clearTransition(self.elements.$popbox_overlay);
            _static.transition(
                self.elements.$popbox_overlay,
                {'opacity':'1'},
                self._private.getOverlayAnimationSpeed('open'),
                self._private.getOverlayAnimationEase('open')
            );

            self.elements.$popbox_overlay.data('is_open',true);
        }
    };

    _private.prototype.closeOverlay = function(){
        var self = this.self;

        if (self.elements.$popbox_overlay) {

            if (self.elements.$popbox_overlay.data('is_open') === true) {
                _static.clearTransition(self.elements.$popbox_overlay);
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

    _private.prototype.getAnimationStartProperties = function(type){
        var self = this.self;
        return (_static.isSet(self.animations[self.settings.animation])) ? self.animations[self.settings.animation][type][0] : self.animations['fade'][type][0];
    };

    _private.prototype.getAnimationEndProperties = function(type){
        var self = this.self;
        return (_static.isSet(self.animations[self.settings.animation])) ? self.animations[self.settings.animation][type][self.animations[self.settings.animation][type].length-1] : self.animations['fade'][type][self.animations['fade'][type].length-1];
    };

    _private.prototype.getAnimationSpeed = function(type){
        var self = this.self;
        return self.settings[type+'_animation_speed'] || self.settings.animation_speed || _speeds._default;
    };

    _private.prototype.getAnimationEase = function(type){
        var self = this.self;
        return self.settings[type+'_animation_ease'] || self.settings.animation_ease || _eases._default;
    };

    _private.prototype.getOverlayAnimationSpeed = function(type){
        var self = this.self;
        if (self.settings[type+'_overlay_animation_speed'] === true) return self._private.getAnimationSpeed(type);
        return self.settings[type+'_overlay_animation_speed'] || self.settings.overlay_animation_speed || self._private.getAnimationSpeed(type);
    };

    _private.prototype.getOverlayAnimationEase = function(type){
        var self = this.self;
        if (self.settings[type+'_overlay_animation_ease'] === true) return self._private.getAnimationEase(type);
        return self.settings[type+'_overlay_animation_ease'] || self.settings.overlay_animation_ease || self._private.getAnimationEase(type);
    };

    _private.prototype.checkImagesLoaded = function(){
        var self = this.self;
        if (self.isCreated()) {

            var $images = self.elements.$popbox.find('img');

            $images.each(function(){
                var image = this,
                    $image = $(this);

                if (image.src) {

                    if (image.complete && _static.isSet(image.naturalWidth)) {
                        if (_static.isNumber(image.naturalWidth,true)) {
                            //self.adjust(true);
                        }
                    }
                    else if (!self.properties.image_cache[image.src]) {
                        var proxy_image = new Image(),
                            proxy_image_event = function(){
                                if ($image.closest(self.elements.$popbox_content).length > 0) {
                                    self.properties.content_image_cache_pending--;
                                    if (self.properties.content_image_cache_pending == 0) {
                                        self.adjust(true);
                                    }
                                }
                                else {
                                    self.properties.interface_image_cache_pending--;
                                    if (self.properties.interface_image_cache_pending == 0) {
                                        //if (self.isLoading()) self.adjust(true);
                                    }
                                }
                            };

                        if ($image.closest(self.elements.$popbox_content).length > 0) {
                            self.properties.content_image_cache_pending++;
                        }
                        else {
                            self.properties.interface_image_cache_pending++;
                        }

                        proxy_image.onload = function(){
                            proxy_image_event();
                        };

                        proxy_image.onerror = function(){
                            proxy_image_event();
                        };

                        proxy_image.src = image.src;

                        self.properties.image_cache[image.src] = {origin:image,proxy:proxy_image};
                    }
                }
            });

            if (self.properties.content_image_cache_pending == 0 && self.properties.interface_image_cache_pending == 0) {
                return true;
            }
        }

        return false;
    };

    _private.prototype.applyDomSettings = function(){
        var self = this.self;
        if (self.isCreated()) {
            self.elements.$popbox_loading.html(self.settings.loading);
            self.elements.$popbox_close.html(self.settings.close);
            self.elements.$popbox_title.html(self.settings.title);
            self.elements.$popbox_content.html(self.settings.content);

            if (_static.isString(self.settings.add_class,true)) {
                self.elements.$popbox.addClass(self.settings.add_class);
            }

            // checks
            if (self.settings.close === false) self.elements.$popbox_close.css('display','none');
            else self.elements.$popbox_close.css('display','block');
            if (self.settings.title === false) self.elements.$popbox_title.css('display','none');
            else self.elements.$popbox_title.css('display','block');
        }
    };

    var Popbox = function(settings){
        var self = this;

        self._private = new _private();
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
        width:false, // number = pixels to set, anything else is ignored
        height:false, // number = pixels to set, anything else is ignored
        min_width:100, // false = none, true = 100%, number = pixels
        min_height:100, // false = none, true = 100%, number = pixels
        max_width:false, // false|true = 100%, number = pixels
        max_height:false, // false = none, true = 100%. if set, scroll inner is used
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
        close:'X',
        title:false,
        hide_page_scroll:true,
        hide_page_scroll_space:true,
        loading:'Loading',
        href:'', //can be used for none-anchor elements to grab content
        mobile_fallback:false, //TODO needs doing (will be used if the website has forms in popboxes and is shown on mobile) (if true, use position absolute instead of fixed for popbox - doesn't matter about overlay)
        add_class:'',
        aspect_fit:false, // recommended for images and iframes - not for content
        cache:false,
        wait_for_images:true,
        width_margin:0.1,
        height_margin:0.06,
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

    Popbox.prototype.create = function(){
        var self = this;

        self.destroy();
        self._private.createOverlay();

        var $container = (self.settings.container) ? $(self.settings.container) : $body;

        self.elements.$popbox = $('<div/>',{
            'class':'popbox',
            'css':{
                'display':'none',
                'position':'fixed', // TODO need to support position absolute
                'width':'100%',
                'height':'100%',
                'top':'0px',
                'left':'0px',
                'overflow-y':'scroll',
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
        }).appendTo(self.elements.$popbox_popup);

        self.elements.$popbox_wrapper = $('<div/>',{
            'class':'popbox-wrapper'
        }).appendTo(self.elements.$popbox_popup);

        self.elements.$popbox_container = $('<div/>',{
            'class':'popbox-container'
        }).appendTo(self.elements.$popbox_wrapper);

        self.elements.$popbox_close = $('<a/>',{
            'class':'popbox-close',
            'href':'javascript:void(0);'
        }).appendTo(self.elements.$popbox_container);

        self.elements.$popbox_title = $('<div/>',{
            'class':'popbox-title'
        }).appendTo(self.elements.$popbox_container);

        self.elements.$popbox_content = $('<div/>',{
            'class':'popbox-content'
        }).appendTo(self.elements.$popbox_container);

        self._private.applyDomSettings();

        // events
        self.elements.$popbox_close.on('click.'+_event_namespace,function(e){
            e.preventDefault();
            self.close();
            return false;
        });

        var _complex_close_namespace = 'Popbox_complex_close';
        self.elements.$popbox.on('mousedown.'+_event_namespace,function(e1){
            if ($(e1.target).closest('.popbox-popup').length === 0) {
                e1.preventDefault();
                self.elements.$popbox.off('mouseup.'+_complex_close_namespace).on('mouseup.'+_complex_close_namespace,function(e2){
                    self.elements.$popbox.off('.'+_complex_close_namespace);
                    if (!self.properties.disable_background_click && e1.target === e2.target && $(e2.target).closest('.popbox-popup').length === 0) {
                        e2.preventDefault();
                        self.close();
                        return false;
                    }
                });
                self.elements.$popbox.off('mousemove.'+_complex_close_namespace).on('mousemove.'+_complex_close_namespace,function(e3){
                    // check limit box
                    if (e3.pageX < e1.pageX-5 || e3.pageX > e1.pageX+5 || e3.pageY < e1.pageY-5 || e3.pageY > e1.pageY+5) {
                        self.elements.$popbox.off('.'+_complex_close_namespace);
                    }
                });
                self.elements.$popbox.off('scroll.'+_complex_close_namespace).on('scroll.'+_complex_close_namespace,function(){
                    self.elements.$popbox.off('.'+_complex_close_namespace);
                });
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
            self._private.reset();
            self._private.applyMode();
        }
    };

    Popbox.prototype.update = function(settings){
        var self = this;

        if (_static.isSet(settings.mode)) {
            if (!self.isOpen()) {
                // erase existing mode functions
                self.destroy();
                self._private.reset();
                self.settings.mode = settings.mode || false;
                self._private.applyMode();
            }
            delete settings.mode;
        }

        $.extend(true,self.settings,_static.param(settings,{}));

        if (self.isCreated()) {
            if (self.isOpen()) {
                self.showLoading(function(){
                    self._private.applyDomSettings();

                    // perform an adjust
                    self.adjust();
                });
            }
            else {
                self._private.applyDomSettings();
            }
        }
    };

    Popbox.prototype.open = function(){
        var self = this;

        if (!self.isOpen()) {
            if (!self.elements.$popbox) {
                self.create();
            }
            else {
                self._private.applyDomSettings();
            }

            if (_static.isFunction(self.settings.on_open)) self.settings.on_open();

            // html body scrollbar
            if (self.settings.hide_page_scroll) {
                var old_body_width = $body.width();
                if (self.properties.last_html_overflow === false) {
                    self.properties.last_html_overflow = _static.getInlineStyle($html,'overflow');
                }
                $html.addClass('popbox-hide-page-scroll').css('overflow','hidden');
                var new_body_width = $body.width();
                if (self.settings.hide_page_scroll_space) {
                    if (self.properties.last_html_margin_right === false) {
                        self.properties.last_html_margin_right = _static.getInlineStyle($html,'margin-right');
                    }
                    if (new_body_width > old_body_width) {
                        $html.css('margin-right',(new_body_width-old_body_width)+'px');
                    }
                }
            }

            // show elements
            self._private.openOverlay();
            self.elements.$popbox_wrapper.css({
                //'visibility':'hidden'
            });
            self.elements.$popbox_popup.css({
                'display':'block'
                //'visibility':'hidden'
            });
            self.elements.$popbox.css({
                'display':'block'
            });

            self.elements.$popbox_popup.css({
                'visibility':'visible'
            });

            // adjust
            self.adjust(false);

            // prepare animation
            self.elements.$popbox_popup.css(self._private.getAnimationStartProperties('open'));
            _static.clearTransition(self.elements.$popbox_popup);
            // do animation
            _static.transition(
                self.elements.$popbox_popup,
                self._private.getAnimationEndProperties('open'),
                self._private.getAnimationSpeed('open'),
                self._private.getAnimationEase('open')
            );

            if (self.elements.$popbox_popup.hasClass('popbox-animating')) {
                self.properties.disable_background_click = true;
                self.properties.disable_background_click_timer = setTimeout(function(){
                    self.properties.disable_background_click = false;
                    self.properties.disable_background_click_timer = false;
                },self._private.getAnimationSpeed('open')+1000);
            }

            self.elements.$popbox_wrapper.css({
                //'visibility':''
            });

            self.properties.is_open = true;

            if (_static.isFunction(self.settings.after_open)) self.settings.after_open();
        }
    };

    Popbox.prototype.close = function(destroy){
        var self = this;
        if (self.isOpen()) {
            if (_static.isFunction(self.settings.on_close)) self.settings.on_close();
            self.properties.is_open = false;

            // clear all animation functions (they can animate but do not trigger their complete function)
            for (var object_name in self.elements) {
                if (self.elements.hasOwnProperty(object_name) && self.elements[object_name].length) {
                    _static.clearTransition(self.elements[object_name]);
                }
            }

            // prepare animation
            self.elements.$popbox_popup.css(self._private.getAnimationStartProperties('close'));

            // do animation
            _static.transition(
                self.elements.$popbox_popup,
                self._private.getAnimationEndProperties('close'),
                self._private.getAnimationSpeed('close'),
                self._private.getAnimationEase('close'),
                function(){

                    self.elements.$popbox.css({
                        'display':'none'
                    });

                    if (self.properties.last_html_overflow !== false) $html.css('overflow',self.properties.last_html_overflow);
                    if (self.properties.last_html_margin_right !== false) $html.css('margin-right',self.properties.last_html_margin_right);
                    self.properties.last_html_overflow = false;
                    self.properties.last_html_margin_right = false;
                    $html.removeClass('popbox-hide-page-scroll');

                    if (destroy || !self.settings.cache) {
                        self.destroy();
                    }
                    else {
                        self.elements.$popbox_popup.css(self._private.getAnimationEndProperties('open'));

                        self.properties.disable_background_click = false;
                        if (self.properties.disable_background_click_timer !== false) {
                            clearTimeout(self.properties.disable_background_click_timer);
                            self.properties.disable_background_click_timer = false;
                        }
                    }

                    if (_static.isFunction(self.settings.after_close)) self.settings.after_close();
                }
            );
        }
        self._private.closeOverlay();
    };

    Popbox.prototype.adjust = function(animate){
        var self = this;

        // initiate another adjust when each image loads (use a 100ms wait in case images load in one after each other quickly)
        animate = _static.param(animate,true);
        if (self.isCreated()) {

            var adjust_elements = function(animate,show_content) {
                animate = _static.param(animate,false);
                show_content = _static.param(show_content,false);
                var window_width = $window.width(),
                    window_height = $window.height(),
                    popbox_width_padding = _static.elementPaddingWidth(self.elements.$popbox_popup),
                    popbox_height_padding = _static.elementPaddingHeight(self.elements.$popbox_popup),
                    max_popbox_width = ((self.settings.width_margin > 0) ? window_width-(window_width*(self.settings.width_margin*2)) : window_width)-popbox_width_padding,
                    max_popbox_height = ((self.settings.height_margin > 0) ? window_height-(window_height*(self.settings.height_margin*2)) : window_height)-popbox_height_padding,
                    min_popbox_width = 0,
                    min_popbox_height = 0,
                    set_popbox_width = (_static.isNumber(self.settings.width)) ? self.settings.width+'px' : 'auto',
                    set_popbox_height = (_static.isNumber(self.settings.height)) ? self.settings.height+'px' : 'auto',
                    max_popbox_screen_height = max_popbox_height,
                    new_popbox_width,
                    new_popbox_height,
                    new_popbox_top,
                    new_popbox_left;

                if (_static.isNumber(self.settings.max_width,true) && max_popbox_width > self.settings.max_width) {
                    max_popbox_width = self.settings.max_width;
                }
                if (_static.isNumber(self.settings.max_height,true) && max_popbox_height > self.settings.max_height) {
                    max_popbox_height = self.settings.max_height;
                }
                if (_static.isNumber(self.settings.min_width,true) && min_popbox_width < self.settings.min_width && self.settings.min_width < max_popbox_width) {
                    min_popbox_width = self.settings.min_width;
                }
                if (_static.isNumber(self.settings.min_height,true) && min_popbox_height > self.settings.min_height) {
                    min_popbox_height = self.settings.min_height;
                }
                self.elements.$popbox_wrapper.css({
                    'position':'absolute',
                    'top':'0px',
                    'left':'0px',
                    'width':max_popbox_width+'px',
                    'height':'auto',
                    'overflow-y':''
                });
                self.elements.$popbox_container.css({
                    'position':'absolute',
                    'top':'0px',
                    'left':'0px',
                    'width':set_popbox_width,
                    'height':set_popbox_height,
                    'min-width':min_popbox_width+'px',
                    'min-height':min_popbox_height+'px'
                });

                // not sure why we are using get true width? could just use outerWidth(true)?
                new_popbox_width = _static.getTrueWidth(self.elements.$popbox_container);
                new_popbox_height = _static.getTrueHeight(self.elements.$popbox_container);

                // size adjustment checks
                if ((self.settings.max_height === true || _static.isNumber(self.settings.max_height,true)) && new_popbox_height > max_popbox_height) {
                    if (self.settings.aspect_fit) {
                        // calculate new width based on height difference
                        new_popbox_width *= (max_popbox_height/new_popbox_height);
                        new_popbox_height = max_popbox_height;
                    }
                    else {
                        new_popbox_height = max_popbox_height;
                        self.elements.$popbox_wrapper.css({
                            'height':new_popbox_height+'px',
                            'overflow-y':'scroll'
                        });
                    }
                }

                new_popbox_left = (window_width-(new_popbox_width+popbox_width_padding))/2;
                new_popbox_top = (window_height-(new_popbox_height+popbox_height_padding))/2;

                // offset adjustment checks
                if (new_popbox_height > max_popbox_screen_height) {
                    new_popbox_top = (self.settings.height_margin > 0) ? window_height*self.settings.height_margin : 0;
                }

                // round numbers
                //new_popbox_width = Math.round(new_popbox_width*100)/100;
                //new_popbox_height = Math.round(new_popbox_height*100)/100;
                //new_popbox_left = Math.round(new_popbox_left*100)/100;
                //new_popbox_top = Math.round(new_popbox_top*100)/100;

                // cleanup
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
                    'height':'',
                    'min-width':'',
                    'min-height':''
                });

                if (animate) {
                    _static.clearTransition(self.elements.$popbox_bottom_push);
                    _static.clearTransition(self.elements.$popbox_popup);

                    _static.transition(
                        self.elements.$popbox_bottom_push,
                        {
                            'top':Math.floor(new_popbox_height+popbox_height_padding+(new_popbox_top*2)-2)+'px'
                        },
                        _speeds.fast,
                        _eases.easeInOutQuad
                    );
                    _static.transition(
                        self.elements.$popbox_popup,
                        {
                            'width':new_popbox_width+'px',
                            'height':new_popbox_height+'px',
                            'top':new_popbox_top+'px',
                            'left':new_popbox_left+'px'
                        },
                        _speeds.fast,
                        _eases.easeInOutQuad,
                        function(){
                            if (show_content) self.showContent();

                            // fail safe in case padding changes on popbox - does not actually work probably due to position top giving back a wrong number, probably not needed
                            /*self.elements.$popbox_bottom_push.css({
                                'top':Math.floor(self.elements.$popbox_popup.outerHeight(false)+(self.elements.$popbox_popup.position().top*2)-2)+'px'
                            });*/
                        }
                    );
                }
                else {

                    self.elements.$popbox_popup.css({
                        'width':new_popbox_width+'px',
                        'height':new_popbox_height+'px',
                        'top':new_popbox_top+'px',
                        'left':new_popbox_left+'px'
                    });

                    self.elements.$popbox_bottom_push.css({
                        'top':Math.floor(self.elements.$popbox_popup.outerHeight(false)+(self.elements.$popbox_popup.position().top*2)-2)+'px'
                    });
                }
            };


            self._private.checkImagesLoaded();

            if (self.settings.wait_for_images && self.properties.content_image_cache_pending > 0) {
                self.showLoading(function(){
                    adjust_elements(true,false);
                });
            }
            else if (!animate) {
                adjust_elements(false,true);
            }
            else {
                self.showLoading(function(){
                    adjust_elements(true,true);
                });
            }
        }
    };

    Popbox.prototype.showLoading = function(ready){
        var self = this;
        if (self.isCreated()) {
            if (self.isLoading()){
                if (!self.elements.$popbox_loading.hasClass('popbox-animating') && !self.elements.$popbox_wrapper.hasClass('popbox-animating') && _static.isFunction(ready)) ready();
                return;
            }
            if (self.isOpen()) {
                _static.clearTransition(self.elements.$popbox_loading);
                _static.clearTransition(self.elements.$popbox_wrapper);
                _static.transition(
                    self.elements.$popbox_wrapper,
                    {'opacity':'0'},
                    _speeds.fast,
                    'linear',
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
                            _speeds.fast,
                            'linear',
                            function(){
                                if (_static.isFunction(ready)) ready();
                            }
                        );
                    }
                );
            }
            else {
                self.elements.$popbox_wrapper.css({
                    'opacity':'0',
                    'visibility':'hidden'
                });
                self.elements.$popbox_loading.css({
                    'opacity':'1',
                    'display':'block'
                });

                if (_static.isFunction(ready)) ready();
            }
            self.properties.is_loading = true;
        }
    };

    Popbox.prototype.showContent = function(ready){
        var self = this;
        if (self.isCreated()) {
            if (!self.isLoading()){
                if (!self.elements.$popbox_popup.hasClass('popbox-animating') && !self.elements.$popbox_loading.hasClass('popbox-animating') && !self.elements.$popbox_wrapper.hasClass('popbox-animating') && _static.isFunction(ready)) ready();
                return;
            }

            if (self.isOpen()) {
                _static.clearTransition(self.elements.$popbox_loading);
                _static.clearTransition(self.elements.$popbox_wrapper);
                _static.transition(
                    self.elements.$popbox_loading,
                    {'opacity':'0'},
                    _speeds.fast,
                    'linear',
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
                            _speeds.fast,
                            'linear',
                            function(){
                                if (_static.isFunction(ready)) ready();
                            }
                        );
                    }
                );
            }
            else {
                self.elements.$popbox_loading.css({
                    'display':'none',
                    'opacity':'0'
                });
                self.elements.$popbox_wrapper.css({
                    'opacity':'1',
                    'visibility':'visible'
                });

                if (_static.isFunction(ready)) ready();
            }
            self.properties.is_loading = false;
        }
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
        return !!self.elements.$popbox;
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