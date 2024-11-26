import { z } from "zod";

// Validación para creación de usuario
export const UserSchemaCreate = z.object({
  name: z.string().min(2, "Name is required"),
  lastName: z.string().min(2, "Last Name is required"),
  email: z.string().email("Invalid email format").optional(),
});

// Validación para actualización de usuario
export const UserSchemaUpdate = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
});

// Exporta los tipos para usarlos en el resto de la app si es necesario
export type UserCreateInput = z.infer<typeof UserSchemaCreate>;
export type UserUpdateInput = z.infer<typeof UserSchemaUpdate>;
