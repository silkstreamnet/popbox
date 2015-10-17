(function($,window){
    var minimum_required_popbox_version = '3.0.0'.split('.');
    var popbox_version = (typeof $.Popbox === "undefined" || typeof $.Popbox.prototype.version === "undefined") ? false : $.Popbox.prototype.version.split('.');

    if (!popbox_version || parseInt(popbox_version[0],10) < 3) {
        console.log("Error: Popbox "+minimum_required_popbox_version.join('.')+"+ required.");
        return;
    }

    var _static = $.Popbox.prototype._static,
        extend_default_settings = {
            gallery:{ // mode must be set to gallery for this to be used
                selector:'', // selector to get images, either is a link to an image or the image or all images or links found inside
                error:'<div>There was an error loading the image.</div>',
                next:'<span>&#x25B6;</span>',
                prev:'<span>&#x25C0;</span>'
            }
        };

    $.extend(true,$.Popbox.prototype.default_settings,extend_default_settings);

    var gallery = function(){};
    gallery.prototype.updateItems = function(){
        var popbox = this.self;

        // get image file links
        if (popbox.settings.selector) {
            $(popbox.settings.selector).each(function(){
                // check for src or href (href first)
                var $item = $(this),
                    href = $item.attr('href'),
                    src = $item.attr('src'),
                    link = false;

                if (href) link = href;
                else if (src) link = src;
                else {
                    // get sub items
                    $item.find('a[href]').each(function(){
                        popbox.properties.gallery.items.push($(this).attr('href'));
                    });
                    $item.find('img[src]').each(function(){
                        popbox.properties.gallery.items.push($(this).attr('src'));
                    });
                }

                if (link) popbox.properties.gallery.items.push(link);
            });
        }
    };
    gallery.prototype.goTo = function(new_item_index){
        var popbox = this.self;

        new_item_index = (_static.isNumber(new_item_index)) ? new_item_index : 0;

        if (popbox.isCreated()) {
            if (popbox.properties.gallery.items.length > 0) {

                if (new_item_index > popbox.properties.gallery.items.length-1) {
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

    _static.addHook('on_initialize',function(){
        var popbox = this;
        popbox.gallery = new gallery();
        popbox.gallery.self = popbox;
    });

    _static.addHook('after_reset',function(){
        var popbox = this;
        popbox.properties.gallery = {
            items:[],
            current_index:0
        };
    });

    _static.addHook('after_open',function(){
        var popbox = this;
        popbox.gallery.updateItems();
    });

    _static.addHook('after_update',function(){
        var popbox = this;

        if (!popbox.isOpen()) {
            popbox.properties.gallery.items = [];
            popbox.properties.gallery.current_index = 0;
        }

        popbox.gallery.updateItems();
    });

    _static.addHook('after_update_dom',function(){
        var popbox = this;

        if (popbox.settings.mode === 'gallery') {

            if (popbox.properties.gallery.items.length > 0) {
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

                _static.offTouchClick(popbox.elements.$popbox_gallery_next);
                _static.onTouchClick(popbox.elements.$popbox_gallery_next,null,function(){
                    popbox.gallery.next();
                },true);

                _static.offTouchClick(popbox.elements.$popbox_gallery_prev);
                _static.onTouchClick(popbox.elements.$popbox_gallery_prev,null,function(){
                    popbox.gallery.prev();
                },true);
            }
        }
        else {
            // remove the next and previous buttons from the popbox if they exist
            if (popbox.elements.$popbox_gallery_next) popbox.elements.$popbox_gallery_next.remove();
            if (popbox.elements.$popbox_gallery_prev) popbox.elements.$popbox_gallery_prev.remove();
            popbox.elements.$popbox_gallery_next = false;
            popbox.elements.$popbox_gallery_prev = false;
        }
    });

    // replace the main content with the error

})(jQuery,window);