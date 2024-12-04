import { z } from "zod";
import { prisma } from "../..";
import { UserRegisterSchema, UserLoginSchema } from "./auth.dto";
import ErrorMessageInterface from "../../shared/interfaces/errormessage.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = UserLoginSchema.parse(req.body);

    const findUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!findUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password || "",
      findUser.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: findUser.id, email: findUser.email },
      SECRET_KEY!,
      { expiresIn: "1h" },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ error: "Error fetching tasks" });
  }
};

export const register = async (req: any, res: any) => {

  try {
    const { email, name, lastName, password } = UserRegisterSchema.parse(
      req.body,
    );

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password || "", 10);

    // Crear el usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        lastName,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: "Error fetching user" });
  }
};
