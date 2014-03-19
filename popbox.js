(function($){

    var popboxes = [];

    function adjustToClient(othis,a)
    {
        //set container to overflow: scroll-y if popup has higher height than available.
        var b={
            forceAbsolute:false,
            container:window,
            completeHandler:null,
            animate:true
        };
        $.extend(b,a);
        return othis.each(function(a){
            var c=$(othis);
            var d=$(b.container);
            var e=b.container==window;
            if (b.forceAbsolute)
            {
                if(e)c.remove().appendTo("body");
                else c.remove().appendTo(d.get(0))
            }
            c.css("position","absolute");
            var f=e?2:1.8;
            var g=(e?d.width():d.outerWidth(false))/2-c.outerWidth(false)/2;
            var h=(e?d.height():d.outerHeight(false))/f-c.outerHeight(false)/2;
            if (b.animate===true)
            {
                c.stop(true,true).animate({
                    "left":g+d.scrollLeft(),
                    "top":h+d.scrollTop()
                },500);
            }
            else
            {
                c.stop(true,true).css({
                    "left":g+d.scrollLeft(),
                    "top":h+d.scrollTop()
                });
            }
            if (b.completeHandler) b.completeHandler(othis);
        });
    }

    function isNumber(o,required)
    {
        required = required || false;
        return ! isNaN (o-0) && o != null && o != "" && (!required || o > 0);
    }

    function isString(o,required)
    {
        required = required || false;
        return typeof(o) === "string" && o != null && (!required || o != '');
    }

	var PopBox = function(options)
	{
		this.settings = $.extend({},this.defaultSettings,options);
        this.popbox = false;
        this.container = false;
        this.shadow = false;
        this.properties = {
            animating: false,
            isopen: false
        };
	};

    PopBox.prototype.defaultSettings = {
        transition:false,
        width:0,
        height:0,
        content:'',
        close:'X',
        onOpen:false,
        onClose:false,
        beforeOpen:false,
        beforeClose:false,
        fadeInSpeed: 400,
        fadeOutSpeed: 400
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
                        popbox.popup.remove();
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

    PopBox.prototype.close = function()
    {
        var _class = this;
        if (!_class.properties.animating && _class.properties.isopen)
        {
            if (typeof(_class.settings.beforeClose) === "function")
            {
                _class.settings.beforeClose();
            }

            _class.properties.animating = true;

            _class.popup.fadeOut(_class.settings.fadeOutSpeed,function(){
                popboxAnimateComplete(_class,'close');
            });
            _class.container.fadeOut(_class.settings.fadeOutSpeed,function(){
                popboxAnimateComplete(_class,'close');
            });

            $('body').css('overflow','');

            if (typeof(_class.settings.onClose) === "function")
            {
                _class.settings.onClose();
            }
        }
    };

    PopBox.prototype.open = function()
    {
        var _class = this;
        if (!_class.properties.animating && !_class.properties.isopen)
        {
            if (typeof(_class.settings.beforeOpen) === "function")
            {
                _class.settings.beforeOpen();
            }

            var setWidth = (isNumber(this.settings.width,true)) ? this.settings.width+'px' : '';
            var setHeight = (isNumber(this.settings.height,true)) ? this.settings.height+'px' : '';
            var close = (isString(this.settings.close,true)) ? this.settings.close : this.defaultSettings.close;
            var content = (isString(this.settings.content,true)) ? this.settings.content : '';

            $("body").css('overflow','hidden').append('<div class="popbox-container" style="display: none;"><div class="popbox-shadow"></div><div class="popbox-popup"><a class="popbox-close">'+close+'</a>'+content+'</div></div>');

            this.container = $(".popbox-container");
            this.popup = this.container.find(".popbox-popup");
            this.shadow = this.container.find(".popbox-shadow");

            this.container.css({
                'display':'none',
                'height':'100%',
                'width':'100%',
                'position':'fixed',
                'left':'0px',
                'top':'0px',
                'z-index':'990'
            });
            this.popup.css({
                'display':'block',
                'visibility':'hidden',
                'position':'absolute',
                'top':'0px',
                'left':'0px',
                'height':setHeight,
                'width':setWidth,
                'z-index':'992'
            });
            this.shadow.css({
                'display':'block',
                'position':'absolute',
                'left':'0px',
                'top':'0px',
                'width':'100%',
                'height':'100%',
                'z-index':'991',
                'background-color': 'rgba(0,0,0,0.4)'
            });

            _class.properties.animating = true;

            adjustToClient(_class.popup,{animate:false,container:_class.container});

            _class.popup.css({'visibility':'visible','display':'none'}).fadeIn(_class.settings.fadeInSpeed,function(){
                popboxAnimateComplete(_class,'open');
            });
            _class.container.fadeIn(_class.settings.fadeInSpeed, function(){
                popboxAnimateComplete(_class,'open');
            });

            var resi = false;
            $(window).resize(function(){
                if (resi == false)
                {
                    resi = true;
                    setTimeout(function(){
                        adjustToClient(_class.popup, {container:_class.container});
                        resi = false;
                    },500);
                }
            });

            $(".popbox-shadow,.popbox-close").click(function(e){
                _class.close();
                e.preventDefault();
            });

            if (typeof(_class.settings.onOpen) === "function")
            {
                _class.settings.onOpen();
            }
        }
    };


    window.PopBox = PopBox;

})(jQuery);