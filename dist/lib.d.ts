export declare const removeAllScrollLocks: () => void;
export declare const removeScrollLock: (element: HTMLElement) => void;
export declare const lockBodyScroll: () => void;
export declare const lockContentScrollResizeObserver: ResizeObserver;
export declare const lockContentScrollElement: (containerElement: HTMLElement, scrollContentElement: HTMLElement) => void;
export declare const registerLockIdOnBody: (id: string) => void;
export declare const registerLockIdOnElement: (element: HTMLElement, id: string) => string;
