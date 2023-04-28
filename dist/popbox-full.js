/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// UNUSED EXPORTS: default

;// CONCATENATED MODULE: external "jQuery"
const external_jQuery_namespaceObject = jQuery;
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_namespaceObject);
;// CONCATENATED MODULE: ./src/modules/static.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }


var _static = {
  $window: external_jQuery_default()(window),
  $document: external_jQuery_default()(document),
  $html: external_jQuery_default()('html'),
  $body: external_jQuery_default()('body'),
  _event_namespace: 'Popbox',
  _next_instance_id: 0,
  _next_transition_id: 0,
  _instances: {
    length: 0
  },
  _support: {},
  _speeds: {
    '_default': 300,
    'fast': 300,
    'medium': 600,
    'slow': 1000
  },
  _eases: {
    '_default': 'ease',
    'in': 'ease-in',
    'out': 'ease-out',
    'in-out': 'ease-in-out',
    'snap': 'cubic-bezier(0,1,.5,1)',
    // Penner equations
    'easeInCubic': 'cubic-bezier(.550,.055,.675,.190)',
    'easeOutCubic': 'cubic-bezier(.215,.61,.355,1)',
    'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
    'easeInCirc': 'cubic-bezier(.6,.04,.98,.335)',
    'easeOutCirc': 'cubic-bezier(.075,.82,.165,1)',
    'easeInOutCirc': 'cubic-bezier(.785,.135,.15,.86)',
    'easeInExpo': 'cubic-bezier(.95,.05,.795,.035)',
    'easeOutExpo': 'cubic-bezier(.19,1,.22,1)',
    'easeInOutExpo': 'cubic-bezier(1,0,0,1)',
    'easeInQuad': 'cubic-bezier(.55,.085,.68,.53)',
    'easeOutQuad': 'cubic-bezier(.25,.46,.45,.94)',
    'easeInOutQuad': 'cubic-bezier(.455,.03,.515,.955)',
    'easeInQuart': 'cubic-bezier(.895,.03,.685,.22)',
    'easeOutQuart': 'cubic-bezier(.165,.84,.44,1)',
    'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
    'easeInQuint': 'cubic-bezier(.755,.05,.855,.06)',
    'easeOutQuint': 'cubic-bezier(.23,1,.32,1)',
    'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
    'easeInSine': 'cubic-bezier(.47,0,.745,.715)',
    'easeOutSine': 'cubic-bezier(.39,.575,.565,1)',
    'easeInOutSine': 'cubic-bezier(.445,.05,.55,.95)',
    'easeInBack': 'cubic-bezier(.6,-.28,.735,.045)',
    'easeOutBack': 'cubic-bezier(.175, .885,.32,1.275)',
    'easeInOutBack': 'cubic-bezier(.68,-.55,.265,1.55)'
  },
  _transition_end_event_names: {
    'transition': 'transitionend',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'WebkitTransition': 'webkitTransitionEnd',
    'msTransition': 'MSTransitionEnd'
  },
  _test_div: document.createElement('div'),
  _last_html_overflow: false,
  _last_html_margin_right: false
};

function getVendorPropertyName(prop) {
  if (prop in _static._test_div.style) return prop;
  var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
  var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

  for (var i = 0; i < prefixes.length; ++i) {
    var vendorProp = prefixes[i] + prop_;

    if (vendorProp in _static._test_div.style) {
      return vendorProp;
    }
  }
}

_static._support.transition = getVendorPropertyName('transition');
_static._support.transform = getVendorPropertyName('transform');
_static._support.transform_origin = getVendorPropertyName('transformOrigin');
_static._support.transition_end = _static._transition_end_event_names[_static._support.transition] || null;

_static._support.transform3d = function () {
  var el = document.createElement('p'),
      has3d,
      transforms = {
    'webkitTransform': '-webkit-transform',
    'OTransform': '-o-transform',
    'msTransform': '-ms-transform',
    'MozTransform': '-moz-transform',
    'transform': 'transform'
  }; // Add it to the body to get the computed style

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
  return has3d !== undefined && has3d.length > 0 && has3d !== "none";
}();

_static._test_div = null;

_static.param = function (parameter, _default) {
  return typeof parameter !== 'undefined' ? parameter : _default;
};

