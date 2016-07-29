(function($,window){
    (function(){var minimum_required_popbox_version = '3.0.0'.split('.');for (var pvi= 0,pvl = $.Popbox.prototype.version.split('.').length; pvi<pvl; pvi++) if ($.Popbox.prototype.version.split('.')[pvi] < minimum_required_popbox_version[pvi]) {console.log("Error: Popbox "+minimum_required_popbox_version.join('.')+"+ required.");return;}})();

    var _static = $.Popbox.prototype._static,
        extend_default_settings = {
            gallery:{ // mode must be set to gallery for this to be used
                selector:'', // selector to get images, either is a link to an image or the image or all images or links found inside
                clickable:true, // whether to apply a click/touch to selector items
                error:'<div class="popbox-gallery-error">There was an error loading the image.</div>',
                next:'<span>&#x25B6;</span>',
                prev:'<span>&#x25C0;</span>'
            }
        };

    $.extend(true,$.Popbox.prototype.default_settings,extend_default_settings);

    var gallery = function(){};
    gallery.prototype.updateItems = function(){
        var popbox = this.self;

        // get image file links
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
                    popbox.gallery.updateItems();
                    if (data_url) popbox.gallery.goTo(_static.indexOf(data_url,popbox.properties.gallery.items,true));
                    else if (href) popbox.gallery.goTo(_static.indexOf(href,popbox.properties.gallery.items,true));
                    else if (src) popbox.gallery.goTo(_static.indexOf(src,popbox.properties.gallery.items,true));
                    else {
                        // get first sub item
                        var first_href = $item.find('a[href]:first').attr('href'),
                            first_src = $item.find('img[src]:first').attr('src');

                        if (first_href && !first_href.match(/^#/)) popbox.gallery.goTo(_static.indexOf(first_href,popbox.properties.gallery.items,true));
                        else if (first_src) popbox.gallery.goTo(_static.indexOf(first_src,popbox.properties.gallery.items,true));
                    }
                    popbox.open();
                });
            }
        }
    };
    gallery.prototype.goTo = function(new_item_index){
        var popbox = this.self;

        new_item_index = (_static.isNumber(new_item_index)) ? new_item_index : popbox.properties.gallery.current_index;

        if (popbox.properties.gallery.items.length > 0) {

            if (new_item_index < -1 || new_item_index > popbox.properties.gallery.items.length-1) {
                new_item_index = 0;
            }
            else if (new_item_index < 0) {
                new_item_index = (popbox.properties.gallery.items.length > 0) ? popbox.properties.gallery.items.length-1 : 0;
            }

            popbox.properties.gallery.current_index = new_item_index;

            popbox.update({
                content:'<img src="'+popbox.properties.gallery.items[popbox.properties.gallery.current_index]+'" />'
            },true);
        }
    };
    gallery.prototype.next = function(){
        var popbox = this.self;
        popbox.gallery.goTo(popbox.properties.gallery.current_index+1);
    };
    gallery.prototype.prev = function(){
        var popbox = this.self;
        popbox.gallery.goTo(popbox.properties.gallery.current_index-1);
    };

    $.Popbox.prototype.gallery = gallery;

    _static.addHook('initialize',function(){
        var popbox = this;
        popbox.gallery = new gallery();
        popbox.gallery.self = popbox;
    });

    _static.addHook('after_initialize',function(new_settings){
        var popbox = this;
        if (popbox.settings.mode == 'gallery' && new_settings && !_static.isSet(new_settings.aspect_fit)) popbox.settings.aspect_fit = true;
        popbox.gallery.updateItems();
    });

    _static.addHook('after_reset',function(){
        var popbox = this;
        popbox.properties.gallery = {
            items:[],
            current_index:0
        };
    });

    _static.addHook('open',function(){
        var popbox = this;
        if (popbox.settings.mode == 'gallery') {
            popbox.gallery.updateItems();
            var $existing_img = $('<div/>').html(popbox.settings.content).find('img[src]'),
                existing_img_index = -1;
            if ($existing_img.length) {
                existing_img_index = _static.indexOf($existing_img.attr('src'),popbox.properties.gallery.items,true);
            }
            popbox.gallery.goTo(existing_img_index);
        }
    });

    _static.addHook('image_error',function(image_cache_src){
        var popbox = this;
        if (popbox.settings.mode == 'gallery') {
            popbox.update({
                content:popbox.settings.gallery.error
            },false);

            if (popbox.properties.image_cache[image_cache_src]) {
                delete popbox.properties.image_cache[image_cache_src];
            }
        }
    });

    _static.addHook('after_update',function(){
        var popbox = this;

        if (!popbox.isOpen()) {
            popbox.properties.gallery.items = [];
            popbox.properties.gallery.current_index = 0;
        }

        if (popbox.settings.mode == 'gallery') {
            popbox.gallery.updateItems();
            popbox.gallery.goTo();
        }
    });

    _static.addHook('after_update_dom',function(){
        var popbox = this;

        var show_btns = false;

        if (popbox.settings.mode === 'gallery') {
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
                    popbox.gallery.next();
                });

                popbox.elements.$popbox_gallery_prev.off('click.popbox_gallery_prev').on('click.popbox_gallery_prev',function(e){
                    e.preventDefault();
                    popbox.gallery.prev();
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

    $.Popbox.prototype.plugins.gallery = '1.0.1';

})(jQuery,window);