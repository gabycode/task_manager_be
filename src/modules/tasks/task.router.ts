import { Router } from "express";
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from "./task.controllers";

const routerTasks: Router = Router();

// Usar funciones async directamente en las rutas
routerTasks.get("/tasks", getAllTasks);  
routerTasks.get("/tasks/:id", getTaskById);
routerTasks.post("/tasks", createTask);
routerTasks.put("/tasks/:id", updateTask);
routerTasks.delete("/tasks/:id", deleteTask);

export default routerTasks;
