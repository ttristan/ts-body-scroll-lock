"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLockIdOnElement = exports.registerLockIdOnBody = exports.lockElement = exports.lockBodyScroll = exports.removeScrollLock = exports.removeAllScrollLocks = void 0;
var bodyDatasetName = "tsslock";
var elementDatasetName = "tsslockid";
var bodyLockStyle = ";touch-action:none!important;overscroll-behavior:none!important;overflow:hidden!important;";
var scrollYContentLockStyle = ";overflow-y:unset!important;";
var preventTouchmoveHandler = function (e) {
    try {
        e.preventDefault();
    }
    catch (e) { }
};
var removeAllScrollLocks = function () {
    getAllLockedElements().forEach(function (element) {
        if (!(element instanceof HTMLElement)) {
            console.warn("removing scroll lock for Elment", element, "is not possible, as it is not a HTMLElement");
            return;
        }
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
    addStyleOverride(element, scrollYContentLockStyle);
    element.addEventListener("touchmove", preventTouchmoveHandler);
};
exports.lockElement = lockElement;
var unlockElement = function (element) {
    removeStyleOverride(element, scrollYContentLockStyle);
    unregisterLockIdOnElement(element);
    element.removeEventListener("touchmove", preventTouchmoveHandler);
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
    var body = document.querySelector("body");
    if (!body) {
        throw "could no locate body in DOM";
    }
    return body;
};
//# sourceMappingURL=lib.js.map