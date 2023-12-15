"use client"
import { cn } from "@/lib/utils";
import { Form } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Logo from "./Logo";
import { Separator } from "./ui/separator";

function ClientSidebar({ forms }: { forms: Form[] }) {
    const path = usePathname()

    console.log(path)
    console.log(path.split("/")[2], forms[0].id)
  return (
    <div className="flex flex-col p-4 gap-2">
        <Logo />
        <Separator />
      {forms.map((f) => {
        return (
          <Link
          key={f.id}
            href={`/form/${f.id}`}
            className={cn("py-2 px-4 flex flex-col hover:cursor-pointer justify-center w-full bg-accent/40 rounded-md",
            path.split("/")[2] === f.id.toString() && "ring-2 ring-accent")}
          >
            <span className="text-accent-foreground font-light text-base">
              {f.name}
            </span>
            <small className="text-muted-foreground">{f.description}</small>
          </Link>
        );
      })}
    </div>
  );
}

export default ClientSidebar;
