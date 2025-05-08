import { z } from "zod";

export const RoleEnum = z.enum(["admin", "user"]);

export const userSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .nonempty({ message: "Username cannot be empty" })
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(50, { message: "Username cannot exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  password: z.string().min(6),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .nonempty({ message: "Email cannot be empty" })
    .email({ message: "Invalid email format" })
    .max(254, { message: "Email cannot exceed 254 characters" }),
  avatar: z
    .string({ required_error: "Avatar is required" })
    .nonempty({ message: "Avatar cannot be empty" })
    .url({ message: "Avatar must be a valid URL" }),
  role: RoleEnum.default("user"),
  createdAt: z
    .date({ invalid_type_error: "Created date must be a valid date" })
    .optional()
    .nullable(),
  updatedAt: z
    .date({ invalid_type_error: "Updated date must be a valid date" })
    .optional()
    .nullable(),
});

export type UserFormValues = z.infer<typeof userSchema>;
