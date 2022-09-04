import {
  registerLockIdOnBody,
  registerLockIdOnElement,
  lockBodyScroll,
  removeAllScrollLocks,
  lockElement,
  removeScrollLock,
} from "./lib";

export {
  removeScrollLock,
  useBodyScrollLock,
  lockBodyScroll,
  removeAllScrollLocks,
};

export default function useBodyScrollLock(
  id: string,
  containerElement: HTMLElement,
  contentElement?: HTMLElement
) {
  registerLockIdOnBody(id);
  registerLockIdOnElement(containerElement, id);
  lockBodyScroll();

  if (contentElement) {
    const containerHeight = containerElement.getBoundingClientRect().height;
    const contentHeight = contentElement.getBoundingClientRect().height;
    if (containerHeight >= contentHeight) {
      lockElement(containerElement);
    }
  }

  return {
    removeScrollLock: () => removeScrollLock(containerElement),
    removeAllScrollLocks,
  };
}
