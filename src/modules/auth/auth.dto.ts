import { z } from "zod";

// Validación para creación de usuario
export const UserRegisterSchema = z.object({
  name: z.string().min(2, "Name is required"),
  lastName: z.string().min(2, "Description is required"),
  email: z.string().min(2, "Description is required"),
});

// Validación para actualización de usuario
export const UserLoginSchema = z.object({
  email: z.string().min(2, "Email is required").optional(),
  password: z.string().min(8, "Password is required").optional(),
});

// Exporta los tipos para usarlos en el resto de la app si es necesario
export type UserLoginInput = z.infer<typeof UserLoginSchema>;
export type UserRegisterInput = z.infer<typeof UserRegisterSchema>;
