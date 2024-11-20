import { Request, Response } from "express";
import app from "./main";
import routerUsers from "./src/modules/users/router";

app.use("/users", routerUsers);

app.get("/", (req: Request, res: Response) => {
  res.send("activo");
  console.log(req.params, req.query);
});

app.listen(3000, () => {
  console.log("Server running on port http://localhost:3000/");
});
