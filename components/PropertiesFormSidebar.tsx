import React from "react";
import useDesigner from "./hooks/useDesigner";
import { FormElements } from "./FormElements";
import { Button } from "./ui/button";
import { XIcon } from "lucide-react";
import { Separator } from "./ui/separator";

function PropertiesFormSidebar() {
  const { selectedElement, setSelectedElement } = useDesigner();

  const PropertiesForm = FormElements[selectedElement!.type].propertiesComponent;

  return (
    <div className="flex flex-col p-2">
        <div className="flex justify-between items-center">
            <p className="text-sm text-foreground/70">Propriedades</p>
            <Button size={"icon"} variant={"ghost"} onClick={() => setSelectedElement(null)}>
                <XIcon className="h-4 w-4" />
            </Button>
        </div>
        <Separator className="mb-4"/>
      <PropertiesForm elementInstance={selectedElement!}/>
    </div>
  );
}

export default PropertiesFormSidebar;
