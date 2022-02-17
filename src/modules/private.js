import $ from "jquery"
import {_static} from "./static"

export const _private = function(core_self) {
    this.self = core_self
};

_private.prototype.reset = function() {
    var self = this.self;

    self._private.triggerHook('reset');
    self.trigger('reset');

    if (self.properties.disable_background_click_timer !== false) {
        clearTimeout(self.properties.disable_background_click_timer);
    }

    self.properties = {
        is_open:false,
        is_loading:false,
        is_changing_state:false,
        disable_background_click:false,
        disable_background_click_timer:false,
        last_html_overflow:false,
        last_html_margin_right:false,
        instance_id:self.properties.instance_id,
        events:self.properties.events,
        cache:{
            images:{},
            interface_images_pending:0,
            content_images_pending:0,
            window_width:-1
        }
    };
    self.elements = {
        $popbox:null,
        $popbox_loading:null,
        $popbox_popup:null,
        $popbox_empty:null,
        $popbox_wrapper:null,
        $popbox_container:null,
        $popbox_title:null,
        $popbox_close:null,
        $popbox_content:null,
        $popbox_overlay:self.elements.$popbox_overlay // not part of individual popbox
    };

    self._private.triggerHook('after_reset');
    self.trigger('after_reset');
};

_private.prototype.createOverlay = function(){
    var self = this.self;

    var $container = (self.settings.container) ? $(self.settings.container) : _static.$body,
        $existing_popbox_overlay = $container.children('.popbox-overlay');

    if ($existing_popbox_overlay.length) {
        self.elements.$popbox_overlay = $existing_popbox_overlay;
    }
    else {
        self.elements.$popbox_overlay = $('<div/>',{
            'class':'popbox-overlay',
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

    self.elements.$popbox_overlay.html(self.settings.overlay_text);

    // you shouldn't be able to use this unless there is a problem. the empty for each popbox is used first.
    self.elements.$popbox_overlay.off('click.popbox_overlay_close').on('click.popbox_overlay_close',function(e){
        e.preventDefault();
        for (var i in _static._instances) {
            if (_static._instances.hasOwnProperty(i)) {
                if (_static._instances[i] instanceof self.constructor && _static._instances[i].isOpen()) {
                    _static._instances[i].close();
                }
            }
        }
        self._private.closeOverlay(true);
    });
};

_private.prototype.destroyOverlay = function(){
    var self = this.self;
    if (_static._instances.length <= 0 && self.elements.$popbox_overlay) {
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

_private.prototype.closeOverlay = function(force){
    var self = this.self;
    // run this function after marking popboxes as closed, it checks to see if there are any popboxes open, use force to bypass it
    if (self.elements.$popbox_overlay) {

        if (!force) {
            var any_open_popbox = false;
            for (var i in _static._instances) {
                if (_static._instances.hasOwnProperty(i)) {
                    if (_static._instances[i] instanceof self.constructor && _static._instances[i].isOpen()) {
                        any_open_popbox = true;
                        break;
                    }
                }
            }
            if (any_open_popbox) return;
        }

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
    return self.settings[type+'_animation_speed'] || self.settings.animation_speed || _static._speeds._default;
};

_private.prototype.getAnimationEase = function(type){
    var self = this.self;
    return self.settings[type+'_animation_ease'] || self.settings.animation_ease || _static._eases._default;
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

        self.properties.cache.content_images_pending = 0;
        self.properties.cache.interface_images_pending = 0;

        var $images = self.elements.$popbox.find('img');

        $images.each(function(){
            var image = this,
                $image = $(this);

            if (image.src) {
                var image_ready = ((image.complete && _static.isNumber(image.naturalWidth,false)) || image.readyState === 4 || image.readyState === 'complete');
                if (!image_ready) {
                    self.properties.cache.images[image.src] = {
                        origin:image,
                        $origin:$image,
                        proxy:false,
                        loaded:false,
                        type:($image.closest(self.elements.$popbox_content).length > 0) ? 'content' : 'interface'
                    };
                }
            }
        });

        var proxy_image_event = function(type){
            if (type === 'content') {
                self.properties.cache.content_images_pending--;
                if (self.properties.cache.content_images_pending <= 0) {
                    self.properties.cache.content_images_pending = 0;
                    if (self.isChangingState() && self.elements.$popbox_popup.hasClass('popbox-animating')) _static.transitionAddCallback(self.elements.$popbox_popup,function(){self.adjust(true);});
                    else self.adjust(true);
                }
            }
            else {
                self.properties.cache.interface_images_pending--;
                if (self.properties.cache.interface_images_pending <= 0) {
                    self.properties.cache.interface_images_pending = 0;
                    //if (self.isLoading()) self.adjust(true);
                }
            }
        };

        for (var image_cache_src in self.properties.cache.images) {
            if (self.properties.cache.images.hasOwnProperty(image_cache_src)) {
                if (!self.properties.cache.images[image_cache_src].proxy) {
                    (function(image_cache_src){
                        var proxy_image = new Image();

                        if (self.properties.cache.images[image_cache_src].type === 'content') {
                            self.properties.cache.content_images_pending++;
                        }
                        else {
                            self.properties.cache.interface_images_pending++;
                        }

                        self.properties.cache.images[image_cache_src].proxy = proxy_image;

                        proxy_image.onload = function(){
                            if (!self.properties.cache.images[image_cache_src].loaded) {
                                self.properties.cache.images[image_cache_src].loaded = true;
                                proxy_image_event(self.properties.cache.images[image_cache_src].type);
                                self._private.triggerHook('image_load',[image_cache_src]);
                                self.trigger('image_load',false,[image_cache_src]);
                            }
                        };

                        proxy_image.onerror = function(){
                            if (!self.properties.cache.images[image_cache_src].loaded) {
                                self.properties.cache.images[image_cache_src].loaded = true;
                                proxy_image_event(self.properties.cache.images[image_cache_src].type);
                                self._private.triggerHook('image_error',[image_cache_src]);
                                self.trigger('image_error',false,[image_cache_src]);
                            }
                        };

                        proxy_image.src = image_cache_src;

                    })(image_cache_src);
                }
                else if (!self.properties.cache.images[image_cache_src].loaded) {
                    if (self.properties.cache.images[image_cache_src].type === 'content') {
                        self.properties.cache.content_images_pending++;
                    }
                    else {
                        self.properties.cache.interface_images_pending++;
                    }
                }
            }
        }

        if (self.properties.cache.content_images_pending === 0 && self.properties.cache.interface_images_pending === 0) {
            return true;
        }
    }

    return false;
};

_private.prototype.applySettings = function(){
    var self = this.self;

    var window_width = _static.$window.width(),
        responsive_width_keys = [],
        new_settings = $.extend(true, {}, self.base_settings);

    if (window_width !== self.properties.cache.window_width) {
        if (typeof self.base_settings.responsive === "object") {
            for (var responsive_key in self.base_settings.responsive) {
                if (self.base_settings.responsive.hasOwnProperty(responsive_key)) {
                    responsive_width_keys.push(responsive_key);
                }
            }
        }

        if (responsive_width_keys.length) {
            responsive_width_keys.sort(function (a, b) {
                return a - b
            });

            for (var i = responsive_width_keys.length; i >= 0; i--) {
                if (window_width > parseInt(responsive_width_keys[i], 10)) {
                    $.extend(true, new_settings, self.base_settings.responsive[responsive_width_keys[i]]);
                    break;
                }
            }

            self.settings = new_settings;
            self._private.applyDomSettings();
        } else {
            self.settings = new_settings;
        }

        self.properties.cache.window_width = window_width;
    } else {
        self.settings = new_settings;
    }
};

_private.prototype.applyDomSettings = function(){
    var self = this.self;
    if (self.isCreated()) {

        self._private.triggerHook('update_dom');
        self.trigger('update_dom');

        self.elements.$popbox.attr('class','').addClass('popbox');

        if (self.settings.loading_text !== self.elements.$popbox_loading.html()) {
            self.elements.$popbox_loading.html(self.settings.loading_text);
        }
        self.elements.$popbox_close.html(self.settings.close_text);
        self.elements.$popbox_overlay.html(self.settings.overlay_text);
        self.elements.$popbox_title.html(self.settings.title);

        if (_static.isFunction(self.settings.content.appendTo)) {
            self.elements.$popbox_content.html('');
            self.settings.content.appendTo(self.elements.$popbox_content);
        }
        else {
            self.elements.$popbox_content.html(self.settings.content);
        }

        if (_static.isString(self.settings.add_class,true)) {
            self.elements.$popbox.addClass(self.settings.add_class);
        }

        if (self.settings.fit) self.elements.$popbox.addClass('popbox-fit');
        else self.elements.$popbox.removeClass('popbox-fit');

        // checks
        if (self.settings.close_text === false) self.elements.$popbox_close.css('display','none');
        else self.elements.$popbox_close.css('display','block');
        if (self.settings.title === false) self.elements.$popbox_title.css('display','none');
        else self.elements.$popbox_title.css('display','block');

        if (_static.isNumber(self.settings.z_index,true)) {
            self.elements.$popbox_overlay.css('z-index',self.settings.z_index);
            self.elements.$popbox.css('z-index',self.settings.z_index+1);
            self.elements.$popbox_popup.css('z-index',self.settings.z_index+2);
        }

        var user_agent_checks = {
            'mobile':navigator.userAgent.match(/(iPad|iPhone|iPod|Android)/g),
            'ios':navigator.userAgent.match(/(iPad|iPhone|iPod)/g),
            'android':navigator.userAgent.match(/(Android)/g)
        };

        if (self.settings.absolute === true || (_static.isString(self.settings.absolute) && user_agent_checks[self.settings.absolute])) {
            self.elements.$popbox.css({
                'position':'absolute',
                'overflow-y':'visible',
                'overflow-x':'visible'
            });
        }
        else {
            self.elements.$popbox.css({
                'position':'fixed',
                'overflow-y':'scroll',
                'overflow-x':'hidden'
            });
        }

        self._private.triggerHook('after_update_dom');
        self.trigger('after_update_dom');
    }
};

_private.prototype.triggerHook = function(name,params){
    var self = this.self;
    params = (_static.isArray(params)) ? params : [];
    if (_static.isPlainObject(self.hooks) && _static.isArray(self.hooks[name])) {
        for (var i=0; i<self.hooks[name].length; i++) {
            if (_static.isFunction(self.hooks[name][i])) {
                self.hooks[name][i].apply(self,params);
            }
        }
    }
};
