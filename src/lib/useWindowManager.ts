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
    closedWindows: Record<string, WindowState>;
    updateWindow: (id: string, updates: Partial<WindowState>) => void;
    bringToFront: (id: string) => void;
    startDrag: (id: string, startX: number, startY: number) => void;
    startResize: (id: string, direction: string, startX: number, startY: number) => void;
    toggleMinimize: (id: string) => void;
    toggleMaximize: (id: string) => void;
    closeWindow: (id: string) => void;
    restoreWindow: (id: string) => void;
    showWindowCentered: (id: string) => void;
    addWindow: (window: Omit<WindowState, 'zIndex'>) => void;
    generateRandomWindowPositions: () => Array<{ id: string; title: string; x: number; y: number; width: number; height: number; isContact: boolean }>;
    checkAndMinimizeOutsideWindows: () => void;
    isDragging: boolean;
    isResizing: boolean;
    isInitialized: boolean;
    clearStorage: () => void;
}

// localStorage helper functions
const STORAGE_KEY = 'windowManager-state';

interface StoredState {
    windows: Record<string, WindowState>;
    closedWindows: Record<string, WindowState>;
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
            parsed.closedWindows &&
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
    const [closedWindows, setClosedWindows] = useState<Record<string, WindowState>>({});
    const [maxZIndex, setMaxZIndex] = useState(1000);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [, setViewportSize] = useState({ width: 0, height: 0 });

    // Function to check if a window is outside viewport boundaries
    const isWindowOutsideViewport = useCallback((window: WindowState, viewportWidth: number, viewportHeight: number) => {
        const headerHeight = 140; // Safe margin below header
        const tolerance = 100; // Allow some pixels to remain visible

        const windowRight = window.x + window.width;
        const windowBottom = window.y + window.height;

        // Check if window is completely outside viewport boundaries
        const isOutsideLeft = windowRight < tolerance;
        const isOutsideRight = window.x > viewportWidth - tolerance;
        const isOutsideTop = windowBottom < headerHeight;
        const isOutsideBottom = window.y > viewportHeight - tolerance;

        return isOutsideLeft || isOutsideRight || isOutsideTop || isOutsideBottom;
    }, []);

    // Function to check and minimize windows outside viewport
    // Helper function to get current window configurations  
    const getCurrentWindowConfigs = useCallback(() => [
        { id: "contact", title: "Contact Information", width: 420, height: 480, isContact: true },
        { id: "about", title: "About Me", width: 400, height: 350, isContact: false },
        { id: "project", title: "OS Information", width: 450, height: 400, isContact: false },
        { id: "skills", title: "Skills", width: 380, height: 450, isContact: false },
        { id: "cheerpx", title: "Terminal", width: 700, height: 500, isContact: false },
        { id: "chat", title: "Global Chat", width: 400, height: 500, isContact: false },
    ], []);

    const checkAndMinimizeOutsideWindows = useCallback(() => {
        if (typeof globalThis === 'undefined' || !globalThis.window) return;

        const viewportWidth = globalThis.window.innerWidth;
        const viewportHeight = globalThis.window.innerHeight;

        setWindows(currentWindows => {
            const updatedWindows = { ...currentWindows };
            let hasChanges = false;

            Object.entries(currentWindows).forEach(([id, window]) => {
                if (!window.isMaximized && isWindowOutsideViewport(window, viewportWidth, viewportHeight)) {
                    // Move window to closedWindows (minimize it)
                    setClosedWindows(prev => ({
                        ...prev,
                        [id]: window
                    }));
                    delete updatedWindows[id];
                    hasChanges = true;
                }
            });

            return hasChanges ? updatedWindows : currentWindows;
        });
    }, [isWindowOutsideViewport]);

