import $ from "jquery"

export const _static = {
    $window:$(window),
    $document:$(document),
    $html:$('html'),
    $body:$('body'),
    _event_namespace:'Popbox',
    _next_instance_id:0,
    _next_transition_id:0,
    _instances:{length:0},
    _support:{},
    _speeds:{
        '_default':300,
        'fast':300,
        'medium':600,
        'slow':1000
    },
    _eases:{
        '_default':       'ease',
        'in':             'ease-in',
        'out':            'ease-out',
        'in-out':         'ease-in-out',
        'snap':           'cubic-bezier(0,1,.5,1)',
        // Penner equations
        'easeInCubic':    'cubic-bezier(.550,.055,.675,.190)',
        'easeOutCubic':   'cubic-bezier(.215,.61,.355,1)',
        'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
        'easeInCirc':     'cubic-bezier(.6,.04,.98,.335)',
        'easeOutCirc':    'cubic-bezier(.075,.82,.165,1)',
        'easeInOutCirc':  'cubic-bezier(.785,.135,.15,.86)',
        'easeInExpo':     'cubic-bezier(.95,.05,.795,.035)',
        'easeOutExpo':    'cubic-bezier(.19,1,.22,1)',
        'easeInOutExpo':  'cubic-bezier(1,0,0,1)',
        'easeInQuad':     'cubic-bezier(.55,.085,.68,.53)',
        'easeOutQuad':    'cubic-bezier(.25,.46,.45,.94)',
        'easeInOutQuad':  'cubic-bezier(.455,.03,.515,.955)',
        'easeInQuart':    'cubic-bezier(.895,.03,.685,.22)',
        'easeOutQuart':   'cubic-bezier(.165,.84,.44,1)',
        'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
        'easeInQuint':    'cubic-bezier(.755,.05,.855,.06)',
        'easeOutQuint':   'cubic-bezier(.23,1,.32,1)',
        'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
        'easeInSine':     'cubic-bezier(.47,0,.745,.715)',
        'easeOutSine':    'cubic-bezier(.39,.575,.565,1)',
        'easeInOutSine':  'cubic-bezier(.445,.05,.55,.95)',
        'easeInBack':     'cubic-bezier(.6,-.28,.735,.045)',
        'easeOutBack':    'cubic-bezier(.175, .885,.32,1.275)',
        'easeInOutBack':  'cubic-bezier(.68,-.55,.265,1.55)'
    },
    _transition_end_event_names:{
        'transition':       'transitionend',
        'MozTransition':    'transitionend',
        'OTransition':      'oTransitionEnd',
        'WebkitTransition': 'webkitTransitionEnd',
        'msTransition':     'MSTransitionEnd'
    },
    _test_div:document.createElement('div')
};

