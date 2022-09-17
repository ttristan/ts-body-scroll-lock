import { lockBodyScroll, removeAllScrollLocks, removeScrollLock } from "./lib";
export { removeScrollLock, useBodyScrollLock, lockBodyScroll, removeAllScrollLocks, };
export default function useBodyScrollLock(id: string, containerElement: HTMLElement, scrollContentElement?: HTMLElement): {
    removeScrollLock: () => void;
    removeAllScrollLocks: () => void;
};
