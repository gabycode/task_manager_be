import { PrismaClient } from "@prisma/client";
import express from "express";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(morgan("combined"));

export const prisma = new PrismaClient();

async function main() {}

export default app;
