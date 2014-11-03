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
- 'customClass' : '' : {string} === Custom string for container of popup
- 'mode' : 'normal' : {string} === Set the mode. 'normal', 'gallery'

View index.html for example code.

Define a new popbox:
	---
	var _popbox = new PopBox();
	---
_popbox has the following methods:
	---
	_popbox.isOpen();                                             === Returns: {boolean}. 
	_popbox.isClose();                                            === Returns: {boolean}. 
	_popbox.checkImages();                                        === Returns: {null}. Executes: Resets the image loader for the current popbox to re-adjust the popbox for any slow loading images.
	_popbox.update(settings={object}, adjust={boolean});          === Returns: {null}. Executes: Can set new settings like changing the width, height, content. Pretty much anything you set when you initialise.
	_popbox.open();                                               === Returns: {null}. Executes: Adds the popbox to the body, applies all the relevant formatting and adds the specified content. Then adjusts and fades in.
	_popbox.close();                                              === Returns: {null}. Executes: Closes the popbox and removes it from the body.
	_popbox.adjust(animate={boolean});                            === Returns: {null}. Executes: Adjusts the popbox to account for any new changes to the popbox.
	---

RECOMMENDED TO NOT set the popbox-popup to have a percentage based padding/border.

@@@@@@@@@@@@@
Things to Add
@@@@@@@@@@@@@

- autoScale isn't taking maxheight or maxwidth settings into account.
- add LINK support to make setting popbox on a link easy, allows you to reference an image or youtube/vimeo link and sets up automatically.
- add jQuery selector method calls. (1 - bind to an anchor/link) (2 - initialise through jQuery)


@@@@@@@
Updates
@@@@@@@

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