(function($){

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

    var PopBox = function(settings)
    {
        settings = param(settings,{});

        this.settings = $.extend({},this.defaultSettings,settings);
        this.container = false;
        this.popup = false;
        this.shadow = false;
        this.properties = {
            animating: false,
            isopen: false,
            resizepause: false,
            loaded_content: -1,
            bodyMarginRight:'',
            bodyOverflow:''
        };
    };

    function popboxAnimateComplete(popbox,method)
    {
        if (popbox.properties.animating)
        {
            popbox.properties.animating = false;

            switch (method)
            {
                case 'close':
                    popbox.container.remove();
                    popbox.properties.isopen = false;
                    popbox.container = false;
                    popbox.popup = false;
                    popbox.shadow = false;
                    $('body').css({
                        'overflow':popbox.properties.bodyOverflow,
                        'margin-right':popbox.properties.bodyMarginRight
                    });
                    $(document).off('scroll.popbox touchmove.popbox mousewheel.popbox');
                    break;
                case 'open':
                    popbox.properties.isopen = true;
                    break;
            }
        }
    }

    function adjustToClient(obj,a)
    {
        var b={
            forceAbsolute:false,
            container:window,
            completeHandler:null,
            animate:true,
            width:'auto',
            height:'auto',
            maxwidth:'none',
            maxheight:'none',
            push_obj: false,
            shadow: false,
            autoScale:false,
            innerOverflow:false
        };

        $.extend(b,a);

        obj.each(function(a){
            var c=$(this);
            var d=$(b.container);
            var e=b.container==window; //is window: true or false

            var $body = $('body');

            if (b.forceAbsolute)
            {
                if (e) c.remove().appendTo($body);
                else c.remove().appendTo(d.get(0))
            }

            //set c and d to hidden and block
            var c_orig = {
                position: c.css('position'),
                visibility: c.css('visibility'),
                display: c.css('display')
            };

            var d_orig = {
                visibility: d.css('visibility'),
                display: d.css('display')
            };

            var c_temp = {
                position: 'absolute',
                visibility: 'hidden',
                display: 'block'
            };

            var d_temp = {
                visibility: 'hidden',
                display: 'block'
            };

            c.css(c_temp).stop(true,false);
            if (!e) d.css(d_temp);

            var newWidth = 0, newHeight = 0, newWidthFull = 0, newHeightFull = 0, dMaxWidth, dMaxHeight, cWidth, cHeight, cWidthPadding, cHeightPadding, cWidthFull, cHeightFull, setY = false, dPush;

            if (b.autoScale)
            {
                var cloneref = 'rsc-clone-'+(Math.floor(Math.random()*9000) + 1000);
                var pre_c_clone = c.clone().addClass(cloneref).css({'height':'auto','width':'auto','top':'auto','left':'auto','position':'absolute','display':'block','visibility':'hidden'});

                pre_c_clone.find('img').css({'max-width':'none','height':'auto','display':'block'});
                pre_c_clone.find('iframe').css({'max-height':'none','max-width':'none'}).attr('src','');
                pre_c_clone.appendTo($body);

                var c_clone = $body.find('.'+cloneref).wrap('<div style="height:0;width:0;position:absolute;left:0;top:0;"></div>');

                cWidth = c_clone.width();
                cHeight = c_clone.height();
                cWidthPadding = c_clone.outerWidth(false) - cWidth;
                cHeightPadding = c_clone.outerHeight(false) - cHeight;

                c_clone.parent().remove();

                dMaxWidth = ((e ? d.width() : d.outerWidth(false)) * 0.8) - (cWidthPadding);
                dMaxHeight = ((e ? d.height() : d.outerHeight(false)) * 0.8) - (cHeightPadding);

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

                //c.width(newWidth);
                //c.height(newHeight);

                c.find('img').css({
                    'max-width':'100%',
                    'height':'auto',
                    'display':'block'
                });

                c.find('iframe').css({
                    'max-height':'100%',
                    'max-width':'100%'
                });

                c.animate({
                    "width":newWidth,
                    "height":newHeight
                });

            }
            else
            {

                //if width is auto, find the 80% max of the container and match to fit.
                dMaxWidth = (e ? d.width() : d.outerWidth(false)) * 0.8;
                dMaxHeight = (e ? d.height() : d.outerHeight(false)) * 0.8;
                cWidthPadding = c.outerWidth(false) - c.width();
                cHeightPadding = c.outerHeight(false) - c.height();
                newWidth = dMaxWidth-cWidthPadding;
                newHeight = dMaxHeight-cHeightPadding;

                if (isNumber(b.width))
                {
                    newWidth = b.width;
                }
                else
                {
                    if (isNumber(b.maxwidth) && newWidth > b.maxwidth)
                    {
                        newWidth = b.maxwidth;
                    }
                }

                //if height is auto, height is automatic, also check if height is greater than container height
                if (isNumber(b.height))
                {
                    newHeight = b.height;
                }
                else if (b.innerOverflow || isNumber(b.maxheight))
                {
                    if (isNumber(b.maxheight) && newHeight > b.maxheight)
                    {
                        newHeight = b.maxheight;
                    }

                    //an insane person wrote this block
                    var _content = c.find('.popbox-content');
                    if (_content.length == 1)
                    {
                        _content.css({'overflow-y':'','height':'','position':'relative'});

                        if (parseInt(_content.css('margin-top')) == 0)
                        {
                            _content.css({'margin-top':'-1px','top':'1px'});
                        }

                        var co_h = _content.outerHeight(true);
                        var hi_p = co_h - _content.height();
                        var mh_a = parseInt(c.css('padding-top'))+parseInt(c.css('border-top-width'))+parseInt(c.css('margin-top'));
                        var mh_b = newHeight - (_content.position().top - mh_a);

                        if (co_h > mh_b)
                        {
                            _content.css('overflow-y','scroll');
                            _content.height(mh_b-hi_p);
                        }
                    }
                }
                else
                {
                    newHeight = 'auto';
                }

                c.css({
                    "width":newWidth,
                    "height":newHeight
                });

                //create a push for the bottom when height is greater than container height
                dPush = (e ? d.height() : d.outerHeight(false)) * 0.05;
                var dFullMaxHeight = e ? d.height() : d.outerHeight(false);
                dMaxHeight = dFullMaxHeight * 0.9; //account for any possible padding, e.g. x button.
                newHeightFull = c.height()+cHeightPadding;
                if (newHeightFull > dMaxHeight)
                {
                    setY = dPush;
                    d.css('overflow','auto');
                    b.push_obj.css({
                        'top':(dPush+newHeightFull)+'px',
                        'height':dPush+'px',
                        'width':'1px'
                    });
                    b.shadow.css({
                        'height':((dPush*2)+newHeightFull)+'px'
                    });
                }
                else
                {
                    d.css('overflow','');
                    b.push_obj.css({
                        'top':'0px',
                        'height':'0px',
                        'width':'0px'
                    });
                    b.shadow.css({
                        'height':'100%'
                    });
                }

            }

            newWidthFull = newWidth+cWidthPadding;
            newHeightFull = newHeight+cHeightPadding;

            var g = ((e ? d.width() : d.outerWidth(false)) - newWidthFull) / 2;
            var h = ((e ? d.height() : d.outerHeight(false)) - newHeightFull) / 2;

            if (setY !== false)
            {
                h = setY;
            }

            if (e)
            {
                g += d.scrollLeft();
                h += d.scrollTop();
            }

            c.css(c_orig);
            if (!e) d.css(d_orig);

            if (b.animate===true)
            {
                c.animate({
                    "left":g,
                    "top":h
                },500).css('overflow','');
            }
            else
            {
                c.css({
                    "left":g,
                    "top":h
                });
            }
            if (b.completeHandler) b.completeHandler(obj);
        });
    }

    function checkAllImagesReady(pb,adjust) {
        pb = param(pb,false);
        adjust = param(adjust,false);

        var images_ready = true;

        if (pb && pb.popup)
        {
            var images = pb.popup.find('img');

            if (images.length > 0)
            {
                // Hook up each image individually
                images.each(function(index, element) {
                    if (!element.complete)
                    {
                        images_ready = false;
                    }
                });
            }
        }

        if (adjust && images_ready)
        {
            adjustPopBoxToClient(pb);
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
                    if (element.complete) {
                        // Already loaded, fire the handler (asynchronously)
                        images_ready++;
                    }
                    else
                    {
                        // Hook up the handler
                        $(element).load(function(){
                            checkAllImagesReady(pb,true);
                        });
                    }
                });

                if (images.length == images_ready)
                {
                    checkAllImagesReady(pb,true);
                }
            }
        }
    }

    function delayedLoadAdjust(pb)
    {
        if (pb.properties.loaded_content !== pb.settings.content)
        {
            if (!checkAllImagesReady(pb))
            {
                addImageLoadListeners(pb);
            }
            pb.properties.loaded_content = pb.settings.content;
        }
    }

    function adjustPopBoxToClient(pb,animate)
    {
        animate = param(animate,false);
        pb = param(pb,false);

        if (pb)
        {
            adjustToClient(pb.popup, {
                animate: animate,
                container:pb.container,
                width:pb.settings.width,
                height:pb.settings.height,
                maxwidth:pb.settings.maxwidth,
                maxheight:pb.settings.maxheight,
                push_obj:pb.bottom_push,
                shadow: pb.shadow,
                autoScale: pb.settings.autoScale,
                innerOverflow: pb.settings.innerOverflow
            });
        }
    }

    PopBox.prototype.adjust = function(animate)
    {
        animate = param(animate,false);
        var _class = this;
        if (!_class.properties.resizepause && (!animate || _class.properties.isopen))
        {
            _class.properties.resizepause = true;
            setTimeout(function(){
                adjustPopBoxToClient(_class,animate);

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
                popboxAnimateComplete(_class,'close');
            });

            $(window).off("resize.popbox.adjust");

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

            var close = (isString(this.settings.close,true)) ? _class.settings.close : this.defaultSettings.close;
            var content = (isString(this.settings.content,true)) ? _class.settings.content : '';
            var title = (isString(this.settings.title,true)) ? '<div class="popbox-title">'+_class.settings.title+'</div>' : '';
            var pclass = (isString(this.settings.customClass,true)) ? ' '+_class.settings.customClass : '';

            var _body = $('body');

            _class.properties.bodyOverflow = _body.css('overflow');

            var old_body_width = _body.width();
            _body.css('overflow','hidden');
            var new_body_width = _body.width();

            if (new_body_width > old_body_width)
            {
                _class.properties.bodyMarginRight = _body.css('margin-right');
                var old_margin_right = parseInt(_class.properties.bodyMarginRight);
                var new_margin_right = old_margin_right+(new_body_width-old_body_width);
                _body.css('margin-right',new_margin_right+'px');
            }

            $(document).on('scroll.popbox touchmove.popbox mousewheel.popbox',function(e){
                var $target = $(e.target);
                var $popboxcontent = $target.closest('.popbox-content');
                if (!$popboxcontent.length) e.preventDefault();
            });

            _body.append('<div class="popbox-container'+pclass+'" style="display: none;"><div class="popbox-bottom-push"></div><a class="popbox-shadow" href="javascript:void(0);"></a><div class="popbox-popup">'+title+'<a class="popbox-close">'+close+'</a><div class="popbox-content">'+content+'</div></div></div>');

            _class.container = $(".popbox-container");
            _class.popup = _class.container.find(".popbox-popup");
            _class.shadow = _class.container.find(".popbox-shadow");
            _class.bottom_push = _class.container.find(".popbox-bottom-push");
            _class.close_button = _class.container.find(".popbox-close");
            _class.title_area = _class.container.find(".popbox-title");
            _class.content_area = _class.container.find(".popbox-content");

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
                'visibility':'visible',
                'position':'absolute',
                'top':'0px',
                'left':'0px',
                'z-index':'993'
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
                'filter':'alpha(opacity=0)',
                'cursor':'default'
            });
            _class.content_area.css({
                'overflow':'hidden',
                'height':'100%'
            });

            _class.adjust();

            _class.container.fadeIn(_class.settings.fadeInSpeed, function(){
                popboxAnimateComplete(_class,'open');
            });

            _class.shadow.click(function(e){
                _class.close();
                e.preventDefault();
            });
            _class.close_button.click(function(e){
                _class.close();
                e.preventDefault();
            });

            $(window).on("resize.popbox.adjust",function(){_class.adjust(true);});

            _class.properties.isopen = true;

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
                _class.adjust(true);
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
        customClass:''
    };


    window.PopBox = PopBox;

})(jQuery);