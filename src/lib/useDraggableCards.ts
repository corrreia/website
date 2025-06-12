import { useRef, useState } from "react";

export function useDraggableCards<T>() {
  const [order, setOrder] = useState<T[]>([]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from !== null && to !== null && from !== to) {
      setOrder((prev) => {
        const updated = [...prev];
        const [removed] = updated.splice(from, 1);
        updated.splice(to, 0, removed);
        return updated;
      });
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return {
    order,
    setOrder,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
  };
}