_static.regexEscape = function (string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

_static.isSet = function (value) {
  return typeof value !== "undefined";
};

_static.isFunction = function (func) {
  return typeof func === "function";
};

_static.isPlainObject = function (obj) {
  return _typeof(obj) === "object" && obj != null && !(obj instanceof Array);
};

_static.isArray = function (arr) {
  return _typeof(arr) === "object" && arr instanceof Array;
};

_static.isNumber = function (number, required) {
  return typeof number === "number" && (!_static.param(required, false) || number > 0);
};

_static.isString = function (string, required) {
  return typeof string === "string" && (!_static.param(required, false) || string !== '');
};

_static.getAttributeString = function ($object, attr) {
  var val = $object.attr(attr);
  return typeof val === 'undefined' || val === false || val === '' ? '' : val;
};

_static.indexOf = function (value, array, strict) {
  strict = strict || false;

  if (array instanceof Array) {
    for (var i = 0; i < array.length; i++) {
      if (strict) {
        if (array[i] === value) {
          return i;
        }
      } else if (array[i] == value) {
        return i;
      }
    }
  }

  return -1;
};

_static.trim = function (string) {
  return _static.isString(string) ? string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : string;
};

_static.getInlineStyle = function ($object, style) {
  var full_inline_style = _static.getAttributeString($object, 'style');

  if (style && full_inline_style) {
    var r = new RegExp('(^|;)\\s*' + _static.regexEscape(style) + '\\s*:');

    if (full_inline_style.match(r)) {
      return $object.css(style);
    }
  }

  return '';
};

_static.splitOutside = function (delimiter, string, container_start, container_end) {
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

  for (var i = 0; i < parts.length; i++) {
    var part_handled = false;

    for (var j = 0; j < container_start.length; j++) {
      container_start_i = container_start[j];
      container_end_i = container_end[current];
      var container_start_ie = container_start_i.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
          container_end_ie = container_end_i.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'),
          start_match = parts[i].match(new RegExp('[' + container_start_ie + '][^' + container_end_ie + ']*')),
          end_match = parts[i].match(new RegExp('[^' + container_start_ie + ']*[' + container_end_ie + ']'));

      if (inside !== false) {
        if (j === current) {
          inside += parts[i];

          if (end_match) {
            results.push(inside);
            inside = false;
          } else {
            inside += delimiter;
          }

          part_handled = true;
        }
      } else if (start_match) {
        inside = parts[i] + delimiter;
        current = j < container_end.length ? j : 0;
        part_handled = true;
      }
    }

    if (!part_handled) {
      results.push(parts[i]);
    }
  }

  return results;
};

_static.elementPaddingWidth = function ($object, include_margin) {
  return $object && $object.length ? $object.outerWidth(!!_static.param(include_margin, false)) - $object.width() : 0;
};

_static.elementPaddingHeight = function ($object, include_margin) {
  return $object && $object.length ? $object.outerHeight(!!_static.param(include_margin, false)) - $object.height() : 0;
};

_static.transition = function ($object, properties, duration, easing, complete, name) {
  properties = _static.param(properties, {});
  duration = _static.param(duration, _static._speeds._default);
  easing = _static.param(easing, _static._eases._default);
  name = _static.isString(name, true) ? name : false;
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
        transitions.push(property + ' ' + duration + 'ms ' + easing); // round number values to 1 decimal place for comparison

        var cur_property_val = $object.css(property),
            new_property_val = properties[property],
            size_properties = ['width', 'height', 'top', 'right', 'bottom', 'left'];

        if (_static.isString(cur_property_val, true)) {
          cur_property_val = cur_property_val.trim();

          if (cur_property_val.match(/^[0-9]+(?:\.[0-9]+)?\s*.{0,4}$/)) {
            cur_property_val = parseFloat(cur_property_val);
          }
        }

        if (_static.isString(new_property_val, true)) {
          new_property_val = new_property_val.trim();

          if (new_property_val.match(/^[0-9]+(?:\.[0-9]+)?\s*.{0,4}$/)) {
            new_property_val = parseFloat(new_property_val);
          }
        }

        if (_static.isNumber(cur_property_val, true)) {
          cur_property_val = Math.ceil(cur_property_val * (_static.indexOf(property, size_properties) > -1 ? 1 : 100));
        }

        if (_static.isNumber(new_property_val, true)) {
          new_property_val = Math.ceil(new_property_val * (_static.indexOf(property, size_properties) > -1 ? 1 : 100));
        }

        if (_static.isNumber(cur_property_val) && _static.isNumber(new_property_val)) {
          if (cur_property_val - new_property_val > 1 || new_property_val - cur_property_val > 1) {
            property_difference = true;
          }
        } else if (cur_property_val !== new_property_val) {
          property_difference = true;
        }
      }
    }

    var existing_transitions = _static.splitOutside(',', $object.css('transition'), '(', ')');

    for (var j = 0; j < existing_transitions.length; j++) {
      var existing_transition = _static.trim(existing_transitions[j]),
          existing_update = false;

      if (existing_transition && !existing_transition.match(/all 0(?:\.[0]+)?[^0-9]/)) {
        for (property in properties) {
          if (properties.hasOwnProperty(property)) {
            if (_static.isString(property, true) && existing_transitions[j].match(new RegExp(_static.regexEscape(property)))) {
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
      $object.off('.popbox_auto_transition_end'); // add function to list

      _static.transitionAddCallback($object, complete, name); // if the event final is the same as the creator, FOR SPARTA


      $object.css('transition', transitions.join(', '));
      $object.css(properties).addClass('popbox-animating');
      $object.data('popbox-transition-id', this_transition_id);
      setTimeout(function () {
        var lazy_timeout_catchup = false;

        var transition_end = function transition_end() {
          if ($object.data('popbox-transition-id') === this_transition_id) {
            if (lazy_timeout_catchup !== false) {
              clearTimeout(lazy_timeout_catchup);
              lazy_timeout_catchup = false;
            }

            $object.off('.popbox_auto_transition_end');
            $object.css('transition', '').removeClass('popbox-animating');
            var live_functions = $object.data('popbox-transition-end-functions');

            if (live_functions) {
              live_functions = external_jQuery_default().extend({}, live_functions);
              $object.data('popbox-transition-id', false);

              _static.clearTransition($object);
            }

            if (live_functions) {
              for (var functions_name in live_functions) {
                if (live_functions.hasOwnProperty(functions_name)) {
                  for (var i = 0; i < live_functions[functions_name].length; i++) {
                    if (_static.isFunction(live_functions[functions_name][i])) live_functions[functions_name][i]();
                  }
                }
              }
            }
          }
        }; // standard event


        $object.off('.popbox_auto_transition_end').on(_static._support.transition_end + '.popbox_auto_transition_end', function (e) {
          e.stopPropagation();
          transition_end();
        }); // fallback check

        lazy_timeout_catchup = setTimeout(function () {
          lazy_timeout_catchup = false;
          transition_end();
        }, duration + 50);
      }, 0);
      transitioning = true;
    }
  }

  if (!transitioning) {
    $object.css(properties);

    if (already_animating) {
      // add function to list
      _static.transitionAddCallback($object, complete, name);
    } else {
      if (_static.isFunction(complete)) {
        setTimeout(function () {
          complete();
        }, 0);
      }
    }
  }
};

_static.transitionAddCallback = function ($object, callback, name) {
  name = _static.isString(name, true) ? name : '_default';

  if ($object.length && _static.isFunction(callback)) {
    var pre = $object.data('popbox-transition-end-functions');

    if (pre && pre[name]) {
      pre[name].push(callback);
    } else if (pre) {
      pre[name] = [callback];
    } else {
      pre = {};
      pre[name] = [callback];
    }

    $object.data('popbox-transition-end-functions', pre);
  }
};

_static.clearTransition = function ($object, name) {
  name = _static.isString(name, true) ? name : false;

  if (name) {
    var pre = $object.data('popbox-transition-end-functions');

    if (pre && pre[name]) {
      delete pre[name];
      $object.data('popbox-transition-end-functions', pre);
    }
  } else {
    $object.data('popbox-transition-end-functions', false);
  }
};

_static.getTrueWidth = function ($object) {
  return $object && $object.length ? $object.get(0).getBoundingClientRect().right - $object.get(0).getBoundingClientRect().left : 0; // support for IE8
  //return ($object && $object.length) ? $object.get(0).getBoundingClientRect().width : 0;
};

_static.getTrueHeight = function ($object) {
  return $object && $object.length ? $object.get(0).getBoundingClientRect().bottom - $object.get(0).getBoundingClientRect().top : 0; // support for IE8
  //return ($object && $object.length) ? $object.get(0).getBoundingClientRect().height : 0;
};

_static.isAbsolutePositioned = function ($element, $relativeToElement) {
  if (['absolute', 'fixed'].indexOf(window.getComputedStyle($element.get(0)).position) >= 0) {
    return true;
  }

  var $parent = $element;

  do {
    $parent = $parent.parent();

    if (!$parent || !$parent.length || $relativeToElement && $relativeToElement.length && $parent.get(0) === $relativeToElement.get(0)) {
      return false;
    }

    if (['absolute', 'fixed'].indexOf(window.getComputedStyle($parent.get(0)).position) >= 0) {
      return true;
    }
  } while (true);
};

_static.offTouchClick = function ($object) {
  if ($object.length) {
    $object.off('.Popbox_touch_click');
  }
};

_static.onTouchClick = function ($object, selector, handler, prevent_default) {
  if ($object.length) {
    var touch_click_namespace = 'Popbox_touch_click';

    if (prevent_default) {
      $object.on('click.' + touch_click_namespace, function (e) {
        e.preventDefault();
      });
    }

    $object.on('mousedown.' + touch_click_namespace + ' touchstart.' + touch_click_namespace, selector, function (e) {
      if (e.originalEvent.touches || e.which === 1) {
        var $subobject = external_jQuery_default()(this); //if (prevent_default) e.preventDefault();

        $subobject.off('mouseup.' + touch_click_namespace + ' touchend.' + touch_click_namespace).on('mouseup.' + touch_click_namespace + ' touchend.' + touch_click_namespace, function (e2) {
          if (e.originalEvent.touches || e.which === 1) {
            if (prevent_default) e2.preventDefault();
            if (_static.isFunction(handler)) handler.call(this, e2);
          }
        });
      }
    });
  }
};

_static.isAnyInstanceOpen = function () {
  var any_open_popbox = false;

  for (var i in _static._instances) {
    if (_static._instances.hasOwnProperty(i)) {
      var v = _static._instances[i];

      if (v && v.isOpen && v.isOpen()) {
        any_open_popbox = true;
        break;
      }
    }
  }

  return any_open_popbox;
};

_static.addHidePageScroll = function (hide_scroll_space) {
  if (_static.$html.hasClass('popbox-hide-page-scroll')) {
    return;
  }

  var old_body_width = _static.$body.width();

  if (_static._last_html_overflow === false) {
    _static._last_html_overflow = _static.getInlineStyle(_static.$html, 'overflow');
  }

  var fix_scroll_top = _static.$window.scrollTop(); // chrome visual disturbance bug


  _static.$html.css('overflow', 'hidden');

  var new_body_width = _static.$body.width();

  if (hide_scroll_space) {
    if (_static._last_html_margin_right === false) {
      _static._last_html_margin_right = _static.getInlineStyle(_static.$html, 'margin-right');
    }

    if (new_body_width > old_body_width) {
      _static.$html.css('margin-right', new_body_width - old_body_width + 'px');
    }
  }

  _static.$window.scrollTop(fix_scroll_top);

  _static.$html.addClass('popbox-hide-page-scroll');
};

_static.removeHidePageScroll = function () {
  if (!_static.$html.hasClass('popbox-hide-page-scroll')) {
    return;
  }

  var any_open_popbox_hide_page_scroll = false,
      any_open_popbox_hide_page_margin = false;

  for (var i in _static._instances) {
    if (_static._instances.hasOwnProperty(i)) {
      var v = _static._instances[i];

      if (v && v.isOpen && v.isOpen() && v.elements.$popbox.css('position') !== 'absolute') {
        any_open_popbox_hide_page_scroll = v.settings.hide_page_scroll;
        any_open_popbox_hide_page_margin = v.settings.hide_page_scroll_space;
      }
    }
  }

  if (!any_open_popbox_hide_page_scroll) {
    if (_static._last_html_overflow !== false) _static.$html.css('overflow', _static._last_html_overflow);
    _static._last_html_overflow = false;
  }

  if (!any_open_popbox_hide_page_margin) {
    if (_static._last_html_margin_right !== false) _static.$html.css('margin-right', _static._last_html_margin_right);
    _static._last_html_margin_right = false;
  }

  if (!any_open_popbox_hide_page_scroll) {
    _static.$html.removeClass('popbox-hide-page-scroll');
  }
};
;// CONCATENATED MODULE: ./src/modules/private.js
function private_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { private_typeof = function _typeof(obj) { return typeof obj; }; } else { private_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return private_typeof(obj); }



var _private = function _private(core_self) {
  this.self = core_self;
};

_private.prototype.reset = function () {
  var self = this.self;

  self._private.triggerHook('reset');

  self.trigger('reset');

  if (self.properties.disable_background_click_timer !== false) {
    clearTimeout(self.properties.disable_background_click_timer);
  }

  self.properties = {
    is_open: false,
    is_loading: false,
    is_changing_state: false,
    disable_background_click: false,
    disable_background_click_timer: false,
    last_html_overflow: false,
    last_html_margin_right: false,
    instance_id: self.properties.instance_id,
    events: self.properties.events,
    cache: {
      images: {},
      interface_images_pending: 0,
      content_images_pending: 0,
      window_width: -1
    }
  };
  self.elements = {
    $popbox: null,
    $popbox_loading: null,
    $popbox_popup: null,
    $popbox_empty: null,
    $popbox_wrapper: null,
    $popbox_container: null,
    $popbox_title: null,
    $popbox_close: null,
    $popbox_content: null,
    $popbox_overlay: self.elements.$popbox_overlay // not part of individual popbox

  };

  self._private.triggerHook('after_reset');

  self.trigger('after_reset');
};

_private.prototype.createOverlay = function () {
  var self = this.self;
  var $container = self.settings.container ? external_jQuery_default()(self.settings.container) : _static.$body,
      $existing_popbox_overlay = $container.children('.popbox-overlay');

  if ($existing_popbox_overlay.length) {
    self.elements.$popbox_overlay = $existing_popbox_overlay;
  } else {
    self.elements.$popbox_overlay = external_jQuery_default()('<div/>', {
      'class': 'popbox-overlay',
      'css': {
        'display': 'none',
        'position': 'fixed',
        'top': '0',
        'right': '0',
        'bottom': '0',
        'left': '0'
      }
    }).data('is_open', false).appendTo($container);
  }

  self.elements.$popbox_overlay.html(self.settings.overlay_text); // you shouldn't be able to use this unless there is a problem. the empty for each popbox is used first.

  self.elements.$popbox_overlay.off('click.popbox_overlay_close').on('click.popbox_overlay_close', function (e) {
    e.preventDefault();

    for (var i in _static._instances) {
      if (_static._instances.hasOwnProperty(i)) {
        if (_static._instances[i] instanceof self.constructor && _static._instances[i].isOpen()) {
          _static._instances[i].close();
        }
      }
    }

    self._private.closeOverlay(true);
  });
};

_private.prototype.destroyOverlay = function () {
  var self = this.self;

  if (_static._instances.length <= 0 && self.elements.$popbox_overlay) {
    self.elements.$popbox_overlay.remove();
    self.elements.$popbox_overlay = null;
  }
};

_private.prototype.openOverlay = function () {
  var self = this.self;

  if (!self.elements.$popbox_overlay) {
    self._private.createOverlay();
  }

  if (self.elements.$popbox_overlay.data('is_open') === false) {
    self.elements.$popbox_overlay.css({
      'display': 'block',
      'opacity': '0'
    });

    _static.clearTransition(self.elements.$popbox_overlay);

    _static.transition(self.elements.$popbox_overlay, {
      'opacity': '1'
    }, self._private.getOverlayAnimationSpeed('open'), self._private.getOverlayAnimationEase('open'));

    self.elements.$popbox_overlay.data('is_open', true);
  }
};

_private.prototype.closeOverlay = function (force) {
  var self = this.self; // run this function after marking popboxes as closed, it checks to see if there are any popboxes open, use force to bypass it

  if (self.elements.$popbox_overlay) {
    if (!force && _static.isAnyInstanceOpen()) {
      return;
    }

    if (self.elements.$popbox_overlay.data('is_open') === true) {
      _static.clearTransition(self.elements.$popbox_overlay);

      _static.transition(self.elements.$popbox_overlay, {
        'opacity': '0'
      }, self._private.getOverlayAnimationSpeed('close'), self._private.getOverlayAnimationEase('close'), function () {
        if (self.elements.$popbox_overlay) {
          self.elements.$popbox_overlay.css({
            'display': 'none'
          });
        }

        self._private.destroyOverlay();
      });

      self.elements.$popbox_overlay.data('is_open', false);
    } else if (!self.elements.$popbox_overlay.hasClass('popbox-animating')) {
      self._private.destroyOverlay();
    }
  }
};

_private.prototype.getAnimationStartProperties = function (type) {
  var self = this.self;
  return _static.isSet(self.animations[self.settings.animation]) ? self.animations[self.settings.animation][type][0] : self.animations['fade'][type][0];
};

_private.prototype.getAnimationEndProperties = function (type) {
  var self = this.self;
  return _static.isSet(self.animations[self.settings.animation]) ? self.animations[self.settings.animation][type][self.animations[self.settings.animation][type].length - 1] : self.animations['fade'][type][self.animations['fade'][type].length - 1];
};

_private.prototype.getAnimationSpeed = function (type) {
  var self = this.self;
  return self.settings[type + '_animation_speed'] || self.settings.animation_speed || _static._speeds._default;
};

_private.prototype.getAnimationEase = function (type) {
  var self = this.self;
  return self.settings[type + '_animation_ease'] || self.settings.animation_ease || _static._eases._default;
};

_private.prototype.getOverlayAnimationSpeed = function (type) {
  var self = this.self;
  if (self.settings[type + '_overlay_animation_speed'] === true) return self._private.getAnimationSpeed(type);
  return self.settings[type + '_overlay_animation_speed'] || self.settings.overlay_animation_speed || self._private.getAnimationSpeed(type);
};

_private.prototype.getOverlayAnimationEase = function (type) {
  var self = this.self;
  if (self.settings[type + '_overlay_animation_ease'] === true) return self._private.getAnimationEase(type);
  return self.settings[type + '_overlay_animation_ease'] || self.settings.overlay_animation_ease || self._private.getAnimationEase(type);
};

_private.prototype.checkImagesLoaded = function () {
  var self = this.self;

  if (self.isCreated()) {
    self.properties.cache.content_images_pending = 0;
    self.properties.cache.interface_images_pending = 0;
    var $images = self.elements.$popbox.find('img');
    $images.each(function () {
      var image = this,
          $image = external_jQuery_default()(this);

      if (image.src) {
        var image_ready = image.complete && _static.isNumber(image.naturalWidth, false) || image.readyState === 4 || image.readyState === 'complete';

        if (!image_ready) {
          self.properties.cache.images[image.src] = {
            origin: image,
            $origin: $image,
            proxy: false,
            loaded: false,
            type: $image.closest(self.elements.$popbox_content).length > 0 ? 'content' : 'interface'
          };
        }
      }
    });

    var proxy_image_event = function proxy_image_event(type) {
      if (type === 'content') {
        self.properties.cache.content_images_pending--;

        if (self.properties.cache.content_images_pending <= 0) {
          self.properties.cache.content_images_pending = 0;
          if (self.isChangingState() && self.elements.$popbox_popup.hasClass('popbox-animating')) _static.transitionAddCallback(self.elements.$popbox_popup, function () {
            self.adjust(true);
          });else self.adjust(true);
        }
      } else {
        self.properties.cache.interface_images_pending--;

        if (self.properties.cache.interface_images_pending <= 0) {
          self.properties.cache.interface_images_pending = 0; //if (self.isLoading()) self.adjust(true);
        }
      }
    };

    for (var image_cache_src in self.properties.cache.images) {
      if (self.properties.cache.images.hasOwnProperty(image_cache_src)) {
        if (!self.properties.cache.images[image_cache_src].proxy) {
          (function (image_cache_src) {
            var proxy_image = new Image();

            if (self.properties.cache.images[image_cache_src].type === 'content') {
              self.properties.cache.content_images_pending++;
            } else {
              self.properties.cache.interface_images_pending++;
            }

            self.properties.cache.images[image_cache_src].proxy = proxy_image;

            proxy_image.onload = function () {
              if (!self.properties.cache.images[image_cache_src].loaded) {
                self.properties.cache.images[image_cache_src].loaded = true;
                proxy_image_event(self.properties.cache.images[image_cache_src].type);

                self._private.triggerHook('image_load', [image_cache_src]);

                self.trigger('image_load', false, [image_cache_src]);
              }
            };

            proxy_image.onerror = function () {
              if (!self.properties.cache.images[image_cache_src].loaded) {
                self.properties.cache.images[image_cache_src].loaded = true;
                proxy_image_event(self.properties.cache.images[image_cache_src].type);

                self._private.triggerHook('image_error', [image_cache_src]);

                self.trigger('image_error', false, [image_cache_src]);
              }
            };

            proxy_image.src = image_cache_src;
          })(image_cache_src);
        } else if (!self.properties.cache.images[image_cache_src].loaded) {
          if (self.properties.cache.images[image_cache_src].type === 'content') {
            self.properties.cache.content_images_pending++;
          } else {
            self.properties.cache.interface_images_pending++;
          }
        }
      }
    }

    if (self.properties.cache.content_images_pending === 0 && self.properties.cache.interface_images_pending === 0) {
      return true;
    }
  }

  return false;
};

_private.prototype.applySettings = function () {
  var self = this.self;

  var window_width = _static.$window.width(),
      responsive_width_keys = [],
      new_settings = external_jQuery_default().extend(true, {}, self.base_settings);

  if (window_width !== self.properties.cache.window_width) {
    if (private_typeof(self.base_settings.responsive) === "object") {
      for (var responsive_key in self.base_settings.responsive) {
        if (self.base_settings.responsive.hasOwnProperty(responsive_key)) {
          responsive_width_keys.push(responsive_key);
        }
      }
    }

    if (responsive_width_keys.length) {
      responsive_width_keys.sort(function (a, b) {
        return a - b;
      });

      for (var i = responsive_width_keys.length; i >= 0; i--) {
        if (window_width > parseInt(responsive_width_keys[i], 10)) {
          external_jQuery_default().extend(true, new_settings, self.base_settings.responsive[responsive_width_keys[i]]);
          break;
        }
      }

      self.settings = new_settings;

      self._private.applyDomSettings();
    } else {
      self.settings = new_settings;
    }

    self.properties.cache.window_width = window_width;
  } else {
    self.settings = new_settings;
  }
};

_private.prototype.applyDomSettings = function () {
  var self = this.self;

  if (self.isCreated()) {
    self._private.triggerHook('update_dom');

    self.trigger('update_dom');
    self.elements.$popbox.attr('class', '').addClass('popbox');

    if (self.settings.loading_text !== self.elements.$popbox_loading.html()) {
      self.elements.$popbox_loading.html(self.settings.loading_text);
    }

    self.elements.$popbox_close.html(self.settings.close_text);
    self.elements.$popbox_overlay.html(self.settings.overlay_text);
    self.elements.$popbox_title.html(self.settings.title);

    if (_static.isFunction(self.settings.content.appendTo)) {
      self.elements.$popbox_content.html('');
      self.settings.content.appendTo(self.elements.$popbox_content);
    } else {
      self.elements.$popbox_content.html(self.settings.content);
    }

    if (_static.isString(self.settings.add_class, true)) {
      self.elements.$popbox.addClass(self.settings.add_class);
    }

    if (self.settings.fit) self.elements.$popbox.addClass('popbox-fit');else self.elements.$popbox.removeClass('popbox-fit'); // checks

    if (self.settings.close_text === false) self.elements.$popbox_close.css('display', 'none');else self.elements.$popbox_close.css('display', 'block');
    if (self.settings.title === false) self.elements.$popbox_title.css('display', 'none');else self.elements.$popbox_title.css('display', 'block');

    if (_static.isNumber(self.settings.z_index, true)) {
      self.elements.$popbox_overlay.css('z-index', self.settings.z_index);
      self.elements.$popbox.css('z-index', self.settings.z_index + 1);
      self.elements.$popbox_popup.css('z-index', self.settings.z_index + 2);
    }

    var user_agent_checks = {
      'mobile': navigator.userAgent.match(/(iPad|iPhone|iPod|Android)/g),
      'ios': navigator.userAgent.match(/(iPad|iPhone|iPod)/g),
      'android': navigator.userAgent.match(/(Android)/g)
    };

    if (self.settings.absolute === true || _static.isString(self.settings.absolute) && user_agent_checks[self.settings.absolute]) {
      self.elements.$popbox.css({
        'position': 'absolute',
        'overflow-y': 'visible',
        'overflow-x': 'visible'
      });
    } else {
      self.elements.$popbox.css({
        'position': 'fixed',
        'overflow-y': 'scroll',
        'overflow-x': 'hidden'
      });
    }

    self._private.triggerHook('after_update_dom');

    self.trigger('after_update_dom');
  }
};

_private.prototype.triggerHook = function (name, params) {
  var self = this.self;
  params = _static.isArray(params) ? params : [];

  if (_static.isPlainObject(self.hooks) && _static.isArray(self.hooks[name])) {
    for (var i = 0; i < self.hooks[name].length; i++) {
      if (_static.isFunction(self.hooks[name][i])) {
        self.hooks[name][i].apply(self, params);
      }
    }
  }
};
;// CONCATENATED MODULE: ./src/constants/default-settings.js

var _default_settings = {
  width: false,
  // number = pixels to set, anything else is ignored
  height: false,
  // number = pixels to set, anything else is ignored
  min_width: 100,
  // false = none, true = 100%, number = pixels
  min_height: 100,
  // false = none, true = 100%, number = pixels
  max_width: false,
  // false|true = 100%, number = pixels
  max_height: false,
  // false = none, true = 100%. if set, scroll inner is used
  container: false,
  //specify an alternate container to body
  animation: 'fade',
  animation_speed: _static._speeds._default,
  animation_ease: _static._eases._default,
  open_animation: null,
  open_animation_speed: null,
  open_animation_ease: null,
  close_animation: null,
  close_animation_speed: null,
  close_animation_ease: null,
  overlay_animation_speed: null,
  // set to true to match the relevant popup animation speed
  overlay_animation_ease: null,
  open_overlay_animation_speed: null,
  open_overlay_animation_ease: null,
  close_overlay_animation_speed: null,
  close_overlay_animation_ease: null,
  content: '',
  title: false,
  close_text: 'X',
  overlay_text: '',
  loading_text: 'Loading',
  hide_page_scroll: true,
  hide_page_scroll_space: true,
  content_additional_offset: false,
  // number in pixels, string for jquery selector, array of strings for multiple jquery selectors to check
  absolute: 'mobile',
  add_class: '',
  // supports multiple space separated classes
  fit: false,
  // false|true|'round' recommended for images and iframes - not for content
  cache: false,
  wait_for_images: true,
  width_margin: 0.1,
  height_margin: 0.08,
  z_index: 99900,
  // should be a number greater than 0, otherwise z-index will not be set at all.
  mode: false,
  //normal, can be 'gallery' if extension is available
  open: false,
  after_open: false,
  close: false,
  after_close: false,
  responsive: {}
};
;// CONCATENATED MODULE: ./src/modules/core.js




var core_core = function _core(settings) {
  var self = this;
  self._private = new _private(self);

  self._private.triggerHook('initialize', [settings]);

  self.base_settings = external_jQuery_default().extend(true, {}, self.default_settings, _static.param(settings, {})); //self.settings = {};
  //defaults for pass through values

  self.properties = {
    instance_id: _static._next_instance_id,
    events: {},
    cache: {}
  };
  self.elements = {
    $popbox_overlay: null
  };

  self._private.applySettings();

  self._private.reset();

  _static._next_instance_id++;
  self.trigger('initialize', false, [settings]);

  self._private.triggerHook('after_initialize', [settings]);

  self.trigger('after_initialize', false, [settings]);
};
core_core.prototype.version = "3.1.6";
core_core.prototype.plugins = {};
core_core.prototype.default_settings = _default_settings;
core_core.prototype._static = _static;
core_core.prototype.animations = {
  'fade': {
    'open': [{
      'opacity': '0'
    }, {
      'opacity': '1'
    }],
    'close': [{
      'opacity': '1'
    }, {
      'opacity': '0'
    }]
  }
};
core_core.prototype.hooks = {};

core_core.prototype.addHook = function (hook, handler) {
  if (!_static.isArray(core_core.prototype.hooks[hook])) core_core.prototype.hooks[hook] = [];

  core_core.prototype.hooks[hook].push(handler);
};

core_core.prototype.create = function () {
  var self = this;
  self.destroy();

  self._private.triggerHook('create');

  self._private.createOverlay();

  var $container = self.settings.container ? external_jQuery_default()(self.settings.container) : _static.$body;
  self.elements.$popbox = external_jQuery_default()('<div/>', {
    'class': 'popbox',
    'css': {
      'display': 'none',
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'top': '0px',
      'left': '0px',
      'overflow-y': 'scroll',
      'overflow-x': 'hidden'
    }
  });
  self.elements.$popbox_empty = external_jQuery_default()('<div/>', {
    'class': 'popbox-empty',
    'css': {
      'display': 'block',
      'position': 'absolute',
      'top': '0',
      'left': '0',
      'width': '100%',
      'height': '100%'
    }
  }).appendTo(self.elements.$popbox);
  self.elements.$popbox_popup = external_jQuery_default()('<div/>', {
    'class': 'popbox-popup',
    'css': {
      'display': 'none',
      'position': 'absolute',
      'top': '50%',
      'left': '50%',
      'bottom': 'auto',
      'right': 'auto',
      'width': '0px',
      'height': '0px'
    }
  }).appendTo(self.elements.$popbox);
  self.elements.$popbox_loading = external_jQuery_default()('<div/>', {
    'class': 'popbox-loading',
    'css': {
      'display': 'none'
    }
  }).appendTo(self.elements.$popbox_popup);
  self.elements.$popbox_wrapper = external_jQuery_default()('<div/>', {
    'class': 'popbox-wrapper'
  }).appendTo(self.elements.$popbox_popup);
  self.elements.$popbox_container = external_jQuery_default()('<div/>', {
    'class': 'popbox-container'
  }).appendTo(self.elements.$popbox_wrapper);
  self.elements.$popbox_title = external_jQuery_default()('<div/>', {
    'class': 'popbox-title'
  }).appendTo(self.elements.$popbox_container);
  self.elements.$popbox_content = external_jQuery_default()('<div/>', {
    'class': 'popbox-content'
  }).appendTo(self.elements.$popbox_container);
  self.elements.$popbox_close = external_jQuery_default()('<a/>', {
    'class': 'popbox-close',
    'href': 'javascript:void(0);'
  }).appendTo(self.elements.$popbox_popup);

  self._private.applyDomSettings(); // events


  var _close_namespace = _static._event_namespace + 'Close';

  self.elements.$popbox.off('click.' + _close_namespace).on('click.' + _close_namespace, '.popbox-close,.close-popbox', function (e) {
    e.preventDefault();
    self.close();
  });

  var _complex_close_start_namespace = _static._event_namespace + 'ComplexCloseStart',
      _complex_close_namespace = _static._event_namespace + 'ComplexClose';

  self.elements.$popbox.on('mousedown.' + _complex_close_start_namespace + ' touchstart.' + _complex_close_start_namespace, function (e1) {
    var e1pageX = e1.originalEvent.touches && e1.originalEvent.touches[0] ? e1.originalEvent.touches[0].pageX : e1.pageX,
        e1pageY = e1.originalEvent.touches && e1.originalEvent.touches[0] ? e1.originalEvent.touches[0].pageY : e1.pageY;

    if ((e1.originalEvent.touches || e1.which === 1) && external_jQuery_default()(e1.target).closest('.popbox-popup').length === 0 && e1pageX < self.elements.$popbox_empty.width()) {
      self.elements.$popbox.off('.' + _complex_close_namespace);
      self.elements.$popbox.on('mouseup.' + _complex_close_namespace + ' touchend.' + _complex_close_namespace, function (e2) {
        if (e2.originalEvent.touches || e2.which === 1) {
          self.elements.$popbox.off('.' + _complex_close_namespace);

          if (!self.properties.disable_background_click && e1.target === e2.target && external_jQuery_default()(e2.target).closest('.popbox-popup').length === 0) {
            e2.preventDefault();
            self.close();
            return false;
          }
        }
      });
      self.elements.$popbox.on('mousemove.' + _complex_close_namespace + ' touchmove.' + _complex_close_namespace, function (e3) {
        // check limit box
        // TODO if the container can be changed to a div instead of body then this will need updating to support the offset of that div
        var e3pageX = e3.originalEvent.touches && e3.originalEvent.touches[0] ? e3.originalEvent.touches[0].pageX : e3.pageX,
            e3pageY = e3.originalEvent.touches && e3.originalEvent.touches[0] ? e3.originalEvent.touches[0].pageY : e3.pageY;

        if (e3pageX < e1pageX - 5 || e3pageX > e1pageX + 5 || e3pageY < e1pageY - 5 || e3pageY > e1pageY + 5) {
          self.elements.$popbox.off('.' + _complex_close_namespace);
        }
      });
      self.elements.$popbox.on('scroll.' + _complex_close_namespace, function () {
        self.elements.$popbox.off('.' + _complex_close_namespace);
      });
    }
  });
  self.elements.$popbox.appendTo($container);
  _static._instances[self.properties.instance_id] = self;
  _static._instances.length++;

  self._private.triggerHook('after_create');
};

core_core.prototype.destroy = function () {
  var self = this;

  if (self.elements.$popbox) {
    self._private.triggerHook('destroy');

    self.elements.$popbox.remove();
    self.elements.$popbox = null;

    if (_static.isSet(_static._instances[self.properties.instance_id])) {
      delete _static._instances[self.properties.instance_id];
      _static._instances.length--;
    }

    self._private.closeOverlay();

    self._private.reset();

    self._private.triggerHook('after_destroy');
  }
};

core_core.prototype.update = function (settings, animate_adjust) {
  var self = this;
  animate_adjust = _static.param(animate_adjust, true);
  external_jQuery_default().extend(true, self.base_settings, _static.param(settings, {}));

  self._private.applySettings();

  if (self.isCreated()) {
    if (self.isOpen()) {
      if (animate_adjust) {
        self.showLoading(function () {
          self._private.applyDomSettings();

          self.adjust(true);
        });
      } else {
        self._private.applyDomSettings();

        self.adjust(false);
      }
    } else {
      self._private.applyDomSettings();
    }
  }
};

core_core.prototype.open = function () {
  var self = this;

  if (!self.isOpen()) {
    if (!self.elements.$popbox) {
      self.create();
    } else {
      self._private.applyDomSettings();
    }

    self._private.triggerHook('open');

    self.trigger('open');

    if (self.elements.$popbox.css('position') === 'absolute') {
      self.elements.$popbox.css('top', _static.$window.scrollTop() + 'px');
    } else {
      // html body scrollbar
      if (self.settings.hide_page_scroll) {
        _static.addHidePageScroll(self.settings.hide_page_scroll_space);
      }
    } // show elements


    self._private.openOverlay();

    self.elements.$popbox_popup.css({
      'display': 'block',
      'box-sizing': 'content-box'
    });
    self.elements.$popbox.css({
      'display': 'block',
      'box-sizing': 'content-box'
    });
    self.elements.$popbox_popup.css({
      'visibility': 'visible',
      'box-sizing': 'content-box'
    }); // is_loading should be false unless manually set it

    if (self.properties.is_loading) {
      self.showLoading();
    } else {
      self.showContent();
    } // adjust


    self.adjust(false); // prepare animation

    self.elements.$popbox_popup.css(self._private.getAnimationStartProperties('open'));

    _static.clearTransition(self.elements.$popbox_popup); // do animation


    self.properties.is_changing_state = true;

    _static.transition(self.elements.$popbox_popup, self._private.getAnimationEndProperties('open'), self._private.getAnimationSpeed('open'), self._private.getAnimationEase('open'), function () {
      self.properties.is_changing_state = false;
    });

    self.properties.is_open = true;

    if (self.elements.$popbox_popup.hasClass('popbox-animating')) {
      self.properties.disable_background_click = true;
      self.properties.disable_background_click_timer = setTimeout(function () {
        self.properties.disable_background_click = false;
        self.properties.disable_background_click_timer = false;

        self._private.triggerHook('ready');

        self.trigger('ready');
      }, self._private.getAnimationSpeed('open') + 200);
    }

    self._private.triggerHook('after_open');

    self.trigger('after_open');

    if (!self.elements.$popbox_popup.hasClass('popbox-animating')) {
      self._private.triggerHook('ready');

      self.trigger('ready');
    }
  }
};

core_core.prototype.close = function (destroy) {
  var self = this;

  if (self.isOpen()) {
    self._private.triggerHook('close');

    self.trigger('close');
    self.properties.is_open = false; // clear all animation functions (they can animate but do not trigger their complete function)

    for (var object_name in self.elements) {
      if (self.elements.hasOwnProperty(object_name) && self.elements[object_name].length) {
        _static.clearTransition(self.elements[object_name]);
      }
    } // prepare animation


    self.elements.$popbox_popup.css(self._private.getAnimationStartProperties('close'));
    self.properties.is_changing_state = true; // do animation

    _static.transition(self.elements.$popbox_popup, self._private.getAnimationEndProperties('close'), self._private.getAnimationSpeed('close'), self._private.getAnimationEase('close'), function () {
      self.properties.is_changing_state = false;
      self.elements.$popbox.css({
        'display': 'none'
      });

      _static.removeHidePageScroll();

      if (destroy || !self.settings.cache) {
        self.destroy();
      } else {
        self.elements.$popbox_popup.css(self._private.getAnimationEndProperties('open'));
        self.properties.disable_background_click = false;

        if (self.properties.disable_background_click_timer !== false) {
          clearTimeout(self.properties.disable_background_click_timer);
          self.properties.disable_background_click_timer = false;
        }
      }

      self._private.triggerHook('after_close');

      self.trigger('after_close');
    });

    self._private.closeOverlay();
  }
};

core_core.prototype.adjust = function (animate) {
  var self = this; // initiate another adjust when each image loads (use a 100ms wait in case images load in one after each other quickly)

  animate = _static.param(animate, true);

  if (self.isCreated()) {
    var adjust_elements = function adjust_elements(animate, show_content) {
      animate = _static.param(animate, false);
      show_content = _static.param(show_content, false);

      self._private.triggerHook('adjust');

      self.trigger('adjust');

      var window_width = self.elements.$popbox_empty.width(),
          //_static.$window.width(),
      window_height = _static.$window.height(),
          popbox_width_padding = _static.elementPaddingWidth(self.elements.$popbox_popup),
          popbox_height_padding = _static.elementPaddingHeight(self.elements.$popbox_popup),
          content_width_padding = _static.elementPaddingWidth(self.elements.$popbox_content, true),
          content_height_padding = _static.elementPaddingHeight(self.elements.$popbox_content, true),
          max_popbox_width = (self.settings.width_margin > 0 ? window_width - window_width * (self.settings.width_margin * 2) : window_width) - popbox_width_padding,
          max_popbox_height = (self.settings.height_margin > 0 ? window_height - window_height * (self.settings.height_margin * 2) : window_height) - popbox_height_padding,
          min_popbox_width = 0,
          min_popbox_height = 0,
          set_popbox_width = _static.isNumber(self.settings.width) ? self.settings.width + 'px' : 'auto',
          set_popbox_height = _static.isNumber(self.settings.height) ? self.settings.height + 'px' : 'auto',
          max_popbox_screen_height = max_popbox_height,
          new_popbox_width,
          new_popbox_height,
          new_popbox_top,
          new_popbox_left;

      if (_static.isNumber(self.settings.max_width, true) && max_popbox_width > self.settings.max_width) {
        max_popbox_width = self.settings.max_width;
      }

      if (_static.isNumber(self.settings.max_height, true) && max_popbox_height > self.settings.max_height) {
        max_popbox_height = self.settings.max_height;
      }

      if (_static.isNumber(self.settings.min_width, true) && min_popbox_width < self.settings.min_width) {
        min_popbox_width = self.settings.min_width;
      }

      if (_static.isNumber(self.settings.min_height, true) && min_popbox_height < self.settings.min_height) {
        min_popbox_height = self.settings.min_height;
      }

      self.elements.$popbox_content.css({
        'height': '',
        'overflow-y': '',
        'box-sizing': 'content-box'
      });
      self.elements.$popbox_wrapper.css({
        'position': 'relative',
        'top': '0px',
        'left': '0px',
        'width': self.settings.fit ? '99999px' : max_popbox_width + 'px',
        'height': self.settings.fit ? '99999px' : '1px',
        'overflow': 'hidden',
        'box-sizing': 'content-box'
      });
      self.elements.$popbox_container.css({
        'position': 'absolute',
        'top': '0px',
        'left': '0px',
        'width': set_popbox_width,
        'height': set_popbox_height,
        'min-width': self.settings.min_width === true ? '100%' : min_popbox_width + 'px',
        'min-height': self.settings.min_height === true ? '100%' : min_popbox_height + 'px',
        'max-width': '100%',
        'box-sizing': 'content-box'
      });
      var $f_img = self.elements.$popbox_content.find('.popbox-fit-image');

      if (!$f_img.length) {
        $f_img = false;

        if (!self.elements.$popbox_content.find('.popbox-fit-ignore-images').length) {
          self.elements.$popbox_content.find('img').each(function () {
            var $img = external_jQuery_default()(this);

            if (!$img.hasClass('popbox-fit-ignore-image') && !_static.isAbsolutePositioned($img, self.elements.$popbox_content)) {
              $f_img = $img;
              return false;
            }
          });
        }
      }

      if ($f_img) {
        $f_img.css('width', '');
      } // use true width to get overhang (stops text wrapping)


      new_popbox_width = Math.ceil(_static.getTrueWidth(self.elements.$popbox_container) * 100) / 100;
      new_popbox_height = Math.ceil(_static.getTrueHeight(self.elements.$popbox_container) * 100) / 100;

      var set_content_height = function set_content_height(scroll) {
        scroll = scroll || false; // deduct content padding and margin (when using content-box)

        var new_content_height = new_popbox_height - content_height_padding,
            content_additional_offset = self.settings.content_additional_offset; // deduct content offset top

        new_content_height -= self.elements.$popbox_content.offset().top - self.elements.$popbox_container.offset().top;

        if (_static.isNumber(content_additional_offset)) {
          new_content_height += content_additional_offset;
        } else {
          content_additional_offset = [content_additional_offset];
        }

        if (content_additional_offset instanceof Array) {
          for (var p = 0; p < content_additional_offset.length; p++) {
            if (_static.isString(content_additional_offset[p], true)) {
              var content_additional_offset_value = 0;
              external_jQuery_default()(content_additional_offset[p]).each(function () {
                var $content_additional_offset_item = external_jQuery_default()(this),
                    cur_value = $content_additional_offset_item.offset().top + $content_additional_offset_item.outerHeight(true) - (self.elements.$popbox_content.offset().top + self.elements.$popbox_content.outerHeight(true));

                if (cur_value > 0 && cur_value > content_additional_offset_value) {
                  content_additional_offset_value = cur_value;
                }
              });
            }
          }
        }

        self.elements.$popbox_content.css({
          'height': scroll ? Math.floor(new_content_height) + 'px' : new_content_height + 'px',
          'overflow-x': 'hidden',
          'overflow-y': scroll ? 'scroll' : 'hidden'
        });
      };

      if (self.settings.fit) {
        // fit for iframes and images
        var text_height = 0;

        var fitResize = function fitResize() {
          var image_height = new_popbox_height;

          if ($f_img) {
            image_height = _static.getTrueHeight($f_img);
          }

          text_height = new_popbox_height - image_height;

          if (new_popbox_width <= max_popbox_width && new_popbox_height <= max_popbox_height) {
            return;
          }

          var width_offset = content_width_padding;
          var height_offset = text_height + content_height_padding;
          var max_mod_width = max_popbox_width - width_offset;
          if (max_mod_width < 1) max_mod_width = 1;
          var max_mod_height = max_popbox_height - height_offset;
          if (max_mod_height < 1) max_mod_height = 1;
          var new_mod_width = new_popbox_width - width_offset;
          if (new_mod_width < 1) new_mod_width = 1;
          var new_mod_height = new_popbox_height - height_offset;
          if (new_mod_height < 1) new_mod_height = 1;
          var max_ratio = max_mod_height / max_mod_width,
              new_ratio = new_mod_height / new_mod_width;

          if (new_ratio > max_ratio) {
            new_popbox_width = new_mod_width * (max_mod_height / new_mod_height) + width_offset;
            new_popbox_height = max_popbox_height;
          } else {
            new_popbox_height = new_mod_height * (max_mod_width / new_mod_width) + height_offset;
            new_popbox_width = max_popbox_width;
          }
        };

        var fitTextResize = function fitTextResize() {
          var iteration = 0,
              switch_effort = false,
              container_height,
              overlap_height,
              current_image_height,
              next_image_width,
              stepped_popbox_width,
              last_changed_iteration,
              last_changed_img_height = 0,
              last_changed_width = 0,
              last_changed_height = 0;

          while (text_height > 0 && iteration < 10) {
            iteration++;
            container_height = Math.ceil(_static.getTrueHeight(self.elements.$popbox_container) * 100) / 100; // if the size has not changed, don't retry

            if (switch_effort && Math.round(container_height) <= Math.round(new_popbox_height + 1) && $f_img.height() / new_popbox_height > 0.5) {
              // increase the image height if possible
              overlap_height = new_popbox_height - container_height;
              current_image_height = $f_img.height();
              if (current_image_height < 1) current_image_height = 1;
              next_image_width = $f_img.width() * ((current_image_height + overlap_height) / current_image_height);
              if (next_image_width < 1) next_image_width = 1;
              $f_img.css('width', next_image_width + 'px');
              break;
            } else {
              if ($f_img) {
                $f_img.css('width', '');

                if (iteration === 1) {
                  new_popbox_width = $f_img.width() + content_width_padding; // image might not be ready, set min width

                  if (new_popbox_width < min_popbox_width) {
                    new_popbox_width = min_popbox_width;
                  }
                }
              }

              self.elements.$popbox_container.css({
                'width': new_popbox_width + 'px'
              });
            }

            container_height = Math.ceil(_static.getTrueHeight(self.elements.$popbox_container) * 100) / 100;

            if (Math.round(container_height) <= Math.round(new_popbox_height + 1)) {
              // text and image fits in space
              break;
            } else {
              if (switch_effort || new_popbox_width < 2 || $f_img && $f_img.height() / new_popbox_height < 0.6) {
                // try to shrink the image instead
                overlap_height = container_height - new_popbox_height;
                current_image_height = $f_img.height();
                if (current_image_height < 1) current_image_height = 1;
                next_image_width = $f_img.width() * ((current_image_height - overlap_height) / current_image_height);
                if (next_image_width < 1) next_image_width = 1;
                $f_img.css('width', next_image_width + 'px');
                stepped_popbox_width = max_popbox_width - max_popbox_width * ((10 - iteration) / 10);
                self.elements.$popbox_container.css({
                  'width': stepped_popbox_width + 'px'
                });
                new_popbox_width = stepped_popbox_width;
                switch_effort = true;
                var new_image_height = $f_img.height();

                if (last_changed_img_height !== new_image_height) {
                  last_changed_iteration = iteration;
                  last_changed_img_height = new_image_height;
                  last_changed_height = new_popbox_height;
                  last_changed_width = new_popbox_width;
                }

                if (iteration === 10 && last_changed_iteration < 10) {
                  new_popbox_width = last_changed_width;
                  new_popbox_height = last_changed_height;
                  break;
                }
              } else if (new_popbox_width < 0) {
                // something has probably gone wrong
                break;
              } else {
                new_popbox_height = container_height;
              }

              fitResize();
            }
          }
        };

        fitResize();

        if (text_height > 0) {
          fitTextResize();
        }

        if (self.settings.fit === 'round') {
          new_popbox_width = Math.round(new_popbox_width);
          new_popbox_height = Math.round(new_popbox_height);
        }

        var loading_width = _static.getTrueWidth(self.elements.$popbox_loading),
            loading_height = _static.getTrueHeight(self.elements.$popbox_loading);

        if (new_popbox_width < loading_width) {
          new_popbox_width = loading_width;
        }

        if (new_popbox_height < loading_height) {
          new_popbox_height = loading_height;
        }

        set_content_height(false);
      } else if ((self.settings.max_height === true || _static.isNumber(self.settings.max_height, true)) && new_popbox_height > max_popbox_height) {
        // apply inner overflow scroll
        new_popbox_height = max_popbox_height;
        set_content_height(true);
      } else {
        set_content_height(false);
      } // cleanup


      var cleanup = function cleanup() {
        self.elements.$popbox_wrapper.css({
          'position': '',
          'top': '',
          'left': '',
          'width': '',
          'height': '',
          'overflow': ''
        });
        self.elements.$popbox_container.css({
          'position': '',
          'top': '',
          'left': '',
          'width': '',
          'height': '',
          'min-width': '',
          'min-height': '',
          'max-width': ''
        });
      };

      new_popbox_left = (window_width - (new_popbox_width + popbox_width_padding)) / 2;
      new_popbox_top = (window_height - (new_popbox_height + popbox_height_padding)) / 2; // offset adjustment checks

      if (new_popbox_height > max_popbox_screen_height) {
        new_popbox_top = self.settings.height_margin > 0 ? window_height * self.settings.height_margin : 0;
      }

      if (animate) {
        _static.clearTransition(self.elements.$popbox_popup, 'adjust');

        _static.transition(self.elements.$popbox_empty, {
          'height': Math.floor(new_popbox_height + popbox_height_padding + new_popbox_top * 2 - 1) + 'px'
        }, _static._speeds.fast, _static._eases.easeInOutQuad);

        _static.transition(self.elements.$popbox_popup, {
          'width': new_popbox_width + 'px',
          'height': new_popbox_height + 'px',
          'top': new_popbox_top + 'px',
          'left': new_popbox_left + 'px'
        }, _static._speeds.fast, _static._eases.easeInOutQuad, function () {
          cleanup();
          if (show_content) self.showContent();

          self._private.triggerHook('after_adjust');

          self.trigger('after_adjust');
        }, 'adjust');
      } else {
        cleanup();
        self.elements.$popbox_popup.css({
          'width': new_popbox_width + 'px',
          'height': new_popbox_height + 'px',
          'top': new_popbox_top + 'px',
          'left': new_popbox_left + 'px'
        });
        self.elements.$popbox_empty.css({
          'height': Math.floor(new_popbox_height + popbox_height_padding + new_popbox_top * 2 - 1) + 'px'
        });
        if (show_content) self.showContent();

        self._private.triggerHook('after_adjust');

        self.trigger('after_adjust');
      }
    };

    self._private.checkImagesLoaded();

    if (self.settings.wait_for_images && self.properties.cache.content_images_pending > 0) {
      self.showLoading(function () {
        if (!animate) adjust_elements(animate, false);
      });
    } else if (!animate) {
      adjust_elements(false, self.properties.is_open);
    } else {
      self.showLoading(function () {
        adjust_elements(animate, true);
      });
    }
  }
};

core_core.prototype.showLoading = function (ready) {
  var self = this;

  if (self.isCreated()) {
    if (self.isOpen()) {
      if (self.isLoading()) {
        //TODO need to add the ability to take off transition events from transitioned elements
        if (_static.isFunction(ready)) ready();
        return;
      }

      _static.clearTransition(self.elements.$popbox_loading);

      _static.clearTransition(self.elements.$popbox_wrapper);

      _static.transition(self.elements.$popbox_wrapper, {
        'opacity': '0'
      }, _static._speeds.fast, 'linear', function () {
        self.elements.$popbox_wrapper.css({
          'visibility': 'hidden'
        });
        self.elements.$popbox_loading.css({
          'opacity': '0',
          'display': 'block'
        });

        _static.transition(self.elements.$popbox_loading, {
          'opacity': '1'
        }, _static._speeds.fast, 'linear', function () {
          if (_static.isFunction(ready)) ready();
        });
      });
    } else {
      self.elements.$popbox_wrapper.css({
        'opacity': '0',
        'visibility': 'hidden'
      });
      self.elements.$popbox_loading.css({
        'opacity': '1',
        'display': 'block'
      });
      if (_static.isFunction(ready)) ready();
    }
  } else {
    if (_static.isFunction(ready)) ready();
  }

  self.properties.is_loading = true;
};

core_core.prototype.showContent = function (ready) {
  var self = this;

  if (self.isCreated()) {
    if (self.isOpen()) {
      if (!self.isLoading()) {
        if (_static.isFunction(ready)) ready();
        return;
      }

      _static.clearTransition(self.elements.$popbox_loading);

      _static.clearTransition(self.elements.$popbox_wrapper);

      _static.transition(self.elements.$popbox_loading, {
        'opacity': '0'
      }, _static._speeds.fast, 'linear', function () {
        self.elements.$popbox_loading.css({
          'display': 'none'
        });
        self.elements.$popbox_wrapper.css({
          'opacity': '0',
          'visibility': 'visible'
        });

        _static.transition(self.elements.$popbox_wrapper, {
          'opacity': '1'
        }, _static._speeds.fast, 'linear', function () {
          if (_static.isFunction(ready)) ready();
        });
      });
    } else {
      self.elements.$popbox_loading.css({
        'display': 'none',
        'opacity': '0'
      });
      self.elements.$popbox_wrapper.css({
        'opacity': '1',
        'visibility': 'visible'
      });
      if (_static.isFunction(ready)) ready();
    }
  } else {
    if (_static.isFunction(ready)) ready();
  }

  self.properties.is_loading = false;
};

core_core.prototype.isLoading = function () {
  var self = this;
  return self.properties.is_loading;
};

core_core.prototype.isOpen = function () {
  var self = this;
  return self.properties.is_open;
};

core_core.prototype.isChangingState = function () {
  var self = this;
  return self.properties.is_changing_state;
};

core_core.prototype.isCreated = function () {
  var self = this;
  return !!self.elements.$popbox;
};

core_core.prototype.on = function (event, handler) {
  var self = this;
  var event_parts = event.split('.', 2);

  if (event_parts.length) {
    var event_type = event_parts[0],
        event_name = event_parts[1] ? event_parts[1] : '_default';
    if (!_static.isPlainObject(self.properties.events[event_type])) self.properties.events[event_type] = {};
    if (!_static.isArray(self.properties.events[event_type][event_name])) self.properties.events[event_type][event_name] = [];
    self.properties.events[event_type][event_name].push(handler);
  }
};

core_core.prototype.off = function (event, handler) {
  var self = this;
  var event_parts = event.split('.', 2);

  if (event_parts.length) {
    var event_type = event_parts[0],
        event_name = event_parts[1] ? event_parts[1] : false;

    if (_static.isPlainObject(self.properties.events[event_type])) {
      for (var current_event_name in self.properties.events[event_type]) {
        if (self.properties.events[event_type].hasOwnProperty(current_event_name) && _static.isArray(self.properties.events[event_type][current_event_name]) && (event_name === false || event_name === current_event_name)) {
          if (_static.isFunction(handler)) {
            for (var i = 0; i < self.properties.events[event_type][current_event_name].length; i++) {
              if (self.properties.events[event_type][current_event_name][i] === handler) {
                self.properties.events[event_type][current_event_name].splice(i, 1);
                i--;
              }
            }
          } else self.properties.events[event_type][current_event_name] = [];
        }
      }
    }
  }
};

core_core.prototype.trigger = function (event, handler, params) {
  var self = this;
  params = _static.isArray(params) ? params : [];
  var event_parts = event.split('.', 2);

  if (event_parts.length) {
    var event_type = event_parts[0],
        event_name = event_parts[1] ? event_parts[1] : false;

    if (_static.isFunction(self.settings[event_type])) {
      self.settings[event_type]();
    }

    if (_static.isPlainObject(self.properties.events[event_type])) {
      for (var current_event_name in self.properties.events[event_type]) {
        if (self.properties.events[event_type].hasOwnProperty(current_event_name) && _static.isArray(self.properties.events[event_type][current_event_name]) && (event_name === false || event_name === current_event_name)) {
          for (var i = 0; i < self.properties.events[event_type][current_event_name].length; i++) {
            if (_static.isFunction(self.properties.events[event_type][current_event_name][i]) && (!_static.isFunction(handler) || self.properties.events[event_type][current_event_name][i] === handler)) {
              self.properties.events[event_type][current_event_name][i].apply(self, params);
            }
          }
        }
      }
    }
  }
};
;// CONCATENATED MODULE: ./src/modules/global.js

var attachGlobalResizeEvent = function attachGlobalResizeEvent(Popbox) {
  _static.$window.off('resize.' + _static._event_namespace).on('resize.' + _static._event_namespace, function () {
    if (_static._instances.length > 0) {
      for (var i in _static._instances) {
        if (_static._instances.hasOwnProperty(i)) {
          if (_static._instances[i] instanceof Popbox) {
            _static._instances[i]._private.applySettings();

            if (_static._instances[i].isOpen()) {
              _static._instances[i].adjust(false);
            }
          }
        }
      }
    }
  });
};
;// CONCATENATED MODULE: ./src/plugins/animations.js

var addAnimationsPlugin = function addAnimationsPlugin(Popbox) {
  var extend_animations = {
    'slide_up': {
      'open': [{
        'transform': 'translateY(2000px)'
      }, {
        'transform': 'translateY(0px)'
      }],
      'close': [{
        'transform': 'translateY(0px)'
      }, {
        'transform': 'translateY(-2000px)'
      }]
    },
    'slide_down': {
      'open': [{
        'transform': 'translateY(-2000px)'
      }, {
        'transform': 'translateY(0px)'
      }],
      'close': [{
        'transform': 'translateY(0px)'
      }, {
        'transform': 'translateY(2000px)'
      }]
    },
    'float_up': {
      'open': [{
        'opacity': '0',
        'transform': 'translateY(100px)'
      }, {
        'opacity': '1',
        'transform': 'translateY(0px)'
      }],
      'close': [{
        'opacity': '1',
        'transform': 'translateY(0px)'
      }, {
        'opacity': '0',
        'transform': 'translateY(-100px)'
      }]
    },
    'float_down': {
      'open': [{
        'opacity': '0',
        'transform': 'translateY(-100px)'
      }, {
        'opacity': '1',
        'transform': 'translateY(0px)'
      }],
      'close': [{
        'opacity': '1',
        'transform': 'translateY(0px)'
      }, {
        'opacity': '0',
        'transform': 'translateY(100px)'
      }]
    },
    'zoom': {
      'open': [{
        'opacity': '0',
        'transform': 'scale(0.5)'
      }, {
        'opacity': '1',
        'transform': 'scale(1)'
      }],
      'close': [{
        'opacity': '1',
        'transform': 'scale(1)'
      }, {
        'opacity': '0',
        'transform': 'scale(0.5)'
      }]
    },
    // zoom big / zoom small
    'fold': {
      'open': [{
        'opacity': '0',
        'transform': 'rotateX(5deg) scale(0.9)'
      }, {
        'opacity': '1',
        'transform': 'rotateX(0deg) scale(1)'
      }],
      'close': [{
        'opacity': '1',
        'transform': 'rotateX(0deg) scale(1)'
      }, {
        'opacity': '0',
        'transform': 'rotateX(5deg) scale(0.9)'
      }]
    }
  };
  external_jQuery_default().extend(true, Popbox.prototype.animations, extend_animations);
  Popbox.prototype.plugins.animations = "3.1.6";
};
;// CONCATENATED MODULE: ./src/plugins/selector.js
function selector_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { selector_typeof = function _typeof(obj) { return typeof obj; }; } else { selector_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return selector_typeof(obj); }


var addSelectorPlugin = function addSelectorPlugin(Popbox) {
  var _static = Popbox.prototype._static;

  _static.applyDataToSettings = function ($object, settings, defaults, stage) {
    settings = _static.param(settings, {});
    defaults = _static.param(defaults, Popbox.prototype.default_settings);
    stage = _static.param(stage, '');

    for (var property in defaults) {
      if (defaults.hasOwnProperty(property)) {
        var data_property = stage + property.toLowerCase().replace('_', '-');

        if (selector_typeof(defaults[property]) === 'object' && defaults[property] !== null) {
          if (selector_typeof(settings[property]) !== 'object' || settings[property] === null) settings[property] = {};

          _static.applyDataToSettings($object, settings[property], defaults[property], data_property + '-');
        } else {
          var data = $object.data(data_property);

          if (typeof data !== 'undefined') {
            var data_float = parseFloat(data);
            if (data == 'true') data = !0;else if (data == 'false') data = !1;else if (data_float == data) data = data_float;
            settings[property] = data;
          }
        }
      }
    }

    return settings;
  };

  Popbox.prototype.default_settings.auto_setup = true;

  (external_jQuery_default()).fn.Popbox = function (settings) {
    settings = _static.param(settings, {});
    var $elements = external_jQuery_default()(this);

    if ($elements.length) {
      $elements.each(function () {
        var $element = external_jQuery_default()(this);
        $element.off('click.popbox_open').on('click.popbox_open', function (e) {
          e.preventDefault();

          var _popbox,
              new_settings = external_jQuery_default().extend(true, {}, Popbox.prototype.default_settings, settings);

          _static.applyDataToSettings($element, new_settings);

          var href = new_settings.href || $element.attr('href'),
              auto = new_settings.auto_setup,
              auto_settings = {},
              auto_run = false;

          if (href && (auto === 1 || auto === true)) {
            var matches = {
              youtube: [/^(?:http:|https:)?\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_\-]+)(?:&([a-zA-Z0-9_&=.\-]+))?/, //normalurl
              /^(?:http:|https:)?\/\/youtu.be\/([a-zA-Z0-9_\-]+)(?:\?([a-zA-Z0-9_&=.\-]+))?/, //shorturl
              /^(?:http:|https:)?\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_\-]+)(?:\?([a-zA-Z0-9_&=.\-]+))?/ //embedurl
              ],
              vimeo: [/^(?:http:|https:)?\/\/(?:www\.)?vimeo\.com\/([a-zA-Z0-9_\-]+)/, //normalurl
              /^(?:http:|https:)?\/\/player\.vimeo\.com\/video\/([a-zA-Z0-9_\-]+)/ //embedurl
              ],
              image: [/^(?:http:|https:)?\/\/[a-zA-Z0-9_\-\./]+(?:\.jpe?g|\.png|\.gif)(?:.+)?/, //remote image
              /^[a-zA-Z0-9_\-\./]+(?:\.jpe?g|\.png|\.gif)(?:.+)?/ //remote or local image
              ]
            };

            match_process: for (var matcher in matches) {
              if (matches.hasOwnProperty(matcher) && matches[matcher] instanceof Array) {
                for (var i = 0; i < matches[matcher].length; i++) {
                  var matchresult = href.match(matches[matcher][i]);

                  if (matchresult) {
                    //check if youtube, vimeo, image (jpg|png|gif)
                    switch (matcher) {
                      case 'youtube':
                        var append_params = matchresult[2] ? '?' + matchresult[2] : '';
                        auto_settings.content = '<iframe width="1280" height="720" src="//www.youtube.com/embed/' + matchresult[1] + append_params + '" frameborder="0" allowfullscreen></iframe>';
                        auto_settings.fit = 'round';
                        break;

                      case 'vimeo':
                        auto_settings.content = '<iframe width="1280" height="720" src="//player.vimeo.com/video/' + matchresult[1] + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
                        auto_settings.fit = 'round';
                        break;

                      case 'image':
                        auto_settings.content = '<img src="' + matchresult[0] + '" alt="" />';
                        auto_settings.fit = true; // gallery mode might not be available

                        auto_settings.mode = 'gallery';
                        break;
                    }

                    external_jQuery_default().extend(true, new_settings, auto_settings);
                    auto_run = true;
                    break match_process;
                  }
                }
              }
            }
          }

          if (auto_run) _popbox = new Popbox(auto_settings);else _popbox = new Popbox(new_settings);

          _popbox.open(); // bind created popbox to element


          $element.data('Popbox', _popbox);
        });
      });
    }

    return this;
  };

  external_jQuery_default()('.open-popbox').Popbox();
  Popbox.prototype.plugins.selector = "3.1.6";
};
;// CONCATENATED MODULE: ./src/plugins/gallery.js

