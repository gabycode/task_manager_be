import { z } from "zod";
import { prisma } from "../..";
import { TaskSchemaCreate, TaskSchemaUpdate } from "./task.dto";
import { taskStatus } from "../../shared/enums/taskStatus";

export const getAllTasks = async (req: any, res: any) => {
  try {
    const { status } = req.query;
    // CAPTURAMOS EL STATUS
    console.log(status, "status");
    // HACER BUSQUEDA AQUI JUNTO A PAGINACION, SEARCH
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

export const getTaskById = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Error fetching task", error });
  }
};

export const createTask = async (req: any, res: any) => {
  try {
    const validatedData = TaskSchemaCreate.parse(req.body);

    const newTask = await prisma.task.create({
      data: {
        ...validatedData,
        status: taskStatus.PENDING,
        updatedAt: null,
      },
    });

    res.status(201).json(newTask);
  } catch (error) {
    // Captura errores de validación
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    // Manejo de otros errores
    res.status(500).json({ message: "Error creating task", error });
  }
};

export const updateTask = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const validatedData = TaskSchemaUpdate.parse(req.body);

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });

    res.json(updatedTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Error updating task", error });
  }
};

export const deleteTask = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const existingRecord = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingRecord) {
      return res
        .status(404)
        .json({ error: `Record with ID: ${id} not found.` });
    }

    await prisma.task.delete({
      where: { id: Number(id) },
    });
    res.status(204).send(`Record with ID: ${id} did deleted.`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Error deleting task", error });
  }
};
