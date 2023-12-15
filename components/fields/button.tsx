"use client";

import { MdSmartButton, MdTextFields } from "react-icons/md";
import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "../hooks/useDesigner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

const type: ElementsType = "Button";

const extraAttributes = {
  text: "Text Button",
  rest: false,
  restUrl: "",
};

const propertiesSchema = z
  .object({
    text: z.string().min(2).max(30),
    rest: z.boolean().default(false),
    restUrl: z.string().max(300),
  })
  .superRefine((values, ctx) => {
    if (values.rest && values.restUrl === "") {
      ctx.addIssue({
        message: "Caso for REST deve receber um endpoint",
        code: z.ZodIssueCode.custom,
        path: ["restUrl"],
      });
    }
  });

export const ButtonFormElement: FormElement = {
  type,

  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),

  designerBtnElement: {
    icon: MdSmartButton,
    label: "Button",
  },
};

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      text: element.extraAttributes.text,
      rest: element.extraAttributes.rest,
      restUrl: element.extraAttributes.restUrl,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...values,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        onBlur={form.handleSubmit(applyChanges)}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(evt) =>
                    evt.key === "Enter" && evt.currentTarget.blur()
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rest"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Rest</FormLabel>
                <FormDescription>
                  Será chamado um endpoint ao clicar
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.getValues().rest && <>
        <FormField
          control={form.control}
          name="restUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(evt) =>
                    evt.key === "Enter" && evt.currentTarget.blur()
                  }
                />
              </FormControl>
              <FormDescription>
                Caso for um botão REST, esse endpoint será chamado
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          </>}
      </form>
    </Form>
  );
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { text, rest, restUrl } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Button variant={"outline"} disabled>{text}</Button>
    </div>
  );
}

function FormComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance;

}) {
  const element = elementInstance as CustomInstance;
  const { rest, text, restUrl } = element.extraAttributes;
  return (
<div className="flex flex-col gap-2 w-full">
      <Button variant={"outline"} onClick={() => {
        fetch(restUrl, {method: "GET"}).then((res) => res.json()).then(res => console.log(res)).catch(err => toast({title: "Erro ao enviar formulario", description: err.message}))
      }} >{text}</Button>
    </div>
  );
}
