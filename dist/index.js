"use strict";
exports.__esModule = true;
var lib_1 = require("./lib");
function useBodyScrollLock(id, containerElement, contentElement) {
    (0, lib_1.registerLockIdOnBody)(id);
    (0, lib_1.registerLockIdOnElement)(containerElement, id);
    (0, lib_1.lockBodyScroll)();
    if (contentElement) {
        var containerHeight = containerElement.getBoundingClientRect().height;
        var contentHeight = contentElement.getBoundingClientRect().height;
        if (containerHeight >= contentHeight) {
            (0, lib_1.lockElement)(containerElement);
        }
    }
    return {
        removeScrollLock: function () { return (0, lib_1.removeScrollLock)(containerElement); },
        removeAllScrollLocks: lib_1.removeAllScrollLocks
    };
}
exports["default"] = useBodyScrollLock;
