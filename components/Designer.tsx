"use client";
import React, { useState } from "react";
import DesignerSidebar from "./DesignerSidebar";
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
  FormElements,
} from "./FormElements";
import useDesigner from "./hooks/useDesigner";
import { idGen } from "@/lib/idGen";
import { Button } from "./ui/button";
import { Trash2Icon } from "lucide-react";
import { v4 } from "uuid";

function Designer() {
  const {
    elements,
    addElement,
    selectedElement,
    setSelectedElement,
    removeElement,
  } = useDesigner();

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (evt: DragEndEvent) => {
      const { active, over } = evt;
      if (!active || !over) return;

      const isDesignerBtnElement = active.data.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea =
        over.data?.current?.isDesignerDropArea;

      if (isDesignerBtnElement && isDroppingOverDesignerDropArea) {
        const type = active.data.current?.type;
        const newElement = FormElements[type as ElementsType].construct(
          idGen()
        );

        addElement(elements.length, newElement);
        return;
      }

      const isDroppingOverDesignerElementTopHalf =
        over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf =
        over.data?.current?.isBottomHalfDesignerElement;

      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf |
        isDroppingOverDesignerElementBottomHalf;

      if (isDesignerBtnElement && isDroppingOverDesignerElement) {
        const type = active.data.current?.type;
        const newElement = FormElements[type as ElementsType].construct(v4());
        const overElementIndex = elements.findIndex(
          (el) => el.id === over.data?.current?.elementId
        );
        if (overElementIndex === -1) {
          throw new Error("element not found");
        }
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }

        addElement(indexForNewElement, newElement);
        return;
      }

      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;
      const draggingDesignerElementOverAnotherElement =
        isDroppingOverDesignerElement && isDraggingDesignerElement;

      console.log(
        "isDroppingOverDesignerElement",
        isDroppingOverDesignerElement
      );
      console.log("isDraggingDesignerElement", isDraggingDesignerElement);
      console.log(
        "draggingDesignerElementOverAnotherElement",
        draggingDesignerElementOverAnotherElement
      );
      if (draggingDesignerElementOverAnotherElement) {
        console.log("opa");
        const activeId = active.data.current?.elementId;
        const overId = over.data.current?.elementId;

        const activeElementIndex = elements.findIndex(
          (el) => el.id == activeId
        );
        const overElementIndex = elements.findIndex((el) => el.id == overId);
        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error("element not found");
        }

        const activeElement = { ...elements[activeElementIndex] };

        removeElement(activeId);

        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }

        addElement(indexForNewElement, activeElement);
      }
    },
  });

  return (
    <div className="flex w-full h-full">
      <div
        className="p-4 w-full"
        onClick={() => {
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            `bg-background max-w-[920px] h-full m-auto rounded-xl
            flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto`,
            droppable.isOver && "ring-2 ring-primary"
          )}
        >
          {!droppable.isOver && elements.length <= 0 && (
            <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
              {" "}
              Solte Aqui
            </p>
          )}
          {droppable.isOver && elements.length === 0 && (
            <div className="p-4 w-full">
              <div className="h-[120px] rounded-md bg-primary/20"></div>
            </div>
          )}

          {elements.length > 0 && (
            <div className="flex flex-col w-full gap-2 p-4">
              {elements.map((element) => {
                return (
                  <DesignerElementWrapper key={element.id} element={element} />
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DesignerSidebar />
    </div>
  );
}

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);

  const { removeElement, selectedElement, setSelectedElement } = useDesigner();

  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null;

  const DesignerElement = FormElements[element.type].designerComponent;
  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
      className="relative h-[120px] flex flex-col text-foreground  hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
    >
      <div
        ref={topHalf.setNodeRef}
        className="absolute w-full h-1/2 rounded-t-md"
      />
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute bottom-0 w-full h-1/2 rounded-b-md"
      />
      {mouseIsOver && (
        <>
          <div className="absolute right-0 h-full z-10">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}
              variant={"outline"}
              className="flex  justify-center h-full border rounded-md rounded-l-none bg-red-500"
            >
              <Trash2Icon className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse z-10">
            <p className="text-muted-foreground text-sm">
              Clique para selecionar ou arraste para mover.
            </p>
          </div>
        </>
      )}
      {topHalf.isOver && (
        <div className=" absolute -top-1.5 w-full h-1 bg-primary  rounded opacity-50" />
      )}
      <div
        className={cn(
          "flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100 z-0",
          mouseIsOver && "opacity-40"
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
      {bottomHalf.isOver && (
        <div className="absolute -bottom-1.5 w-full h-1 bg-primary  rounded opacity-50" />
      )}
    </div>
  );
}

export default Designer;
