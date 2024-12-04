import { Router } from "express";
import {  login, register } from "./auth.controller";

const routerTasks: Router = Router();

// Usar funciones async directamente en las rutas
routerTasks.get("/login", login);  
routerTasks.get("/register", register);

export default routerTasks;
