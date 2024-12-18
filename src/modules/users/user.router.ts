import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./user.controller";

const routerUsers: Router = Router();

routerUsers.get("/users", getAllUsers);

routerUsers.get("/users/:id", getUserById);
routerUsers.post("/users", createUser);
routerUsers.put("/users/:id", updateUser);
routerUsers.delete("/users/:id", deleteUser);

export default routerUsers;
