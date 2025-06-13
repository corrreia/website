import React from "react";
import { Draggable } from "@hello-pangea/dnd";

interface WindowWinProps {
  title: string;
  children: React.ReactNode;
  draggableId: string;
  index: number;
}

export function WindowWin({
  title,
  children,
  draggableId,
  index,
}: WindowWinProps) {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`h-full flex flex-col rounded-lg border border-[#e0e0e0] dark:border-[#3c3c3c] bg-white dark:bg-[#1e1e1e] shadow-xl overflow-hidden transition-all duration-200 ${
            snapshot.isDragging ? "z-50 scale-105" : ""
          }`}
          style={{
            ...provided.draggableProps.style,
            minHeight: 340,
            maxHeight: 420,
          }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#2c2c2c] border-b border-[#e0e0e0] dark:border-[#3c3c3c] select-none cursor-grab active:cursor-grabbing h-8"
            {...provided.dragHandleProps}
          >
            <div className="flex gap-3 items-center flex-1">
              <span className="font-normal text-sm text-[#0f0f0f] dark:text-white select-none">
                {title}
              </span>
            </div>
            <div className="flex">
              <button className="w-[46px] h-8 flex items-center justify-center hover:bg-[#f3f3f3] dark:hover:bg-[#404040] transition-colors">
                <div className="w-3 h-[1px] bg-[#0f0f0f] dark:bg-white"></div>
              </button>
              <button className="w-[46px] h-8 flex items-center justify-center hover:bg-[#f3f3f3] dark:hover:bg-[#404040] transition-colors">
                <div className="w-2.5 h-2.5 border border-[#0f0f0f] dark:border-white bg-transparent"></div>
              </button>
              <button className="w-[46px] h-8 flex items-center justify-center hover:bg-[#c42b1c] hover:text-white transition-colors group">
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M1 1L11 11M11 1L1 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col p-4 sm:p-5 bg-white dark:bg-[#1e1e1e]">
            {children}
          </div>
        </div>
      )}
    </Draggable>
  );
}
