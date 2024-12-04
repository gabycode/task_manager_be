import { Router } from "express";
import {  login, register } from "./auth.controller";

const routerAuth: Router = Router();

// Usar funciones async directamente en las rutas
routerAuth.get("/login", login);  
routerAuth.get("/register", register);

export default routerAuth;
