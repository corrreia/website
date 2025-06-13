import React from "react";
import { Draggable } from "@hello-pangea/dnd";

interface WindowLinuxProps {
  title: string;
  children: React.ReactNode;
  draggableId: string;
  index: number;
}

export function WindowLinux({
  title,
  children,
  draggableId,
  index,
}: WindowLinuxProps) {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`h-full flex flex-col rounded-lg border border-[#c0bfbc] dark:border-[#5e5c64] bg-white dark:bg-[#1d1d20] shadow-lg overflow-hidden transition-all duration-200 ${
            snapshot.isDragging ? "z-50 scale-105" : ""
          }`}
          style={{
            ...provided.draggableProps.style,
            minHeight: 340,
            maxHeight: 420,
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 bg-[#f6f5f4] dark:bg-[#2e2e32] border-b border-[#c0bfbc] dark:border-[#5e5c64] select-none cursor-grab active:cursor-grabbing"
            {...provided.dragHandleProps}
          >
            <div className="flex-1 text-center">
              <span className="font-medium text-sm text-[#000006cc] dark:text-white select-none">
                {title}
              </span>
            </div>
            <div className="flex">
              <button className="w-8 h-7 flex items-center justify-center hover:bg-[#deddda] dark:hover:bg-[#3d3846] rounded transition-colors">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    className="text-[#000006cc] dark:text-white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col p-4 sm:p-5 bg-white dark:bg-[#1d1d20]">
            {children}
          </div>
        </div>
      )}
    </Draggable>
  );
}
