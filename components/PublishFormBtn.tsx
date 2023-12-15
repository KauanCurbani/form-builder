"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { MdOutlinePublish } from "react-icons/md";
import { PublishForm } from "@/actions/form";
import useDesigner from "./hooks/useDesigner";
import { Loader2Icon } from "lucide-react";

function PublishFormBtn() {
  const { currentForm } = useDesigner();
  const [loading, setLoading] = useState(false);

  async function publish() {
    setLoading(true);
    await PublishForm(currentForm!.id);
    setLoading(false);
  }

  return (
    <Button onClick={publish} variant={"outline"} className="gap-2">
      <div className="text-xl">
        {!loading && <MdOutlinePublish />}
        {loading && <Loader2Icon className="animate-spin" />}
      </div>
      Publicar
    </Button>
  );
}

export default PublishFormBtn;
