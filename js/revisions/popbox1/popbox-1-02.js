(function($){

	$.fn.PopBox = function(options)
	{
		var defaults = {
			transition:false,
			width:0,
			height:0,
			html:false,
			contentid:false,
			closeText:'X',
			onShow:false
		};
		var settings = $.extend({},defaults,options);

		popboxStart(this,settings);
	};
	
	function centerInClient(othis,a){var b={forceAbsolute:false,container:window,completeHandler:null,animate:true};$.extend(b,a);return othis.each(function(a){var c=$(othis);var d=$(b.container);var e=b.container==window;if(b.forceAbsolute){if(e)c.remove().appendTo("body");else c.remove().appendTo(d.get(0))}c.css("position","absolute");var f=e?2:1.8;var g=(e?d.width():d.outerWidth())/2-c.outerWidth()/2;var h=(e?d.height():d.outerHeight())/f-c.outerHeight()/2;if(b.animate===true){c.stop(true,true).animate({"left":g+d.scrollLeft(),"top":h+d.scrollTop()},500);}else{c.stop(true,true).css({"left":g+d.scrollLeft(),"top":h+d.scrollTop()});}if(b.completeHandler)b.completeHandler(othis)})};
	
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
		
		var closeText = 'X';
		var htmlcontent = '';
		
		$(linkobject).click(function(e){
			
			setWidth = (typeof(settings.width) === "number" && settings.width > 0) ? 'width:'+settings.width+'px;' : '';
			setHeight = (typeof(settings.height) === "number" && settings.height > 0) ? 'height:'+settings.height+'px;' : '';
			setStyle = (setWidth != '' || setHeight != '') ? setWidth+' '+setHeight : '';
			
			closeText = (typeof(settings.closeText) === "string") ? settings.closeText : closeText;
			var wrapfirst = '<div class="quo-cast" style="display:none;"></div><div class="quo-popup" style="visibility:hidden;'+setStyle+'"><a class="quo-close">'+closeText+'</a>';
			var wraplast = '</div>';
			
			htmlcontent = (settings.html != null && settings.html != false && settings.html != '' && typeof(settings.html) === "string") ? settings.html : htmlcontent;
			
			var grabobject = false;
			if (settings.contentid != false && typeof(settings.contentid) === "string" && htmlcontent === '')
			{
				grabobject = $('#'+settings.contentid);
				htmlcontent = (grabobject.length > 0) ? outerHTML(grabobject) : htmlcontent;
				grabobject.remove();
			}
			
			$("body").append(wrapfirst+htmlcontent+wraplast);
			var popup = $(".quo-popup");
			var popcast = $(".quo-cast");

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

			var closing = false;
			$(".quo-cast,.quo-close").click(function(e){
                if (!closing)
                {
                    popup.fadeOut(500,function(){$(this).remove()});
                    popcast.fadeOut(500,function(){$(this).remove()});
                    closing = true;
                }
				e.preventDefault();
			});
			
			if (typeof(settings.onShow) === "function")
			{
				settings.onShow();
			}
			e.preventDefault();
		});
	}

})(jQuery);