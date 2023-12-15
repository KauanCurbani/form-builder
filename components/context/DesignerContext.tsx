"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { FormElementInstance } from "../FormElements";
import { Form } from "@prisma/client";

type DesignerContextType = {
  elements: FormElementInstance[];
  addElement(index: number, element: FormElementInstance): void;
  removeElement(elementId: string): void;

  selectedElement: FormElementInstance | null;
  setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;

  updateElement(id: string, element: FormElementInstance): void
  currentForm: Form | null,
  setCurrentForm: Dispatch<SetStateAction<Form | null>>
  addElements(items: FormElementInstance[]): void

  reset():void
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [elements, setElements] = useState<FormElementInstance[]>([]);
  const [currentForm, setCurrentForm] = useState<Form | null>(null)
  const [selectedElement, setSelectedElement] =
    useState<FormElementInstance | null>(null);

  const addElement = (index: number, element: FormElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      newElements.splice(index, 0, element);
      return newElements;
    });
  };

  const removeElement = (elementId: string) => {
    setElements((prev) => {
      return prev.filter((el) => el.id !== elementId);
    });
  };

  function updateElement(id: string, element: FormElementInstance){
    setElements(prev => {
        const newElements = [...prev];
        const index = newElements.findIndex(el => el.id === id)
        newElements[index] = element
        return newElements;
    })
  }

  function addElements(items: FormElementInstance[]){
    setElements(prev => ([...items]))
  }

  function reset() {
    setElements([])
    setCurrentForm(null)
    setSelectedElement(null)
  }

  return (
    <DesignerContext.Provider
      value={{
        elements,
        selectedElement,
        addElement,
        removeElement,
        setSelectedElement,
        updateElement,
        currentForm,
        setCurrentForm,
        addElements,
        reset
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
}
