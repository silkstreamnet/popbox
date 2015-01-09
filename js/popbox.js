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

        if (settings.mode == 'gallery' && settings.autoScale == null) settings.autoScale = true;

        this.settings = $.extend({},this.defaultSettings,settings);
        this.container = false;
        this.popup = false;
        this.shadow = false;
        this.properties = {
            animating: false,
            isopen: false,
            newopen: true,
            newopentime: 0,
            resizepause: false,
            loaded_content: -1,
            stored_styles: {
                htmlOverflow:'',
                htmlHeight:'',
                htmlPaddingRight:''
            },
            gallery:{
                isloading:false
            }
        };
    };

    function popboxAnimateStateComplete(popbox,method)
    {
        if (popbox.properties.animating)
        {
            popbox.properties.animating = false;

            switch (method)
            {
                case 'close':
                    popbox.container.remove();
                    popbox.container = false;
                    popbox.properties.isopen = false;
                    popbox.popup = false;
                    popbox.shadow = false;

                    $('html').css({
                        'overflow':popbox.properties.stored_styles.htmlOverflow,
                        'height':popbox.properties.stored_styles.htmlHeight,
                        'padding-right':popbox.properties.stored_styles.htmlPaddingRight
                    });

                    break;
                case 'open':
                    popbox.properties.isopen = true;
                    break;
            }
        }
    }

    function checkAllImagesReady(pb) {
        pb = param(pb,false);

        var images_ready = true;

        if (pb && pb.popup)
        {
            var images = pb.popup.find('img');

            if (images.length > 0)
            {
                // Hook up each image individually
                images.each(function(index, element) {
                    if (!element.complete && element.readyState !== 4 && element.readyState !== 'complete')
                    {
                        images_ready = false;
                    }
                });
            }
        }

        if (pb.settings.mode == 'gallery')
        {
            if (images_ready)
            {
                pb.content_area.show();
                if (pb.gallery_loading_area) pb.gallery_loading_area.hide();
                pb.properties.gallery.isloading = false;
            }
            else
            {
                pb.content_area.hide();
                if (pb.gallery_loading_area) pb.gallery_loading_area.show();
                pb.properties.gallery.isloading = true;
            }
        }

        if (images_ready)
        {
            adjustPopBoxToClient(pb);
            pb.properties.newopen = false;
        }

        return images_ready;
    }

    function addImageLoadListeners(pb)
    {
        pb = param(pb,false);

        if (pb && pb.popup)
        {

            var images = pb.popup.find('img');

            if (images.length > 0)
            {
                var images_ready = 0;

                // Hook up each image individually
                images.each(function(index, element) {
                    if (element.complete || element.readyState === 4 || element.readyState === 'complete') {
                        // Already loaded, fire the handler (asynchronously)
                        images_ready++;
                    }
                    else if (element.src)
                    {
                        // Hook up the handler
                        var fimage = new Image();
                        if (typeof fimage.onload !== "undefined")
                        {
                            fimage.onload = function(){
                                setTimeout(function(){checkAllImagesReady(pb)},10);
                            };
                        }
                        else if (typeof fimage.onreadystatechange !== "undefined")
                        {
                            fimage.onreadystatechange = function(){
                                setTimeout(function(){checkAllImagesReady(pb)},10);
                            };
                        }

                        if (pb.settings.mode == 'gallery' && pb.gallery_loading_area)
                        {
                            if (typeof fimage.onerror !== "undefined")
                            {
                                fimage.onerror = function(){
                                    var error = (isString(pb.settings.gallery.error,true)) ? pb.settings.gallery.error : pb.defaultSettings.gallery.error;
                                    pb.gallery_loading_area.html(error);
                                    pb.properties.gallery.isloading = true;
                                    $(element).remove();
                                    pb.adjust();
                                }
                            }
                        }

                        fimage.src = element.src;
                    }
                });

                if (images.length == images_ready)
                {
                    checkAllImagesReady(pb);
                }
            }
        }
    }

    function delayedLoadAdjust(pb)
    {
        if (pb.properties.loaded_content !== pb.settings.content)
        {
            //checkAllImagesReady will verify the popbox is ready for animated resizing
            if (!checkAllImagesReady(pb))
            {
                addImageLoadListeners(pb);
            }
            pb.properties.loaded_content = pb.settings.content;
        }
    }

    function fixScalableElements(pb)
    {
        pb.popup.find('img').css({
            'max-width':'100%',
            'height':'auto',
            'display':'block'
        });

        pb.popup.find('iframe').css({
            'max-height':'100%',
            'max-width':'100%'
        });
    }

    function clonePopbox(pb)
    {
        var _body = $('body');
        var cloneref = 'popbox-rsc-clone';
        var clone_container_tmp = pb.container.clone().stop(true,true).addClass(cloneref).css({'display':'block','visibility':'hidden','z-index':'-1','overflow':'hidden'});
        clone_container_tmp.find('iframe').attr('src','');
        clone_container_tmp.appendTo(_body);
        var clone_container = _body.find('.'+cloneref);

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

    function adjustPopBoxToClient(pb)
    {
        pb = param(pb,false);

        if (pb && pb.popup)
        {
            var _body = $('body');
            var st = pb.settings;
            var $popup = pb.popup;
            var $container = pb.container;
            var $content = pb.content_area;
            var $gallery_loading_area = pb.gallery_loading_area;

            $popup.stop(true,false);

            var newWidth = 0, newHeight = 0, newOuterWidth = 0, newOuterHeight = 0,
                cWidth = 0, cHeight = 0, cWidthPadding = 0, cHeightPadding = 0, cOuterWidth = 0, cOuterHeight = 0,
                dOuterWidth = $container.outerWidth(false), dOuterHeight = $container.outerHeight(false), dMaxWidth = 0, dMaxHeight = 0, dPush = 0,
                setY = false, clone = false;

            fixScalableElements(pb);

            var newBodyHeight = _body.height();
            if (newBodyHeight != pb.properties.stored_styles.bodyHeight)
            {
                _body.css('top','+='+(newBodyHeight-pb.properties.stored_styles.bodyHeight));
                pb.properties.stored_styles.bodyHeight = newBodyHeight;
            }

            if (st.autoScale && !pb.properties.gallery.isloading)
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

                if (pb.properties.gallery.isloading)
                {
                    clone.content.css('display','none');
                    clone.gallery_loading_area.css('display','block');

                    $_content_ob = $gallery_loading_area;
                    clone_content_ob = clone.gallery_loading_area;
                }
                else
                {
                    clone.content.css('display','block');
                    clone.gallery_loading_area.css('display','none');
                }


                if (isNumber(st.width))
                {
                    newWidth = st.width;
                }
                else if (st.scaleToContent && clone.popup.width() < newWidth)
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

                if (!pb.properties.newopen && st.animateSpeed > 0) $_content_ob.stop(true,false).height($_content_ob.height()).animate({'height':mh_b-hi_p},st.animateSpeed);
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
                    $container.css('overflow','hidden');
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

            var g = (dOuterWidth - newOuterWidth) / 2;
            var h = (dOuterHeight - newOuterHeight) / 2;

            if (setY !== false)
            {
                h = setY;
            }

            if (!pb.properties.newopen && st.animateSpeed > 0)
            {
                $popup.animate({
                    "left":g,
                    "top":h,
                    "width":newWidth,
                    "height":newHeight
                },st.animateSpeed).css('overflow','');
            }
            else
            {
                $popup.css({
                    "left":g,
                    "top":h,
                    "width":newWidth,
                    "height":newHeight
                });
            }
        }
    }

    PopBox.prototype.adjust = function()
    {
        var _class = this;
        if (!_class.properties.resizepause && _class.properties.isopen)
        {
            _class.properties.resizepause = true;
            setTimeout(function(){
                adjustPopBoxToClient(_class);

                _class.properties.resizepause = false;
            },_class.properties.updatePositionDelay);

            delayedLoadAdjust(_class);
        }
    };

    PopBox.prototype.checkImages = function()
    {
        this.properties.loaded_content = -1;
    };

    PopBox.prototype.close = function()
    {
        var _class = this;
        if (!_class.properties.animating && _class.properties.isopen)
        {
            if (typeof(_class.settings.onClose) === "function")
            {
                _class.settings.onClose(_class);
            }

            _class.properties.animating = true;

            _class.container.fadeOut(_class.settings.fadeOutSpeed,function(){
                popboxAnimateStateComplete(_class,'close');
            });

            $(window).off('resize.popbox.adjust');
            $(document).off('touchstart.popbox touchend.popbox');

            _class.properties.isopen = false;
            _class.checkImages();

            if (typeof(_class.settings.afterClose) === "function")
            {
                _class.settings.afterClose(_class);
            }
        }
    };

    PopBox.prototype.open = function()
    {
        //need to add a preload all images check when it is opened. add a listener if there are images to preload, when complete apply "adjust" function.
        var _class = this;
        if (!_class.properties.animating && !_class.properties.isopen)
        {
            if (typeof(_class.settings.onOpen) === "function")
            {
                _class.settings.onOpen(_class);
            }

            _class.properties.animating = true;

            var close = (isString(this.settings.close,true)) ? _class.settings.close : _class.defaultSettings.close;
            var content = (isString(this.settings.content,true)) ? _class.settings.content : '';
            var title = (isString(this.settings.title,true)) ? '<div class="popbox-title">'+_class.settings.title+'</div>' : '';
            var pclass = (isString(this.settings.customClass,true)) ? ' '+_class.settings.customClass : '';

            var _html = $('html');
            var _body = $('body');

            _class.properties.stored_styles.htmlOverflow = getInlineStyle(_html,'overflow');
            _class.properties.stored_styles.htmlHeight = getInlineStyle(_html,'height');
            _class.properties.stored_styles.htmlPaddingRight = getInlineStyle(_html,'padding-right');

            var old_body_width = _body.width();
            _html.css({'overflow':'hidden','height':'100%'});
            var new_body_width = _body.width();

            if (new_body_width > old_body_width) _html.css({'padding-right':(new_body_width-old_body_width)+'px'});

            _body.append('<div class="popbox-container'+pclass+'" style="display: none;"><div class="popbox-bottom-push"></div><a class="popbox-shadow" href="javascript:void(0);"></a><div class="popbox-popup">'+title+'<a class="popbox-close">'+close+'</a><div class="popbox-content">'+content+'</div></div></div>');

            _class.container = $(".popbox-container");
            _class.popup = _class.container.find(".popbox-popup");
            _class.shadow = _class.container.find(".popbox-shadow");
            _class.bottom_push = _class.container.find(".popbox-bottom-push");
            _class.close_button = _class.container.find(".popbox-close");
            _class.title_area = _class.container.find(".popbox-title");
            _class.content_area = _class.container.find(".popbox-content");
            _class.gallery_loading_area = false;

            _class.container.css({
                'display':'none',
                'height':'100%',
                'width':'100%',
                'position':'fixed',
                'left':'0px',
                'top':'0px',
                'z-index':'990',
                'background-color': 'rgba(0,0,0,0.4)'
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

            if (_class.settings.mode == 'gallery')
            {
                _class.content_area.hide();
                var loading = (isString(this.settings.gallery.loading,true)) ? _class.settings.gallery.loading : _class.defaultSettings.gallery.loading;
                _class.content_area.after('<div class="popbox-gallery-loading">'+loading+'</div>');
                _class.gallery_loading_area = _class.container.find(".popbox-gallery-loading");
                _class.gallery_loading_area.css({
                    'overflow':'hidden',
                    'height':'auto'
                });
            }



            _class.container.fadeIn(_class.settings.fadeInSpeed, function(){
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

            $(window).on('resize.popbox.adjust',function(){_class.adjust();});
            //$(document).on('touchstart.popbox',function(){_body.css('position','fixed');}).on('touchend.popbox',function(){_body.css('position','relative');});

            _class.properties.isopen = true;
            _class.properties.newopen = true;
            _class.properties.newopentime = new Date().getTime();
            _class.adjust();

            if (typeof(_class.settings.afterOpen) === "function")
            {
                _class.settings.afterOpen(_class);
            }
        }
    };

    PopBox.prototype.update = function(settings,adjust)
    {
        var _class = this;

        settings = param(settings,{});
        adjust = param(adjust,true);

        _class.settings = $.extend({},_class.settings,settings);

        if (_class.properties.isopen)
        {
            var close = (isString(_class.settings.close,true)) ? _class.settings.close : _class.defaultSettings.close;
            var content = (isString(_class.settings.content,true)) ? _class.settings.content : '';
            var title = (isString(_class.settings.title,true)) ? _class.settings.title : '';

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

            if (adjust)
            {
                _class.adjust();
            }
            else
            {
                fixScalableElements(_class);
            }
        }
    };

    PopBox.prototype.isOpen = function()
    {
        return this.properties.isopen == true;
    };

    PopBox.prototype.isClose = function()
    {
        return this.properties.isopen == false;
    };


    PopBox.prototype.defaultSettings = {
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
            loading:'Loading',
            error:'Error'
        }
    };


    window.PopBox = PopBox;

})(jQuery);