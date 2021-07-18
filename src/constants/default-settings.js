import {_static} from "../modules/static";

export const _default_settings = {
    width:false, // number = pixels to set, anything else is ignored
    height:false, // number = pixels to set, anything else is ignored
    min_width:100, // false = none, true = 100%, number = pixels
    min_height:100, // false = none, true = 100%, number = pixels
    max_width:false, // false|true = 100%, number = pixels
    max_height:false, // false = none, true = 100%. if set, scroll inner is used
    container:false, //specify an alternate container to body
    animation:'fade',
    animation_speed:_static._speeds._default,
    animation_ease:_static._eases._default,
    open_animation:null,
    open_animation_speed:null,
    open_animation_ease:null,
    close_animation:null,
    close_animation_speed:null,
    close_animation_ease:null,
    overlay_animation_speed:null, // set to true to match the relevant popup animation speed
    overlay_animation_ease:null,
    open_overlay_animation_speed:null,
    open_overlay_animation_ease:null,
    close_overlay_animation_speed:null,
    close_overlay_animation_ease:null,
    content:'',
    title:false,
    close_text:'X',
    overlay_text:'',
    loading_text:'Loading',
    hide_page_scroll:true,
    hide_page_scroll_space:true,
    content_additional_offset:false, // number in pixels, string for jquery selector, array of strings for multiple jquery selectors to check
    absolute:'mobile',
    add_class:'', // supports multiple space separated classes
    fit:false, // false|true|'round' recommended for images and iframes - not for content
    cache:false,
    wait_for_images:true,
    width_margin:0.1,
    height_margin:0.08,
    z_index:99900, // should be a number greater than 0, otherwise z-index will not be set at all.
    mode:false, //normal, can be 'gallery' if extension is available
    open:false,
    after_open:false,
    close:false,
    after_close:false,
    responsive: {}
};
