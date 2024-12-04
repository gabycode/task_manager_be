import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { PORT, URL_APP } from "./config/vars";
import routerUsers from "./modules/users/user.router";
import routerTasks from "./modules/tasks/task.router";
import routerAuth from "./modules/auth/auth.router";

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

// Swagger Configuración
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Express.js API",
      version: "1.0.0",
      description: "A sample Express.js API built with TypeScript and Swagger",
    },
    servers: [
      {
        url: `${URL_APP}:${PORT}/api`,
      },
    ],
  },
  apis: ["./src/modules/**/*.router.ts"], // Ruta donde están definidas tus rutas
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use("/api", routerUsers);
app.use("/api", routerTasks);
app.use("/api", routerAuth);

// Rutas base
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello World" });
});

// Manejo de errores global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: "Algo salió mal",
    error: err,
  });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Server is running on ${URL_APP}:${PORT}`);
});

export const prisma = new PrismaClient();
export default app;
