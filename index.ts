import app from "./main";

app.get("/", (req, res) => {
  res.send("activo");
});

app.listen(3000, () => {
  console.log("Server running on port http://localhost:3000/");
});
