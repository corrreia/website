import { useState, useCallback, useEffect } from "react";

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
    updateWindow: (id: string, updates: Partial<WindowState>) => void;
    bringToFront: (id: string) => void;
    startDrag: (id: string, startX: number, startY: number) => void;
    startResize: (id: string, direction: string, startX: number, startY: number) => void;
    toggleMinimize: (id: string) => void;
    toggleMaximize: (id: string) => void;
    closeWindow: (id: string) => void;
    openWindow: (id: string) => void;
    addWindow: (window: Omit<WindowState, 'zIndex'>) => void;
    isDragging: boolean;
    isResizing: boolean;
    isInitialized: boolean;
    clearStorage: () => void;
}

// localStorage helper functions
const STORAGE_KEY = 'windowManager-state';

interface StoredState {
    windows: Record<string, WindowState>;
    maxZIndex: number;
}

const saveToLocalStorage = (state: StoredState) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn('Failed to save window state to localStorage:', error);
    }
};

const loadFromLocalStorage = (): StoredState | null => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const parsed = JSON.parse(stored);

        // Validate the structure
        if (
            typeof parsed === 'object' &&
            parsed.windows &&
            typeof parsed.maxZIndex === 'number'
        ) {
            return parsed;
        }

        return null;
    } catch (error) {
        console.warn('Failed to load window state from localStorage:', error);
        return null;
    }
};