    // Load state from localStorage on mount and check boundaries
    useEffect(() => {
        const stored = loadFromLocalStorage();
        let currentWindows: Record<string, WindowState> = {};
        let currentClosedWindows: Record<string, WindowState> = {};
        let currentMaxZIndex = 1000;

        if (stored) {
            currentWindows = { ...stored.windows };
            currentClosedWindows = { ...stored.closedWindows };
            currentMaxZIndex = stored.maxZIndex;

            // Check for missing windows that need to be added
            const currentConfigs = getCurrentWindowConfigs();
            const existingWindowIds = new Set([
                ...Object.keys(currentWindows),
                ...Object.keys(currentClosedWindows)
            ]);

            const missingConfigs = currentConfigs.filter(config => !existingWindowIds.has(config.id));

            if (missingConfigs.length > 0) {
                console.log(`Adding ${missingConfigs.length} new windows:`, missingConfigs.map(c => c.id));

                // Generate simple random positions for missing windows
                const headerHeight = 140;
                const viewportWidth = globalThis?.window?.innerWidth || 1200;
                const viewportHeight = globalThis?.window?.innerHeight || 800;
                const padding = 50;

                missingConfigs.forEach(config => {
                    // Generate a simple random position for each missing window
                    const x = Math.random() * (viewportWidth - config.width - padding * 2) + padding;
                    const y = Math.random() * (viewportHeight - config.height - headerHeight - padding) + headerHeight;

                    const newWindow: WindowState = {
                        id: config.id,
                        title: config.title,
                        x: Math.round(x),
                        y: Math.round(y),
                        width: config.width,
                        height: config.height,
                        zIndex: ++currentMaxZIndex,
                        isMinimized: false,
                        isMaximized: false,
                        isVisible: true,
                    };
                    currentWindows[config.id] = newWindow;
                });
            }
        }

        setWindows(currentWindows);
        setClosedWindows(currentClosedWindows);
        setMaxZIndex(currentMaxZIndex);

        // Set initial viewport size
        if (typeof globalThis !== 'undefined' && globalThis.window) {
            setViewportSize({
                width: globalThis.window.innerWidth,
                height: globalThis.window.innerHeight
            });
        }

        setIsInitialized(true);

        // Check boundaries after loading
        setTimeout(() => {
            checkAndMinimizeOutsideWindows();
        }, 100);
    }, [checkAndMinimizeOutsideWindows, getCurrentWindowConfigs]);

    // Listen for viewport changes
    useEffect(() => {
        if (typeof globalThis === 'undefined' || !globalThis.window) return;

        const handleResize = () => {
            const newWidth = globalThis.window.innerWidth;
            const newHeight = globalThis.window.innerHeight;

            setViewportSize(prev => {
                // Only check boundaries if viewport actually changed
                if (prev.width !== newWidth || prev.height !== newHeight) {
                    setTimeout(() => {
                        checkAndMinimizeOutsideWindows();
                    }, 100);
                }

                return { width: newWidth, height: newHeight };
            });
        };

        globalThis.window.addEventListener('resize', handleResize);

        return () => {
            globalThis.window.removeEventListener('resize', handleResize);
        };
    }, [checkAndMinimizeOutsideWindows]);

