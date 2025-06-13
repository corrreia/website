import React from "react";
import { Draggable } from "@hello-pangea/dnd";

interface WindowMacProps {
  title: string;
  children: React.ReactNode;
  draggableId: string;
  index: number;
}

export function WindowMac({
  title,
  children,
  draggableId,
  index,
}: WindowMacProps) {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`h-full flex flex-col rounded-xl border border-[#d0d0d0] dark:border-[#515151] bg-white dark:bg-[#1d1d20] shadow-2xl overflow-hidden backdrop-blur-md transition-all duration-200 ${
            snapshot.isDragging ? "z-50 scale-105" : ""
          }`}
          style={{
            ...provided.draggableProps.style,
            minHeight: 340,
            maxHeight: 420,
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-1.5 bg-[#fafafb] dark:bg-[#2e2e32] border-b border-[#d0d0d0] dark:border-[#515151] select-none cursor-grab active:cursor-grabbing"
            {...provided.dragHandleProps}
          >
            <div className="flex gap-2">
              <button className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff3b30] border border-[#e0443e] shadow-sm transition-colors"></button>
              <button className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ff9500] border border-[#dea123] shadow-sm transition-colors"></button>
              <button className="w-3 h-3 rounded-full bg-[#27ca3f] hover:bg-[#28cd41] border border-[#20ac2e] shadow-sm transition-colors"></button>
            </div>
            <div className="flex-1 text-center">
              <span className="font-medium text-sm text-[#000006cc] dark:text-white tracking-tight select-none">
                {title}
              </span>
            </div>
            <div className="w-[42px]"></div> {/* Spacer to center title */}
          </div>
          <div className="flex-1 flex flex-col p-4 sm:p-5 bg-white dark:bg-[#1d1d20]">
            {children}
          </div>
        </div>
      )}
    </Draggable>
  );
}