_static._support.transition         = getVendorPropertyName('transition');
_static._support.transform          = getVendorPropertyName('transform');
_static._support.transform_origin   = getVendorPropertyName('transformOrigin');
_static._support.transition_end     = _static._transition_end_event_names[_static._support.transition] || null;
_static._support.transform3d        = (function () {
    var el = document.createElement('p'),
        has3d,
        transforms = {
            'webkitTransform': '-webkit-transform',
            'OTransform': '-o-transform',
            'msTransform': '-ms-transform',
            'MozTransform': '-moz-transform',
            'transform': 'transform'
        };

    // Add it to the body to get the computed style
    document.body.insertBefore(el, null);

    for (var t in transforms) {
        if (transforms.hasOwnProperty(t)) {
            if (el.style[t] !== undefined) {
                el.style[t] = 'translate3d(1px,1px,1px)';
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }
    }

    document.body.removeChild(el);

    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
})();

_static._test_div = null;

_static.param = function(parameter,_default) {
    return (typeof parameter !== 'undefined' ? parameter : _default);
};
_static.regexEscape = function(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
_static.isSet = function(value) {
    return typeof value !== "undefined";
};
_static.isFunction = function(func) {
    return typeof func === "function";
};
_static.isPlainObject = function(obj) {
    return typeof obj === "object" && obj != null && !(obj instanceof Array);
};
_static.isArray = function(arr) {
    return typeof arr === "object" && arr instanceof Array;
};
_static.isNumber = function(number,required) {
    return typeof number === "number" && (!_static.param(required,false) || number > 0);
};
_static.isString = function(string,required) {
    return typeof string === "string" && (!_static.param(required,false) || string !== '');
};
_static.getAttributeString = function($object,attr) {
    var val = $object.attr(attr);
    return (typeof val === 'undefined' || val === false || val === '') ? '' : val;
};
_static.indexOf = function(value,array,strict) {
    strict = strict || false;

    if (array instanceof Array) {
        for (var i=0; i<array.length; i++) {
            if (strict) {
                if (array[i] === value) {
                    return i;
                }
            }
            else if (array[i] == value) {
                return i;
            }
        }
    }
    return -1;
};
_static.trim = function (string) {
    return (_static.isString(string)) ? string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : string;
};
_static.getInlineStyle = function($object,style)
{
    var full_inline_style = _static.getAttributeString($object,'style');
    if (style && full_inline_style) {
        var r = new RegExp('(^|;)\\s*'+_static.regexEscape(style)+'\\s*:');
        if (full_inline_style.match(r)) {
            return $object.css(style);
        }
    }
    return '';
};
_static.splitOutside = function(delimiter,string,container_start,container_end){
    if (typeof container_start === 'undefined') container_start = '';
    if (typeof container_end === 'undefined') container_end = container_start;
    if (!(container_start instanceof Array)) container_start = [container_start];
    if (!(container_end instanceof Array)) container_end = [container_end];

    var results = [],
        parts = string.split(delimiter),
        inside = false,
        current = 0,
        container_start_i = container_start[current],
        container_end_i = container_end[current];

    for (var i=0; i<parts.length; i++) {

        var part_handled = false;

        for (var j=0; j<container_start.length; j++) {
            container_start_i = container_start[j];
            container_end_i = container_end[current];

            var container_start_ie = container_start_i.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
                container_end_ie = container_end_i.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
                start_match = parts[i].match(new RegExp('['+container_start_ie+'][^'+container_end_ie+']*')),
                end_match = parts[i].match(new RegExp('[^'+container_start_ie+']*['+container_end_ie+']'));

            if (inside !== false) {
                if (j === current) {
                    inside += parts[i];
                    if (end_match) {
                        results.push(inside);
                        inside = false;
                    }
                    else {
                        inside += delimiter;
                    }
                    part_handled = true;
                }
            }
            else if (start_match) {
                inside = parts[i]+delimiter;
                current = (j < container_end.length) ? j : 0;
                part_handled = true;
            }
        }

        if (!part_handled) {
            results.push(parts[i]);
        }
    }

    return results;
};
_static.elementPaddingWidth = function($object,include_margin) {
    return ($object && $object.length) ? $object.outerWidth(!!_static.param(include_margin,false))-$object.width() : 0;
};
_static.elementPaddingHeight = function($object,include_margin) {
    return ($object && $object.length) ? $object.outerHeight(!!_static.param(include_margin,false))-$object.height() : 0;
};
_static.transition = function($object,properties,duration,easing,complete,name){
    properties = _static.param(properties,{});
    duration = _static.param(duration,_static._speeds._default);
    easing = _static.param(easing,_static._eases._default);
    name = (_static.isString(name,true)) ? name : false;

    var property,
        transitions = [],
        property_difference = false,
        transitioning = false,
        this_transition_id = _static._next_transition_id;

    _static._next_transition_id++;

    if (_static._support.transition_end && duration > 25) {

        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                //TODO jquery converts required prefix for css3, but the property pushed to transition needs to be retrieved e.g. transform, margin, padding
                //TODO this code does not support check for 12em vs 12px, this will be treated as not different but popbox doesn't animate anything other than pixels anyway...
                //TODO if possible, need to shorten this to only work for what is needed (pixel comparisons).
                transitions.push(property+' '+duration+'ms '+easing);

                // round number values to 1 decimal place for comparison
                var cur_property_val = $object.css(property),
                    new_property_val = properties[property],
                    size_properties = ['width','height','top','right','bottom','left'];

                if (_static.isString(cur_property_val,true)) {
                    cur_property_val = cur_property_val.trim();
                    if (cur_property_val.match(/^[0-9]+(?:\.[0-9]+)?\s*.{0,4}$/)) {
                        cur_property_val = parseFloat(cur_property_val);
                    }
                }
                if (_static.isString(new_property_val,true)) {
                    new_property_val = new_property_val.trim();
                    if (new_property_val.match(/^[0-9]+(?:\.[0-9]+)?\s*.{0,4}$/)) {
                        new_property_val = parseFloat(new_property_val);
                    }
                }

                if (_static.isNumber(cur_property_val,true)) {
                    cur_property_val = Math.ceil(cur_property_val*(_static.indexOf(property,size_properties) > -1 ? 1 : 100));
                }

                if (_static.isNumber(new_property_val,true)) {
                    new_property_val = Math.ceil(new_property_val*(_static.indexOf(property,size_properties) > -1 ? 1 : 100));
                }

                if (_static.isNumber(cur_property_val) && _static.isNumber(new_property_val)) {
                    if (cur_property_val-new_property_val > 1 || new_property_val-cur_property_val > 1) {
                        property_difference = true;
                    }
                }
                else if (cur_property_val !== new_property_val) {
                    property_difference = true;
                }
            }
        }

        var existing_transitions = _static.splitOutside(',',$object.css('transition'),'(',')');
        for (var j=0; j<existing_transitions.length; j++) {
            var existing_transition = _static.trim(existing_transitions[j]),
                existing_update = false;

            if (existing_transition && !existing_transition.match(/all 0(?:\.[0]+)?[^0-9]/)) {
                for (property in properties) {
                    if (properties.hasOwnProperty(property)) {
                        if (_static.isString(property,true) && existing_transitions[j].match(new RegExp(_static.regexEscape(property)))) {
                            existing_update = true;
                            break;
                        }
                    }
                }

                if (!existing_update) {
                    transitions.push(existing_transition);
                    property_difference = true;
                }
            }
        }

        var already_animating = $object.hasClass('popbox-animating');

        if (transitions.length && property_difference) {

            $object.off('.popbox_auto_transition_end');

            // add function to list
            _static.transitionAddCallback($object,complete,name);
            // if the event final is the same as the creator, FOR SPARTA

            $object.css('transition',transitions.join(', '));
            $object.css(properties).addClass('popbox-animating');
            $object.data('popbox-transition-id',this_transition_id);

            setTimeout(function(){
                var lazy_timeout_catchup = false;
                var transition_end = function(){
                    if ($object.data('popbox-transition-id') === this_transition_id) {
                        if (lazy_timeout_catchup !== false) {
                            clearTimeout(lazy_timeout_catchup);
                            lazy_timeout_catchup = false;
                        }

                        $object.off('.popbox_auto_transition_end');
                        $object.css('transition','').removeClass('popbox-animating');

                        var live_functions = $object.data('popbox-transition-end-functions');
                        if (live_functions) {
                            live_functions = $.extend({},live_functions);
                            $object.data('popbox-transition-id',false);
                            _static.clearTransition($object);
                        }
                        if (live_functions) {
                            for (var functions_name in live_functions) {
                                if (live_functions.hasOwnProperty(functions_name)) {
                                    for (var i=0; i<live_functions[functions_name].length; i++) {
                                        if (_static.isFunction(live_functions[functions_name][i])) live_functions[functions_name][i]();
                                    }
                                }
                            }
                        }
                    }
                };

                // standard event
                $object.off('.popbox_auto_transition_end').on(_static._support.transition_end+'.popbox_auto_transition_end',function(e){
                    e.stopPropagation();
                    transition_end();
                });
                // fallback check
                lazy_timeout_catchup = setTimeout(function(){lazy_timeout_catchup=false;transition_end();},duration+50);
            },0);

            transitioning = true;
        }
    }

    if (!transitioning) {

        $object.css(properties);

        if (already_animating) {
            // add function to list
            _static.transitionAddCallback($object,complete,name);
        }
        else {
            if (_static.isFunction(complete)) {
                setTimeout(function(){complete();},0);
            }
        }
    }
};
_static.transitionAddCallback = function($object,callback,name) {
    name = (_static.isString(name,true)) ? name : '_default';
    if ($object.length && _static.isFunction(callback)) {
        var pre = $object.data('popbox-transition-end-functions');
        if (pre && pre[name]) {
            pre[name].push(callback);
        }
        else if (pre) {
            pre[name] = [callback];
        }
        else {
            pre = {};
            pre[name] = [callback];
        }
        $object.data('popbox-transition-end-functions',pre);
    }
};
_static.clearTransition = function($object,name) {
    name = (_static.isString(name,true)) ? name : false;
    if (name) {
        var pre = $object.data('popbox-transition-end-functions');
        if (pre && pre[name]) {
            delete pre[name];
            $object.data('popbox-transition-end-functions',pre);
        }
    }
    else {
        $object.data('popbox-transition-end-functions',false);
    }
};
_static.getTrueWidth = function($object) {
    return ($object && $object.length) ? $object.get(0).getBoundingClientRect().right-$object.get(0).getBoundingClientRect().left : 0; // support for IE8
    //return ($object && $object.length) ? $object.get(0).getBoundingClientRect().width : 0;
};
_static.getTrueHeight = function($object) {
    return ($object && $object.length) ? $object.get(0).getBoundingClientRect().bottom-$object.get(0).getBoundingClientRect().top : 0; // support for IE8
    //return ($object && $object.length) ? $object.get(0).getBoundingClientRect().height : 0;
};
_static.offTouchClick = function($object) {
    if ($object.length) {
        $object.off('.Popbox_touch_click');
    }
};
_static.onTouchClick = function($object,selector,handler,prevent_default){
    if ($object.length) {
        var touch_click_namespace = 'Popbox_touch_click';
        if (prevent_default) {
            $object.on('click.'+touch_click_namespace,function(e){
                e.preventDefault();
            });
        }
        $object.on('mousedown.'+touch_click_namespace+' touchstart.'+touch_click_namespace,selector,function(e){
            if (e.originalEvent.touches || e.which === 1) {
                var $subobject = $(this);
                //if (prevent_default) e.preventDefault();
                $subobject.off('mouseup.'+touch_click_namespace+' touchend.'+touch_click_namespace).on('mouseup.'+touch_click_namespace+' touchend.'+touch_click_namespace,function(e2){
                    if (e.originalEvent.touches || e.which === 1) {
                        if (prevent_default) e2.preventDefault();
                        if (_static.isFunction(handler)) handler.call(this,e2);
                    }
                });
            }
        });
    }
};
