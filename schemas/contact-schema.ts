import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .nonempty({ message: "Name cannot be empty" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be valid" }),
  phone: z
    .string({ required_error: "Phone number is required" })
    .nonempty({ message: "Phone number cannot be empty" })
    .regex(/^\+?[1-9]\d{8,14}$/, {
      message: "Phone number must be a valid format (e.g., +1234567890)",
    }),
  message: z
    .string({ required_error: "Message is required" })
    .nonempty({ message: "Message cannot be empty" })
    .min(10, { message: "Message must be at least 10 characters long" })
    .max(1000, { message: "Message cannot exceed 1000 characters" }),
    createdAt: z
    .date({ invalid_type_error: "Created date must be a valid date" })
    .optional()
    .nullable(),
  updatedAt: z
    .date({ invalid_type_error: "Updated date must be a valid date" })
    .optional()
    .nullable(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
