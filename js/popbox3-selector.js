(function($,window){
    var minimum_required_popbox_version = '3.0.0'.split('.');
    var popbox_version = (typeof $.Popbox === "undefined" || typeof $.Popbox.prototype.version === "undefined") ? false : $.Popbox.prototype.version.split('.');

    if (!popbox_version || parseInt(popbox_version[0],10) < 3) {
        console.log("Error: Popbox "+minimum_required_popbox_version+"+ required.");
        return;
    }

    var _static = $.Popbox.prototype._static;

    _static.applyDataToSettings = function($object,defaults,settings,stage) {
        stage = _static.param(stage,'');

        for (var property in defaults) {
            if (defaults.hasOwnProperty(property)) {
                var data_property = stage+property.toLowerCase().replace('_','-');

                if (typeof defaults[property] === 'object' && defaults[property] !== null) {
                    if (typeof settings[property] !== 'object' || settings[property] === null) settings[property] = {};
                    _static.applyDataToSettings($object,defaults[property],settings[property],data_property+'-');
                }
                else {
                    var data = $object.data(data_property);
                    if (typeof data !== 'undefined') {
                        var data_float = parseFloat(data);
                        if (data == 'true') data = !0;
                        else if (data == 'false') data = !1;
                        else if (data_float == data) data = data_float;

                        settings[p] = data;
                    }
                }
            }
        }
    };

    $.Popbox.prototype.default_settings.auto_setup = true;

    $.fn.Popbox = function(settings) {
        settings = _static.param(settings,{});
        var $elements = $(this);
        if ($elements.length) {
            $elements.each(function() {
                var $element = $(this);

                _static.offTouchClick($element);
                _static.onTouchClick($element,null,function(){
                    var _popbox, new_settings = $.extend(true,{},settings);
                    _static.applyDataToSettings($element,$.Popbox.prototype.default_settings,new_settings);

                    var href = new_settings.href || $element.attr('href'),
                        auto = new_settings.auto_setup,
                        auto_settings = {},
                        auto_run = false;

                    if (href && (auto === 1 || auto === true))
                    {
                        var matches = {
                            youtube:[
                                /^(?:http:|https:)?\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_\-]+)/, //normalurl
                                /^(?:http:|https:)?\/\/youtu.be\/([a-zA-Z0-9_\-]+)/, //shorturl
                                /^(?:http:|https:)?\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_\-]+)/ //embedurl
                            ],
                            vimeo:[
                                /^(?:http:|https:)?\/\/(?:www\.)?vimeo\.com\/([a-zA-Z0-9_\-]+)/, //normalurl
                                /^(?:http:|https:)?\/\/player\.vimeo\.com\/video\/([a-zA-Z0-9_\-]+)/ //embedurl
                            ],
                            image:[
                                /^(?:http:|https:)?\/\/[a-zA-Z0-9_\-\./]+(?:\.jpe?g|\.png|\.gif)(?:.+)?/, //remote image
                                /^[a-zA-Z0-9_\-\./]+(?:\.jpg|\.png|\.gif)(?:.+)?/ //remote image
                            ]
                        };

                        match_process:
                            for (var matcher in matches)
                            {
                                if (matches.hasOwnProperty(matcher) && matches[matcher] instanceof Array)
                                {
                                    for (var i=0; i<matches[matcher].length; i++)
                                    {
                                        var matchresult = href.match(matches[matcher][i]);
                                        if (matchresult)
                                        {
                                            //check if youtube, vimeo, image (jpg|png|gif)
                                            switch (matcher)
                                            {
                                                case 'youtube':
                                                    auto_settings.content = '<iframe width="1280" height="720" src="//www.youtube.com/embed/'+matchresult[1]+'" frameborder="0" allowfullscreen></iframe>';
                                                    auto_settings.aspect_fit = true;
                                                    break;
                                                case 'vimeo':
                                                    auto_settings.content = '<iframe width="1280" height="720" src="//player.vimeo.com/video/'+matchresult[1]+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
                                                    auto_settings.aspect_fit = true;
                                                    break;
                                                case 'image':
                                                    auto_settings.content = '<img src="'+matchresult[0]+'" alt="" />';
                                                    auto_settings.mode = 'gallery';
                                                    break;
                                            }

                                            $.extend(true,auto_settings,new_settings);
                                            auto_run = true;

                                            break match_process;
                                        }
                                    }
                                }
                            }
                    }

                    if (auto_run) _popbox = new $.Popbox(auto_settings);
                    else _popbox = new $.Popbox(new_settings);

                    _popbox.open();

                    // bind created popbox to element
                    $element.data('Popbox',_popbox);
                },true);
            });
        }
        return this;
    };

    $('.open-popbox').Popbox();

})(jQuery,window);