(function($){

	$.fn.PopBox = function(options)
	{
		var defaults = {
			transition:false,
			width:0,
			height:0,
			content:'',
			close:'X',
			onShow:false,
            onClose:false,
            onStart:false,
            onClick:false
		};
		var settings = $.extend({},defaults,options);
        settings.popbox = false;

		popboxStart(this,settings);
	};
	
	function centerInClient(othis,a){
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
	
	function outerHTML(object) {
		return $('<div />').append($(object).eq(0).clone()).html();
	}
	
	function isNumber(o)
	{
		return ! isNaN (o-0) && o != null && o != "";
	}
	
	function popboxStart(linkobject,settings)
	{
		var setWidth = '';
		var setHeight = '';
		var setStyle = '';
		
		var close = 'X';
		var content = '';

		$(linkobject).click(function(e){

            if (typeof(settings.onClick) === "function")
            {
                settings.onClick(settings);
            }

			setWidth = (typeof(settings.width) === "number" && settings.width > 0) ? 'width:'+settings.width+'px;' : '';
			setHeight = (typeof(settings.height) === "number" && settings.height > 0) ? 'height:'+settings.height+'px;' : '';
			setStyle = (setWidth != '' || setHeight != '') ? setWidth+' '+setHeight : '';
			
			close = (typeof(settings.close) === "string") ? settings.close : close;
			var wrapfirst = '<div class="popbox-cast" style="display:none;height:100%; width: 100%; position:fixed; left: 0; top:0; background-color: rgba(0,0,0,0.4); z-index: 9990;"></div><div class="popbox-popup" style="position:absolute; z-index:9991; visibility:hidden;'+setStyle+'"><a class="popbox-close">'+close+'</a>';
			var wraplast = '</div>';

            content = (settings.content != null && settings.content != false && settings.content != '' && typeof(settings.content) === "string") ? settings.content : content;
			
			var grabobject = false;
			if (settings.contentid != false && typeof(settings.contentid) === "string" && content === '')
			{
				grabobject = $('#'+settings.contentid);
                content = (grabobject.length > 0) ? outerHTML(grabobject) : content;
				grabobject.remove();
			}
			
			$("body").append(wrapfirst+content+wraplast);
			var popup = $(".popbox-popup");
			var popcast = $(".popbox-cast");
            var closing = false;

            settings.close = function()
            {
                if (!closing)
                {
                    if (typeof(settings.onClose) === "function")
                    {
                        settings.onClose(settings);
                    }
                    settings.popbox = false;
                    popup.fadeOut(500,function(){$(this).remove()});
                    popcast.fadeOut(500,function(){$(this).remove()});
                    closing = true;
                }
            };
            settings.popbox = popup;

            if (typeof(settings.onStart) === "function")
            {
                settings.onStart(settings);
            }

            popcast.fadeIn(300);

			if (settings.contentid != false)
			{
				popup.find('#'+settings.contentid);
			}
			
			centerInClient(popup,{animate:false});
            popup.css({'visibility':'','display':'none'}).fadeIn(300);

			function centerPopup()
			{
				centerInClient(popup);
			}
			
			var resi = false;
			$(window).resize(function(){
				if (resi == false)
				{
					resi = true;
					setTimeout(function(){centerPopup(); resi = false;},500);
				}
			});
			var scro = false;
			$(window).scroll(function(){
				if (scro == false)
				{
					scro = true;
					setTimeout(function(){centerPopup(); scro = false;},500);
				}
			});


			$(".popbox-cast,.popbox-close").click(function(e){
                if (!closing)
                {
                    if (typeof(settings.onClose) === "function")
                    {
                        settings.onClose(settings);
                    }
                    settings.popbox = false;
                    popup.fadeOut(500,function(){$(this).remove()});
                    popcast.fadeOut(500,function(){$(this).remove()});
                    closing = true;
                }
				e.preventDefault();
			});
			
			if (typeof(settings.onShow) === "function")
			{
				settings.onShow(settings);
			}
			e.preventDefault();
		});
	}

})(jQuery);