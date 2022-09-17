import {
  registerLockIdOnBody,
  registerLockIdOnElement,
  lockBodyScroll,
  removeAllScrollLocks,
  lockContentScrollElement,
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
  scrollContentElement?: HTMLElement
) {
  registerLockIdOnBody(id);
  registerLockIdOnElement(containerElement, id);
  lockBodyScroll();

  if (scrollContentElement) {
    lockContentScrollElement(containerElement, scrollContentElement);
  }

  return {
    removeScrollLock: () => removeScrollLock(containerElement),
    removeAllScrollLocks,
  };
}
