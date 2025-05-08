import { z } from "zod";

export const settingsSchema = z.object({
  theme: z.object({
    backgroundImage: z.object({
      default: z.string().min(1, "Default background image is required"),
      home: z.string().min(1, "Home background image is required"),
      projects: z.string().min(1, "Projects background image is required"),
      contacts: z.string().min(1, "Contacts background image is required"),
      login: z.string().min(1, "Login background image is required"),
    }),
    colors: z.object({
      primary: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, "Primary color must be a valid HEX code"),
      secondary: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, "Secondary color must be a valid HEX code"),
      accent: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, "Accent color must be a valid HEX code"),
      background: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, "Background color must be a valid HEX code"),
      text: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, "Text color must be a valid HEX code"),
      error: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, "Error color must be a valid HEX code"),
      success: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, "Success color must be a valid HEX code"),
    }),
    typography: z.object({
      fontFamily: z.string().min(1, "Font family is required"),
      fontSize: z.object({
        base: z.string().min(1, "Base font size is required"),
        heading: z.string().min(1, "Heading font size is required"),
        subheading: z.string().min(1, "Subheading font size is required"),
      }),
    }),
  }),
  socialLinks: z.array(
    z.object({
      id: z.number(),
      name: z.string().min(1, "Social link name is required"),
      url: z.string().url("Invalid URL"),
      icon: z.string().min(1, "Icon path is required"),
    })
  ),
  contactInfo: z.object({
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
  }),
  footer: z.object({
    text: z.string().min(1, "Footer text is required"),
    links: z.array(
      z.object({
        id: z.number(),
        name: z.string().min(1, "Link name is required"),
        url: z.string().min(1, "Link URL is required"),
      })
    ),
  }),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
