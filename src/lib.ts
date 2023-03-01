/**
 * Constants
 */
const bodyDatasetName = "tsslock";
const elementDatasetName = "tsslockid";
const styleBackupDatasetName = "tsslockstyle";
const version = '0.11.3';

const lockStyleBody = ";overscroll-behavior:none!important;-webkit-overflow-scrolling: auto!important;";
const lockStyleHTML = lockStyleBody + "overflow:hidden!important;"

// used to fix iOS body scrolling when content is not large enough to be scrolled but has overflow-y: scroll
const scrollYContentLockStyle = ";overflow-y:unset!important;";

export const getVersion = () => version;

/**
 * Lock Handler
 */
export const removeAllScrollLocks = (observer: ResizeObserver | null) => {
  getAllLockedElements().forEach((element) => {
    if (!(element instanceof HTMLElement)) {
      console.warn(
        "removing scroll lock for Elment",
        element,
        "is not possible, as it is not a HTMLElement"
      );
      return;
    }
    removeScrollLock(element, observer);
  });
  unlockBodyScroll();
};

export const removeScrollLock = (element: HTMLElement, observer: ResizeObserver | null) => {
  unregisterLockIdOnBody(element);
  unlockScrollElement(element);
  if (observer) {
    observer.disconnect();
  }

  if (!hasActiveScrollLocks()) {
    unlockBodyScroll();
  }
};

export const lockBodyScroll = () => {
  const html = getHtml();
  const body = getBody();

  addStyleOverride(html, lockStyleHTML);
  addStyleOverride(body, lockStyleBody);
};

export const getLockContentScrollResizeObserver = (): ResizeObserver | null => {
  if (!document) {
    return null;
  }
  return new ResizeObserver((entries) => {
    if (entries) {
      const scrollContentElement = entries[0]?.target.parentElement;
      if (scrollContentElement && scrollContentElement.parentElement) {
        unlockScrollElement(scrollContentElement);
        lockContentScrollElement(scrollContentElement.parentElement, scrollContentElement)
      }
    }
  });
}

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
  const html = getHtml();
  const body = getBody();

  removeStyleOverride(html);
  removeStyleOverride(body);
};

const lockScrollElement = (element: HTMLElement) => {
  addStyleOverride(element, scrollYContentLockStyle);

  if (isIOS) {
    element.addEventListener("touchmove", preventTouchmoveHandler);
  }
};

const unlockScrollElement = (element: HTMLElement) => {
  removeStyleOverride(element);
  unregisterLockIdOnElement(element);

  if (isIOS) {
    element.removeEventListener("touchmove", preventTouchmoveHandler);
  }
};

/**
 * Inline Style handler
 */
const addStyleOverride = (element: HTMLElement, styleOverride: string) => {
  if (typeof element.dataset[styleBackupDatasetName] === 'string') {
    // style is already applied
    return;
  }
  // set some style as default
  element.dataset[styleBackupDatasetName] = '';

  const currentStyle = element.getAttribute("style");
  if (currentStyle === null) {
    return element.setAttribute("style", styleOverride);
  }
  if (currentStyle.length > 0) {
    // store current inline style
    element.dataset[styleBackupDatasetName] = currentStyle;
  }
  return element.setAttribute("style", `${currentStyle}${styleOverride}`);
};

const removeStyleOverride = (element: HTMLElement) => {
  const currentStyle = element.getAttribute("style");
  if (currentStyle == null) {
    return;
  }
  const storedStyle = element.dataset[styleBackupDatasetName];
  element.removeAttribute("data-".concat(styleBackupDatasetName))

  if (!storedStyle) {
    return element.removeAttribute("style");
  }
  return element.setAttribute("style", storedStyle);
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
  return getElement('body');
};

const getHtml = () => {
  return getElement('html');
}

const getElement = (selector: string): HTMLElement => {
  const element = document.querySelector(selector);
  if (!(element instanceof HTMLElement)) {
    throw `could not locate ${selector} in DOM`
  }
  return element;
}

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