    // Save state to localStorage whenever windows, closedWindows, or maxZIndex change
    useEffect(() => {
        if (!isInitialized) return; // Don't save during initial load

        const state: StoredState = {
            windows,
            closedWindows,
            maxZIndex,
        };

        saveToLocalStorage(state);
    }, [windows, closedWindows, maxZIndex, isInitialized]);

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
        // Check if window already exists (to prevent duplicates on restore)
        setWindows(prev => {
            if (prev[window.id]) {
                return prev; // Window already exists, don't add again
            }

            const newZIndex = maxZIndex + 1;
            setMaxZIndex(newZIndex);
            return {
                ...prev,
                [window.id]: { ...window, zIndex: newZIndex }
            };
        });
    }, [maxZIndex]);

    const generateRandomWindowPositions = useCallback(() => {
        const headerHeight = 140; // Safe margin below header
        const viewportWidth = globalThis?.window?.innerWidth || 1200;
        const viewportHeight = globalThis?.window?.innerHeight || 800;
        const padding = 50; // Minimum distance from screen edges

        // Get window configurations
        const allWindowConfigs = getCurrentWindowConfigs();

        const placedWindows: Array<{ x: number; y: number; width: number; height: number; id: string }> = [];

        // Function to check if two rectangles overlap too much or if one is completely hidden
        const hasExcessiveOverlap = (
            rect1: { x: number; y: number; width: number; height: number },
            rect2: { x: number; y: number; width: number; height: number }
        ) => {
            const overlapX = Math.max(
                0,
                Math.min(rect1.x + rect1.width, rect2.x + rect2.width) -
                Math.max(rect1.x, rect2.x)
            );
            const overlapY = Math.max(
                0,
                Math.min(rect1.y + rect1.height, rect2.y + rect2.height) -
                Math.max(rect1.y, rect2.y)
            );
            const overlapArea = overlapX * overlapY;

            const area1 = rect1.width * rect1.height;
            const area2 = rect2.width * rect2.height;
            const smallerArea = Math.min(area1, area2);

            // Check if one window is completely hidden behind another (90%+ overlap)
            const isCompletelyHidden = overlapArea > smallerArea * 0.9;

            // Check if overlap is too much (more than 15% of smaller area)
            const isTooMuchOverlap = overlapArea > smallerArea * 0.15;

            return isCompletelyHidden || isTooMuchOverlap;
        };

        // Function to find a good position for a window
        const findGoodPosition = (
            width: number,
            height: number,
            isContact: boolean,
            maxAttempts = 100
        ) => {
            if (isContact) {
                // Contact window is always centered
                const x = Math.max(0, (viewportWidth - width) / 2);
                const y = Math.max(headerHeight, (viewportHeight - height) / 2);
                return { x: Math.round(x), y: Math.round(y) };
            }

            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const x = Math.random() * (viewportWidth - width - padding * 2) + padding;
                const y = Math.random() * (viewportHeight - height - headerHeight - padding) + headerHeight;

                const newRect = { x, y, width, height };

                // Check if this position has excessive overlap with existing windows (including contact)
                const hasExcessiveOverlapWithAny = placedWindows.some(placed =>
                    hasExcessiveOverlap(newRect, placed)
                );

                if (!hasExcessiveOverlapWithAny) {
                    return { x: Math.round(x), y: Math.round(y) };
                }
            }

            // Fallback: just place it randomly if we can't find a perfect spot
            const x = Math.random() * (viewportWidth - width - padding * 2) + padding;
            const y = Math.random() * (viewportHeight - height - headerHeight - padding) + headerHeight;
            return { x: Math.round(x), y: Math.round(y) };
        };

        // Generate positions for all windows
        const windowPositions: Array<{ id: string; title: string; x: number; y: number; width: number; height: number; isContact: boolean }> = [];

        // Place contact window FIRST in placedWindows so others avoid it
        const contactConfig = allWindowConfigs.find(w => w.isContact)!;
        const contactPosition = findGoodPosition(contactConfig.width, contactConfig.height, true);

        // Add contact to placedWindows IMMEDIATELY so others avoid it
        placedWindows.push({
            ...contactPosition,
            width: contactConfig.width,
            height: contactConfig.height,
            id: contactConfig.id
        });

        // Add contact to return array
        windowPositions.push({ ...contactConfig, ...contactPosition });

        // Now place other windows (they will avoid the contact window)
        allWindowConfigs.filter(w => !w.isContact).forEach(config => {
            const position = findGoodPosition(config.width, config.height, false);
            placedWindows.push({ ...position, width: config.width, height: config.height, id: config.id });
            windowPositions.push({ ...config, ...position });
        });

        return windowPositions;
    }, [getCurrentWindowConfigs]);

    // Define closeWindow before it's used in startDrag
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

                // Check if window is moved outside viewport after drag ends
                // Use a timeout to ensure state has been updated
                setTimeout(() => {
                    setWindows(currentWindowsState => {
                        const finalWindow = currentWindowsState[id];
                        if (finalWindow && typeof globalThis !== 'undefined' && globalThis.window) {
                            const viewportWidth = globalThis.window.innerWidth;
                            const viewportHeight = globalThis.window.innerHeight;

                            const windowRight = finalWindow.x + finalWindow.width;
                            const windowBottom = finalWindow.y + finalWindow.height;

                            // Check if window is completely outside viewport boundaries
                            const isOutsideLeft = windowRight < 100; // Allow some pixels to remain visible
                            const isOutsideRight = finalWindow.x > viewportWidth - 100;
                            const isOutsideTop = windowBottom < 100;
                            const isOutsideBottom = finalWindow.y > viewportHeight - 100;

                            if (isOutsideLeft || isOutsideRight || isOutsideTop || isOutsideBottom) {
                                // Auto-minimize the window if it's outside viewport
                                closeWindow(id);
                                return currentWindowsState; // Return unchanged since closeWindow handles the state update
                            }
                        }
                        return currentWindowsState;
                    });
                }, 0);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'grabbing';

            return currentWindows;
        });
    }, [updateWindow, bringToFront, closeWindow]);

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

    const toggleMinimize = useCallback((id: string) => {
        // Minimizing now works the same as closing - moves window to restore panel
        closeWindow(id);
    }, [closeWindow]);

    const restoreWindow = useCallback((id: string) => {
        setClosedWindows(prev => {
            const { [id]: windowToRestore, ...rest } = prev;
            if (windowToRestore) {
                // Calculate safe position for restored window
                const safeX = Math.max(50, Math.min(windowToRestore.x, (globalThis?.window?.innerWidth || 1200) - windowToRestore.width - 50));
                const safeY = Math.max(50, Math.min(windowToRestore.y, (globalThis?.window?.innerHeight || 800) - windowToRestore.height - 50));

                // Add the window back with a new z-index and safe position
                const newZIndex = maxZIndex + 1;
                setMaxZIndex(newZIndex);
                setWindows(windowsPrev => ({
                    ...windowsPrev,
                    [id]: {
                        ...windowToRestore,
                        zIndex: newZIndex,
                        x: safeX,
                        y: safeY
                    }
                }));
            }
            return rest;
        });
    }, [maxZIndex]);

    const showWindowCentered = useCallback((id: string) => {
        // Check if window is already open
        if (windows[id]) {
            // Just bring to front and center it
            const window = windows[id];
            const viewportWidth = globalThis?.window?.innerWidth || 1200;
            const viewportHeight = globalThis?.window?.innerHeight || 800;

            const centerX = Math.max(0, (viewportWidth - window.width) / 2);
            const centerY = Math.max(0, (viewportHeight - window.height) / 2);

            bringToFront(id);
            updateWindow(id, { x: centerX, y: centerY });
            return;
        }

        // Check if window is in closedWindows and restore it centered
        setClosedWindows(prev => {
            const { [id]: windowToRestore, ...rest } = prev;
            if (windowToRestore) {
                const viewportWidth = globalThis?.window?.innerWidth || 1200;
                const viewportHeight = globalThis?.window?.innerHeight || 800;

                const centerX = Math.max(0, (viewportWidth - windowToRestore.width) / 2);
                const centerY = Math.max(0, (viewportHeight - windowToRestore.height) / 2);

                // Add the window back with a new z-index and centered position
                const newZIndex = maxZIndex + 1;
                setMaxZIndex(newZIndex);
                setWindows(windowsPrev => ({
                    ...windowsPrev,
                    [id]: {
                        ...windowToRestore,
                        zIndex: newZIndex,
                        x: centerX,
                        y: centerY
                    }
                }));
            }
            return rest;
        });
    }, [windows, maxZIndex, bringToFront, updateWindow]);

    const clearStorage = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            // Reset to initial state
            setWindows({});
            setClosedWindows({});
            setMaxZIndex(1000);
        } catch (error) {
            console.warn('Failed to clear localStorage:', error);
        }
    }, []);

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
        showWindowCentered,
        addWindow,
        generateRandomWindowPositions,
        checkAndMinimizeOutsideWindows,
        isDragging,
        isResizing,
        isInitialized,
        clearStorage,
    };
} 