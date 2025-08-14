import { z } from "zod";

export const createUserValidationSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().optional(),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters long")
    .max(128, "Password must not exceed 128 characters"),
});

export const UserValidation = {
  createUserValidationSchema,
};
