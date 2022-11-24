/**
 * Constants
 */
const bodyDatasetName = "tsslock";
const elementDatasetName = "tsslockid";
const bodyLockStyle =
  ";overscroll-behavior:none!important;overflow:hidden!important;";

// used to fix iOS body scrolling when content is not large enough to be scrolled but has overflow-y: scroll
const scrollYContentLockStyle = ";overflow-y:unset!important;";

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
  unlockScrollElement(element);
  if (lockContentScrollResizeObserver) {
    lockContentScrollResizeObserver.disconnect();
  }

  if (!hasActiveScrollLocks()) {
    unlockBodyScroll();
  }
};

export const lockBodyScroll = () => {
  const body = getBody();
  addStyleOverride(body, bodyLockStyle);
};

export const lockContentScrollResizeObserver = new ResizeObserver((entries) => {
  if (entries) {
    entries.map((entry) => {
      console.log(entry);
    })
    const scrollContentElement = entries[0].target.parentElement;
    if (scrollContentElement && scrollContentElement.parentElement) {
      unlockScrollElement(scrollContentElement);
      lockContentScrollElement(scrollContentElement.parentElement, scrollContentElement)
    }
  }
})

// used to fix iOS body scrolling when content is not large enough to be scrolled but has overflow-y: scroll
export const lockContentScrollElement = (
  containerElement: HTMLElement,
  scrollContentElement: HTMLElement
) => {
  const containerHeight = containerElement.getBoundingClientRect().height;
  const contentHeight = scrollContentElement.getBoundingClientRect().height;
  // also get children height as contentHeight might be set to 100% and is scrollable
  const contentChildrenHeight = getChildNodesHeight(
    scrollContentElement.children
  );

  // only lock element if wrapper or children are larger
  if (
    containerHeight >= contentHeight &&
    containerHeight >= contentChildrenHeight
  ) {
    lockScrollElement(scrollContentElement);
  }
};

const unlockBodyScroll = () => {
  const body = getBody();

  removeStyleOverride(body, bodyLockStyle);
};

const lockScrollElement = (element: HTMLElement) => {
  addStyleOverride(element, scrollYContentLockStyle);

  if (isIOS) {
    element.addEventListener("touchmove", preventTouchmoveHandler);
  }
};

const unlockScrollElement = (element: HTMLElement) => {
  removeStyleOverride(element, scrollYContentLockStyle);
  unregisterLockIdOnElement(element);

  if (isIOS) {
    element.removeEventListener("touchmove", preventTouchmoveHandler);
  }
};

/**
 * Inline Style handler
 */
const addStyleOverride = (element: HTMLElement, styleOverride: string) => {
  const currentStyle = element.getAttribute("style");
  if (currentStyle === null) {
    console.log('set style');
    return element.setAttribute("style", styleOverride);
  }
  if (currentStyle.indexOf(styleOverride) > -1) {
    console.log('return');
    return;
  }
  console.log('add style');
  return element.setAttribute("style", `${currentStyle}${styleOverride}`);
};

const removeStyleOverride = (element: HTMLElement, styleOverride: string) => {
  const currentStyle = element.getAttribute("style");
  if (currentStyle == null) {
    return;
  }
  // this is more complicated than it could be but it makes sure we do not override user-defined inline styles
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

const preventTouchmoveHandler = (e: TouchEvent) => {
  try {
    e.preventDefault();
  } catch (e) {}
};

const getChildNodesHeight = (children: HTMLCollection) => {
  let height = 0;

  for (const child of <any>children) {
    height = height + child.getBoundingClientRect().height;
  }

  return height;
};

const isIOS =
  typeof window !== "undefined" && // prevent SSR context
  ((navigator.userAgent.indexOf("Mac") > -1 && "ontouchend" in document) ||
    (() => {
      let isIOSDevice = false;
      ["iPad", "iPhone", "iPod"].forEach((device: string) => {
        if (navigator.platform.indexOf(device) > -1) {
          isIOSDevice = true;
        }
      });
      return isIOSDevice;
    })());
