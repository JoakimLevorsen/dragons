import express from "express";
import { DB } from "./db";
import z from "zod";
import cors from "cors";

const app = express();
const port = 4000;

const db = new DB();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.put("/user", (req, res) => {
  res.send(db.createUser());
});

// Dragons

const putDragonSchema = z.object({
  name: z
    .string()
    .min(5, "Dragon name must be longer than 5 characters")
    .max(255, "Dragon name cannot be longer than 255 characters"),
});

app.put("/dragon", (req, res) => {
  const params = putDragonSchema.safeParse(req.params);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
