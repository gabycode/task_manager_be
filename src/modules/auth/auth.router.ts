import { Router } from "express";
import {  login, register } from "./auth.controller";

const routerAuth: Router = Router();

// Usar funciones async directamente en las rutas
routerAuth.post("/login", login);  
routerAuth.post("/register", register);

export default routerAuth;
