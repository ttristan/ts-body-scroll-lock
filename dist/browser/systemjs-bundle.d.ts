declare module "lib" {
    export const removeAllScrollLocks: () => void;
    export const removeScrollLock: (element: HTMLElement) => void;
    export const lockBodyScroll: () => void;
    export const lockContentScrollElement: (containerElement: HTMLElement, scrollContentElement: HTMLElement) => void;
    export const registerLockIdOnBody: (id: string) => void;
    export const registerLockIdOnElement: (element: HTMLElement, id: string) => string;
}
declare module "index" {
    import { lockBodyScroll, removeAllScrollLocks, removeScrollLock } from "lib";
    export { removeScrollLock, useBodyScrollLock, lockBodyScroll, removeAllScrollLocks, };
    export default function useBodyScrollLock(id: string, containerElement: HTMLElement, scrollContentElement?: HTMLElement): {
        removeScrollLock: () => void;
        removeAllScrollLocks: () => void;
    };
}
