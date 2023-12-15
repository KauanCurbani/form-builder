"use server";

import { prisma } from "@/lib/prisma";
import { FormSchemaType, formSchema } from "@/schemas/form";
import { FormType } from "@/types/form";

export async function GetForms(): Promise<FormType[]> {
  return (await prisma.form.findMany()).reverse();
}

export async function GetPublishedForms(): Promise<FormType[]> {
  return (await prisma.form.findMany({where: {published: true}})).reverse();
}
GetPublishedForms
export async function CreateForm(data: FormSchemaType) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("Formulário não válido!");
  }

  await prisma.form.create({ data });
  return;
}

export async function DeleteForm(deleteId: number) {
  await prisma.form.delete({ where: { id: deleteId } });
  return;
}

export async function GetFormById(id: number): Promise<FormType> {
  return await prisma.form.findFirstOrThrow({ where: { id: id } });
}

export async function SaveForm(id: number, content: any) {
  return await prisma.form.update({
    where: { id: id },
    data: { content: content },
  });
}

export async function PublishForm(id: number) {
  return await prisma.form.update({
    where: { id: id },
    data: { published: true },
  });
}

export async function ChangeName(id: number, newName: string){
  return prisma.form.update({where: {id: id}, data: {name: newName}})
}