import { z } from "zod";

export const technologySchema = z.object({
  name: z
    .string({
      invalid_type_error: "Technology name must be a string",
    })
    .nonempty({ message: "Technology name is required and cannot be empty" }),
  tag: z.string().optional(),
  link: z.string().url({ message: "Link must be a valid URL" }).optional(),
  createdAt: z
    .date({ invalid_type_error: "Created date must be a valid date" })
    .optional()
    .nullable(),
  updatedAt: z
    .date({ invalid_type_error: "Updated date must be a valid date" })
    .optional()
    .nullable(),
});

export type TechnologyFormValues = z.infer<typeof technologySchema>;
