import { z } from "zod";

// Validación para creación de usuario
export const UserRegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .regex(/^[a-zA-Z\s]+$/, "Name must only contain letters and spaces"),
  lastName: z
    .string()
    .min(2, "Last name is required")
    .regex(/^[a-zA-Z\s]+$/, "Last name must only contain letters and spaces"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  email: z
    .string()
    .email("Invalid email format") // Valida que sea un correo electrónico válido
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Email must only contain valid email characters",
    ),
});

// Validación para actualización de usuario
export const UserLoginSchema = z.object({
  email: z.string().min(2, "Email is required"),
  password: z.string().min(8, "Password is required"),
});

// Exporta los tipos para usarlos en el resto de la app si es necesario
export type UserLoginInput = z.infer<typeof UserLoginSchema>;
export type UserRegisterInput = z.infer<typeof UserRegisterSchema>;
