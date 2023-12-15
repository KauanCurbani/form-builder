"use client"

import React, { useState } from "react";
import { Button } from "./ui/button";
import { HiSaveAs } from "react-icons/hi";
import useDesigner from "./hooks/useDesigner";
import { SaveForm } from "@/actions/form";
import { Loader2Icon } from "lucide-react";

function SaveFormBtn() {
  const {elements, currentForm} = useDesigner()
  const [loading, setLoading] = useState(false)

  async function save(){
    setLoading(true);
    await SaveForm(currentForm!.id, JSON.stringify(elements))
    setLoading(false);
  }

  return (
    <Button onClick={save} variant={"outline"} className="gap-2">
      <div className="text-xl">
        {!loading && <HiSaveAs />}
        {loading && <Loader2Icon className="animate-spin" />}
      </div>
      Salvar
    </Button>
  );
}

export default SaveFormBtn;
