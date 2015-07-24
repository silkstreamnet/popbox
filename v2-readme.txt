popbox.js

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


[[[ Version 2.20+ BEGIN ]]]

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

[[[ Version 2.20+ END ]]]
