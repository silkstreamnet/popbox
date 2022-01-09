import $ from "jquery"
import {_static} from "./static"
import {_private} from "./private"
import {_default_settings} from "../constants/default-settings";

export const _core = function(settings) {
    var self = this;
    self._private = new _private(self);

    self._private.triggerHook('initialize',[settings]);

    self.base_settings = $.extend(true,{},self.default_settings,_static.param(settings,{}));
    //self.settings = {};

    //defaults for pass through values
    self.properties = {
        instance_id:_static._next_instance_id,
        events:{},
        cache:{}
    };
    self.elements = {
        $popbox_overlay:null
    };

    self._private.applySettings();

    self._private.reset();

    _static._next_instance_id++;

    self.trigger('initialize',false,[settings]);

    self._private.triggerHook('after_initialize',[settings]);
    self.trigger('after_initialize',false,[settings]);
}

_core.prototype.version = __VERSION__
_core.prototype.plugins = {}
_core.prototype.default_settings = _default_settings

_core.prototype._static = _static;
_core.prototype.animations = {
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
_core.prototype.hooks = {};
_core.prototype.addHook = function(hook,handler){
    if (!_static.isArray(_core.prototype.hooks[hook])) _core.prototype.hooks[hook] = [];
    _core.prototype.hooks[hook].push(handler);
};

_core.prototype.create = function(){
    var self = this;

    self.destroy();

    self._private.triggerHook('create');

    self._private.createOverlay();

    var $container = (self.settings.container) ? $(self.settings.container) : _static.$body;

    self.elements.$popbox = $('<div/>',{
        'class':'popbox',
        'css':{
            'display':'none',
            'position':'fixed',
            'width':'100%',
            'height':'100%',
            'top':'0px',
            'left':'0px',
            'overflow-y':'scroll',
            'overflow-x':'hidden'
        }
    });

    self.elements.$popbox_empty = $('<div/>',{
        'class':'popbox-empty',
        'css':{
            'display':'block',
            'position':'absolute',
            'top':'0',
            'left':'0',
            'width':'100%',
            'height':'100%'
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
            'height':'0px'
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

    self.elements.$popbox_title = $('<div/>',{
        'class':'popbox-title'
    }).appendTo(self.elements.$popbox_container);

    self.elements.$popbox_content = $('<div/>',{
        'class':'popbox-content'
    }).appendTo(self.elements.$popbox_container);

    self.elements.$popbox_close = $('<a/>',{
        'class':'popbox-close',
        'href':'javascript:void(0);'
    }).appendTo(self.elements.$popbox_popup);

    self._private.applyDomSettings();

    // events
    var _close_namespace = _static._event_namespace+'Close';
    self.elements.$popbox.off('click.'+_close_namespace).on('click.'+_close_namespace,'.popbox-close,.close-popbox',function(e){
        e.preventDefault();
        self.close();
    });

    var _complex_close_start_namespace = _static._event_namespace+'ComplexCloseStart',
        _complex_close_namespace = _static._event_namespace+'ComplexClose';
    self.elements.$popbox.on('mousedown.'+_complex_close_start_namespace+' touchstart.'+_complex_close_start_namespace,function(e1){
        var e1pageX = (e1.originalEvent.touches && e1.originalEvent.touches[0]) ? e1.originalEvent.touches[0].pageX : e1.pageX,
            e1pageY = (e1.originalEvent.touches && e1.originalEvent.touches[0]) ? e1.originalEvent.touches[0].pageY : e1.pageY;
        if ((e1.originalEvent.touches || e1.which === 1) && $(e1.target).closest('.popbox-popup').length === 0 && e1pageX < self.elements.$popbox_empty.width()) {
            self.elements.$popbox.off('.'+_complex_close_namespace);
            self.elements.$popbox.on('mouseup.'+_complex_close_namespace+' touchend.'+_complex_close_namespace,function(e2){
                if (e2.originalEvent.touches || e2.which === 1) {
                    self.elements.$popbox.off('.'+_complex_close_namespace);
                    if (!self.properties.disable_background_click && e1.target === e2.target && $(e2.target).closest('.popbox-popup').length === 0) {
                        e2.preventDefault();
                        self.close();
                        return false;
                    }
                }
            });
            self.elements.$popbox.on('mousemove.'+_complex_close_namespace+' touchmove.'+_complex_close_namespace,function(e3){
                // check limit box
                // TODO if the container can be changed to a div instead of body then this will need updating to support the offset of that div
                var e3pageX = (e3.originalEvent.touches && e3.originalEvent.touches[0]) ? e3.originalEvent.touches[0].pageX : e3.pageX,
                    e3pageY = (e3.originalEvent.touches && e3.originalEvent.touches[0]) ? e3.originalEvent.touches[0].pageY : e3.pageY;
                if (e3pageX < e1pageX-5 ||
                    e3pageX > e1pageX+5 ||
                    e3pageY < e1pageY-5 ||
                    e3pageY > e1pageY+5) {
                    self.elements.$popbox.off('.'+_complex_close_namespace);
                }
            });
            self.elements.$popbox.on('scroll.'+_complex_close_namespace,function(){
                self.elements.$popbox.off('.'+_complex_close_namespace);
            });
        }
    });

    self.elements.$popbox.appendTo($container);

    _static._instances[self.properties.instance_id] = self;
    _static._instances.length++;

    self._private.triggerHook('after_create');
};

_core.prototype.destroy = function(){
    var self = this;

    if (self.elements.$popbox) {

        self._private.triggerHook('destroy');

        self.elements.$popbox.remove();
        self.elements.$popbox = null;

        if (_static.isSet(_static._instances[self.properties.instance_id])) {
            delete _static._instances[self.properties.instance_id];
            _static._instances.length--;
        }

        self._private.closeOverlay();
        self._private.reset();

        self._private.triggerHook('after_destroy');
    }
};

_core.prototype.update = function(settings,animate_adjust){
    var self = this;

    animate_adjust = _static.param(animate_adjust,true);

    $.extend(true,self.base_settings,_static.param(settings,{}));
    self._private.applySettings();

    if (self.isCreated()) {
        if (self.isOpen()) {
            if (animate_adjust) {
                self.showLoading(function(){
                    self._private.applyDomSettings();
                    self.adjust(true);
                });
            }
            else {
                self._private.applyDomSettings();
                self.adjust(false);
            }
        }
        else {
            self._private.applyDomSettings();
        }
    }
};

_core.prototype.open = function(){
    var self = this;

    if (!self.isOpen()) {

        if (!self.elements.$popbox) {
            self.create();
        }
        else {
            self._private.applyDomSettings();
        }

        self._private.triggerHook('open');
        self.trigger('open');

        if (self.elements.$popbox.css('position') === 'absolute') {
            self.elements.$popbox.css('top',_static.$window.scrollTop()+'px');
        }
        else {
            // html body scrollbar
            if (self.settings.hide_page_scroll) {
                var old_body_width = _static.$body.width();
                if (self.properties.last_html_overflow === false) {
                    self.properties.last_html_overflow = _static.getInlineStyle(_static.$html,'overflow');
                }
                var fix_scroll_top = _static.$window.scrollTop(); // chrome visual disturbance bug
                _static.$html.addClass('popbox-hide-page-scroll').css('overflow','hidden');
                var new_body_width = _static.$body.width();
                if (self.settings.hide_page_scroll_space) {
                    if (self.properties.last_html_margin_right === false) {
                        self.properties.last_html_margin_right = _static.getInlineStyle(_static.$html,'margin-right');
                    }
                    if (new_body_width > old_body_width) {
                        _static.$html.css('margin-right',(new_body_width-old_body_width)+'px');
                    }
                }
                _static.$window.scrollTop(fix_scroll_top);
            }
        }

        // show elements
        self._private.openOverlay();
        self.elements.$popbox_popup.css({
            'display':'block',
            'box-sizing':'content-box'
        });
        self.elements.$popbox.css({
            'display':'block',
            'box-sizing':'content-box'
        });
        self.elements.$popbox_popup.css({
            'visibility':'visible',
            'box-sizing':'content-box'
        });

        // is_loading should be false unless manually set it
        if (self.properties.is_loading) {
            self.showLoading();
        } else {
            self.showContent();
        }

        // adjust
        self.adjust(false);

        // prepare animation
        self.elements.$popbox_popup.css(self._private.getAnimationStartProperties('open'));
        _static.clearTransition(self.elements.$popbox_popup);
        // do animation
        self.properties.is_changing_state = true;
        _static.transition(
            self.elements.$popbox_popup,
            self._private.getAnimationEndProperties('open'),
            self._private.getAnimationSpeed('open'),
            self._private.getAnimationEase('open'),
            function(){
                self.properties.is_changing_state = false;
            }
        );

        self.properties.is_open = true;

        if (self.elements.$popbox_popup.hasClass('popbox-animating')) {
            self.properties.disable_background_click = true;
            self.properties.disable_background_click_timer = setTimeout(function(){
                self.properties.disable_background_click = false;
                self.properties.disable_background_click_timer = false;
                self._private.triggerHook('ready');
                self.trigger('ready');
            },self._private.getAnimationSpeed('open')+200);
        }

        self._private.triggerHook('after_open');
        self.trigger('after_open');

        if (!self.elements.$popbox_popup.hasClass('popbox-animating')) {
            self._private.triggerHook('ready');
            self.trigger('ready');
        }
    }
};

_core.prototype.close = function(destroy){
    var self = this;
    if (self.isOpen()) {
        self._private.triggerHook('close');
        self.trigger('close');

        self.properties.is_open = false;

        // clear all animation functions (they can animate but do not trigger their complete function)
        for (var object_name in self.elements) {
            if (self.elements.hasOwnProperty(object_name) && self.elements[object_name].length) {
                _static.clearTransition(self.elements[object_name]);
            }
        }

        // prepare animation
        self.elements.$popbox_popup.css(self._private.getAnimationStartProperties('close'));
        self.properties.is_changing_state = true;
        // do animation
        _static.transition(
            self.elements.$popbox_popup,
            self._private.getAnimationEndProperties('close'),
            self._private.getAnimationSpeed('close'),
            self._private.getAnimationEase('close'),
            function(){
                self.properties.is_changing_state = false;
                self.elements.$popbox.css({
                    'display':'none'
                });

                if (self.properties.last_html_overflow !== false) _static.$html.css('overflow',self.properties.last_html_overflow);
                if (self.properties.last_html_margin_right !== false) _static.$html.css('margin-right',self.properties.last_html_margin_right);
                self.properties.last_html_overflow = false;
                self.properties.last_html_margin_right = false;
                _static.$html.removeClass('popbox-hide-page-scroll');

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

                self._private.triggerHook('after_close');
                self.trigger('after_close');
            }
        );

        self._private.closeOverlay();
    }
};

_core.prototype.adjust = function(animate){
    var self = this;

    // initiate another adjust when each image loads (use a 100ms wait in case images load in one after each other quickly)
    animate = _static.param(animate,true);
    if (self.isCreated()) {

        var adjust_elements = function(animate,show_content) {
            animate = _static.param(animate,false);
            show_content = _static.param(show_content,false);

            self._private.triggerHook('adjust');
            self.trigger('adjust');

            var window_width = self.elements.$popbox_empty.width(), //_static.$window.width(),
                window_height = _static.$window.height(),
                popbox_width_padding = _static.elementPaddingWidth(self.elements.$popbox_popup),
                popbox_height_padding = _static.elementPaddingHeight(self.elements.$popbox_popup),
                content_width_padding = _static.elementPaddingWidth(self.elements.$popbox_content,true),
                content_height_padding = _static.elementPaddingHeight(self.elements.$popbox_content,true),
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
            if (_static.isNumber(self.settings.min_width,true) && min_popbox_width < self.settings.min_width) {
                min_popbox_width = self.settings.min_width;
            }
            if (_static.isNumber(self.settings.min_height,true) && min_popbox_height < self.settings.min_height) {
                min_popbox_height = self.settings.min_height;
            }

            self.elements.$popbox_content.css({
                'height':'',
                'overflow-y':'',
                'box-sizing':'content-box'
            });
            self.elements.$popbox_wrapper.css({
                'position':'relative',
                'top':'0px',
                'left':'0px',
                'width':(self.settings.fit) ? '99999px' : max_popbox_width+'px',
                'height':(self.settings.fit) ? '99999px' : '1px',
                'overflow':'hidden',
                'box-sizing':'content-box'
            });
            self.elements.$popbox_container.css({
                'position':'absolute',
                'top':'0px',
                'left':'0px',
                'width':set_popbox_width,
                'height':set_popbox_height,
                'min-width':(self.settings.min_width === true) ? '100%' : min_popbox_width+'px',
                'min-height':(self.settings.min_height === true) ? '100%' : min_popbox_height+'px',
                'max-width':'100%',
                'box-sizing':'content-box'
            });

            var $f_img = self.elements.$popbox_content.find('.popbox-fit-image');

            if (!$f_img.length) {
                $f_img = false;

                if (!self.elements.$popbox_content.find('.popbox-fit-ignore-images').length) {
                    self.elements.$popbox_content.find('img').each(function(){
                        var $img = $(this);
                        if (!$img.hasClass('popbox-fit-ignore-image') && !_static.isAbsolutePositioned($img,self.elements.$popbox_content)) {
                            $f_img = $img;
                            return false;
                        }
                    });
                }
            }

            if ($f_img) {
                $f_img.css('width', '');
            }

            // use true width to get overhang (stops text wrapping)
            new_popbox_width = Math.ceil(_static.getTrueWidth(self.elements.$popbox_container)*100)/100;
            new_popbox_height = Math.ceil(_static.getTrueHeight(self.elements.$popbox_container)*100)/100;

            var set_content_height = function(scroll){
                scroll = scroll || false;

                // deduct content padding and margin (when using content-box)
                var new_content_height = new_popbox_height-content_height_padding,
                    content_additional_offset = self.settings.content_additional_offset;
                // deduct content offset top
                new_content_height -= self.elements.$popbox_content.offset().top-self.elements.$popbox_container.offset().top;

                if (_static.isNumber(content_additional_offset)) {
                    new_content_height += content_additional_offset;
                }
                else {
                    content_additional_offset = [content_additional_offset];
                }

                if (content_additional_offset instanceof Array) {
                    for (var p=0; p<content_additional_offset.length; p++) {
                        if (_static.isString(content_additional_offset[p],true)) {
                            var content_additional_offset_value = 0;
                            $(content_additional_offset[p]).each(function(){
                                var $content_additional_offset_item = $(this),
                                    cur_value = ($content_additional_offset_item.offset().top+$content_additional_offset_item.outerHeight(true)) - (self.elements.$popbox_content.offset().top+self.elements.$popbox_content.outerHeight(true));
                                if (cur_value > 0 && cur_value > content_additional_offset_value) {
                                    content_additional_offset_value = cur_value;
                                }
                            });
                        }
                    }
                }

                self.elements.$popbox_content.css({
                    'height':(scroll) ? Math.floor(new_content_height)+'px' : new_content_height+'px',
                    'overflow-x':'hidden',
                    'overflow-y':(scroll) ? 'scroll' : 'hidden'
                });
            };

            if (self.settings.fit) { // fit for iframes and images
                var text_height = 0;

                var fitResize = function() {
                    var image_height = new_popbox_height;
                    if ($f_img) {
                        image_height = _static.getTrueHeight($f_img);
                    }
                    text_height = new_popbox_height - image_height;

                    if (new_popbox_width <= max_popbox_width && new_popbox_height <= max_popbox_height) {
                        return;
                    }

                    var width_offset = content_width_padding;
                    var height_offset = text_height + content_height_padding;

                    var max_mod_width = max_popbox_width - width_offset;
                    if (max_mod_width < 1) max_mod_width = 1;
                    var max_mod_height = max_popbox_height - height_offset;
                    if (max_mod_height < 1) max_mod_height = 1;

                    var new_mod_width = new_popbox_width - width_offset;
                    if (new_mod_width < 1) new_mod_width = 1;
                    var new_mod_height = new_popbox_height - height_offset;
                    if (new_mod_height < 1) new_mod_height = 1;

                    var max_ratio = max_mod_height / max_mod_width,
                        new_ratio = new_mod_height / new_mod_width;
                    if (new_ratio > max_ratio) {
                        new_popbox_width = (new_mod_width * (max_mod_height / new_mod_height)) + width_offset;
                        new_popbox_height = max_popbox_height;
                    } else {
                        new_popbox_height = ((new_mod_height) * (max_mod_width / new_mod_width)) + height_offset;
                        new_popbox_width = max_popbox_width;
                    }
                };

                var fitTextResize = function() {
                    var iteration = 0,
                        switch_effort = false,
                        container_height,
                        overlap_height,
                        current_image_height,
                        next_image_width,
                        stepped_popbox_width,
                        last_changed_iteration,
                        last_changed_img_height = 0,
                        last_changed_width = 0,
                        last_changed_height = 0;

                    while (text_height > 0 && iteration < 10) {
                        iteration++;

                        container_height = Math.ceil(_static.getTrueHeight(self.elements.$popbox_container)*100)/100;
                        // if the size has not changed, don't retry
                        if (switch_effort && Math.round(container_height) <= Math.round(new_popbox_height+1) && $f_img.height() / new_popbox_height > 0.5) {
                            // increase the image height if possible
                            overlap_height = new_popbox_height - container_height;

                            current_image_height = $f_img.height();
                            if (current_image_height < 1) current_image_height = 1;

                            next_image_width = ($f_img.width() * ((current_image_height + overlap_height) / current_image_height));
                            if (next_image_width < 1) next_image_width = 1;

                            $f_img.css('width', next_image_width + 'px');

                            break;
                        } else {
                            //
                            if ($f_img) {
                                $f_img.css('width', '');

                                if (iteration === 1) {
                                    new_popbox_width = $f_img.width() + content_width_padding;
                                }
                            }

                            self.elements.$popbox_container.css({
                                'width':new_popbox_width+'px',
                            });
                        }

                        container_height = Math.ceil(_static.getTrueHeight(self.elements.$popbox_container)*100)/100;

                        if (Math.round(container_height) <= Math.round(new_popbox_height+1)) {
                            // text and image fits in space
                            break;
                        } else {
                            if (switch_effort || new_popbox_width < 2 || ($f_img && $f_img.height() / new_popbox_height < 0.6)) {

                                // try to shrink the image instead
                                overlap_height = container_height - new_popbox_height;

                                current_image_height = $f_img.height();
                                if (current_image_height < 1) current_image_height = 1;

                                next_image_width = ($f_img.width() * ((current_image_height - overlap_height) / current_image_height));
                                if (next_image_width < 1) next_image_width = 1;

                                $f_img.css('width', next_image_width + 'px');

                                stepped_popbox_width = max_popbox_width - (max_popbox_width * ((10 - iteration) / 10));

                                self.elements.$popbox_container.css({
                                    'width': stepped_popbox_width + 'px',
                                });
                                new_popbox_width = stepped_popbox_width;

                                switch_effort = true;

                                var new_image_height = $f_img.height();

                                if (last_changed_img_height !== new_image_height) {
                                    last_changed_iteration = iteration;
                                    last_changed_img_height = new_image_height;
                                    last_changed_height = new_popbox_height;
                                    last_changed_width = new_popbox_width;
                                }

                                if (iteration === 10 && last_changed_iteration < 10) {
                                    new_popbox_width = last_changed_width;
                                    new_popbox_height = last_changed_height;
                                    break;
                                }
                            } else if (new_popbox_width < 0) {
                                // something has probably gone wrong
                                break;
                            } else {
                                new_popbox_height = container_height;
                            }

                            fitResize();
                        }
                    }
                };

                fitResize();

                if (text_height > 0) {
                    fitTextResize();
                }

                if (new_popbox_width > max_popbox_width || new_popbox_height > max_popbox_height) {

                    // for iframes
                    if (self.settings.fit === 'round') {
                        new_popbox_width = Math.round(new_popbox_width);
                        new_popbox_height = Math.round(new_popbox_height);
                    }

                    set_content_height(false);
                }
            }
            else if ((self.settings.max_height === true || _static.isNumber(self.settings.max_height,true)) && new_popbox_height > max_popbox_height) {
                // apply inner overflow scroll
                new_popbox_height = max_popbox_height;
                set_content_height(true);
            }
            else {
                set_content_height(false);
            }

            // cleanup
            var cleanup = function(){
                self.elements.$popbox_wrapper.css({
                    'position':'',
                    'top':'',
                    'left':'',
                    'width':'',
                    'height':'',
                    'overflow':''
                });
                self.elements.$popbox_container.css({
                    'position':'',
                    'top':'',
                    'left':'',
                    'width':'',
                    'height':'',
                    'min-width':'',
                    'min-height':'',
                    'max-width':''
                });
            };

            new_popbox_left = (window_width-(new_popbox_width+popbox_width_padding))/2;
            new_popbox_top = (window_height-(new_popbox_height+popbox_height_padding))/2;

            // offset adjustment checks
            if (new_popbox_height > max_popbox_screen_height) {
                new_popbox_top = (self.settings.height_margin > 0) ? window_height*self.settings.height_margin : 0;
            }

            if (animate) {
                _static.clearTransition(self.elements.$popbox_popup,'adjust');

                _static.transition(
                    self.elements.$popbox_empty,
                    {
                        'height':Math.floor(new_popbox_height+popbox_height_padding+(new_popbox_top*2)-1)+'px'
                    },
                    _static._speeds.fast,
                    _static._eases.easeInOutQuad
                );
                _static.transition(
                    self.elements.$popbox_popup,
                    {
                        'width':(new_popbox_width)+'px',
                        'height':(new_popbox_height)+'px',
                        'top':new_popbox_top+'px',
                        'left':new_popbox_left+'px'
                    },
                    _static._speeds.fast,
                    _static._eases.easeInOutQuad,
                    function(){
                        cleanup();
                        if (show_content) self.showContent();
                        self._private.triggerHook('after_adjust');
                        self.trigger('after_adjust');
                    },
                    'adjust'
                );
            }
            else {

                cleanup();

                self.elements.$popbox_popup.css({
                    'width':new_popbox_width+'px',
                    'height':new_popbox_height+'px',
                    'top':new_popbox_top+'px',
                    'left':new_popbox_left+'px'
                });

                self.elements.$popbox_empty.css({
                    'height':Math.floor(new_popbox_height+popbox_height_padding+(new_popbox_top*2)-1)+'px'
                });

                if (show_content) self.showContent();

                self._private.triggerHook('after_adjust');
                self.trigger('after_adjust');
            }
        };


        self._private.checkImagesLoaded();

        if (self.settings.wait_for_images && self.properties.cache.content_images_pending > 0) {
            self.showLoading(function(){
                if (!animate) adjust_elements(animate,false);
            });
        }
        else if (!animate) {
            adjust_elements(false,self.properties.is_open);
        }
        else {
            self.showLoading(function(){
                adjust_elements(animate,true);
            });
        }
    }
};

_core.prototype.showLoading = function(ready){
    var self = this;
    if (self.isCreated()) {
        if (self.isOpen()) {
            if (self.isLoading()){
                //TODO need to add the ability to take off transition events from transitioned elements
                if (_static.isFunction(ready)) ready();
                return;
            }

            _static.clearTransition(self.elements.$popbox_loading);
            _static.clearTransition(self.elements.$popbox_wrapper);
            _static.transition(
                self.elements.$popbox_wrapper,
                {'opacity':'0'},
                _static._speeds.fast,
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
                        _static._speeds.fast,
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
    } else {
        if (_static.isFunction(ready)) ready();
    }
    self.properties.is_loading = true;
};

_core.prototype.showContent = function(ready){
    var self = this;
    if (self.isCreated()) {
        if (self.isOpen()) {
            if (!self.isLoading()){
                if (_static.isFunction(ready)) ready();
                return;
            }

            _static.clearTransition(self.elements.$popbox_loading);
            _static.clearTransition(self.elements.$popbox_wrapper);
            _static.transition(
                self.elements.$popbox_loading,
                {'opacity':'0'},
                _static._speeds.fast,
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
                        _static._speeds.fast,
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
    } else {
        if (_static.isFunction(ready)) ready();
    }
    self.properties.is_loading = false;
};

_core.prototype.isLoading = function(){
    var self = this;
    return self.properties.is_loading;
};

_core.prototype.isOpen = function(){
    var self = this;
    return self.properties.is_open;
};

_core.prototype.isChangingState = function(){
    var self = this;
    return self.properties.is_changing_state;
};

_core.prototype.isCreated = function(){
    var self = this;
    return !!self.elements.$popbox;
};

_core.prototype.on = function(event,handler){
    var self = this;
    var event_parts = event.split('.',2);
    if (event_parts.length) {
        var event_type = event_parts[0], event_name = (event_parts[1]) ? event_parts[1] : '_default';
        if (!_static.isPlainObject(self.properties.events[event_type])) self.properties.events[event_type] = {};
        if (!_static.isArray(self.properties.events[event_type][event_name])) self.properties.events[event_type][event_name] = [];
        self.properties.events[event_type][event_name].push(handler);
    }
};

_core.prototype.off = function(event,handler){
    var self = this;
    var event_parts = event.split('.',2);
    if (event_parts.length) {
        var event_type = event_parts[0], event_name = (event_parts[1]) ? event_parts[1] : false;
        if (_static.isPlainObject(self.properties.events[event_type])) {
            for (var current_event_name in self.properties.events[event_type]) {
                if (self.properties.events[event_type].hasOwnProperty(current_event_name)
                    && _static.isArray(self.properties.events[event_type][current_event_name])
                    && (event_name === false || event_name === current_event_name)) {
                    if (_static.isFunction(handler)) {
                        for (var i=0; i<self.properties.events[event_type][current_event_name].length; i++) {
                            if (self.properties.events[event_type][current_event_name][i] === handler) {
                                self.properties.events[event_type][current_event_name].splice(i,1);
                                i--;
                            }
                        }
                    }
                    else self.properties.events[event_type][current_event_name] = [];
                }
            }
        }
    }
};

_core.prototype.trigger = function(event,handler,params){
    var self = this;
    params = (_static.isArray(params)) ? params : [];
    var event_parts = event.split('.',2);
    if (event_parts.length) {
        var event_type = event_parts[0], event_name = (event_parts[1]) ? event_parts[1] : false;
        if (_static.isFunction(self.settings[event_type])) {
            self.settings[event_type]();
        }
        if (_static.isPlainObject(self.properties.events[event_type])) {
            for (var current_event_name in self.properties.events[event_type]) {
                if (self.properties.events[event_type].hasOwnProperty(current_event_name)
                    && _static.isArray(self.properties.events[event_type][current_event_name])
                    && (event_name === false || event_name === current_event_name)) {
                    for (var i=0; i<self.properties.events[event_type][current_event_name].length; i++) {
                        if (_static.isFunction(self.properties.events[event_type][current_event_name][i])
                            && (!_static.isFunction(handler) || self.properties.events[event_type][current_event_name][i] === handler)) {
                            self.properties.events[event_type][current_event_name][i].apply(self,params);
                        }
                    }
                }
            }
        }
    }
};
