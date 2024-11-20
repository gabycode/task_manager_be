import { Router } from "express";
import { getAllUsers } from "./controllers";

const routerUsers = Router();

routerUsers.get("/", getAllUsers);

export default routerUsers;
