import { z } from "zod";
import { prisma } from "../..";
import { UserSchemaCreate, UserSchemaUpdate } from "./user.dto";

interface SearchParams {
  page: number;
  limit: number;
  param: string;
}

// Obtener todos los usuarios con paginación
export const getAllUsers = async (req: any, res: any) => {
  try {
    const {
      page = 1,
      limit = 10,
      param = "",
    }: Partial<SearchParams> = req.query;

    // Convertir `page` y `limit` a números (si es necesario)
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    // Obtener usuarios con los filtros y la paginación
    const users = await prisma.user.findMany({
      take: limitNumber, // Límite de registros por página
      skip: (pageNumber - 1) * limitNumber, // Calcular el número de registros a saltar
      where: param
        ? {
            OR: [
              { name: { contains: param } },
              { lastName: { contains: param } },
              { email: { contains: param } },
            ],
          }
        : {}, // Si no hay parámetro, devuelve todos
    });

    // Contar el total de usuarios para calcular las páginas
    const totalUsers = await prisma.user.count({
      where: param
        ? {
            OR: [
              { name: { contains: param } },
              { lastName: { contains: param } },
              { email: { contains: param } },
            ],
          }
        : {},
    });

    const totalPages = Math.ceil(totalUsers / limitNumber);

    // Respuesta con los datos y metadatos de paginación
    res.json({
      data: users,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        limit: limitNumber,
        totalRecords: totalUsers,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users", error });
  }
};
// Obtener un usuario por ID
export const getUserById = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: "Error fetching user" });
  }
};

// Crear un usuario
export const createUser = async (req: any, res: any) => {
  try {
    const validatedData = UserSchemaCreate.parse(req.body);

    const newUser = await prisma.user.create({
      data: validatedData,
    });

    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: "Error creating user" });
  }
};

// Actualizar un usuario
export const updateUser = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const validatedData = UserSchemaUpdate.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: validatedData,
    });

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: "Error updating user" });
  }
};

// Eliminar un usuario
export const deleteUser = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const existingRecord = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingRecord) {
      return res
        .status(404)
        .json({ error: `Record with ID: ${id} not found.` });
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(204).send(`Record with ID: ${id} did deleted.`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: "Error deleting user" });
  }
};
