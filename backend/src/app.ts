import express from "express";
import { DB } from "./db";

const app = express();
const port = 3000;

const db = new DB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.put("/user", (req, res) => {
  res.send(db.createUser());
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
