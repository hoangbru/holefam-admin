import { passwordPattern } from "@/constants/pattern";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .nonempty({ message: "Email cannot be empty" })
    .email({ message: "Invalid email format" })
    .max(254, { message: "Email cannot exceed 254 characters" }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .nonempty({ message: "Password cannot be empty" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(128, { message: "Password cannot exceed 128 characters" })
    .regex(passwordPattern, {
      message:
        "Password must contain at least one uppercase letter, one number, and one special character",
    }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
