import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { PORT, URL_APP } from "./config/vars";
import routerUsers from "./modules/users/user.router";

const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

app.use("/api", routerUsers);

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello World" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send("Algo salió mal");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${URL_APP}:${PORT}`);
});

export const prisma = new PrismaClient();

export default app;
