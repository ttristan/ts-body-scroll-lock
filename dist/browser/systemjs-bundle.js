System.register("lib", [], function (exports_1, context_1) {
    "use strict";
    var bodyDatasetName, elementDatasetName, bodyLockStyle, scrollYContentLockStyle, removeAllScrollLocks, removeScrollLock, lockBodyScroll, lockContentScrollElement, unlockBodyScroll, lockScrollElement, unlockScrollElement, addStyleOverride, removeStyleOverride, registerLockIdOnBody, unregisterLockIdOnBody, registerLockIdOnElement, getElementLockId, getAllLockedElements, hasActiveScrollLocks, unregisterLockIdOnElement, getBody, preventTouchmoveHandler, getChildNodesHeight, isIOS;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            bodyDatasetName = "tsslock";
            elementDatasetName = "tsslockid";
            bodyLockStyle = ";touch-action:none!important;overscroll-behavior:none!important;overflow:hidden!important;";
            scrollYContentLockStyle = ";overflow-y:unset!important;";
            exports_1("removeAllScrollLocks", removeAllScrollLocks = () => {
                getAllLockedElements().forEach((element) => {
                    if (!(element instanceof HTMLElement)) {
                        console.warn("removing scroll lock for Elment", element, "is not possible, as it is not a HTMLElement");
                        return;
                    }
                    removeScrollLock(element);
                });
                unlockBodyScroll();
            });
            exports_1("removeScrollLock", removeScrollLock = (element) => {
                unregisterLockIdOnBody(element);
                unlockScrollElement(element);
                if (!hasActiveScrollLocks()) {
                    unlockBodyScroll();
                }
            });
            exports_1("lockBodyScroll", lockBodyScroll = () => {
                const body = getBody();
                addStyleOverride(body, bodyLockStyle);
            });
            exports_1("lockContentScrollElement", lockContentScrollElement = (containerElement, scrollContentElement) => {
                const containerHeight = containerElement.getBoundingClientRect().height;
                const contentHeight = scrollContentElement.getBoundingClientRect().height;
                const contentChildrenHeight = getChildNodesHeight(scrollContentElement.children);
                if (containerHeight >= contentHeight &&
                    containerHeight >= contentChildrenHeight) {
                    lockScrollElement(scrollContentElement);
                }
            });
            unlockBodyScroll = () => {
                const body = getBody();
                removeStyleOverride(body, bodyLockStyle);
            };
            lockScrollElement = (element) => {
                addStyleOverride(element, scrollYContentLockStyle);
                if (isIOS) {
                    element.addEventListener("touchmove", preventTouchmoveHandler);
                }
            };
            unlockScrollElement = (element) => {
                removeStyleOverride(element, scrollYContentLockStyle);
                unregisterLockIdOnElement(element);
                if (isIOS) {
                    element.removeEventListener("touchmove", preventTouchmoveHandler);
                }
            };
            addStyleOverride = (element, styleOverride) => {
                const currentStyle = element.getAttribute("style");
                if (currentStyle === null) {
                    return element.setAttribute("style", styleOverride);
                }
                if (currentStyle.indexOf(styleOverride) > -1) {
                    return;
                }
                return element.setAttribute("style", `${currentStyle}${styleOverride}`);
            };
            removeStyleOverride = (element, styleOverride) => {
                const currentStyle = element.getAttribute("style");
                if (currentStyle == null) {
                    return;
                }
                const newStyle = currentStyle.replace(new RegExp(styleOverride + "$"), "");
                if (newStyle === "") {
                    return element.removeAttribute("style");
                }
                return element.setAttribute("style", newStyle);
            };
            exports_1("registerLockIdOnBody", registerLockIdOnBody = (id) => {
                const body = getBody();
                if (!body.dataset[bodyDatasetName]) {
                    body.dataset[bodyDatasetName] = id;
                    return;
                }
                if (body.dataset[bodyDatasetName].indexOf(id) > -1) {
                    return;
                }
                body.dataset[bodyDatasetName] += `,${id}`;
            });
            unregisterLockIdOnBody = (element) => {
                const body = getBody();
                if (!body.dataset[bodyDatasetName]) {
                    return;
                }
                if (body.dataset[bodyDatasetName].indexOf(",") === -1) {
                    body.removeAttribute(`data-${bodyDatasetName}`);
                    return;
                }
                const id = getElementLockId(element);
                body.dataset[bodyDatasetName] = body.dataset[bodyDatasetName].replace(`,${id}`, "");
                return;
            };
            exports_1("registerLockIdOnElement", registerLockIdOnElement = (element, id) => {
                return (element.dataset[elementDatasetName] = id);
            });
            getElementLockId = (element) => {
                return element.dataset[elementDatasetName];
            };
            getAllLockedElements = () => document.querySelectorAll(`[data-${elementDatasetName}]`);
            hasActiveScrollLocks = () => {
                return getAllLockedElements().length > 0;
            };
            unregisterLockIdOnElement = (element) => {
                return element.removeAttribute(`data-${elementDatasetName}`);
            };
            getBody = () => {
                const body = document.querySelector("body");
                if (!body) {
                    throw "could no locate body in DOM";
                }
                return body;
            };
            preventTouchmoveHandler = (e) => {
                try {
                    e.preventDefault();
                }
                catch (e) { }
            };
            getChildNodesHeight = (children) => {
                let height = 0;
                for (const child of children) {
                    height = height + child.getBoundingClientRect().height;
                }
                return height;
            };
            isIOS = typeof window !== "undefined" &&
                ((navigator.userAgent.indexOf("Mac") > -1 && "ontouchend" in document) ||
                    (() => {
                        let isIOSDevice = false;
                        ["iPad", "iPhone", "iPod"].forEach((device) => {
                            if (navigator.platform.indexOf(device) > -1) {
                                isIOSDevice = true;
                            }
                        });
                        return isIOSDevice;
                    })());
        }
    };
});
System.register("index", ["lib"], function (exports_2, context_2) {
    "use strict";
    var lib_1;
    var __moduleName = context_2 && context_2.id;
    function useBodyScrollLock(id, containerElement, scrollContentElement) {
        lib_1.registerLockIdOnBody(id);
        lib_1.registerLockIdOnElement(containerElement, id);
        lib_1.lockBodyScroll();
        if (scrollContentElement) {
            lib_1.lockContentScrollElement(containerElement, scrollContentElement);
        }
        return {
            removeScrollLock: () => lib_1.removeScrollLock(containerElement),
            removeAllScrollLocks: lib_1.removeAllScrollLocks,
        };
    }
    exports_2("default", useBodyScrollLock);
    exports_2("useBodyScrollLock", useBodyScrollLock);
    return {
        setters: [
            function (lib_1_1) {
                lib_1 = lib_1_1;
            }
        ],
        execute: function () {
            exports_2("lockBodyScroll", lib_1.lockBodyScroll);
            exports_2("removeAllScrollLocks", lib_1.removeAllScrollLocks);
            exports_2("removeScrollLock", lib_1.removeScrollLock);
        }
    };
});
//# sourceMappingURL=systemjs-bundle.js.map