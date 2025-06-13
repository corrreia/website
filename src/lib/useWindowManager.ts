import { useState, useCallback } from "react";

export interface WindowState {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    isMinimized: boolean;
    isMaximized: boolean;
    isVisible: boolean;
    title: string;
}

export interface WindowManagerReturn {
    windows: Record<string, WindowState>;
    closedWindows: Record<string, WindowState>;
    updateWindow: (id: string, updates: Partial<WindowState>) => void;
    bringToFront: (id: string) => void;
    startDrag: (id: string, startX: number, startY: number) => void;
    startResize: (id: string, direction: string, startX: number, startY: number) => void;
    toggleMinimize: (id: string) => void;
    toggleMaximize: (id: string) => void;
    closeWindow: (id: string) => void;
    restoreWindow: (id: string) => void;
    addWindow: (window: Omit<WindowState, 'zIndex'>) => void;
    isDragging: boolean;
    isResizing: boolean;
}

export function useWindowManager(): WindowManagerReturn {
    const [windows, setWindows] = useState<Record<string, WindowState>>({});
    const [closedWindows, setClosedWindows] = useState<Record<string, WindowState>>({});
    const [maxZIndex, setMaxZIndex] = useState(1000);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const updateWindow = useCallback((id: string, updates: Partial<WindowState>) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], ...updates }
        }));
    }, []);

    const bringToFront = useCallback((id: string) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        updateWindow(id, { zIndex: newZIndex });
    }, [maxZIndex, updateWindow]);

    const addWindow = useCallback((window: Omit<WindowState, 'zIndex'>) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);
        setWindows(prev => ({
            ...prev,
            [window.id]: { ...window, zIndex: newZIndex }
        }));
    }, [maxZIndex]);

    const startDrag = useCallback((id: string, startX: number, startY: number) => {
        setWindows(currentWindows => {
            const window = currentWindows[id];
            if (!window) {
                return currentWindows;
            }
            if (window.isMaximized) {
                return currentWindows;
            }

            bringToFront(id);
            setIsDragging(true);

            const startWindowX = window.x;
            const startWindowY = window.y;

            const handleMouseMove = (e: MouseEvent) => {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                const newX = Math.max(0, startWindowX + deltaX);
                const newY = Math.max(0, startWindowY + deltaY);

                updateWindow(id, { x: newX, y: newY });
            };

            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.userSelect = '';
                document.body.style.cursor = '';
                setIsDragging(false);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'grabbing';

            return currentWindows;
        });
    }, [updateWindow, bringToFront]);

    const startResize = useCallback((id: string, direction: string, startX: number, startY: number) => {
        setWindows(currentWindows => {
            const window = currentWindows[id];
            if (!window || window.isMaximized) return currentWindows;

            bringToFront(id);
            setIsResizing(true);

            const startWidth = window.width;
            const startHeight = window.height;
            const startWindowX = window.x;
            const startWindowY = window.y;

            const handleMouseMove = (e: MouseEvent) => {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                let newWidth = startWidth;
                let newHeight = startHeight;
                let newX = startWindowX;
                let newY = startWindowY;

                // Handle different resize directions
                if (direction.includes('e')) {
                    newWidth = Math.max(320, startWidth + deltaX);
                }
                if (direction.includes('w')) {
                    newWidth = Math.max(320, startWidth - deltaX);
                    newX = startWindowX + (startWidth - newWidth);
                }
                if (direction.includes('s')) {
                    newHeight = Math.max(240, startHeight + deltaY);
                }
                if (direction.includes('n')) {
                    newHeight = Math.max(240, startHeight - deltaY);
                    newY = startWindowY + (startHeight - newHeight);
                }

                updateWindow(id, {
                    width: newWidth,
                    height: newHeight,
                    x: Math.max(0, newX),
                    y: Math.max(0, newY),
                });
            };

            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.userSelect = '';
                document.body.style.cursor = '';
                setIsResizing(false);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'resizing';

            return currentWindows;
        });
    }, [updateWindow, bringToFront]);

    const toggleMaximize = useCallback((id: string) => {
        const window = windows[id];
        if (!window) return;

        if (window.isMaximized) {
            // Restore to previous size and position
            updateWindow(id, {
                isMaximized: false,
                x: window.x,
                y: window.y,
                width: Math.max(320, window.width),
                height: Math.max(240, window.height),
            });
        } else {
            // Maximize to viewport
            updateWindow(id, {
                isMaximized: true,
                x: 0,
                y: 0,
                width: window.width,
                height: window.height,
            });
        }
    }, [windows, updateWindow]);

    const closeWindow = useCallback((id: string) => {
        setWindows(prev => {
            const { [id]: windowToClose, ...rest } = prev;
            if (windowToClose) {
                // Store the window in closedWindows
                setClosedWindows(closedPrev => ({
                    ...closedPrev,
                    [id]: windowToClose
                }));
            }
            return rest;
        });
    }, []);

    const toggleMinimize = useCallback((id: string) => {
        // Minimizing now works the same as closing - moves window to restore panel
        closeWindow(id);
    }, [closeWindow]);

    const restoreWindow = useCallback((id: string) => {
        setClosedWindows(prev => {
            const { [id]: windowToRestore, ...rest } = prev;
            if (windowToRestore) {
                // Add the window back with a new z-index
                const newZIndex = maxZIndex + 1;
                setMaxZIndex(newZIndex);
                setWindows(windowsPrev => ({
                    ...windowsPrev,
                    [id]: { ...windowToRestore, zIndex: newZIndex }
                }));
            }
            return rest;
        });
    }, [maxZIndex]);

    return {
        windows,
        closedWindows,
        updateWindow,
        bringToFront,
        startDrag,
        startResize,
        toggleMinimize,
        toggleMaximize,
        closeWindow,
        restoreWindow,
        addWindow,
        isDragging,
        isResizing,
    };
} 