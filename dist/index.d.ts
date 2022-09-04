export default function useBodyScrollLock(id: string, containerElement: HTMLElement, contentElement?: HTMLElement): {
    removeScrollLock: () => void;
    removeAllScrollLocks: () => void;
};
