"use client";
import { Form } from "@prisma/client";
import React, { useRef } from "react";
import { FormElementInstance, FormElements } from "./FormElements";
import { z } from "zod";

function ClientForm({ form }: { form: Form }) {
    const formValues = useRef<{[key: string]: string}>({})

    const handleValues = (key: string, value: string) => {}

  return (
    <div className="flex flex-col m-8 border bg-accent/40 p-4 w-full rounded-md">
          {(JSON.parse(form.content) as FormElementInstance[]).map((e) => (
            <FormElement element={e} key={e.id} onSubmit={handleValues} />
          ))}
    </div>
  );
}

function FormElement({ element, onSubmit }: { element: FormElementInstance, onSubmit(key: string, value: string): void }) {
  const FormEl = FormElements[element.type].formComponent;
  return (
    <div className="mb-4">
      <FormEl elementInstance={element} />
    </div>
  );
}

export default ClientForm;
