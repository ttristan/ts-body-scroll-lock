export declare const getVersion: () => string;
export declare const removeAllScrollLocks: (observer: ResizeObserver | null) => void;
export declare const removeScrollLock: (element: HTMLElement, observer: ResizeObserver | null) => void;
export declare const lockBodyScroll: () => void;
export declare const getLockContentScrollResizeObserver: () => ResizeObserver | null;
export declare const lockContentScrollElement: (containerElement: HTMLElement, scrollContentElement: HTMLElement) => void;
export declare const registerLockIdOnBody: (id: string) => void;
export declare const registerLockIdOnElement: (element: HTMLElement, id: string) => string;
