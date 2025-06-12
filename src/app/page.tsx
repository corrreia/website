




"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import profile from "./profile.json";
import { AboutMeCard } from "./cards/AboutMeCard";
import { FeaturedProjectCard } from "./cards/FeaturedProjectCard";
import { SkillsCard } from "./cards/SkillsCard";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";
import { MdDragIndicator } from "react-icons/md";

export default function Home() {
  // Card order state
  const initialCards = [
    { id: "about", component: <AboutMeCard /> },
    { id: "project", component: <FeaturedProjectCard /> },
    { id: "skills", component: <SkillsCard /> },
  ];
  const [cards, setCards] = useState(initialCards);

  // Drag and drop handler
  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const reordered = Array.from(cards);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setCards(reordered);
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-background font-sans">
      {/* Header Section */}
      <header className="w-full flex flex-col sm:flex-row items-center sm:items-center justify-between px-4 sm:px-12 py-6 sm:py-8 bg-card/80 border-b shadow-sm gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <Avatar className="size-20 sm:size-16">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>{profile.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center sm:items-start w-full">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center sm:text-left">{profile.name}</h1>
            <p className="text-muted-foreground text-base sm:text-lg text-center sm:text-left">{profile.title}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
              {profile.badges.map((badge: string) => (
                <Badge key={badge} variant="secondary">{badge}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <Button size="lg" className="w-full sm:w-auto">Contact Me</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col gap-8 sm:gap-12 px-2 sm:px-12 py-6 sm:py-12">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="cards-droppable">
            {(provided, snapshot) => (
              <section
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {cards.map((card, idx) => (
                  <Draggable key={card.id} draggableId={card.id} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`relative select-none transition-all duration-200 ${snapshot.isDragging ? "z-50 scale-105" : ""}`}
                        style={{
                          ...provided.draggableProps.style,
                          minHeight: 340,
                          maxWidth: "100%",
                          width: "100%",
                          maxHeight: 420,
                        }}
                      >
                        <div className="h-full flex flex-col justify-stretch min-h-[340px] max-h-[420px] w-full">
                          {React.cloneElement(card.component, { dragHandleProps: provided.dragHandleProps })}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </section>
            )}
          </Droppable>
        </DragDropContext>
      </main>

      {/* Footer */}
      <footer className="w-full flex flex-col items-center gap-2 text-xs text-muted-foreground py-4 sm:py-6 border-t bg-card/80 mt-6 sm:mt-8 px-2 sm:px-0">
        <span className="text-center">© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
        <span className="text-center">Built with Next.js, Tailwind CSS, and shadcn/ui.</span>
      </footer>
    </div>
  );
}