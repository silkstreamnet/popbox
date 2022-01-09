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
;// CONCATENATED MODULE: ./src/plugins/animations.js

var animations_addAnimationsPlugin = function addAnimationsPlugin(Popbox) {
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
  Popbox.prototype.plugins.animations = "3.1.2";
};
;// CONCATENATED MODULE: ./src/popbox-animations.js


animations_addAnimationsPlugin((external_jQuery_default()).Popbox);
/* harmony default export */ const popbox_animations = ((/* unused pure expression or super */ null && (addAnimationsPlugin)));
/******/ })()
;