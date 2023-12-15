"use client";

import { CreateForm, DeleteForm, GetForms } from "@/actions/form";
import useDesigner from "@/components/hooks/useDesigner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { FormSchemaType, formSchema } from "@/schemas/form";
import { FormType } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ListIcon, PlusIcon, RefreshCwIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function Home() {
  const [forms, setForms] = useState<FormType[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { reset } = useDesigner();

  useEffect(() => {
    getForms();
    reset();
  }, []);

  const getForms = async () => {
    setLoading(true);
    const formsResponse = await GetForms();
    setForms(formsResponse);
    setLoading(false);
  };

  const onClose = (val: boolean) => {
    if (!val) {
      getForms();
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex flex-col w-[90vw] max-w-screen-lg py-4">
        <div className="flex gap-2 items-center justify-between">
          <div className=" flex items-center gap-2">
            <ListIcon />
            <h1 className="text-xl ">Seus Formulários</h1>
          </div>

          {loading && (
            <small className="text-muted-foreground">Carregando...</small>
          )}
          {deleting && (
            <small className="text-muted-foreground">Excluindo...</small>
          )}

          <Button
            variant={"ghost"}
            disabled={loading}
            onClick={() => getForms()}
          >
            <RefreshCwIcon
              className={cn(
                "h-[1rem] transition-all",
                loading && "animate-spin"
              )}
            />
            Atualizar
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-4 items-center mt-4">
          <CreateFormDialog onClose={onClose} />

          {forms.map((form) => {
            return (
              <Link href={`/builder/${form.id}`} key={form.id} className="h-full">
                <div
                  className="w-full h-full border rounded-2xl flex 
              justify-center items-start flex-col 
              text-muted-foreground hover:text-primary hover:border-primary 
              transition-all hover:cursor-pointer p-4 relative "
                >
                  {form.published && <div className="absolute top-0 right-2 -translate-y-1/2 bg-green-700/40 py-1 px-4 text-xs rounded-md text-accent-foreground">Público</div>}
                  <span>{form.name}</span>
                  <span className="text-sm opacity-50">{form.description}</span>
                  <span className="text-sm opacity-50">
                    {form.createAt.toLocaleString("pt-br")}
                  </span>
                  <div className="h-full"></div>
                  <div className="mt-2">
                    <Button
                      onClick={async (e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        setDeleting(true);
                        await DeleteForm(form.id);
                        setDeleting(false);
                        getForms();
                      }}
                      className="flex gap-2 text-sm h-fit"
                      variant={"destructive"}
                    >
                      <TrashIcon className="h-[1rem]" />
                    </Button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CreateFormDialog({ onClose }: { onClose: (val: boolean) => void }) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (value: FormSchemaType) => {
    console.log("teste");
    try {
      await CreateForm(value);
      form.reset();
      // form.resetField("name")
      toast({ title: "Formulário Criado!" });
    } catch (error: any) {
      toast({
        title: "Algo de errado aconteceu!",
        description: <span>{error.message}</span>,
      });
    }
  };

  return (
    <Dialog onOpenChange={onClose}>
      <DialogTrigger asChild>
        <div
          className="w-full h-full border rounded-2xl flex 
    justify-center items-center flex-col 
    text-muted-foreground hover:text-primary hover:border-primary 
    transition-all hover:cursor-pointer"
        >
          <PlusIcon />
          <span className="mt-4">Criar Formulário</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Formulário</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="w-full mt-4"
            disabled={form.formState.isSubmitting}
          >
            {!form.formState.isSubmitting && <span>Criar</span>}
            {form.formState.isSubmitting && <span>Carregando...</span>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Home;
