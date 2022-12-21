"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLockIdOnElement = exports.registerLockIdOnBody = exports.lockContentScrollElement = exports.getLockContentScrollResizeObserver = exports.lockBodyScroll = exports.removeScrollLock = exports.removeAllScrollLocks = void 0;
var bodyDatasetName = "tsslock";
var elementDatasetName = "tsslockid";
var bodyLockStyle = ";overscroll-behavior:none!important;-webkit-overflow-scrolling: auto!important;overflow:hidden!important;";
var htmlLockStyle = ";overscroll-behavior:none!important;-webkit-overflow-scrolling: auto!important;overflow:hidden!important;";
var bodyLockIOSStyle = ";touch-action:none!important;";
var htmlLockIOSStyle = ";touch-action:none!important;";
var scrollYContentLockStyle = ";overflow-y:unset!important;";
var removeAllScrollLocks = function (observer) {
    getAllLockedElements().forEach(function (element) {
        if (!(element instanceof HTMLElement)) {
            console.warn("removing scroll lock for Elment", element, "is not possible, as it is not a HTMLElement");
            return;
        }
        (0, exports.removeScrollLock)(element, observer);
    });
    unlockBodyScroll();
};
exports.removeAllScrollLocks = removeAllScrollLocks;
var removeScrollLock = function (element, observer) {
    unregisterLockIdOnBody(element);
    unlockScrollElement(element);
    if (observer) {
        observer.disconnect();
    }
    if (!hasActiveScrollLocks()) {
        unlockBodyScroll();
    }
};
exports.removeScrollLock = removeScrollLock;
var lockBodyScroll = function () {
    var html = getHtml();
    var body = getBody();
    addStyleOverride(html, htmlLockStyle);
    addStyleOverride(body, bodyLockStyle);
    if (isIOS) {
        addStyleOverride(html, htmlLockIOSStyle);
        addStyleOverride(body, bodyLockIOSStyle);
    }
};
exports.lockBodyScroll = lockBodyScroll;
var getLockContentScrollResizeObserver = function () {
    if (!document) {
        return null;
    }
    return new ResizeObserver(function (entries) {
        if (entries) {
            var scrollContentElement = entries[0].target.parentElement;
            if (scrollContentElement && scrollContentElement.parentElement) {
                unlockScrollElement(scrollContentElement);
                (0, exports.lockContentScrollElement)(scrollContentElement.parentElement, scrollContentElement);
            }
        }
    });
};
exports.getLockContentScrollResizeObserver = getLockContentScrollResizeObserver;
var lockContentScrollElement = function (containerElement, scrollContentElement) {
    var containerHeight = containerElement.getBoundingClientRect().height;
    var contentHeight = scrollContentElement.getBoundingClientRect().height;
    var contentChildrenHeight = getChildNodesHeight(scrollContentElement.children);
    if (containerHeight >= contentHeight &&
        containerHeight >= contentChildrenHeight) {
        lockScrollElement(scrollContentElement);
    }
};
exports.lockContentScrollElement = lockContentScrollElement;
var unlockBodyScroll = function () {
    var html = getHtml();
    var body = getBody();
    removeStyleOverride(html, htmlLockStyle);
    removeStyleOverride(body, bodyLockStyle);
    if (isIOS) {
        removeStyleOverride(html, htmlLockIOSStyle);
        removeStyleOverride(body, bodyLockIOSStyle);
    }
};
var lockScrollElement = function (element) {
    addStyleOverride(element, scrollYContentLockStyle);
    if (isIOS) {
        element.addEventListener("touchmove", preventTouchmoveHandler);
    }
};
var unlockScrollElement = function (element) {
    removeStyleOverride(element, scrollYContentLockStyle);
    unregisterLockIdOnElement(element);
    if (isIOS) {
        element.removeEventListener("touchmove", preventTouchmoveHandler);
    }
};
var addStyleOverride = function (element, styleOverride) {
    var currentStyle = element.getAttribute("style");
    if (currentStyle === null) {
        return element.setAttribute("style", styleOverride);
    }
    if (currentStyle.indexOf(styleOverride) > -1) {
        return;
    }
    return element.setAttribute("style", "".concat(currentStyle).concat(styleOverride));
};
var removeStyleOverride = function (element, styleOverride) {
    var currentStyle = element.getAttribute("style");
    if (currentStyle == null) {
        return;
    }
    var newStyle = currentStyle.replace(new RegExp(styleOverride + "$"), "");
    if (newStyle === "") {
        return element.removeAttribute("style");
    }
    return element.setAttribute("style", newStyle);
};
var registerLockIdOnBody = function (id) {
    var body = getBody();
    if (!body.dataset[bodyDatasetName]) {
        body.dataset[bodyDatasetName] = id;
        return;
    }
    if (body.dataset[bodyDatasetName].indexOf(id) > -1) {
        return;
    }
    body.dataset[bodyDatasetName] += ",".concat(id);
};
exports.registerLockIdOnBody = registerLockIdOnBody;
var unregisterLockIdOnBody = function (element) {
    var body = getBody();
    if (!body.dataset[bodyDatasetName]) {
        return;
    }
    if (body.dataset[bodyDatasetName].indexOf(",") === -1) {
        body.removeAttribute("data-".concat(bodyDatasetName));
        return;
    }
    var id = getElementLockId(element);
    body.dataset[bodyDatasetName] = body.dataset[bodyDatasetName].replace(",".concat(id), "");
    return;
};
var registerLockIdOnElement = function (element, id) {
    return (element.dataset[elementDatasetName] = id);
};
exports.registerLockIdOnElement = registerLockIdOnElement;
var getElementLockId = function (element) {
    return element.dataset[elementDatasetName];
};
var getAllLockedElements = function () {
    return document.querySelectorAll("[data-".concat(elementDatasetName, "]"));
};
var hasActiveScrollLocks = function () {
    return getAllLockedElements().length > 0;
};
var unregisterLockIdOnElement = function (element) {
    return element.removeAttribute("data-".concat(elementDatasetName));
};
var getBody = function () {
    return getElement('body');
};
var getHtml = function () {
    return getElement('html');
};
var getElement = function (selector) {
    var element = document.querySelector(selector);
    if (!element) {
        throw "could not locate ".concat(selector, " in DOM");
    }
    return element;
};
var preventTouchmoveHandler = function (e) {
    try {
        e.preventDefault();
    }
    catch (e) { }
};
var getChildNodesHeight = function (children) {
    var height = 0;
    for (var _i = 0, _a = children; _i < _a.length; _i++) {
        var child = _a[_i];
        height = height + child.getBoundingClientRect().height;
    }
    return height;
};
var isIOS = typeof window !== "undefined" &&
    ((navigator.userAgent.indexOf("Mac") > -1 && "ontouchend" in document) ||
        (function () {
            var isIOSDevice = false;
            ["iPad", "iPhone", "iPod"].forEach(function (device) {
                if (navigator.platform.indexOf(device) > -1) {
                    isIOSDevice = true;
                }
            });
            return isIOSDevice;
        })());
//# sourceMappingURL=lib.js.map