import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "./user.controllers";

const routerUsers: Router = Router();

// Usar funciones async directamente en las rutas
routerUsers.get("/users", getAllUsers);  
routerUsers.get("/users/:id", getUserById);
routerUsers.post("/users", createUser);
routerUsers.put("/users/:id", updateUser);
routerUsers.delete("/users/:id", deleteUser);

export default routerUsers;
