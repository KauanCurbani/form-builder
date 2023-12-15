"use client";

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Form } from "@prisma/client";
import Designer from "./Designer";
import PreviewDialogBtn from "./PreviewDialogBtn";
import PublishFormBtn from "./PublishFormBtn";
import SaveFormBtn from "./SaveFormBtn";
import DragOverlayWrapper from "./DragOverlayWrapper";
import { useEffect, useState } from "react";
import useDesigner from "./hooks/useDesigner";
import { Input } from "./ui/input";
import { ChangeName } from "@/actions/form";

function FormBuilder({ form }: { form: Form }) {
  const { setCurrentForm, addElements, currentForm, updateElement } = useDesigner();
  const [semaphore, setSemaphore] = useState(true);
  useEffect(() => {
    setCurrentForm(form);
  }, []);

  useEffect(() => {
    if (form && semaphore) {
      setSemaphore(false);
      addElements(JSON.parse(form.content));
    }
  }, [currentForm]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 300, tolerance: 5 },
  });

  const sensors = useSensors(mouseSensor, touchSensor);
  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full">
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center shadow-2xl">
          <h2 className="truncate font-medium flex items-center px-0 indent-0">
            <span className="text-muted-foreground mr-2">Formulário:</span>
            <Input
              className="border-none h-fit ring-0 outline-none w-fit"
              defaultValue={form.name}
              onBlur={(evt) =>{
                if(evt.target.value !== form.name){

                    ChangeName(form.id, evt.target.value)
                    form.name = evt.target.value
                }
              }}
            />
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            <SaveFormBtn />
            {!form.published && (
              <>
                <PublishFormBtn />
              </>
            )}
          </div>
        </nav>
        <div
          className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent
            bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]"
        >
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
}

export default FormBuilder;
