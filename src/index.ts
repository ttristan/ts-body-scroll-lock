import {
  registerLockIdOnBody,
  registerLockIdOnElement,
  lockBodyScroll,
  removeAllScrollLocks,
  lockContentScrollElement,
  removeScrollLock, lockContentScrollResizeObserver,
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

  if (scrollContentElement && lockContentScrollResizeObserver) {
    lockContentScrollElement(containerElement, scrollContentElement);
    Array.from(scrollContentElement.children).forEach((child: Element) => {
      lockContentScrollResizeObserver.observe(child)
    })
  }

  return {
    removeScrollLock: () => removeScrollLock(containerElement),
    removeAllScrollLocks,
  };
}
