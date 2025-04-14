"use client";

import { Dispatch, ReactNode, SetStateAction, useCallback } from "react";
import {
  useForm,
  UseFormReturn,
  SubmitHandler,
  SubmitErrorHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";
import { Form } from "@/components/ui/form";
import { QueryFunction } from "@/hooks/use-action";
import { toast } from "sonner";
import { generateDefaultValues } from "@/lib/zod/utils";

interface FormWrapperProps<T extends ZodSchema> {
  formAction: QueryFunction<any[], any>;
  schema: T;
  children: (methods: UseFormReturn<any>) => ReactNode;
  className?: string;
  onSubmit?: (data: any) => void;
  initialData?: {};
  setDialogOpen?: Dispatch<SetStateAction<boolean>>;
}

export function FormWrapper<T extends ZodSchema>({
  formAction,
  schema,
  children,
  className,
  onSubmit,
  initialData,
  setDialogOpen,
}: FormWrapperProps<T>) {
  const defaultValues =
    initialData === undefined ? generateDefaultValues(schema) : initialData;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });
  const onValidSubmit: SubmitHandler<any> = useCallback(
    async (data) => {
      try {
        console.log("Form data (valid submission):", data);
        const cleanedData = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            value === null ? undefined : value,
          ]),
        );
        const result = await formAction(cleanedData);
        console.log("Form submission result:", result);
        if (result && typeof result === "object" && "message" in result) {
          console.log(result.message);
        }
        if (onSubmit) {
          onSubmit(data);
        }
        form.reset();
        if (setDialogOpen) {
          setDialogOpen(false);
        }
      } catch (error) {
        console.error("Form submission error:", error);
        console.log(form.getValues);
      }
    },
    [formAction, form, onSubmit],
  );

  const onInvalidSubmit: SubmitErrorHandler<any> = useCallback((errors) => {
    console.log("invalid");
    const formValues = form.watch();
    console.log(formValues);
    console.log("Form validation errors:", errors);
    toast.error("Please correct the errors in the form");
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)}
        className={className}
      >
        {children(form)}
      </form>
    </Form>
  );
}
