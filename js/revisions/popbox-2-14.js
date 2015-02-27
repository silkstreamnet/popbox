(function($){

    if (RegExp != null && RegExp.escape == null) RegExp.escape= function(s) { return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); };

    function param(parameter,_default)
    {
        return (typeof parameter !== 'undefined' ? parameter : _default);
    }

    function isNumber(o,required)
    {
        required = param(required,false);
        return ! isNaN (o-0) && o != null && o != "" && (!required || o > 0);
    }

    function isString(o,required)
    {
        required = param(required,false);
        return typeof(o) === "string" && o != null && (!required || o != '');
    }

    function getAttr(obj,attr)
    {
        var attrval = obj.attr(attr);
        if (typeof attrval === 'undefined' || attrval === false || attrval === '') attrval = '';
        return attrval;
    }

    function indexOf(value,array,strict)
    {
        strict = strict || false;

        if (array instanceof Array)
        {
            for (var i=0; i<array.length; i++)
            {
                if (strict)
                {
                    if (array[i] === value)
                    {
                        return i;
                    }
                }
                else if (array[i] == value)
                {
                    return i;
                }
            }
        }
        return -1;
    }

    function getInlineStyle(obj,style)
    {
        var cstyle = getAttr(obj,'style');
        if (style && cstyle)
        {
            //check for string begin or ; at the start
            var r = new RegExp('(^|;)\\s*'+RegExp.escape(style)+'\\s*:');
            if (cstyle.match(r))
            {
                return obj.css(style);
            }
        }
        return '';
    }

    var PopBox = function(settings)
    {
        settings = param(settings,{});

        this.$window = $(window);
        this.$html = $('html');
        this.$body = $('body');

        this._settings = $.extend(true,{},this._defaultSettings,settings);
        this.container = false;
        this.popup = false;
        this.shadow = false;
        this._properties = {
            animating: false,
            isopen: false,
            newopen: true,
            newopentime: 0,
            resizepause: false,
            loaded_content: -1,
            loaded_images:[],
            stored_styles: {
                htmlOverflow:'',
                htmlHeight:'',
                htmlMarginRight:''
            },
            gallery:{
                status:'ready',
                images:[],
                position:0
            }
        };
    };

    function popboxAnimateStateComplete(popbox,method)
    {
        if (popbox._properties.animating)
        {
            popbox._properties.animating = false;

            switch (method)
            {
                case 'close':
                    popbox.container.remove();
                    popbox.container = false;
                    popbox._properties.isopen = false;
                    popbox.popup = false;
                    popbox.shadow = false;

                    popbox.$html.css({
                        'overflow':popbox._properties.stored_styles.htmlOverflow,
                        'height':popbox._properties.stored_styles.htmlHeight,
                        'margin-right':popbox._properties.stored_styles.htmlMarginRight
                    });

                    break;
                case 'open':
                    popbox._properties.isopen = true;
                    break;
            }
        }
    }

    function fixScalableElements(pb)
    {
        pb.popup.find('img').css({
            'max-width':'100%',
            'height':'auto'
        }).filter(':visible').css({
            'display':'block'
        });

        pb.popup.find('iframe').css({
            'max-height':'100%',
            'max-width':'100%'
        });
    }

    function updateGallery(pb)
    {
        pb = param(pb,false);

        if (pb && pb.popup)
        {
            pb.update({
                content:'<img src="'+pb._properties.gallery.images[pb._properties.gallery.position]+'" style="display:none;" />'
            });
        }
    }

    function unsetGalleryArrows(pb)
    {
        pb = param(pb,false);

        if (pb && pb.popup)
        {
            if (pb.gallery_next) pb.gallery_next.remove();
            if (pb.gallery_prev) pb.gallery_prev.remove();

            pb.gallery_next = false;
            pb.gallery_prev = false;
        }
    }

    function setGalleryArrows(pb)
    {
        pb = param(pb,false);

        if (pb && pb.popup && pb._properties.gallery.images.length > 1)
        {
            pb.popup.append('<a href="#" class="popbox-gallery-next">&nbsp;'+pb._settings.gallery.next+'</a>');
            pb.gallery_next = pb.popup.find('.popbox-gallery-next');

            pb.popup.append('<a href="#" class="popbox-gallery-prev">'+pb._settings.gallery.prev+'&nbsp;</a>');
            pb.gallery_prev = pb.popup.find('.popbox-gallery-prev');

            var mousemove_next = false;
            var mousemove_prev = false;

            pb.gallery_next.click(function(e){
                e.preventDefault();
                pb._properties.gallery.position++;
                if (pb._properties.gallery.position >= pb._properties.gallery.images.length) pb._properties.gallery.position = 0;
                updateGallery(pb);
            }).mousemove(function(e){
                if (!mousemove_next)
                {
                    pb.gallery_next.addClass('popbox-btn-hover');
                    mousemove_next = true;
                    setTimeout(function(){mousemove_next = false;},200);
                }
            }).mouseleave(function(e){
                pb.gallery_next.removeClass('popbox-btn-hover');
            });

            pb.gallery_prev.click(function(e){
                e.preventDefault();
                pb._properties.gallery.position--;
                if (pb._properties.gallery.position < 0) pb._properties.gallery.position = pb._properties.gallery.images.length-1;
                updateGallery(pb);
            }).mousemove(function(e){
                if (!mousemove_prev)
                {
                    pb.gallery_prev.addClass('popbox-btn-hover');
                    mousemove_prev = true;
                    setTimeout(function(){mousemove_prev = false;},200);
                }
            }).mouseleave(function(e){
                pb.gallery_prev.removeClass('popbox-btn-hover');
            });
        }
    }

    function clonePopbox(pb)
    {
        var cloneref = 'popbox-rsc-clone';
        var clone_container_tmp = pb.container.clone().stop(true,true).addClass(cloneref).css({'display':'block','visibility':'hidden','z-index':'-1','overflow':'hidden'});
        clone_container_tmp.find('iframe').attr('src','');
        clone_container_tmp.appendTo(pb.$body);
        var clone_container = pb.$body.find('.'+cloneref);

        return {
            container:clone_container,
            popup:clone_container.find('.popbox-popup').eq(0),
            content:clone_container.find('.popbox-content').eq(0),
            gallery_loading_area:clone_container.find('.popbox-gallery-loading').eq(0)
        }
    }

    function removeClonePopbox(clone)
    {
        if (clone && clone.container) clone.container.remove();
    }

    function adjustPopBoxEnd(pb)
    {
        pb = param(pb,false);

        if (pb && pb.popup)
        {
            if (pb._settings.mode == 'gallery' && pb._properties.gallery.status == 'ready') pb.content_area.find('img:hidden').fadeIn(300);
            pb.popup.find('.popbox-btn-hover').removeClass('popbox-btn-hover');
        }
    }

    function adjustPopBoxToClient(pb)
    {
        pb = param(pb,false);

        if (pb && pb.popup)
        {
            var st = pb._settings;
            var $popup = pb.popup;
            var $container = pb.container;
            var $content = pb.content_area;
            var $shadow = pb.shadow;
            var $gallery_loading_area = pb.gallery_loading_area;

            $popup.stop(true,false);
            $container.css('overflow-y','hidden');

            fixScalableElements(pb);

            var newWidth = 0, newHeight = 0, newOuterWidth = 0, newOuterHeight = 0,
                cWidth = 0, cHeight = 0, cWidthPadding = 0, cHeightPadding = 0,
                dOuterWidth = $shadow.width(), dOuterHeight = $container.outerHeight(false), dMaxWidth = 0, dMaxHeight = 0, dPush = 0,
                setY = false, clone = false;

            if (st.autoScale && pb._properties.gallery.status == 'ready')
            {
                $content.css({
                    'height':'100%',
                    'width':'100%',
                    'overflow':'hidden'
                });

                clone = clonePopbox(pb);
                clone.popup.css({'height':'auto','width':'auto','top':'auto','left':'auto'});
                clone.content.attr('style','');
                clone.content.find('img').css({'max-width':'none','height':'auto','display':'block'});
                clone.content.find('iframe').css({'max-height':'none','max-width':'none'});

                cWidth = clone.popup.width();
                cHeight = clone.popup.height();
                cWidthPadding = clone.popup.outerWidth(false) - cWidth;
                cHeightPadding = clone.popup.outerHeight(false) - cHeight;

                removeClonePopbox(clone);

                dMaxWidth = (dOuterWidth * 0.8) - (cWidthPadding);
                dMaxHeight = (dOuterHeight * 0.8) - (cHeightPadding);

                if (dMaxWidth > st.maxwidth) dMaxWidth = st.maxwidth;
                if (dMaxHeight > st.maxheight) dMaxHeight = st.maxheight;

                if (cHeight > dMaxHeight || cWidth > dMaxWidth)
                {
                    var dRatio = dMaxHeight / dMaxWidth;
                    var cRatio = cHeight / cWidth;
                    var difperc = 1;

                    if (cRatio > dRatio)
                    {
                        //go by the height
                        difperc = dMaxHeight / cHeight;
                        newHeight = dMaxHeight;
                        newWidth = (cWidth) * difperc;
                    }
                    else
                    {
                        difperc = dMaxWidth / cWidth;
                        newWidth = dMaxWidth;
                        newHeight = (cHeight) * difperc;
                    }
                }
                else
                {
                    newWidth = cWidth;
                    newHeight = cHeight;
                }

            }
            else
            {

                //if width is auto, find the 80% max of the container and match to fit.
                dMaxWidth = dOuterWidth * 0.8;
                dMaxHeight = dOuterHeight * 0.8;
                cWidthPadding = $popup.outerWidth(false) - $popup.width();
                cHeightPadding = $popup.outerHeight(false) - $popup.height();
                newWidth = dMaxWidth-cWidthPadding;
                newHeight = dMaxHeight-cHeightPadding;

                clone = clonePopbox(pb);
                clone.popup.css({'height':'auto','width':'auto','top':'0','left':'0'});
                clone.content.attr('style','');
                clone.gallery_loading_area.attr('style','');

                var $_content_ob = $content;
                var clone_content_ob = clone.content;

                if (pb._properties.gallery.status == 'ready')
                {
                    clone.content.css('display','block');
                    clone.gallery_loading_area.css('display','none');
                }
                else
                {
                    clone.content.css('display','none');
                    clone.gallery_loading_area.css('display','block');

                    $_content_ob = $gallery_loading_area;
                    clone_content_ob = clone.gallery_loading_area;
                }

                if (isNumber(st.width))
                {
                    newWidth = st.width;
                }
                else if ((st.scaleToContent || pb._properties.gallery.status != 'ready') && clone.popup.width() < newWidth)
                {
                    newWidth = clone.popup.width();
                }

                if (isNumber(st.maxwidth) && newWidth > st.maxwidth)
                {
                    newWidth = st.maxwidth;
                }

                clone.popup.css({width:newWidth});

                //if height is auto, height is automatic, also check if height is greater than container height
                if (isNumber(st.height))
                {
                    newHeight = st.height;
                }
                else if (!st.innerOverflow)
                {
                    newHeight = clone.popup.height();
                }

                if (isNumber(st.maxheight) && newHeight > st.maxheight)
                {
                    newHeight = st.maxheight;
                }

                //an insane person wrote this block
                if (parseInt(clone_content_ob.css('margin-top')) == 0)
                {
                    clone_content_ob.css({'margin-top':'-1px','top':'1px'});
                }

                var co_h = clone_content_ob.outerHeight(true);
                var hi_p = co_h - clone_content_ob.height();
                var mh_a_padding = parseInt(clone.popup.css('padding-top'));
                var mh_a_border = parseInt(clone.popup.css('border-top-width'));
                var mh_a_margin = parseInt(clone.popup.css('margin-top'));
                if (isNaN(mh_a_padding)) mh_a_padding = 0;
                if (isNaN(mh_a_border)) mh_a_border = 0;
                if (isNaN(mh_a_margin)) mh_a_margin = 0;
                var mh_a = mh_a_padding+mh_a_border+mh_a_margin;
                var mh_b = newHeight - (clone_content_ob.position().top - mh_a);

                if (!pb._properties.newopen && st.animateSpeed > 0) $_content_ob.stop(true,false).height($_content_ob.height()).animate({'height':mh_b-hi_p},st.animateSpeed);
                else $_content_ob.stop(true,false).css({'height':mh_b-hi_p});

                if (co_h > mh_b && st.innerOverflow) $_content_ob.css('overflow-y','scroll');

                removeClonePopbox(clone);

                //create a push for the bottom when height is greater than container height
                dPush = dOuterHeight * 0.05;
                dMaxHeight = dOuterHeight * 0.9; //account for any possible padding, e.g. x button.
                newOuterHeight = newHeight+cHeightPadding;
                if (newOuterHeight > dMaxHeight)
                {
                    setY = dPush;
                    $container.css('overflow-y','scroll');
                    pb.bottom_push.css({
                        'top':(dPush+newOuterHeight)+'px',
                        'height':dPush+'px',
                        'width':'1px'
                    });
                    pb.shadow.css({
                        'height':((dPush*2)+newOuterHeight)+'px'
                    });
                }
                else
                {
                    pb.bottom_push.css({
                        'top':'0px',
                        'height':'0px',
                        'width':'0px'
                    });
                    pb.shadow.css({
                        'height':'100%'
                    });
                }

            }

            newOuterWidth = newWidth+cWidthPadding;
            newOuterHeight = newHeight+cHeightPadding;

            var newLeft = (dOuterWidth - newOuterWidth) / 2;
            var newTop = (dOuterHeight - newOuterHeight) / 2;

            if (setY !== false)
            {
                newTop = setY;
            }


            if (!pb._properties.newopen && st.animateSpeed > 0)
            {
                $popup.animate({
                    "left":newLeft,
                    "top":newTop,
                    "width":newWidth,
                    "height":newHeight
                },st.animateSpeed,function(){
                    adjustPopBoxEnd(pb);
                }).css('overflow','');
            }
            else
            {
                $popup.css({
                    "left":newLeft,
                    "top":newTop,
                    "width":newWidth,
                    "height":newHeight
                });

                adjustPopBoxEnd(pb);
            }
        }
    }

    function galleryReady(pb)
    {
        if (pb._settings.mode == 'gallery')
        {
            pb.content_area.show();
            pb.gallery_loading_area.hide();
            pb._properties.gallery.status = 'ready';
        }
    }

    function galleryLoading(pb)
    {
        if (pb._settings.mode == 'gallery')
        {
            var loading = (isString(pb._settings.gallery.loading,true)) ? pb._settings.gallery.loading : pb._defaultSettings.gallery.loading;
            pb.content_area.hide();
            pb.gallery_loading_area.show();
            pb.gallery_loading_area.html(loading);
            pb._properties.gallery.status = 'loading';
        }
    }

    function galleryError(pb)
    {
        if (pb._settings.mode == 'gallery')
        {
            var error = (isString(pb._settings.gallery.error,true)) ? pb._settings.gallery.error : pb._defaultSettings.gallery.error;
            pb.content_area.hide();
            pb.gallery_loading_area.show();
            pb.gallery_loading_area.html(error);
            pb._properties.gallery.status = 'error';
            pb.adjust(true);
        }
    }

    function checkAllImagesReady(pb)
    {
        pb = param(pb,false);

        var images_ready = true;

        if (pb && pb.popup)
        {
            var images = pb._properties.loaded_images;

            if (images.length)
            {
                for (var k=0; k<images.length; k++)
                {
                    var image = images[k];
                    if (!image.complete && image.readyState !== 4 && image.readyState !== 'complete')
                    {
                        images_ready = false;
                    }
                }
            }
        }

        if (images_ready) galleryReady(pb);

        return images_ready;
    }

    function addImageLoadListeners(pb)
    {
        pb = param(pb,false);

        if (pb && pb.popup)
        {
            pb._properties.loaded_images = [];
            var images = pb.popup.find('img');

            if (images.length > 0)
            {
                galleryLoading(pb);

                var images_ready = 0;

                // Hook up each image individually
                images.each(function(index, element) {
                    if (element.src)
                    {
                        var fimage = new Image();

                        if (element.complete || element.readyState === 4 || element.readyState === 'complete') {
                            // Already loaded, fire the handler (asynchronously)
                            images_ready++;
                        }
                        else
                        {
                            // Hook up the handler
                            if (typeof fimage.onload !== "undefined")
                            {
                                fimage.onload = function(){
                                    setTimeout(function(){if (checkAllImagesReady(pb)) pb.adjust(true)},10);
                                };
                            }
                            else if (typeof fimage.onreadystatechange !== "undefined")
                            {
                                fimage.onreadystatechange = function(){
                                    setTimeout(function(){if (checkAllImagesReady(pb)) pb.adjust(true)},10);
                                };
                            }

                            if (typeof fimage.onerror !== "undefined")
                            {
                                fimage.onerror = function(){
                                    $(element).remove();
                                    galleryError(pb);
                                }
                            }
                        }

                        fimage.src = element.src;
                        pb._properties.loaded_images.push(fimage);
                    }
                });

                if (images.length == images_ready)
                {
                    return true;
                }
            }
            else
            {
                return true;
            }
        }
        return false;
    }

    function loadAdjust(pb)
    {
        var ready = false;

        if (pb._properties.loaded_content !== pb._settings.content)
        {
            //checkAllImagesReady will verify the popbox is ready for animated resizing
            ready = addImageLoadListeners(pb);
            pb._properties.loaded_content = pb._settings.content;
        }

        return ready;
    }

    function clearTimedResize(pb)
    {
        if (pb._properties.resizetimer !== false) clearTimeout(pb._properties.resizetimer);
    }

    function startGallery(pb)
    {
        stopGallery(pb);
        if (pb._settings.mode == 'gallery') pb._settings.autoScale = true;

        pb.content_area.find('img').hide();

        if (pb._settings.gallery.name)
        {
            var $gallery_images = $('.'+pb._settings.gallery.name);
            if ($gallery_images.length)
            {
                $gallery_images.each(function(){
                    //can be either an image or an anchor link
                    var $gallery_image = $(this);
                    if ($gallery_image.closest('.popbox-container').length == 0)
                    {
                        var gi_src = getAttr($gallery_image,'src');
                        var gi_href = getAttr($gallery_image,'href');

                        var tsrc = (gi_src) ? gi_src : gi_href;

                        if (tsrc && indexOf(tsrc,pb._properties.gallery.images) == -1) pb._properties.gallery.images.push(tsrc);
                    }
                });

                if (pb._properties.gallery.images.length > 0)
                {
                    //if the current image isn't in the list, add it
                    var first_src = '';
                    var $popup_image = pb.content_area.find('img:first');
                    if ($popup_image.length) first_src = getAttr($popup_image.eq(0),'src');

                    var first_src_key = indexOf(first_src,pb._properties.gallery.images);

                    pb._properties.gallery.position = 0;
                    if (first_src == '' || first_src_key == -1) pb._properties.gallery.images.unshift(first_src);
                    else if (first_src_key > -1) pb._properties.gallery.position = first_src_key;

                    //add arrows
                    setGalleryArrows(pb);
                }
            }
        }
    }

    function stopGallery(pb)
    {
        pb.content_area.show();
        pb.gallery_loading_area.hide();
        pb._properties.gallery.status = 'ready';
        pb._properties.gallery.images = [];
        pb._properties.gallery.position = 0;
        unsetGalleryArrows(pb);
    }

    PopBox.prototype.adjust = function(immediate)
    {
        immediate = param(immediate,false);

        var pb = this;

        if (pb._properties.isopen)
        {
            if (immediate || !pb._properties.resizepause)
            {
                if (loadAdjust(pb)) galleryReady(pb);

                if (pb._properties.newopen)
                {
                    adjustPopBoxToClient(pb);
                    pb._properties.newopen = false;
                }
                else
                {
                    var curDelay = 1;
                    var adjustType = 'normal';

                    if (pb._settings.mode == 'gallery' && pb._properties.gallery.status == 'loading')
                    {
                        curDelay = 100;
                        adjustType = 'loading';
                    }
                    else
                    {
                        if (!immediate)
                        {
                            curDelay = pb._settings.updatePositionDelay;
                        }
                    }

                    pb._properties.resizepause = true;
                    pb._properties.resizetimer = setTimeout(function(){
                        if (adjustType == 'normal' || (adjustType == 'loading' && pb._properties.gallery.status != 'error'))
                        {
                            adjustPopBoxToClient(pb);
                            pb._properties.resizepause = false;
                            pb._properties.resizetimer = false;
                        }
                    },curDelay);
                }
            }
        }
    };

    PopBox.prototype.refresh = function()
    {
        this._properties.loaded_content = -1;
        this._properties.loaded_images = [];
    };

    PopBox.prototype.close = function()
    {
        var _class = this;
        if (!_class._properties.animating && _class._properties.isopen)
        {
            if (typeof(_class._settings.onClose) === "function") _class._settings.onClose(_class);

            _class._properties.animating = true;

            _class.container.fadeOut(_class._settings.fadeOutSpeed,function(){
                popboxAnimateStateComplete(_class,'close');
            });

            _class.$window.off('resize.popbox.adjust');

            _class._properties.isopen = false;
            _class.refresh();

            if (_class._settings.mode == 'gallery') _class.update({content:''},false);

            if (typeof(_class._settings.afterClose) === "function") _class._settings.afterClose(_class);
        }
    };

    PopBox.prototype.open = function()
    {
        //need to add a preload all images check when it is opened. add a listener if there are images to preload, when complete apply "adjust" function.
        var _class = this;
        _class.refresh();

        if (!_class._properties.animating && !_class._properties.isopen)
        {
            if (typeof(_class._settings.onOpen) === "function") _class._settings.onOpen(_class);

            _class._properties.animating = true;

            var close = (isString(this._settings.close,true)) ? _class._settings.close : _class._defaultSettings.close;
            var content = (isString(this._settings.content,true)) ? _class._settings.content : '';
            var title = (isString(this._settings.title,true)) ? '<div class="popbox-title">'+_class._settings.title+'</div>' : '';
            var pclass = (isString(this._settings.customClass,true)) ? ' '+_class._settings.customClass : '';
            var loading = (isString(this._settings.gallery.loading,true)) ? _class._settings.gallery.loading : _class._defaultSettings.gallery.loading;

            _class._properties.stored_styles.htmlOverflow = getInlineStyle(_class.$html,'overflow');
            _class._properties.stored_styles.htmlHeight = getInlineStyle(_class.$html,'height');
            _class._properties.stored_styles.htmlMarginRight = getInlineStyle(_class.$html,'margin-right');

            var old_body_width = _class.$body.width();
            _class.$html.css({'overflow':'hidden','height':'100%'});
            var new_body_width = _class.$body.width();
            if (new_body_width > old_body_width) _class.$html.css({'margin-right':(new_body_width-old_body_width)+'px'});

            _class.$body.append('<div class="popbox-container'+pclass+'" style="display: none;"><div class="popbox-bottom-push"></div><a class="popbox-shadow" href="javascript:void(0);"></a><div class="popbox-popup">'+title+'<div class="popbox-content">'+content+'</div><div class="popbox-gallery-loading">'+loading+'</div><a href="#" class="popbox-close">'+close+'</a></div></div>');

            _class.container = $(".popbox-container");
            _class.popup = _class.container.find(".popbox-popup");
            _class.shadow = _class.container.find(".popbox-shadow");
            _class.bottom_push = _class.container.find(".popbox-bottom-push");
            _class.close_button = _class.container.find(".popbox-close");
            _class.title_area = _class.container.find(".popbox-title");
            _class.content_area = _class.container.find(".popbox-content");
            _class.gallery_loading_area = _class.container.find(".popbox-gallery-loading");

            _class.container.css({
                'display':'none',
                'height':'100%',
                'width':'100%',
                'position':'fixed',
                'left':'0px',
                'top':'0px',
                'z-index':'990',
                'background-color': 'rgba(0,0,0,0.4)',
                'overflow-x':'hidden'
            });
            _class.bottom_push.css({
                'display':'block',
                'position':'absolute',
                'left':'0px',
                'top':'0px',
                'height':'0px',
                'width':'1px',
                'z-index':'992'
            });
            _class.popup.css({
                'display':'block',
                'position':'absolute',
                'top':'0px',
                'left':'0px',
                'z-index':'993',
                '-webkit-box-sizing':'content-box',
                '-moz-box-sizing':'content-box',
                'box-sizing':'content-box'
            });
            _class.shadow.css({
                'display':'block',
                'position':'absolute',
                'left':'0px',
                'top':'0px',
                'width':'100%',
                'height':'100%',
                'z-index':'991',
                'background':'#fff',
                'opacity':'0',
                'cursor':'default'
            });
            _class.content_area.css({
                'overflow':'hidden',
                'height':'auto'
            });
            _class.gallery_loading_area.css({
                'overflow':'hidden',
                'height':'auto'
            });

            if (_class._settings.mode == 'gallery')
            {
                startGallery(_class);
            }

            _class.container.fadeIn(_class._settings.fadeInSpeed, function(){
                popboxAnimateStateComplete(_class,'open');
            });

            _class.shadow.click(function(e){
                _class.close();
                e.preventDefault();
            });
            _class.close_button.click(function(e){
                _class.close();
                e.preventDefault();
            });

            _class.$window.on('resize.popbox.adjust',function(){_class.adjust();});

            _class._properties.isopen = true;
            _class._properties.newopen = true;
            _class._properties.newopentime = new Date().getTime();
            _class.adjust();

            if (typeof(_class._settings.afterOpen) === "function") _class._settings.afterOpen(_class);
        }
    };

    PopBox.prototype.update = function(settings,adjust)
    {
        var _class = this;

        settings = param(settings,{});
        adjust = param(adjust,true);

        _class._settings = $.extend(true,{},_class._settings,settings);

        if (_class._properties.isopen)
        {
            var close = (isString(_class._settings.close,true)) ? _class._settings.close : _class._defaultSettings.close;
            var content = (isString(_class._settings.content,true)) ? _class._settings.content : '';
            var title = (isString(_class._settings.title,true)) ? _class._settings.title : '';

            if (_class.close_button.length > 0) _class.close_button.html(close);
            if (_class.content_area.length > 0) _class.content_area.html(content);

            if (_class.title_area.length > 0)
            {
                if (title != '')
                {
                    _class.title_area.html(title);
                }
                else
                {
                    _class.title_area.remove();
                    _class.title_area = _class.popup.find('.popbox-title');
                }
            }
            else if (title != '')
            {
                _class.popup.prepend('<div class="popbox-title">'+title+'</div>');
                _class.title_area = _class.popup.find('.popbox-title');
            }

            if (_class._settings.mode == 'gallery')
            {
                startGallery(_class);
            }
            else
            {
                stopGallery(_class);
            }

            if (adjust)
            {
                _class.adjust(true);
            }
            else
            {
                fixScalableElements(_class);
            }
        }
    };

    PopBox.prototype.isOpen = function()
    {
        return this._properties.isopen == true;
    };

    PopBox.prototype.isClose = function()
    {
        return this._properties.isopen == false;
    };


    PopBox.prototype._defaultSettings = {
        width:'auto',
        height:'auto',
        maxwidth:'none',
        maxheight:'none',
        innerOverflow:false,
        scaleToContent:false,
        content:'',
        close:'X',
        title:'',
        onOpen:false,
        onClose:false,
        afterOpen:false,
        afterClose:false,
        fadeInSpeed: 400,
        fadeOutSpeed: 400,
        updatePositionDelay: 200,
        autoScale:false,
        customClass:'',
        animateSpeed: 400,
        mode:'normal',
        gallery:{
            loading:'<div style="padding:10px;">Loading...</div>',
            error:'<div style="padding:10px;">There was an error loading the image.</div>',
            name:'',
            next:'<span>&#x25B6;</span>',
            prev:'<span>&#x25C0;</span>'
        }
    };


    window.PopBox = PopBox;

})(jQuery);