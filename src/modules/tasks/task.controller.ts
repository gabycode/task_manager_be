import { z } from "zod";
import { prisma } from "../..";
import { TaskStatusEnum } from "../../shared/enums/taskStatus";
import SearchParams from "../../shared/interfaces/searchparams.interface";
import { TaskSchema } from "./task.dto";

export const getAllTasks = async (req: any, res: any) => {
  try {
    const { status } = req.query;
    const { page, limit, param }: Partial<SearchParams> = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    // CAPTURAMOS EL STATUS

    // HACER BUSQUEDA AQUI JUNTO A PAGINACION, SEARCH
    const tasks = await prisma.task.findMany({
      take: limitNumber,
      skip: (pageNumber - 1) * limitNumber,
      where: param
        ? {
            status: status,
            disabled: false,
            OR: [
              { title: { contains: param } }, // Búsqueda en `title`
              { content: { contains: param } },
            ],
          }
        : { disabled: false, status: status },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(
      tasks,
      "tasks",
      limitNumber,
      "limitNumber",
      pageNumber,
      "pageNumber",
      status,
      "status",
      page,
      limit,
      param,
      "page, limit, param",
    );
    const totalTask = await prisma.task.count({
      where: param
        ? {
            status: status,
            disabled: false,
            OR: [
              { title: { contains: param } },
              { content: { contains: param } },
            ],
          }
        : { status: status, disabled: false },
    });

    const totalPages = Math.ceil(totalTask / limitNumber);

    res.json({
      data: tasks,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        limit: limitNumber,
        totalRecords: totalTask,
      },
    });
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
    const data = {
      ...req.body,
      disabled: false,
    };

    const validatedData = TaskSchema.parse(data);
    console.log(validatedData, "validatedData");
    const newTask = await prisma.task.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        createdAt: new Date(),
        disabled: false,
        status: TaskStatusEnum.PENDING,
        createdBy: validatedData.createdBy,
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
    const validatedData = TaskSchema.parse(req.body);

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

export const disableTask = async (req: any, res: any) => {
  const { id, userId } = req.params;
  console.log(id, userId, "id, userId");
  try {
    const existingRecord = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    console.log(existingRecord, "existingRecord");
    if (!existingRecord) {
      return res
        .status(404)
        .json({ error: `Record with ID: ${id} not found.` });
    }

    await prisma.task.update({
      where: { id: Number(id) },
      data: {
        disabled: true,
        disabledBy: Number(userId),
        disabled_at: new Date(),
        updatedAt: new Date(),
        updatedBy: Number(userId),
      },
    });

    res.status(204).send(`Record with ID: ${id} did disabled.`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Error disabling task", error });
  }
};
