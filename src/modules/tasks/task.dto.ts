import { z } from "zod";
import { TaskStatusEnum } from "../../shared/enums/taskStatus";

// Validación para creación de usuario
export const TaskSchemaCreate = z.object({
  title: z.string().min(2, "Title is required"),
  content: z.string().min(2, "Description is required"),
  userId: z.number(),
  status: z.enum([
    TaskStatusEnum.PENDING,
    TaskStatusEnum.CANCELLED,
    TaskStatusEnum.COMPLETED,
  ]),
  createdAt: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date(),
    )
    .optional(),
  updatedAt: z
    .union([
      z.preprocess(
        (arg) => (typeof arg === "string" ? new Date(arg) : arg),
        z.date(),
      ),
      z.null(),
    ])
    .optional(),
});

export type ITaskSchemaCreate = z.infer<typeof TaskSchemaCreate>;

// Validación para actualización de usuario
export const TaskSchemaUpdate = z.object({
  title: z.string().min(2, "Title is required").optional(),
  content: z.string().min(2, "Description is required").optional(),
  userId: z.number().optional(),
  createdAt: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date(),
    )
    .optional(),
  updatedAt: z
    .union([
      z.preprocess(
        (arg) => (typeof arg === "string" ? new Date(arg) : arg),
        z.date(),
      ),
      z.null(),
    ])
    .optional(),
});

// Exporta los tipos para usarlos en el resto de la app si es necesario
export type TaskCreateInput = z.infer<typeof TaskSchemaCreate>;
export type TaskUpdateInput = z.infer<typeof TaskSchemaUpdate>;
