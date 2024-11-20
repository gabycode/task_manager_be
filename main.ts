import { PrismaClient } from "@prisma/client";
import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

export const prisma = new PrismaClient();

async function main() {}

export default app;
