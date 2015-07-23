popbox.js

@@@@@@@@@@
How To Use
@@@@@@@@@@

Options:
   param : default value : all values

- 'width' : 'auto' : {number}, 'auto'
- 'height' : 'auto' : {number}, 'auto'
- 'maxwidth' : 'none' : {number}, 'none'
- 'maxheight' : 'none' : {number}, 'none'
- 'content' : '' : {string}
- 'close' : 'X' : {string}
- 'onOpen' : false : {false}, {function}
- 'onClose' : false : {false}, {function}
- 'afterOpen' : false : {false}, {function}
- 'afterClose' : false : {false}, {function}
- 'fadeInSpeed' : 400 : {number}
- 'fadeOutSpeed' : 400 : {number}
- 'updatePositionDelay' : 200 : {number}     === Interval refresh rate for adjusting the popbox. (higher the number, the less intensive. lower the number, the more responsive and accurate.)
- 'autoScale' : false : {boolean}  === Set to true for galleries/images/iframes.
- 'innerOverflow' : false : {boolean} === Create scroll bar for overflow inside the popup when true
- 'scaleToContent' : false : {boolean} === When autoScale is false, use this setting to attempt to scale the popbox to its contents based on width.
- 'customClass' : '' : {string} === Custom string for container of popup
- 'mode' : 'normal' : {string} === Set the mode. 'normal', 'gallery'
- 'gallery' : {} : {object} === Look at gallery settings for more information.


'gallery' Sub-options:
   param : default value : all values

- 'loading' : 'Loading' : {string} === Text to show when image is loading. Accepts HTML.
- 'error' : 'Error' : {string} === Text to show when image has failed to load. Accepts HTML.
- 'name' : '' : {string} === Class to use to select all images in the gallery.
- 'next' : '&#x25B6' : {string} === Text to show for the next button. Accepts HTML.
- 'prev' : '&#x25C0' : {string} === Text to show for the prev button. Accepts HTML.


Define a new popbox:
	---
	var _popbox = new PopBox();
	---
_popbox has the following methods:
	---
	_popbox.isOpen();                                                                === Returns: {boolean}.
	_popbox.isClose();                                                               === Returns: {boolean}.
	_popbox.checkImages();                                                           === Returns: {null}. Executes: Resets the image loader for the current popbox to re-adjust the popbox for any slow loading images.
	_popbox.update(settings={object}, adjust={boolean});                             === Returns: {null}. Executes: Can set new settings like changing the width, height, content. Pretty much anything you set when you initialise.
	_popbox.open();                                                                  === Returns: {null}. Executes: Adds the popbox to the body, applies all the relevant formatting and adds the specified content. Then adjusts and fades in.
	_popbox.close();                                                                 === Returns: {null}. Executes: Closes the popbox and removes it from the body.
	_popbox.adjust(immediate={bool|number});                                         === Returns: {null}. Executes: Adjusts the popbox to account for any new changes to the popbox.
	_popbox.applyDataSettings(jqueryelement={object})                                === Returns: {null}. Executes: Applies settings based on data attributes of the jQuery element provided.
	---


[[[ As of Version 2.20 - BEGIN ]]]

Define a new popbox with jQuery:
$('.custom-popbox').PopBox({
	content:'test'
});

Applying data attributes:
Example: <a href="#" class="popbox" data-content="This is the popbox content.">Click Me</a>
- Advice: Data attributes are all lowercase versions of the settings, settings which go down multiple levels are separated by hyphens (-). e.g. data-gallery-name=""

Automatic PopBox:
PopBox now automatically searches for any elements with a class of 'popbox' and applies a click listener to them.
Example: <a href="http://www.vimeo.com/38013872" class="popbox">Vimeo</span>
If the selected element has a href or data-href attribute, this will be analysed and a popbox will be automatically prepared.
- Advice: If you have an element with a href but do not want automatic setup, apply data-autosetup="0" or data-autosetup="false" to the element.
Example: <span data-href="http://www.vimeo.com/38013872" data-autosetup="false" class="popbox">Vimeo</span>

[[[ As of Version 2.20 - END ]]]


@@@@@@@@@@@@@
Things to Add
@@@@@@@@@@@@@

VERSION BEYOND 2 PLANS
- IE7 iframe doesnt work/scale
- IE7 gallery isn't completely stable
- When popup is resized, check all images are ready/loaded or have a listener (not sure whether this is important)

VERSION 3 PLANS
- Support CSS3 transitions over javascript animation.
- Add extension support to the plugin. Separate gallery functionality and extensive future animations to their own extension scripts.
- Change function definition convention for private functions to var function plus camelCase.
- Change variables to underscore with jquery objects prepended with $.
- Take out awkward clone calculation and rely strictly on naturalWidth and naturalHeight from loaded image. If not supported, don't expect miracles.
- Add addEventListener method to popbox class.
- Change name of class to Popbox, only first letter capitalised.
- Change applyDataSettings method to applySettings


@@@@@@@
Updates
@@@@@@@

