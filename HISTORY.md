# Popbox

### 3.1.3
- Fixed issue with popbox-content height not being set.

### 3.1.2
- Added support for text/caption under images when fit setting is true or 'round'.
- Added new class detection inside popbox-content to disable automatic caption sizing. Classes are: "popbox-fit-image", "popbox-fit-ignore-image", "popbox-fit-ignore-images".

### 3.1.1
- Removed version numbers from plugins.
- Fixed issue where popbox fails to calculate the dimensions of an image.

### 3.1.0
- Updated build to use Webpack.
- No intended new features or functionality changes.

### 3.0.13
- Fixed using showLoading before open to show the loading screen first.

### 3.0.12
- When more than one popbox are shown at once, the overlay will not close after one popbox is closed.
- Fixed Chrome jumping scroll issue with percentage based content.
- Updated CSS to disable text selection for galleries.

### 3.0.11
- Fixed issues which were brought in by responsive settings.
- Renamed popbox-aspect-fit css class to popbox-fit.
- Moved popbox-close element from popbox-container to popbox-popup.
- Added popbox.on('adjust') and popbox.on('after_adjust') events.

### 3.0.10
- Removed aspect_fit_round.
- Renamed aspect_fit to fit.
- Fit supports 'round',true,false.
- Moved properties image cache variables to properties.cache.
- Added responsive setting. Ability to override base settings using minimum window width keys.
- All plugins updated with fixed version checker.
- Updated gallery and selector functionality to support new fit setting.

### 3.0.9
- Added the ability to add elements to the content with the "close-popbox" class to close the popbox.

### 3.0.8
- Added some recommended coercion checks.
- Added mode class support (gallery).
- Added new support check for 3d.
- Added overflow-x hidden on popbox-content.
- Changed events to be assigned to popbox and use target.

### 3.0.7
- Added aspect_fit_round setting.

### 3.0.6
- Added overlay_text setting.

### 3.0.5
- Removed min_width true 100% and max_width true 100% support.

### 3.0.4
- Added option to set content setting to a jquery element object (used to only support a string with html or text).

### 3.0.3
- Moved the popbox-close element below the popbox-content element to fix issue with iOS Safari close button not being clickable.

### 3.0.2
- Removed static setting of _private object.
- Fixed padding calculation on popbox-popup.
- Updated code to support applying showLoading manually. (useful for ajax calls)

### 3.0.1
- Style modifications to visual padding and margin.
- Added comment stating never to set a margin or padding on popbox-popup.
- Finally fixed iOS bug where aspect_fit=true popboxes were rendering far smaller than they should have been.
- Updated selector extension to allow for parameters on youtube links.
- Added plugin versioning.
- Added overlay to z-index registering.
- Added even triggers for all locations which had hooks but no triggers.
- Fixed issue scrolling on empty background not working.

### 3.0.0
- Creation, completely re-engineered
- Animations are now purely css3, fallback is no animation (IE9 and below)
- Open and close animations are now highly customisable in javascript

# Popbox Plugins

## Animations
### 1.0.0
- Added slide_up, slide_down, float_up, float_down, zoom, fold animations.

## Gallery
### 1.1.4
- gallery_after_change event now runs after adjust (required to make sure the items used were from the new slide)
- Added swipeable setting (default true, set to false to disable swiping navigation)
- Fixed an issue where the sliding animation would occur when swiping vertically.

### 1.1.3
- Changed aspect_fit settings to fit.
- Raised core version requirement to 3.0.10

### 1.1.2
- Added events gallery_change and and gallery_after_change.

### 1.1.1
- Changed swiping animation.
- Removed redundant code from swiping.

### 1.1.0
- Renamed updateItems to refreshItems.
- Added API functions: addItem, removeItem, addItems, removeItems. Not recommended to use these when using selector setting.
- Added swipe support.
- Changed events to be attached to popbox then use targets.
- Moved code around for organisation.

### 1.0.2
- Added aspect_fit_round support.
- Raised core version requirement to 3.0.7

### 1.0.1
- Added support for data-url attribute.

### 1.0.0
- Requires setting the mode of the popbox to "gallery".
- API included for controlling the gallery.

## Selector
### 1.0.3
- Added fit property setting to images, gallery mode isn't always available.

### 1.0.2
- Changed aspect_fit and aspect_fit_round settings to fit.
- Raised core version requirement to 3.0.10

### 1.0.1
- Added aspect_fit_round support.
- Raised core version requirement to 3.0.7

### 1.0.0
- Adds ability to initiate a popbox element by specifying the "open-popbox" class on an element.
- Supports Vimeo and Youtube links.
- Specify settings by using the data attributes.
