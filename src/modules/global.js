import {_static} from "./static";

export const attachGlobalResizeEvent = function(Popbox){
    _static.$window.off('resize.'+_static._event_namespace).on('resize.'+_static._event_namespace,function(){
        if (_static._instances.length > 0) {
            for (var i in _static._instances) {
                if (_static._instances.hasOwnProperty(i)) {
                    if (_static._instances[i] instanceof Popbox) {
                        _static._instances[i]._private.applySettings();
                        if (_static._instances[i].isOpen()) {
                            _static._instances[i].adjust(false);
                        }
                    }
                }
            }
        }
    });
};
