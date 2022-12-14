"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAllScrollLocks = exports.lockBodyScroll = exports.useBodyScrollLock = exports.removeScrollLock = void 0;
var lib_1 = require("./lib");
Object.defineProperty(exports, "lockBodyScroll", { enumerable: true, get: function () { return lib_1.lockBodyScroll; } });
Object.defineProperty(exports, "removeAllScrollLocks", { enumerable: true, get: function () { return lib_1.removeAllScrollLocks; } });
Object.defineProperty(exports, "removeScrollLock", { enumerable: true, get: function () { return lib_1.removeScrollLock; } });
function useBodyScrollLock(id, containerElement, scrollContentElement) {
    (0, lib_1.registerLockIdOnBody)(id);
    (0, lib_1.registerLockIdOnElement)(containerElement, id);
    (0, lib_1.lockBodyScroll)();
    var observer = (0, lib_1.getLockContentScrollResizeObserver)();
    if (scrollContentElement && observer) {
        (0, lib_1.lockContentScrollElement)(containerElement, scrollContentElement);
        Array.from(scrollContentElement.children).forEach(function (child) {
            observer.observe(child);
        });
    }
    return {
        removeScrollLock: function () { return (0, lib_1.removeScrollLock)(containerElement, observer); },
        removeAllScrollLocks: function () { return (0, lib_1.removeAllScrollLocks)(observer); },
    };
}
exports.default = useBodyScrollLock;
exports.useBodyScrollLock = useBodyScrollLock;
//# sourceMappingURL=index.js.map