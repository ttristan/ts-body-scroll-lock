import { registerLockIdOnBody, registerLockIdOnElement, lockBodyScroll, removeAllScrollLocks, lockElement, removeScrollLock, } from "./lib";
export { removeScrollLock, useBodyScrollLock, lockBodyScroll, removeAllScrollLocks, };
export default function useBodyScrollLock(id, containerElement, scrollContentElement) {
    registerLockIdOnBody(id);
    registerLockIdOnElement(containerElement, id);
    lockBodyScroll();
    if (scrollContentElement) {
        const containerHeight = containerElement.getBoundingClientRect().height;
        const contentHeight = scrollContentElement.getBoundingClientRect().height;
        if (containerHeight >= contentHeight) {
            lockElement(scrollContentElement);
        }
    }
    return {
        removeScrollLock: () => removeScrollLock(containerElement),
        removeAllScrollLocks,
    };
}
//# sourceMappingURL=index.js.map