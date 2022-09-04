"use strict";
exports.__esModule = true;
exports.registerLockIdOnElement = exports.registerLockIdOnBody = exports.lockElement = exports.lockBodyScroll = exports.removeScrollLock = exports.removeAllScrollLocks = void 0;
/**
 * Constants
 */
var bodyDatasetName = "tsslock";
var elementDatasetName = "tsslockid";
var bodyLockStyle = ";touch-action:none!important;overscroll-behavior:none!important;overflow:hidden!important;";
// used to fix iOS body scrolling when content is not large enough to be scrolled but has overflow-y: scroll
var contentLockStyle = ";overflow-y:hidden!important;";
var preventTouchmoveHandler = function (e) { return e.preventDefault(); };
/**
 * Lock Handler
 */
var removeAllScrollLocks = function () {
    getAllLockedElements().forEach(function (element) {
        (0, exports.removeScrollLock)(element);
    });
    unlockBodyScroll();
};
exports.removeAllScrollLocks = removeAllScrollLocks;
var removeScrollLock = function (element) {
    unregisterLockIdOnBody(element);
    unlockElement(element);
    if (!hasActiveScrollLocks()) {
        unlockBodyScroll();
    }
};
exports.removeScrollLock = removeScrollLock;
var lockBodyScroll = function () {
    var body = getBody();
    addStyleOverride(body, bodyLockStyle);
};
exports.lockBodyScroll = lockBodyScroll;
var unlockBodyScroll = function () {
    var body = getBody();
    removeStyleOverride(body, bodyLockStyle);
};
var lockElement = function (element) {
    addStyleOverride(element, contentLockStyle);
    element.addEventListener("touchmove", preventTouchmoveHandler, {
        passive: true
    });
};
exports.lockElement = lockElement;
var unlockElement = function (element) {
    removeStyleOverride(element, contentLockStyle);
    unregisterLockIdOnElement(element);
    element.removeEventListener("touchmove", preventTouchmoveHandler);
};
/**
 * Inline Style handler
 */
var addStyleOverride = function (element, styleOverride) {
    var currentStyle = element.getAttribute("style");
    if (currentStyle === null) {
        return element.setAttribute("style", styleOverride);
    }
    if (currentStyle.includes(styleOverride)) {
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
/**
 * Body Lock Id handling
 */
var registerLockIdOnBody = function (id) {
    var body = getBody();
    if (!body.dataset[bodyDatasetName]) {
        body.dataset[bodyDatasetName] = id;
        return;
    }
    if (body.dataset[bodyDatasetName].includes(id)) {
        console.warn("scroll lock already registered for ".concat(id, ", make sure to use unique ids for elements"));
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
    if (!body.dataset[bodyDatasetName].includes(",")) {
        body.removeAttribute("data-".concat(bodyDatasetName));
        return;
    }
    var id = getElementLockId(element);
    body.dataset[bodyDatasetName] = body.dataset[bodyDatasetName].replace(",".concat(id), "");
    return;
};
/**
 * Element Lock Id handling
 */
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
/**
 * DOM Helper
 */
var getBody = function () {
    var body = document.querySelector("body");
    if (!body) {
        throw "could no locate body in DOM";
    }
    return body;
};
/**
 * String.prototype.includes() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes#Polyfill
 */
if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';
        // @ts-expect-error
        if (search instanceof RegExp) {
            throw TypeError('first argument must not be a RegExp');
        }
        if (start === undefined) {
            start = 0;
        }
        return this.indexOf(search, start) !== -1;
    };
}
