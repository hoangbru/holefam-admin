"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { mutation } from "@/utils/fetcher";
import {
  TechnologyFormValues,
  technologySchema,
} from "@/schemas/technology-schema";

const FormAdd = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<TechnologyFormValues>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: "",
      tag: "",
      link: "",
    },
  });

  const onSubmit = async (values: TechnologyFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await mutation("/api/technologies", "POST", values);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      form.reset();
      router.push("/admin/technologies");
      toast.success("Technology added successfully");
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input id="name" placeholder="Example: React" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <span>Tag</span>
                {field.value !== "" ? (
                  <Badge className="text-base">
                    <i className={`bx bxl-${field.value}`}></i>
                  </Badge>
                ) : null}
              </FormLabel>
              <FormControl>
                <Input id="tag" placeholder="Example: react" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input
                  id="link"
                  placeholder="Example: https://react.dev/"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Loading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default FormAdd;
