const bodyDatasetName = "tsslock";
const elementDatasetName = "tsslockid";
const bodyLockStyle = ";touch-action:none!important;overscroll-behavior:none!important;overflow:hidden!important;";
const scrollContentLockStyle = ";overflow-y:hidden!important;";
const preventTouchmoveHandler = (e) => {
    try {
        e.preventDefault();
    }
    catch (e) { }
};
export const removeAllScrollLocks = () => {
    getAllLockedElements().forEach((element) => {
        if (!(element instanceof HTMLElement)) {
            console.warn("removing scroll lock for Elment", element, "is not possible, as it is not a HTMLElement");
            return;
        }
        removeScrollLock(element);
    });
    unlockBodyScroll();
};
export const removeScrollLock = (element) => {
    unregisterLockIdOnBody(element);
    unlockElement(element);
    if (!hasActiveScrollLocks()) {
        unlockBodyScroll();
    }
};
export const lockBodyScroll = () => {
    const body = getBody();
    addStyleOverride(body, bodyLockStyle);
};
const unlockBodyScroll = () => {
    const body = getBody();
    removeStyleOverride(body, bodyLockStyle);
};
export const lockElement = (element) => {
    addStyleOverride(element, scrollContentLockStyle);
    element.addEventListener("touchmove", preventTouchmoveHandler);
};
const unlockElement = (element) => {
    removeStyleOverride(element, scrollContentLockStyle);
    unregisterLockIdOnElement(element);
    element.removeEventListener("touchmove", preventTouchmoveHandler);
};
const addStyleOverride = (element, styleOverride) => {
    const currentStyle = element.getAttribute("style");
    if (currentStyle === null) {
        return element.setAttribute("style", styleOverride);
    }
    if (currentStyle.includes(styleOverride)) {
        return;
    }
    return element.setAttribute("style", `${currentStyle}${styleOverride}`);
};
const removeStyleOverride = (element, styleOverride) => {
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
export const registerLockIdOnBody = (id) => {
    const body = getBody();
    if (!body.dataset[bodyDatasetName]) {
        body.dataset[bodyDatasetName] = id;
        return;
    }
    if (body.dataset[bodyDatasetName].includes(id)) {
        return;
    }
    body.dataset[bodyDatasetName] += `,${id}`;
};
const unregisterLockIdOnBody = (element) => {
    const body = getBody();
    if (!body.dataset[bodyDatasetName]) {
        return;
    }
    if (!body.dataset[bodyDatasetName].includes(",")) {
        body.removeAttribute(`data-${bodyDatasetName}`);
        return;
    }
    const id = getElementLockId(element);
    body.dataset[bodyDatasetName] = body.dataset[bodyDatasetName].replace(`,${id}`, "");
    return;
};
export const registerLockIdOnElement = (element, id) => {
    return (element.dataset[elementDatasetName] = id);
};
const getElementLockId = (element) => {
    return element.dataset[elementDatasetName];
};
const getAllLockedElements = () => document.querySelectorAll(`[data-${elementDatasetName}]`);
const hasActiveScrollLocks = () => {
    return getAllLockedElements().length > 0;
};
const unregisterLockIdOnElement = (element) => {
    return element.removeAttribute(`data-${elementDatasetName}`);
};
const getBody = () => {
    const body = document.querySelector("body");
    if (!body) {
        throw "could no locate body in DOM";
    }
    return body;
};
//# sourceMappingURL=lib.js.map