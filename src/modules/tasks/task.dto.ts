import { z } from "zod";
import { TaskStatusEnum } from "../../shared/enums/taskStatus";

// Validación para creación de usuario
export const TaskSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "Title is required"),
  content: z.string().min(2, "Description is required"),
  createdAt: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date()
    )
    .optional(),
  updatedAt: z
    .union([
      z.preprocess(
        (arg) => (typeof arg === "string" ? new Date(arg) : arg),
        z.date()
      ),
      z.null(),
    ])
    .optional(),
  status: z.enum([
    TaskStatusEnum.PENDING,
    TaskStatusEnum.CANCELLED,
    TaskStatusEnum.COMPLETED,
  ]),
  disabled: z.boolean().optional(),
  disabled_at: z.null().optional(),
  createdBy: z.number(),
  updatedBy: z.null().optional(),
  disabledBy: z.null().optional(),
});
export type ITaskSchema = z.infer<typeof TaskSchema>;

