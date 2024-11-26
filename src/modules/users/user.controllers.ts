import { z } from "zod";
import { prisma } from "../..";
import { UserSchemaCreate, UserSchemaUpdate } from "./user.dto";

// Obtener todos los usuarios
export const getAllUsers = async (req: any, res: any) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
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
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};
