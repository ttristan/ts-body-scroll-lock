/**
 * Constants
 */
const bodyDatasetName = "tsslock";
const elementDatasetName = "tsslockid";
const bodyLockStyle =
  ";touch-action:none!important;overscroll-behavior:none!important;overflow:hidden!important;";

// used to fix iOS body scrolling when content is not large enough to be scrolled but has overflow-y: scroll
const scrollContentLockStyle = ";overflow-y:hidden!important;";
const preventTouchmoveHandler = (e: TouchEvent) => {
  try {
    e.preventDefault();
  } catch (e) {}
};

/**
 * Lock Handler
 */
export const removeAllScrollLocks = () => {
  getAllLockedElements().forEach((element) => {
    if (!(element instanceof HTMLElement)) {
      console.warn(
        "removing scroll lock for Elment",
        element,
        "is not possible, as it is not a HTMLElement"
      );
      return;
    }
    removeScrollLock(element);
  });
  unlockBodyScroll();
};

export const removeScrollLock = (element: HTMLElement) => {
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

export const lockElement = (element: HTMLElement) => {
  addStyleOverride(element, scrollContentLockStyle);
  element.addEventListener("touchmove", preventTouchmoveHandler);
};

const unlockElement = (element: HTMLElement) => {
  removeStyleOverride(element, scrollContentLockStyle);
  unregisterLockIdOnElement(element);
  element.removeEventListener("touchmove", preventTouchmoveHandler);
};

/**
 * Inline Style handler
 */
const addStyleOverride = (element: HTMLElement, styleOverride: string) => {
  const currentStyle = element.getAttribute("style");
  if (currentStyle === null) {
    return element.setAttribute("style", styleOverride);
  }
  if (currentStyle.indexOf(styleOverride) > -1) {
    return;
  }
  return element.setAttribute("style", `${currentStyle}${styleOverride}`);
};

const removeStyleOverride = (element: HTMLElement, styleOverride: string) => {
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

/**
 * Body Lock Id handling
 */
export const registerLockIdOnBody = (id: string) => {
  const body = getBody();
  if (!body.dataset[bodyDatasetName]) {
    body.dataset[bodyDatasetName] = id;
    return;
  }
  if (body.dataset[bodyDatasetName].indexOf(id) > -1) {
    return;
  }
  body.dataset[bodyDatasetName] += `,${id}`;
};

const unregisterLockIdOnBody = (element: HTMLElement) => {
  const body = getBody();
  if (!body.dataset[bodyDatasetName]) {
    return;
  }
  if (body.dataset[bodyDatasetName].indexOf(",") === -1) {
    body.removeAttribute(`data-${bodyDatasetName}`);
    return;
  }
  const id = getElementLockId(element);
  body.dataset[bodyDatasetName] = body.dataset[bodyDatasetName].replace(
    `,${id}`,
    ""
  );

  return;
};

/**
 * Element Lock Id handling
 */
export const registerLockIdOnElement = (element: HTMLElement, id: string) => {
  return (element.dataset[elementDatasetName] = id);
};

const getElementLockId = (element: HTMLElement) => {
  return element.dataset[elementDatasetName];
};

const getAllLockedElements = () =>
  document.querySelectorAll(`[data-${elementDatasetName}]`);

const hasActiveScrollLocks = () => {
  return getAllLockedElements().length > 0;
};

const unregisterLockIdOnElement = (element: HTMLElement) => {
  return element.removeAttribute(`data-${elementDatasetName}`);
};

/**
 * DOM Helper
 */
const getBody = () => {
  const body = document.querySelector("body");
  if (!body) {
    throw "could no locate body in DOM";
  }
  return body;
};