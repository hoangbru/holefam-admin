import { z } from "zod";
import { technologySchema } from "./technology-schema";

export const projectSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Project name must be a string",
    })
    .nonempty({ message: "Project name is required and cannot be empty" }),
  image: z
    .string({ required_error: "Image URL is required" }),
  description: z
    .string({ required_error: "Description is required" })
    .nonempty({ message: "Description cannot be empty" }),
  link: z
    .string({ required_error: "Project link is required" })
    .url({ message: "Link must be a valid URL" }),
  githubLink: z
    .string()
    .url({ message: "GitHub link must be a valid URL" })
    .optional(),
  technologies: z
    .array(
      z.lazy(() => technologySchema),
      {
        required_error: "Technologies are required",
      }
    )
    .nonempty({ message: "At least one technology is required" }),
  createdAt: z
    .date({ invalid_type_error: "Created date must be a valid date" })
    .optional()
    .nullable(),
  updatedAt: z
    .date({ invalid_type_error: "Updated date must be a valid date" })
    .optional()
    .nullable(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
