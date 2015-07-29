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
        duration = _static.param(duration,400);
        easing = _static.param(easing,'ease');

        var property,
            transitions = [];
        //TODO: need to make sure at least one property is different value to existing. currently, the transitionend never gets called because it doesnt animate to complete
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                transitions.push(property+' '+duration+'ms '+easing);
            }
        }

        if (transitions.length) {
            $object.css('transition',transitions.join(','));
            $object.each(function(){this.offsetWidth = this.offsetWidth;}); // repaint
            $object.css(properties).addClass('popbox-animating');
            $object.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',function(){
                $object.removeClass('popbox-animating').css('transition','');
            });

            if (_static.isFunction(complete)) {
                _static.onTransitionEnd($object,complete);
            }
        }
    };
    _static.onTransitionEnd = function($object,func) {
        $object.off('.popbox_transitionend').on('transitionend.popbox_transitionend webkitTransitionEnd.popbox_transitionend oTransitionEnd.popbox_transitionend otransitionend.popbox_transitionend MSTransitionEnd.popbox_transitionend',function(){
            if (_static.isFunction(func)) func();
            $(this).off('.popbox_transitionend');
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

        self._private.reset();
        self._private.applyMode();

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
        close:'X', // TODO: if set to FALSE, set element to display none
        title:'', // TODO: if set to FALSE, set element to display none
        loading:'',
        href:'', //can be used for none-anchor elements to grab content
        cache:false,
        width_padding:0.1,
        height_padding:0.1,
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
            instance_id:self.properties.instance_id
        };
        self.elements = {
            $popbox:false,
            $popbox_overlay:false,
            $popbox_loading:false,
            $popbox_popup:false,
            $popbox_wrapper:false,
            $popbox_container:false,
            $popbox_title:false,
            $popbox_close:false,
            $popbox_content:false,
            $popbox_bottom_push:false
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
            }).appendTo($container);
        }

        self.elements.$popbox_overlay.on('click.'+_event_namespace,function(e){
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
        }
    };

    Popbox.prototype._private.showOverlay = function(){
        var self = this.self;

        if (!self.isOpen()) {
            if (!self.elements.$popbox_overlay) {
                self._private.createOverlay();
            }

            self.elements.$popbox_overlay.css({
                'display':'block'
            });
        }
    };

    Popbox.prototype._private.hideOverlay = function(){
        var self = this.self;

        if (self.isOpen() && self.elements.$popbox_overlay) {
            self.elements.$popbox_overlay.css({
                'display':'none'
            });
        }
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
            'class':'popbox-loading'
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

            if (_static.isSet(_instances[self.properties.instance_id])) {
                delete _instances[self.properties.instance_id];
                _instances.length--;
            }

            self._private.destroyOverlay();
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
            if (existing_settings.close !== self.settings.close) {
                self.elements.$popbox_close.html(self.settings.close);
            }
            if (existing_settings.title !== self.settings.title) {
                self.elements.$popbox_title.html(self.settings.title);
            }
            if (existing_settings.content !== self.settings.content) {
                self.elements.$popbox_content.html(self.settings.content);
            }
        }

        // perform an adjust
        self.adjust();
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

            self._private.showOverlay();

            self.elements.$popbox_wrapper.css({
                'visibility':'hidden'
            });

            self.elements.$popbox_popup.css({
                'display':'block',
                'opacity':'0'
            });

            self.elements.$popbox.css({
                'display':'block'
            });

            self.properties.is_open = true;

            self.adjust(false);

            self.elements.$popbox_popup.css({
                'opacity':'1'
            });

            self.elements.$popbox_wrapper.css({
                'visibility':''
            });
        }
    };

    Popbox.prototype.close = function(destroy){
        var self = this;

        if (self.isOpen()) {

            self.elements.$popbox.css({
                'display':'none'
            });

            self._private.hideOverlay();

            if (destroy || !self.settings.cache) {
                self.destroy();
            }

            self.properties.is_open = false;
        }
    };

    Popbox.prototype.adjust = function(animate){
        var self = this;

        animate = _static.param(animate,true);

        if (self.isOpen()) {
            //TODO popbox needs wrapper for example to work as fixed
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
            //TODO top and left should be calculated after width is applied?
            if (newPopboxHeight > maxPopboxHeight) {
                newPopboxTop = (self.settings.height_padding > 0) ? windowHeight*self.settings.height_padding : 0;
            }

            self.elements.$popbox_wrapper.attr('style','');
            self.elements.$popbox_container.attr('style','');

            if (animate) {
                self.showLoading();

                _static.transition(self.elements.$popbox_popup,{
                    'width':newPopboxWidth+'px',
                    'height':newPopboxHeight+'px',
                    'top':newPopboxTop+'px',
                    'left':newPopboxLeft+'px',
                    'margin-bottom':newPopboxTop+'px'
                },300,'ease',function(){
                    self.showContent();
                    console.log("moo");
                });
            }
            else {
                self.elements.$popbox_popup.css({
                    'width':newPopboxWidth+'px',
                    'height':newPopboxHeight+'px',
                    'top':newPopboxTop+'px',
                    'left':newPopboxLeft+'px',
                    'margin-bottom':newPopboxTop+'px'
                });
            }

            // old style push bottom (do still need or can remove element altogether?)
            /*self.elements.$popbox_bottom_push.css({
                'top':(self.elements.$popbox_popup.outerHeight(false)+(newPopboxTop*2)-1)+'px'
            });*/
        }
    };

    Popbox.prototype.showLoading = function(){
        var self = this;
        self.elements.$popbox_loading.css('display','block');
        self.elements.$popbox_wrapper.css('visibility','hidden');
    };

    Popbox.prototype.showContent = function(){
        var self = this;
        self.elements.$popbox_loading.css('display','none');
        self.elements.$popbox_wrapper.css('visibility','visible');
    };

    Popbox.prototype.isLoading = function(){
        var self = this;
        return self.elements.$popbox_loading.is(':visible');
    };

    Popbox.prototype.isOpen = function(){
        var self = this;
        return self.properties.is_open;
    };

    Popbox.prototype.isCreated = function(){
        var self = this;
        return self.elements.$popbox !== false;
    };


    // global events
    var resize_timer = false;
    $window.on('resize.'+_event_namespace,function(){
        if (resize_timer === false) {
            resize_timer = setTimeout(function(){
                if (_instances.length > 0) {
                    for (var i in _instances) {
                        if (_instances.hasOwnProperty(i)) {
                            if (_instances[i] instanceof Popbox && _instances[i].isOpen()) {
                                _instances[i].adjust();
                            }
                        }
                    }
                }
                resize_timer = false;
            },100);
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