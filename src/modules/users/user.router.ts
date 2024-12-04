import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "./user.controller";

const routerUsers: Router = Router();

// Usar funciones async directamente en las rutas
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 */
routerUsers.get("/users", getAllUsers); 
 
routerUsers.get("/users/:id", getUserById);
routerUsers.post("/users", createUser);
routerUsers.put("/users/:id", updateUser);
routerUsers.delete("/users/:id", deleteUser);

export default routerUsers;
