import $ from "jquery"
import {_core} from "./modules/core";
import {attachGlobalResizeEvent} from "./modules/global";

attachGlobalResizeEvent(_core)

$.Popbox = _core;

export default _core;