var addGalleryPlugin = function addGalleryPlugin(Popbox) {
  var _static = Popbox.prototype._static;
  var extend_default_settings = {
    gallery: {
      // mode must be set to gallery for this to be used
      selector: '',
      // selector to get images, either is a link to an image or the image or all images or links found inside
      clickable: true,
      // whether to apply a click/touch to selector items
      swipeable: true,
      error: '<div class="popbox-gallery-error">There was an error loading the image.</div>',
      next: '<span>&#x25B6;</span>',
      prev: '<span>&#x25C0;</span>',
      items: [] // array of image urls

    }
  };

  var _private = function _private() {};

  _static._gallery_event_namespace = 'PopboxGallery';
  external_jQuery_default().extend(true, Popbox.prototype.default_settings, extend_default_settings);

  _private.prototype.attachSwipeEvents = function () {
    var self = this.self,
        popbox = this.self.popbox;

    if (popbox.elements.$popbox && popbox.settings.gallery.swipeable) {
      // include movement vertically in case we need to escape for vertical scrolling
      var _swipe_namespace = _static._gallery_event_namespace + 'Swipe',
          disable_mouse = false,
          $image = false,
          capture_space = 8,
          captured = false,
          start_x = 0,
          start_y = 0,
          move_x = 0,
          move_y = 0,
          move_velocities = [],
          start = function start(new_x, new_y, event) {
        captured = false;
        $image = popbox.elements.$popbox_popup.find('.popbox-gallery-image');

        if ($image.length) {
          if (!$image.data('movement')) $image.data('movement', 0);
          start_x = new_x;
          start_y = new_y;
          move_x = start_x;
          move_y = start_y;
          move(new_x, new_y, event);
          return true;
        }

        return false;
      },
          move = function move(new_x, new_y, event) {
        move_velocities.push({
          distance: new_x - move_x,
          time: new Date().getTime()
        });
        if (move_velocities.length > 10) move_velocities.shift();
        move_x = new_x;
        move_y = new_y;
        var move_diff_x = Math.abs(move_x - start_x) - capture_space,
            move_diff_y = Math.abs(move_y - start_y) - capture_space;

        if (!captured) {
          if (move_diff_x > 0 && move_diff_x > move_diff_y) {
            captured = true; // this is wrong, morally wrong, but it works.

            external_jQuery_default()('<div/>').css({
              'position': 'absolute',
              'top': '0',
              'left': '0',
              'right': '0',
              'bottom': '0',
              'z-index': popbox.settings.z_index + 50
            }).addClass('popbox-swipe-shield').appendTo(popbox.elements.$popbox_popup);
            end(event);
          } else {
            if ((move_diff_x > 0 || move_diff_y > 0) && move_diff_y > move_diff_x) {
              end(event);
            }

            return;
          }
        } // move image


        if (_static._support.transform3d) {
          $image.css('transform', 'translate3d(' + (move_x - start_x + $image.data('movement')) + 'px,0px,0px');
        } else {
          $image.css('transform', 'translate(' + (move_x - start_x + $image.data('movement')) + 'px,0px');
        }
      },
          end = function end(event) {
        disable_mouse = false;

        _static.$document.off('touchmove.' + _swipe_namespace);

        _static.$document.off('touchend.' + _swipe_namespace);

        _static.$document.off('mousemove.' + _swipe_namespace);

        _static.$document.off('mouseup.' + _swipe_namespace);

        var movement = move_x - start_x + $image.data('movement');
        $image.data('movement', movement);

        if (captured) {
          event.stopImmediatePropagation();
          event.preventDefault();

          if (move_x > start_x) {
            self.prev();
          } else if (move_x < start_x) {
            self.next();
          }
        }

        popbox.elements.$popbox_popup.find('.popbox-swipe-shield').remove(); // animate

        if (captured && move_velocities.length) {
          var distance = 0,
              start_time = 0,
              end_time = move_velocities[move_velocities.length - 1].time,
              direction = 0;

          for (var j = move_velocities.length - 1; j >= 0; j--) {
            if (!direction) {
              if (move_velocities[j].distance > 0) direction = 1;else if (move_velocities[j].distance < 0) direction = -1;
            } else if (direction === 1 && move_velocities[j].distance <= 0 || direction === -1 && move_velocities[j].distance >= 0) {
              start_time = move_velocities[j].time;
              break;
            }

            distance += move_velocities[j].distance;
            start_time = move_velocities[j].time;
          }

          if (start_time > 0 && start_time !== end_time) {
            var speed = distance / (end_time - start_time),
                residual_time_warp = 300;
            $image.css('transition', 'ease-in ' + residual_time_warp + 'ms transform');

            if (_static._support.transform3d) {
              $image.css('transform', 'translate3d(' + (movement + speed * residual_time_warp) + 'px,0px,0px');
            } else {
              $image.css('transform', 'translate(' + (movement + speed * residual_time_warp) + 'px,0px');
            }
          }
        } else {
          $image.css('transform', 'translate3d(0px,0px,0px');
        }

        return !captured;
      };

      popbox.elements.$popbox.off('dragstart.' + _swipe_namespace).on('dragstart.' + _swipe_namespace, '.popbox-popup', function (e) {
        e.preventDefault();
      });
      popbox.elements.$popbox.off('touchstart.' + _swipe_namespace).on('touchstart.' + _swipe_namespace, '.popbox-popup', function (e) {
        disable_mouse = true;

        if (start(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY, e)) {
          _static.$document.off('touchmove.' + _swipe_namespace).on('touchmove.' + _swipe_namespace, function (e) {
            move(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY, e);
          });

          _static.$document.off('touchend.' + _swipe_namespace).on('touchend.' + _swipe_namespace, function (e) {
            return end(e);
          });
        } else {
          disable_mouse = false;
        }
      });
      popbox.elements.$popbox.off('mousedown.' + _swipe_namespace).on('mousedown.' + _swipe_namespace, '.popbox-popup', function (e) {
        if (!disable_mouse && e.which === 1) {
          if (start(e.pageX, e.pageY, e)) {
            _static.$document.off('mousemove.' + _swipe_namespace).on('mousemove.' + _swipe_namespace, function (e) {
              move(e.pageX, e.pageY, e);
            });

            _static.$document.off('mouseup.' + _swipe_namespace).on('mouseup.' + _swipe_namespace, function (e) {
              if (e.which === 1) {
                return end(e);
              }
            });
          }
        }
      });
      popbox.elements.$popbox.off('click.' + _swipe_namespace).on('click.' + _swipe_namespace, '.popbox-popup', function (e) {
        if (captured) {
          e.stopImmediatePropagation();
          e.preventDefault();
          return false;
        }
      });
    }
  };

  _private.prototype.detachSwipeEvents = function () {
    var self = this.self,
        popbox = this.self.popbox;

    if (popbox.elements.$popbox) {
      var _swipe_namespace = _static._gallery_event_namespace + 'Swipe';

      popbox.elements.$popbox.off('dragstart.' + _swipe_namespace);
      popbox.elements.$popbox.off('touchstart.' + _swipe_namespace);
      popbox.elements.$popbox.off('mousedown.' + _swipe_namespace);
      popbox.elements.$popbox.off('click.' + _swipe_namespace);
    }
  };

  _private.prototype.attachNavEvents = function () {
    var self = this.self,
        popbox = this.self.popbox;

    if (popbox.elements.$popbox) {
      var _nav_namespace = _static._gallery_event_namespace + 'Nav';

      popbox.elements.$popbox.off('click.' + _nav_namespace);
      popbox.elements.$popbox.on('click.' + _nav_namespace, '.popbox-gallery-next', function (e) {
        e.preventDefault();
        self.next();
      });
      popbox.elements.$popbox.on('click.' + _nav_namespace, '.popbox-gallery-prev', function (e) {
        e.preventDefault();
        self.prev();
      });
    }
  };

  var PopboxGallery = function PopboxGallery(popbox) {
    var self = this;
    self.popbox = popbox;
    self._private = new _private();
    self._private.self = self;
  };

  PopboxGallery.prototype.refreshItems = function () {
    var self = this,
        popbox = this.popbox; // get image file links

    if (_static.isArray(popbox.settings.gallery.items) && popbox.settings.gallery.items.length > 0) {
      for (var i = 0; i < popbox.settings.gallery.items.length; i++) {
        popbox.properties.gallery.items.push(popbox.settings.gallery.items[i]);
      }
    }

    if (popbox.settings.gallery.selector) {
      var $items = external_jQuery_default()(popbox.settings.gallery.selector);
      $items.each(function () {
        // check for src or href (href first)
        var $item = external_jQuery_default()(this),
            data_url = $item.data('url'),
            href = $item.attr('href'),
            src = $item.attr('src'),
            link = false;
        if (data_url) link = data_url;else if (href) link = href;else if (src) link = src;else {
          // get sub items
          $item.find('a[href]').each(function () {
            var sublink = external_jQuery_default()(this).attr('href');
            if (sublink && !sublink.match(/^#/) && _static.indexOf(sublink, popbox.properties.gallery.items, true) < 0) popbox.properties.gallery.items.push(sublink);
          });
          $item.find('img[src]').each(function () {
            var sublink = external_jQuery_default()(this).attr('src');
            if (sublink && _static.indexOf(sublink, popbox.properties.gallery.items, true) < 0) popbox.properties.gallery.items.push(sublink);
          });
        }
        if (link && _static.indexOf(link, popbox.properties.gallery.items, true) < 0) popbox.properties.gallery.items.push(link);
      });

      if (popbox.settings.gallery.clickable) {
        $items.off('click.popbox_gallery_open').on('click.popbox_gallery_open', function (e) {
          e.preventDefault();
          var $item = external_jQuery_default()(this),
              data_url = $item.data('url'),
              href = $item.attr('href'),
              src = $item.attr('src');
          self.refreshItems();
          if (data_url) self.goTo(_static.indexOf(data_url, popbox.properties.gallery.items, true));else if (href) self.goTo(_static.indexOf(href, popbox.properties.gallery.items, true));else if (src) self.goTo(_static.indexOf(src, popbox.properties.gallery.items, true));else {
            // get first sub item
            var first_href = $item.find('a[href]:first').attr('href'),
                first_src = $item.find('img[src]:first').attr('src');
            if (first_href && !first_href.match(/^#/)) self.goTo(_static.indexOf(first_href, popbox.properties.gallery.items, true));else if (first_src) self.goTo(_static.indexOf(first_src, popbox.properties.gallery.items, true));
          }
          popbox.open();
        });
      }
    }
  };

  PopboxGallery.prototype.addItem = function (item) {
    var self = this;
    self.addItems([item]);
  };

  PopboxGallery.prototype.removeItem = function (item) {
    var self = this;
    self.removeItems([item]);
  };

  PopboxGallery.prototype.addItems = function (items) {
    var popbox = this.popbox;

    if (items) {
      if (!_static.isArray(popbox.base_settings.gallery.items)) popbox.base_settings.gallery.items = [];
      if (!_static.isArray(items)) items = [items];

      for (var i = 0; i < items.length; i++) {
        popbox.base_settings.gallery.items.push(items[i]);
      }

      popbox._private.applySettings();
    }
  };

  PopboxGallery.prototype.removeItems = function (items) {
    var popbox = this.popbox;

    if (items && _static.isArray(popbox.base_settings.gallery.items)) {
      if (!_static.isArray(items)) items = [items];

      for (var i = 0; i < items.length; i++) {
        var item_index = _static.indexOf(items[i], popbox.base_settings.gallery.items);

        if (item_index >= 0) {
          popbox.base_settings.gallery.items.splice(item_index, 1);
        }
      }

      popbox._private.applySettings();
    }
  };

  PopboxGallery.prototype.goTo = function (new_item_index) {
    var popbox = this.popbox;

    if (popbox.properties.gallery.items.length > 0) {
      popbox.trigger('gallery_change');
      new_item_index = _static.isNumber(new_item_index) ? new_item_index : popbox.properties.gallery.current_index;

      if (new_item_index > popbox.properties.gallery.items.length - 1) {
        new_item_index = 0;
      } else if (new_item_index < 0) {
        new_item_index = popbox.properties.gallery.items.length > 0 ? popbox.properties.gallery.items.length - 1 : 0;
      }

      popbox.properties.gallery.current_index = new_item_index;
      popbox.update({
        content: '<div class="popbox-gallery-container" style="overflow:hidden;"><div class="popbox-gallery-image"><img src="' + popbox.properties.gallery.items[popbox.properties.gallery.current_index] + '" /></div></div>'
      }, true);
      popbox.on('adjust.gallery_after_change', function () {
        popbox.off('adjust.gallery_after_change');
        popbox.trigger('gallery_after_change');
      });
    }
  };

  PopboxGallery.prototype.next = function () {
    var self = this,
        popbox = this.popbox;
    self.goTo(popbox.properties.gallery.current_index + 1);
  };

  PopboxGallery.prototype.prev = function () {
    var self = this,
        popbox = this.popbox;
    self.goTo(popbox.properties.gallery.current_index - 1);
  };

  Popbox.prototype.gallery = PopboxGallery;
  Popbox.prototype.addHook('initialize', function () {
    var popbox = this;
    popbox.gallery = new PopboxGallery(popbox);
  });
  Popbox.prototype.addHook('after_initialize', function (new_settings) {
    var self = this.gallery,
        popbox = this;

    if (popbox.settings.mode === 'gallery') {
      if (new_settings && !_static.isSet(new_settings.fit)) {
        popbox.base_settings.fit = true;

        popbox._private.applySettings();
      }

      self.refreshItems();
    }
  });
  Popbox.prototype.addHook('after_reset', function () {
    var popbox = this;
    popbox.properties.gallery = {
      items: [],
      current_index: 0
    };
  });
  Popbox.prototype.addHook('after_create', function () {
    var self = this.gallery,
        popbox = this;

    if (popbox.settings.mode === 'gallery') {
      self._private.attachSwipeEvents(); // must go first


      self._private.attachNavEvents();
    }
  });
  Popbox.prototype.addHook('open', function () {
    var self = this.gallery,
        popbox = this;

    if (popbox.settings.mode === 'gallery') {
      self.refreshItems();
      var $existing_img = external_jQuery_default()('<div/>').html(popbox.settings.content).find('img[src]'),
          existing_img_index = 0;

      if ($existing_img.length) {
        existing_img_index = _static.indexOf($existing_img.attr('src'), popbox.properties.gallery.items, true);
      }

      self.goTo(existing_img_index);
    }
  });
  Popbox.prototype.addHook('image_error', function (image_cache_src) {
    var popbox = this;

    if (popbox.settings.mode === 'gallery') {
      popbox.update({
        content: popbox.settings.gallery.error
      }, false);

      if (popbox.properties.cache.images[image_cache_src]) {
        delete popbox.properties.cache.images[image_cache_src];
      }
    }
  });
  Popbox.prototype.addHook('after_update', function () {
    var self = this.gallery,
        popbox = this;

    if (!popbox.isOpen()) {
      popbox.properties.gallery.items = [];
      popbox.properties.gallery.current_index = 0;
    }

    if (popbox.settings.mode === 'gallery') {
      self.refreshItems();
      self.goTo();
    }
  });
  Popbox.prototype.addHook('after_update_dom', function () {
    var popbox = this;
    var show_btns = false;

    if (popbox.settings.mode === 'gallery') {
      popbox.elements.$popbox.addClass('popbox-gallery');

      if (popbox.properties.gallery.items.length > 1) {
        // put the next and previous buttons in the popbox
        if (!popbox.elements.$popbox_gallery_next) {
          popbox.elements.$popbox_gallery_next = external_jQuery_default()('<a/>', {
            'class': 'popbox-gallery-next',
            'href': 'javascript:void(0);'
          }).html(popbox.settings.gallery.next).appendTo(popbox.elements.$popbox_container);
        }

        if (!popbox.elements.$popbox_gallery_prev) {
          popbox.elements.$popbox_gallery_prev = external_jQuery_default()('<a/>', {
            'class': 'popbox-gallery-prev',
            'href': 'javascript:void(0);'
          }).html(popbox.settings.gallery.prev).appendTo(popbox.elements.$popbox_container);
        }

        show_btns = true;
      }
    }

    if (!show_btns) {
      // remove the next and previous buttons from the popbox if they exist
      if (popbox.elements.$popbox_gallery_next) popbox.elements.$popbox_gallery_next.remove();
      if (popbox.elements.$popbox_gallery_prev) popbox.elements.$popbox_gallery_prev.remove();
      popbox.elements.$popbox_gallery_next = false;
      popbox.elements.$popbox_gallery_prev = false;
    }
  });
  Popbox.prototype.plugins.gallery = "3.1.6";
};
;// CONCATENATED MODULE: ./src/popbox-full.js






attachGlobalResizeEvent(core_core);
addAnimationsPlugin(core_core);
addGalleryPlugin(core_core);
addSelectorPlugin(core_core);
(external_jQuery_default()).Popbox = core_core;
/* harmony default export */ const popbox_full = ((/* unused pure expression or super */ null && (_core)));
/******/ })()
;