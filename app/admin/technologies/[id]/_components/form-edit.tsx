"use client";

import { useEffect, useState } from "react";
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
import SkeletonSection from "@/components/skeleton-section";

import { fetcher, mutation } from "@/utils/fetcher";
import {
  TechnologyFormValues,
  technologySchema,
} from "@/schemas/technology-schema";
import { Technology } from "@/types/technology";

type FormEditTechnologyProps = {
  id?: string;
};

const FormEditTechnology = ({ id }: FormEditTechnologyProps) => {
  const router = useRouter();
  const [technology, setTechnology] = useState<Technology | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchTechnology = async () => {
      try {
        const res = await fetcher(`/api/technologies/${id}`);
        if (res.error) {
          toast.error(res.error);
          setError(res.error);
        } else {
          setTechnology(res);
        }
      } catch (err) {
        console.error("Fetch failed", err);
        setError("Failed to load technology");
        toast.error("Failed to load technology");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTechnology();
  }, [id]);

  const defaultValues = technology
    ? technologySchema.parse(technology)
    : { name: "", tag: "", link: "" };

  const form = useForm<TechnologyFormValues>({
    resolver: zodResolver(technologySchema),
    defaultValues,
  });

  useEffect(() => {
    if (technology) {
      form.reset(technology);
    }
  }, [technology, form]);

  const onSubmit = async (values: TechnologyFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await mutation(`/api/technologies/${id}`, "PUT", values);
      if (res.error) {
        toast.error(res.error);
      }
      form.reset();
      router.push("/admin/technologies");
      toast.success("Technology updated successfully");
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return <SkeletonSection />;
  }

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
                <Input
                  id="name"
                  placeholder="Example: React"
                  disabled={isSubmitting}
                  {...field}
                />
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
                <Badge className="text-base">
                  {field.value ? (
                    <i className={`bx bxl-${field.value}`}></i>
                  ) : null}
                </Badge>
              </FormLabel>
              <FormControl>
                <Input
                  id="tag"
                  placeholder="Example: react"
                  disabled={isSubmitting}
                  {...field}
                />
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
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Loading..." : "Update"}
        </Button>
      </form>
    </Form>
  );
};

export default FormEditTechnology;
