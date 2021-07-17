import $ from "jquery"
import {_core} from "./modules/core";
import {attachGlobalResizeEvent} from "./modules/global";
import {addAnimationsPlugin} from "./plugins/animations";

import {addSelectorPlugin} from "./plugins/selector";
import {addGalleryPlugin} from "./plugins/gallery";

attachGlobalResizeEvent(_core);

addAnimationsPlugin(_core);
addGalleryPlugin(_core);
addSelectorPlugin(_core);

$.Popbox = _core;

export default _core;
