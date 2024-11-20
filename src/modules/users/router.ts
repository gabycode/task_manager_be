import { Router } from "express";

const routerUsers = Router();

routerUsers.get("/", (req, res) => {
  res.send("All users");
});

export default routerUsers;