=== v2-22 (stable) ===
- Fix for iDevice image load problem (tested).
- Moved autoScale style settings to be only set on images under the effects of autoScale.
- Optimised imagesLost internal function which checks if an image has dropped out of the cache while being viewed.
- Moved window.PopBox to $.PopBox as it is a jQuery plugin...
- Fix on applyDataSettings, sub objects were being overwritten.
- Cleanup of style for gallery loading.
- Changed popbox to adjust every time a new image is loaded.
- Added a few more box-sizing resets to some containers.
- Changed the form fix to only apply for iOS and Android devices. (Need a more robust way to avoid fixed position issues on mobile devices.)
- Hotfix for cache check code, returning from adjust too early causing infinite clones. NOOOO!

=== v2-21 (stable) ===
- Added applyDataSettings method.

=== v2-20 (stable) ===
- Added potential hack fix for mobile device (old android and iOS) input field focus bug
- Added jQuery initiate support. e.g. $('.custom-popbox').PopBox();
- Added support for data attributes on jQuery initiated PopBoxes.
- Fixed bottom few pixels space below iframes with autoScale.
- Fixed background scrolling hitch on webkit browsers with iframes.
- Full support for automatic image (jpg|png|gif) opening and youtube|vimeo links.

=== v2-15 (stable) ===
- Added last ditch fix for any potential problems with image loading.
- Fixed a few setting update conversions e.g. scrollable content to gallery.
- Added support for numbers in adjust method "immediate" parameter.
- Fixed a bug with going from a scrolled content mode to gallery mode.

=== v2-14 (stable) ===
- Fixed issues with adjust scaling stability with the gallery and onload.
- Made some changes to naming conventions (tidy up in progress)
- Switching modes using "update" should work correctly now.

=== v2-13 (unstable) ===
- Updated popbox.css
- Changed handling of body/html elements to remove scrollbar and stop scrolling.
- Changed image loading system to better support the problems IE has with onload.
- Loading/Error for galleries now fits popbox to content.
- Small adjustments and bugfixes throughout.
- Added full gallery functionality - new gallery settings.

=== v2-12 (stable) ===
- Removed all instances of animate parameter (update and adjust functions no longer have animate parameters)
- Created new way of managing whether to animate popbox on open.

=== v2-11 (stable) ===
- Added new setting, scaleToContent.

=== v2-10 (stable) ===
- Changed how html/body correction is reset.
- Added fix for websites that have global box-sizing.

=== v2-09 (stable) ===
- Added small width checking for popup.
- Added image load failure error monitoring.
- Added sub setting of 'error' to 'gallery'. Error setting lets you specify "error" text. (Only for gallery mode)
- Added 'animate' parameter to 'update' method. Set whether the adjust transformation is animated.

=== v2-08b (beta) ===
- PopBox Now memorises body margin right and overflow.
- Added fix for some browsers scrolling. (Odd fix was to apply an empty listener)
- adjustToClient internal function completely removed. The adjustment functionality is now fully dedicated to PopBox.
- Added new scale clone functionality to make scaling calculations smoother.
- autoScale and not both can now animate the width, height, left, top.
- Added 'gallery' setting with sub setting of 'loading'. Loading setting lets you specify "loading" text. (This is for the gallery mode)
- Added 'mode' setting. Can set to 'normal' or 'gallery'.
- Added 'animateSpeed' setting.
- Fixed some issues with IE 7 and 8.

=== v2-07b (beta) ===
- WARNING: This revision changes variable/method names and may require code updates
- changed beforeOpen to onOpen (illogical name adjustment)
- changed beforeClose to onClose (illogical name adjustment)
- changed onOpen to afterOpen (illogical name adjustment)
- changed onClose to afterClose (illogical name adjustment)
- updated the autoScale functionality to be more robust when scaling down in real time
- changed the way scaling is generated
- height and width are now animated like top and left (should add option to turn off animation in next revision)
- turned off animation on load
- changed property setting "class" to "customClass" due to problem with compiler

=== v2-06 (stable) ===
- added "innerOverflow" setting to specify whether to show a scroll bar inside the popup
- various improvements/fixes to maxheight handling
- added "class" setting to specify a custom class name for the popup (for user styling)
- optimised "update" method. removed unneccessary code

=== v2-05b (beta) ===
- WARNING: This revision changes variable/method names and may require code updates
- changed "fitImage" setting to "autoScale"
- changed "setSettings" method to "update"
- added new div with class "popbox-content" (main purpose is to handle maxheight)
- maxheight setting functionality was added (only used when autoScale set to false, like maxwidth)
- fixed support for iframes

=== v2-04 (stable) ===
- fixed scaling for images smaller than screen.
- fixed issue with padding on the popup container affecting scaling.

=== v2-03b (beta) ===
- added single image functionality (new setting called "fitImage"). Useful for galleries.
- not fully bug tested as this is a beta release.

=== v2-02 (stable) ===
- made some tweaks to better support/stabilise functionality on old IE.

=== v2-01 (stable) ===
- width of the page will not change if the page has a scroll bar. (small visual tweak)

=== v2-00 (stable) ===
- completely rewritten popbox as a class.
- fully responsive.
- options to set max width.

=== v1-00 to v1-08 is undocumented  ===
- version 1 popbox.js and subsequent revisions are possibly unstable.
- possible fundamental changes throughout revisions.