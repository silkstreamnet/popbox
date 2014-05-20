popbox.js

@@@@@@@@@@
How To Use
@@@@@@@@@@

Options:
   param : default value : all values

- 'width' : 'auto' : {number}, 'auto'
- 'height' : 'auto' : {number}, 'auto'
- 'maxwidth' : 'none' : {number}, 'none'
- 'maxheight' : 'none' : {number}, 'none'    === This option is not currently used.
- 'content' : '' : {string}
- 'close' : 'X' : {string}
- 'onOpen' : false : {false}, {function}
- 'onClose' : false : {false}, {function}
- 'beforeOpen' : false : {false}, {function}
- 'beforeClose' : false : {false}, {function}
- 'fadeInSpeed' : 400 : {number}
- 'fadeOutSpeed' : 400 : {number}
- 'updatePositionDelay' : 200 : {number}     === Interval refresh rate for adjusting the popbox. (higher the number, the less intensive. lower the number, the more responsive and accurate.)
- 'fitImage' : false : {boolean}  === Set to true for galleries.

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
	_popbox.setSettings(settings={object}, animate={boolean});    === Returns: {null}. Executes: Can set new settings like changing the width, height, content. Pretty much anything you set when you initialise.
	_popbox.open();                                               === Returns: {null}. Executes: Adds the popbox to the body, applies all the relevant formatting and adds the specified content. Then adjusts and fades in.
	_popbox.close();                                              === Returns: {null}. Executes: Closes the popbox and removes it from the body.
	_popbox.adjust(animate={boolean});                            === Returns: {null}. Executes: Adjusts the popbox to account for any new changes to the popbox.
	---


@@@@@@@@@@@@@
Things to Add
@@@@@@@@@@@@@

- possible fix for body still scrolling (visual): set body to position fixed (will have to get current scroll before hand and use that to reset as well).
- add option to animate width and height (currently only animates top and left). can only do this with set widths and heights or auto scaling (image).


@@@@@@@
Updates
@@@@@@@

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