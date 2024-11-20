// class UsersController {
//   constructor() {}
//   getAllUsers() {
//   }
// }
import { Request, Response } from "express";
import { prisma } from "../../../main";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};
