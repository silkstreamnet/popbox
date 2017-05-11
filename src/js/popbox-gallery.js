(function($,window){
    (function(){var minimum_required_popbox_version = '3.0.9'.split('.');for (var pvi= 0,pvl = $.Popbox.prototype.version.split('.').length; pvi<pvl; pvi++) if ($.Popbox.prototype.version.split('.')[pvi] < minimum_required_popbox_version[pvi]) {console.log("Error: Popbox "+minimum_required_popbox_version.join('.')+"+ required.");return;}})();

    var _private = function(){},
        _static = $.Popbox.prototype._static,
        extend_default_settings = {
            gallery:{ // mode must be set to gallery for this to be used
                selector:'', // selector to get images, either is a link to an image or the image or all images or links found inside
                clickable:true, // whether to apply a click/touch to selector items
                error:'<div class="popbox-gallery-error">There was an error loading the image.</div>',
                next:'<span>&#x25B6;</span>',
                prev:'<span>&#x25C0;</span>',
                items:[] // array of image urls
            }
        };

    _static._gallery_event_namespace = 'PopboxGallery';

    $.extend(true,$.Popbox.prototype.default_settings,extend_default_settings);

    _private.prototype.attachSwipeEvents = function() {
        var popbox = this.self.popbox;

        if (popbox.elements.$popbox_popup) {
            // include movement vertically in case we need to escape for vertical scrolling
            var disable_mouse = false,
                capture_space = 8,
                captured = false,
                start_x = 0,
                start_y = 0,
                move_x = 0,
                move_y = 0,

                start = function(new_x,new_y,event,type) {
                    start_x = new_x;
                    start_y = new_y;
                    move_x = start_x;
                    move_y = start_y;
                    move(new_x,new_y,event,type);
                },
                move = function(new_x,new_y,event,type) {
                    move_x = new_x;
                    move_y = new_y;

                    var move_diff_x = Math.abs(move_x - start_x) - capture_space,
                        move_diff_y = Math.abs(move_y - start_y) - capture_space;

                    if (!captured) {
                        if (move_diff_x > 0 && move_diff_x > move_diff_y) {
                            captured = true;
                        } else {
                            if ((move_diff_x > 0 || move_diff_y > 0) && move_diff_y > move_diff_x) {
                                end(new_x,new_y,event,type);
                            }
                            return;
                        }
                    }

                    if (event) event.preventDefault();

                    // move image

                },
                end = function(new_x,new_y,event,type) {
                    _static.$document.off('touchmove.'+_static._gallery_event_namespace);
                    _static.$document.off('touchend.'+_static._gallery_event_namespace);
                    _static.$document.off('mousemove.'+_static._gallery_event_namespace);
                    _static.$document.off('mouseup.'+_static._gallery_event_namespace);

                    if (captured) {

                    }

                    return !captured;
                };

            popbox.elements.$popbox_popup.off('dragstart.'+_static._gallery_event_namespace).on('dragstart.'+_static._gallery_event_namespace, function(e){
                e.preventDefault();
            });
            popbox.elements.$popbox_popup.off('touchstart.'+_static._gallery_event_namespace).on('touchstart.'+_static._gallery_event_namespace, function(e){
                start(e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY,e,'touch');
                _static.$document.off('touchmove.'+_static._gallery_event_namespace).on('touchmove.'+_static._gallery_event_namespace, function(e){
                    move(e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY,e,'touch');
                });
                _static.$document.off('touchend.'+_static._gallery_event_namespace).on('touchend.'+_static._gallery_event_namespace, function(e){
                    return end(e.originalEvent.touches[0].pageX,e.originalEvent.touches[0].pageY,e,'touch');
                });
            });
            popbox.elements.$popbox_popup.off('mousedown.'+_static._gallery_event_namespace).on('mousedown.'+_static._gallery_event_namespace, function(e){
                if (e.which === 1) {
                    start(e.pageX,e.pageY,e,'mouse');
                    _static.$document.off('mousemove.'+_static._gallery_event_namespace).on('mousemove.'+_static._gallery_event_namespace, function(e){
                        move(e.pageX,e.pageY,e,'mouse');
                    });
                    _static.$document.off('mouseup.'+_static._gallery_event_namespace).on('mouseup.'+_static._gallery_event_namespace, function(e){
                        if (e.which === 1) {
                            return end(e.pageX,e.pageY,e,'mouse');
                        }
                    });
                }
            });
            popbox.elements.$popbox_popup.off('click.'+_static._gallery_event_namespace).on('click.'+_static._gallery_event_namespace, function(e){

            });
        }
    };

    var gallery = function(popbox){
        var self = this;
        self.popbox = popbox;
        self._private = new _private();
        self._private.self = self;
    };

    gallery.prototype.refreshItems = function(){
        var self = this, popbox = this.popbox;

        // get image file links
        if (_static.isArray(popbox.settings.gallery.items) && popbox.settings.gallery.items.length > 0) {
            for (var i=0; i<popbox.settings.gallery.items.length; i++) {
                popbox.properties.gallery.items.push(popbox.settings.gallery.items[i]);
            }
        }

        if (popbox.settings.gallery.selector) {

            var $items = $(popbox.settings.gallery.selector);

            $items.each(function(){
                // check for src or href (href first)
                var $item = $(this),
                    data_url = $item.data('url'),
                    href = $item.attr('href'),
                    src = $item.attr('src'),
                    link = false;
                if (data_url) link = data_url;
                else if (href) link = href;
                else if (src) link = src;
                else {
                    // get sub items
                    $item.find('a[href]').each(function(){
                        var sublink = $(this).attr('href');
                        if (sublink && !sublink.match(/^#/) && _static.indexOf(sublink,popbox.properties.gallery.items,true) < 0)
                            popbox.properties.gallery.items.push(sublink);
                    });
                    $item.find('img[src]').each(function(){
                        var sublink = $(this).attr('src');
                        if (sublink && _static.indexOf(sublink,popbox.properties.gallery.items,true) < 0)
                            popbox.properties.gallery.items.push(sublink);
                    });
                }

                if (link && _static.indexOf(link,popbox.properties.gallery.items,true) < 0) popbox.properties.gallery.items.push(link);
            });

            if (popbox.settings.gallery.clickable) {
                $items.off('click.popbox_gallery_open').on('click.popbox_gallery_open',function(e){
                    e.preventDefault();
                    var $item = $(this),
                        data_url = $item.data('url'),
                        href = $item.attr('href'),
                        src = $item.attr('src');
                    self.refreshItems();
                    if (data_url) self.goTo(_static.indexOf(data_url,popbox.properties.gallery.items,true));
                    else if (href) self.goTo(_static.indexOf(href,popbox.properties.gallery.items,true));
                    else if (src) self.goTo(_static.indexOf(src,popbox.properties.gallery.items,true));
                    else {
                        // get first sub item
                        var first_href = $item.find('a[href]:first').attr('href'),
                            first_src = $item.find('img[src]:first').attr('src');

                        if (first_href && !first_href.match(/^#/)) self.goTo(_static.indexOf(first_href,popbox.properties.gallery.items,true));
                        else if (first_src) self.goTo(_static.indexOf(first_src,popbox.properties.gallery.items,true));
                    }
                    popbox.open();
                });
            }
        }
    };
    gallery.prototype.addItem = function(item) {
        var self = this;
        self.addItems([item]);
    };
    gallery.prototype.removeItem = function(item) {
        var self = this;
        self.removeItems([item]);
    };
    gallery.prototype.addItems = function(items) {
        var popbox = this.popbox;
        if (items) {
            if (!_static.isArray(popbox.settings.gallery.items)) popbox.settings.gallery.items = [];
            if (!_static.isArray(items)) items = [items];
            for (var i=0; i<items.length; i++) {
                popbox.settings.gallery.items.push(items[i]);
            }
        }
    };
    gallery.prototype.removeItems = function(items) {
        var popbox = this.popbox;
        if (items && _static.isArray(popbox.settings.gallery.items)) {
            if (!_static.isArray(items)) items = [items];
            for (var i=0; i<items.length; i++) {
                var item_index = _static.indexOf(items[i],popbox.settings.gallery.items);
                if (item_index >= 0) {
                    popbox.settings.gallery.items.splice(item_index,1);
                }
            }
        }
    };
    gallery.prototype.goTo = function(new_item_index){
        var popbox = this.popbox;

        new_item_index = (_static.isNumber(new_item_index)) ? new_item_index : popbox.properties.gallery.current_index;

        if (popbox.properties.gallery.items.length > 0) {

            if (new_item_index > popbox.properties.gallery.items.length-1) {
                new_item_index = 0;
            }
            else if (new_item_index < 0) {
                new_item_index = (popbox.properties.gallery.items.length > 0) ? popbox.properties.gallery.items.length-1 : 0;
            }

            popbox.properties.gallery.current_index = new_item_index;

            popbox.update({
                content:'<div class="popbox-gallery-container"><div class="popbox-gallery-image"><img src="'+popbox.properties.gallery.items[popbox.properties.gallery.current_index]+'" /></div></div>'
            },true);
        }
    };
    gallery.prototype.next = function(){
        var self = this, popbox = this.popbox;
        self.goTo(popbox.properties.gallery.current_index+1);
    };
    gallery.prototype.prev = function(){
        var self = this, popbox = this.popbox;
        self.goTo(popbox.properties.gallery.current_index-1);
    };

    $.Popbox.prototype.gallery = gallery;

    _static.addHook('initialize',function(){
        var popbox = this;
        popbox.gallery = new gallery(popbox);
    });

    _static.addHook('after_initialize',function(new_settings){
        var self = this.gallery, popbox = this;
        if (popbox.settings.mode === 'gallery' && new_settings && !_static.isSet(new_settings.aspect_fit)) {
            popbox.settings.aspect_fit = true;
        }
        self.refreshItems();
    });

    _static.addHook('after_reset',function(){
        var popbox = this;
        popbox.properties.gallery = {
            items:[],
            current_index:0
        };
    });

    _static.addHook('after_create',function(){
        var self = this.gallery;
        self._private.attachSwipeEvents();
    });

    _static.addHook('open',function(){
        var self = this.gallery, popbox = this;
        if (popbox.settings.mode === 'gallery') {
            self.refreshItems();
            var $existing_img = $('<div/>').html(popbox.settings.content).find('img[src]'),
                existing_img_index = 0;
            if ($existing_img.length) {
                existing_img_index = _static.indexOf($existing_img.attr('src'),popbox.properties.gallery.items,true);
            }
            self.goTo(existing_img_index);
        }
    });

    _static.addHook('image_error',function(image_cache_src){
        var popbox = this;
        if (popbox.settings.mode === 'gallery') {
            popbox.update({
                content:popbox.settings.gallery.error
            },false);

            if (popbox.properties.image_cache[image_cache_src]) {
                delete popbox.properties.image_cache[image_cache_src];
            }
        }
    });

    _static.addHook('after_update',function(){
        var self = this.gallery, popbox = this;

        if (!popbox.isOpen()) {
            popbox.properties.gallery.items = [];
            popbox.properties.gallery.current_index = 0;
        }

        if (popbox.settings.mode === 'gallery') {
            self.refreshItems();
            self.goTo();
        }
    });

    _static.addHook('after_update_dom',function(){
        var self = this.gallery, popbox = this;

        var show_btns = false;

        if (popbox.settings.mode === 'gallery') {
            popbox.elements.$popbox.addClass('popbox-gallery');

            if (popbox.properties.gallery.items.length > 1) {
                // put the next and previous buttons in the popbox
                if (!popbox.elements.$popbox_gallery_next) {
                    popbox.elements.$popbox_gallery_next = $('<a/>',{
                        'class':'popbox-gallery-next',
                        'href':'javascript:void(0);'
                    }).html(popbox.settings.gallery.next).appendTo(popbox.elements.$popbox_container);
                }
                if (!popbox.elements.$popbox_gallery_prev) {
                    popbox.elements.$popbox_gallery_prev = $('<a/>',{
                        'class':'popbox-gallery-prev',
                        'href':'javascript:void(0);'
                    }).html(popbox.settings.gallery.prev).appendTo(popbox.elements.$popbox_container);
                }

                popbox.elements.$popbox_gallery_next.off('click.popbox_gallery_next').on('click.popbox_gallery_next',function(e){
                    e.preventDefault();
                    self.next();
                });

                popbox.elements.$popbox_gallery_prev.off('click.popbox_gallery_prev').on('click.popbox_gallery_prev',function(e){
                    e.preventDefault();
                    self.prev();
                });

                show_btns = true;
            }
        }

        if (!show_btns) {
            // remove the next and previous buttons from the popbox if they exist
            if (popbox.elements.$popbox_gallery_next) popbox.elements.$popbox_gallery_next.remove();
            if (popbox.elements.$popbox_gallery_prev) popbox.elements.$popbox_gallery_prev.remove();
            popbox.elements.$popbox_gallery_next = false;
            popbox.elements.$popbox_gallery_prev = false;
        }
    });

    $.Popbox.prototype.plugins.gallery = '1.1.0';

})(jQuery,window);