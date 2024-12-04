import { z } from "zod";
import { prisma } from "../..";
import { UserRegisterSchema, UserLoginSchema } from "./auth.dto";
import ErrorMessageInterface from "../../shared/interfaces/errormessage.interface";
import bcrypt from "bcrypt"

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = UserLoginSchema.parse(req.body);
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        module: "Auth",
        message: `Error getting user with email ${email}`,
        controllerMethod: "login",
        error: "",
      } as ErrorMessageInterface);
    }
    const isPasswordValid = await bcrypt.compare(password || "", findUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        module: "Auth",
        message: `Error with password`,
        controllerMethod: "login",
        error: "",
      } as ErrorMessageInterface);
    }

    return res.json(findUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ error: "Error fetching tasks" });
  }
};

export const register = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: "Error fetching user" });
  }
};
