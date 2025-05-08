"use client";

import { useEffect, useMemo, useState } from "react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { fetcher, mutation } from "@/utils/fetcher";
import { ProjectFormValues, projectSchema } from "@/schemas/project-schema";
import { Technology } from "@/types/technology";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

const FormAdd = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchTechnologies = async () => {
    try {
      const response = await fetcher("/api/technologies");
      setTechnologies(response);
    } catch {
      setError("Failed to fetch technologies");
    } finally {
      setIsLoading(false);
    }
  };

  const retryFetchTechnologies = () => {
    setIsLoading(true);
    fetchTechnologies();
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      image: "",
      description: "",
      link: "",
      githubLink: "",
      technologies: [],
    },
  });

  const onUploadImage = async (
    file: File,
    onChange: (value: string) => void,
    setImagePreview: (value: string | null) => void
  ) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const data = await mutation("/api/upload", "POST", formData);

      if (data.error) {
        toast.error(data.error || "Failed to upload image");
        setImagePreview(null);
        onChange("");
        return;
      }

      onChange(data.url);
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error("Image upload failed", err);
      toast.error("Failed to upload image. Please try again.");
      setImagePreview(null);
      onChange("");
    }
  };

  const onRemoveImage = async (
    imageUrl: string,
    onChange: (value: string) => void,
    setImagePreview: (value: string | null) => void
  ) => {
    const filename = imageUrl.split("/").pop();
    if (!filename) {
      toast.error("Invalid image URL");
      return;
    }

    try {
      const res = await mutation(`/api/upload/delete/${filename}`, "DELETE");

      if (res.error) {
        toast.error(res.error || "Failed to delete image");
        return;
      }
      onChange("");
      setImagePreview(null);
      toast.success(res.message || "Image deleted successfully");
    } catch (err) {
      console.error("Image delete failed", err);
      toast.error("Failed to delete image. Please try again.");
      setImagePreview(null);
      onChange("");
    }
  };

  const onSubmit = async (values: ProjectFormValues) => {
    console.log("hehe", values);
    return;
    setIsSubmitting(true);
    try {
      const res = await mutation("/api/projects", "POST", values);
      if (res.error) {
        toast.error(res.error);
      }
      form.reset();
      setImagePreview(null);
      router.push("/admin/projects");
      toast.success("Project added successfully");
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const technologyItems = useMemo(() => {
    return technologies.map((tech) => (
      <FormField
        key={tech.id}
        name="technologies"
        control={form.control}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value?.includes(tech.id) || false}
                onCheckedChange={(checked) => {
                  const newValue = checked
                    ? [...(field.value || []), tech.id]
                    : field.value?.filter((value) => value !== tech.id) || [];
                  field.onChange(newValue);
                }}
              />
            </FormControl>
            <FormLabel className="flex gap-x-1.5 text-sm font-normal">
              {tech.tag ? (
                <Badge className="text-base">
                  <i className={`bx bxl-${tech.tag}`}></i>
                </Badge>
              ) : null}
              <span>{tech.name}</span>
            </FormLabel>
          </FormItem>
        )}
      />
    ));
  }, [technologies, form.control]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input id="name" placeholder="Example: My Project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="image"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    id="tag"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);

                        onUploadImage(file, field.onChange, setImagePreview);
                      } else {
                        field.onChange("");
                        setImagePreview(null);
                      }
                    }}
                  />
                  {imagePreview && (
                    <div className="relative w-full max-w-xs">
                      <Image
                        src={imagePreview}
                        width={120}
                        height={120}
                        alt="Image preview"
                        className="object-cover rounded-md"
                      />
                      <Button
                        variant="destructive"
                        type="button"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          if (field.value) {
                            onRemoveImage(
                              field.value,
                              field.onChange,
                              setImagePreview
                            );
                          } else {
                            field.onChange("");
                            setImagePreview(null);
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder="Example: This is a project"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="link"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input
                  id="link"
                  placeholder="Example: https://ex-project.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="githubLink"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Github Link</FormLabel>
              <FormControl>
                <Input
                  id="githubLink"
                  placeholder="Example: https://github.com/username/ex-project"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="technologies"
          control={form.control}
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Technologies</FormLabel>
                <FormDescription>
                  Select the technologies used in this project
                </FormDescription>
              </div>
              {isLoading ? (
                <Skeleton className="h-4 w-full" />
              ) : technologies.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No technologies available.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {technologyItems}
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2">
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => retryFetchTechnologies()}
                    disabled={isLoading}
                  >
                    Retry
                  </Button>
                </div>
              )}
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
