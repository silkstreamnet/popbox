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
        this.popbox = false;
        this.container = false;
        this.shadow = false;
        this.properties = {
            animating: false,
            isopen: false,
            resizepause: false
        };
	};

    PopBox.prototype.defaultSettings = {
        transition:false,
        width:'auto',
        height:'auto',
        maxwidth:'none',
        maxheight:'none',
        content:'',
        close:'X',
        onOpen:false,
        onClose:false,
        beforeOpen:false,
        beforeClose:false,
        fadeInSpeed: 400,
        fadeOutSpeed: 400,
        updatePositionDelay: 200
    };

    function popboxAnimateComplete(popbox,method)
    {
        if (popbox.properties.animating)
        {
            popbox.properties.animating = false;

            switch (method)
            {
                case 'close':
                    if (popbox.properties.isopen)
                    {
                        popbox.container.remove();
                        popbox.properties.isopen = false;
                        popbox.container = false;
                        popbox.popup = false;
                        popbox.shadow = false;
                    }
                    break;
                case 'open':
                    if (!popbox.properties.isopen)
                    {
                        popbox.properties.isopen = true;
                    }
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
            shadow: false
        };

        $.extend(b,a);

        obj.each(function(a){
            var c=$(this);
            var d=$(b.container);
            var e=b.container==window; //is window: true or false

            if (b.forceAbsolute)
            {
                if (e) c.remove().appendTo("body");
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

            c.css(c_temp);
            if (!e) d.css(d_temp);

            //if width is auto, find the 80% max of the container and match to fit.
            var dMaxWidth = (e ? d.width() : d.outerWidth(false)) * 0.8;
            var cWidthPadded = c.outerWidth(false) - c.width();
            var newWidth = dMaxWidth-cWidthPadded;
            if (isNumber(b.width))
            {
                c.width(b.width);
            }
            else
            {
                if (isNumber(b.maxwidth) && newWidth > b.maxwidth)
                {
                    c.width(b.maxwidth);
                }
                else
                {
                    c.width(newWidth);
                }
            }

            //if height is auto, height is automatic, also check if height is greater than container height
            if (isNumber(b.height))
            {
                c.height(b.height);
            }
            var dPush = (e ? d.height() : d.outerHeight(false)) * 0.05;
            var dFullMaxHeight = e ? d.height() : d.outerHeight(false);
            var dMaxHeight = dFullMaxHeight * 0.9; //account for any possible padding, e.g. x button.
            var cHeight = c.outerHeight(false);
            var setY = false;
            if (cHeight > dMaxHeight)
            {
                setY = dPush;
                d.css('overflow','auto');
                b.push_obj.css({
                    'top':(dPush+cHeight)+'px',
                    'height':dPush+'px',
                    'width':'1px'
                });
                b.shadow.css({
                    'height':((dPush*2)+cHeight)+'px'
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

            var g = ((e ? d.width() : d.outerWidth(false)) - c.outerWidth(false)) / 2;
            var h = ((e ? d.height() : d.outerHeight(false)) - c.outerHeight(false)) / 2;

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
                c.stop(true,true).animate({
                    "left":g,
                    "top":h
                },500);
            }
            else
            {
                c.stop(true,true).css({
                    "left":g,
                    "top":h
                });
            }
            if (b.completeHandler) b.completeHandler(obj);
        });
    }

    PopBox.prototype.adjust = function(animate)
    {
        animate = param(animate,false);
        var _class = this;
        if (_class.properties.resizepause == false)
        {
            _class.properties.resizepause = true;
            setTimeout(function(){
                adjustToClient(_class.popup, {
                    animate: animate,
                    container:_class.container,
                    width:_class.settings.width,
                    height:_class.settings.height,
                    maxwidth:_class.settings.maxwidth,
                    maxheight:_class.settings.maxheight,
                    push_obj:_class.bottom_push,
                    shadow: _class.shadow
                });

                _class.properties.resizepause = false;
            },_class.properties.updatePositionDelay);
        }
    };

    PopBox.prototype.close = function()
    {
        var _class = this;
        if (!_class.properties.animating && _class.properties.isopen)
        {
            if (typeof(_class.settings.beforeClose) === "function")
            {
                _class.settings.beforeClose(_class);
            }

            _class.properties.animating = true;

            _class.container.fadeOut(_class.settings.fadeOutSpeed,function(){
                popboxAnimateComplete(_class,'close');
            });

            $('body').css('overflow','');
            $(window).off("resize.popbox.adjust");

            if (typeof(_class.settings.onClose) === "function")
            {
                _class.settings.onClose(_class);
            }
        }
    };

    PopBox.prototype.open = function()
    {
        //need to add a preload all images check when it is opened. add a listener if there are images to preload, when complete apply "adjust" function.
        var _class = this;
        if (!_class.properties.animating && !_class.properties.isopen)
        {
            if (typeof(_class.settings.beforeOpen) === "function")
            {
                _class.settings.beforeOpen(_class);
            }

            var setWidth = (isNumber(this.settings.width,true)) ? _class.settings.width+'px' : '';
            var setHeight = (isNumber(this.settings.height,true)) ? _class.settings.height+'px' : '';
            var close = (isString(this.settings.close,true)) ? _class.settings.close : this.defaultSettings.close;
            var content = (isString(this.settings.content,true)) ? _class.settings.content : '';

            $("body").css('overflow','hidden').append('<div class="popbox-container" style="display: none;"><div class="popbox-bottom-push"></div><div class="popbox-shadow"></div><div class="popbox-popup"><a class="popbox-close">'+close+'</a>'+content+'</div></div>');

            _class.container = $(".popbox-container");
            _class.popup = _class.container.find(".popbox-popup");
            _class.shadow = _class.container.find(".popbox-shadow");
            _class.bottom_push = _class.container.find(".popbox-bottom-push");
            _class.close_button = _class.container.find(".popbox-close");

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
                'height':setHeight,
                'width':setWidth,
                'z-index':'993'
            });
            _class.shadow.css({
                'display':'block',
                'position':'absolute',
                'left':'0px',
                'top':'0px',
                'width':'100%',
                'height':'100%',
                'z-index':'991'
            });

            _class.properties.animating = true;
            _class.adjust();

            _class.container.fadeIn(_class.settings.fadeInSpeed, function(){
                popboxAnimateComplete(_class,'open');
            });

            $(window).on("resize.popbox.adjust",function(){_class.adjust(true);});

            _class.shadow.click(function(e){
                _class.close();
                e.preventDefault();
            });
            _class.close_button.click(function(e){
                _class.close();
                e.preventDefault();
            });

            if (typeof(_class.settings.onOpen) === "function")
            {
                _class.settings.onOpen(_class);
            }
        }
    };

    PopBox.prototype.setSettings = function(settings,adjust)
    {
        var _class = this;

        settings = param(settings,{});
        adjust = param(adjust,true);
        _class.settings = $.extend({},_class.settings,settings);
        
        if (_class.properties.isopen && adjust) 
        {
            var setWidth = (isNumber(this.settings.width,true)) ? _class.settings.width+'px' : '';
            var setHeight = (isNumber(this.settings.height,true)) ? _class.settings.height+'px' : '';
            var close = (isString(this.settings.close,true)) ? _class.settings.close : this.defaultSettings.close;
            var content = (isString(this.settings.content,true)) ? _class.settings.content : '';

            _class.popup.html('<a class="popbox-close">'+close+'</a>'+content).css({
                'height':setHeight,
                'width':setWidth
            });

            _class.close_button = _class.popup.find('.popbox-close');

            _class.close_button.click(function(e){
                _class.close();
                e.preventDefault();
            });

            _class.adjust(true);
        }
    };


    window.PopBox = PopBox;

})(jQuery);