export function useWindowManager(): WindowManagerReturn {
    const [windows, setWindows] = useState<Record<string, WindowState>>({});
    const [maxZIndex, setMaxZIndex] = useState(1000);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [, setViewportSize] = useState({ width: 0, height: 0 });

    // Helper function to get current window configurations  
    const getCurrentWindowConfigs = useCallback(() => [
        { id: "contact", title: "Contact Information", width: 420, height: 480, isContact: true },
        { id: "about", title: "About Me", width: 400, height: 350, isContact: false },
        { id: "project", title: "OS Information", width: 450, height: 400, isContact: false },
        { id: "skills", title: "Skills", width: 380, height: 450, isContact: false },
        { id: "cheerpx", title: "Terminal", width: 700, height: 500, isContact: false },
        { id: "chat", title: "Global Chat", width: 400, height: 500, isContact: false },
    ], []);

    // Load state from localStorage on mount
    useEffect(() => {
        const stored = loadFromLocalStorage();
        let currentWindows: Record<string, WindowState> = {};
        let currentMaxZIndex = 1000;

        if (stored) {
            currentWindows = { ...stored.windows };
            currentMaxZIndex = stored.maxZIndex;
        } else {
            // If no stored state, only open the contact window initially
            const contactConfig = getCurrentWindowConfigs().find(config => config.id === "contact");
            if (contactConfig) {
                const headerHeight = 140;
                const viewportWidth = globalThis?.window?.innerWidth || 1200;
                const viewportHeight = globalThis?.window?.innerHeight || 800;

                const centerX = Math.max(0, (viewportWidth - contactConfig.width) / 2);
                const centerY = Math.max(0, (viewportHeight - contactConfig.height - headerHeight) / 2) + headerHeight;

                currentWindows[contactConfig.id] = {
                    id: contactConfig.id,
                    title: contactConfig.title,
                    x: centerX,
                    y: centerY,
                    width: contactConfig.width,
                    height: contactConfig.height,
                    zIndex: ++currentMaxZIndex,
                    isMinimized: false,
                    isMaximized: false,
                    isVisible: true,
                };
            }
        }

        setWindows(currentWindows);
        setMaxZIndex(currentMaxZIndex);

        // Set initial viewport size
        if (typeof globalThis !== 'undefined' && globalThis.window) {
            setViewportSize({
                width: globalThis.window.innerWidth,
                height: globalThis.window.innerHeight
            });
        }

        setIsInitialized(true);
    }, [getCurrentWindowConfigs]);

    // Listen for viewport changes
    useEffect(() => {
        if (typeof globalThis === 'undefined' || !globalThis.window) return;

        const handleResize = () => {
            const newWidth = globalThis.window.innerWidth;
            const newHeight = globalThis.window.innerHeight;
            setViewportSize({ width: newWidth, height: newHeight });
        };

        globalThis.window.addEventListener('resize', handleResize);

        return () => {
            globalThis.window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Save state to localStorage whenever windows or maxZIndex change
    useEffect(() => {
        if (!isInitialized) return; // Don't save during initial load

        const state: StoredState = {
            windows,
            maxZIndex,
        };

        saveToLocalStorage(state);
    }, [windows, maxZIndex, isInitialized]);

    const updateWindow = useCallback((id: string, updates: Partial<WindowState>) => {
        setWindows(prevWindows => {
            const existingWindow = prevWindows[id];
            if (!existingWindow) return prevWindows;

            return {
                ...prevWindows,
                [id]: { ...existingWindow, ...updates }
            };
        });
    }, []);

    const bringToFront = useCallback((id: string) => {
        setWindows(prevWindows => {
            if (!prevWindows[id]) return prevWindows;

            const newZIndex = maxZIndex + 1;
            setMaxZIndex(newZIndex);

            return {
                ...prevWindows,
                [id]: { ...prevWindows[id], zIndex: newZIndex }
            };
        });
    }, [maxZIndex]);

    const addWindow = useCallback((window: Omit<WindowState, 'zIndex'>) => {
        const newZIndex = maxZIndex + 1;
        setMaxZIndex(newZIndex);

        setWindows(prevWindows => ({
            ...prevWindows,
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
                setIsDragging(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.userSelect = '';
                document.body.style.cursor = '';
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

                if (direction.includes('e')) newWidth = Math.max(200, startWidth + deltaX);
                if (direction.includes('w')) {
                    newWidth = Math.max(200, startWidth - deltaX);
                    newX = startWindowX + (startWidth - newWidth);
                }
                if (direction.includes('s')) newHeight = Math.max(150, startHeight + deltaY);
                if (direction.includes('n')) {
                    newHeight = Math.max(150, startHeight - deltaY);
                    newY = startWindowY + (startHeight - newHeight);
                }

                updateWindow(id, { width: newWidth, height: newHeight, x: newX, y: newY });
            };

            const handleMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.userSelect = '';
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = 'none';

            return currentWindows;
        });
    }, [updateWindow, bringToFront]);

    const closeWindow = useCallback((id: string) => {
        setWindows(prevWindows => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [id]: _, ...rest } = prevWindows;
            return rest;
        });
    }, []);

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

    const toggleMinimize = useCallback((id: string) => {
        // Minimizing now just closes the window
        closeWindow(id);
    }, [closeWindow]);

    const openWindow = useCallback((id: string) => {
        // Check if window is already open
        if (windows[id]) {
            // Just bring to front
            bringToFront(id);
            return;
        }

        // Create new window from config
        const config = getCurrentWindowConfigs().find(c => c.id === id);
        if (!config) return;

        const headerHeight = 140;
        const viewportWidth = globalThis?.window?.innerWidth || 1200;
        const viewportHeight = globalThis?.window?.innerHeight || 800;
        const padding = 50;

        // Generate a random position
        const x = Math.random() * (viewportWidth - config.width - padding * 2) + padding;
        const y = Math.random() * (viewportHeight - config.height - headerHeight - padding) + headerHeight;

        addWindow({
            id: config.id,
            title: config.title,
            x: Math.round(x),
            y: Math.round(y),
            width: config.width,
            height: config.height,
            isMinimized: false,
            isMaximized: false,
            isVisible: true,
        });
    }, [windows, bringToFront, getCurrentWindowConfigs, addWindow]);

    const clearStorage = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            // Reset to initial state
            setWindows({});
            setMaxZIndex(1000);
        } catch (error) {
            console.warn('Failed to clear localStorage:', error);
        }
    }, []);

    return {
        windows,
        updateWindow,
        bringToFront,
        startDrag,
        startResize,
        toggleMinimize,
        toggleMaximize,
        closeWindow,
        openWindow,
        addWindow,
        isDragging,
        isResizing,
        isInitialized,
        clearStorage,
    };
} 