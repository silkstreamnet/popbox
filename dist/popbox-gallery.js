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
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {

// UNUSED EXPORTS: default

;// CONCATENATED MODULE: external "jQuery"
const external_jQuery_namespaceObject = jQuery;
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_namespaceObject);
;// CONCATENATED MODULE: ./src/plugins/gallery.js

var gallery_addGalleryPlugin = function addGalleryPlugin(Popbox) {
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
;// CONCATENATED MODULE: ./src/popbox-gallery.js


gallery_addGalleryPlugin((external_jQuery_default()).Popbox);
/* harmony default export */ const popbox_gallery = ((/* unused pure expression or super */ null && (addGalleryPlugin)));
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
// extracted by mini-css-extract-plugin

})();

/******/ })()
;