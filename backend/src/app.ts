import express from "express";
import { DB } from "./db";
import z from "zod";
import cors from "cors";

const app = express();
const port = 4000;

const db = new DB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.put("/user", (req, res) => {
  const user = db.createUser();

  for (const name of ["Defaultious", "Dingus", "Bingus"]) {
    db.createDragon(user, name);
  }

  res.send(user.toFrontend());
});

const idSchema = z.number().min(0, "Negative ID's should not exist");

app.get("/user/:id", (req, res) => {
  const id = idSchema.safeParse(+req.params.id);

  if (id.error) {
    res.status(401).send(id.error);
    console.error("Failed with", id.error);
    return;
  }

  const user = db.getUser(id.data);

  if (user) {
    res.send(user.toFrontend());
  } else {
    res.status(404).send("User not found");
  }
});

// Dragons

const putDragonSchema = z.object({
  name: z
    .string()
    .min(5, "Dragon name must be longer than 5 characters")
    .max(255, "Dragon name cannot be longer than 255 characters"),
  userId: idSchema,
});

app.put("/dragon", (req, res) => {
  const params = putDragonSchema.safeParse(req.body);

  if (params.error) {
    res.status(401).send(params.error);
    return;
  }

  const user = db.getUser(params.data.userId);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  return res.send(db.createDragon(user, params.data.name).toFrontend());
});

// Battles

const putBattleSchema = z.object({
  userId: idSchema,
  dragons: z.tuple([idSchema, idSchema]),
});

app.put("/battle", (req, res) => {
  const params = putBattleSchema.safeParse(req.body);

  if (params.error) {
    res.status(401).send(params.error);
    return;
  }

  const user = db.getUser(params.data.userId);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  const battle = db.createBattle(user, params.data.dragons);

  if (typeof battle === "string") {
    res.status(400).send(battle);
  } else {
    res.send(battle.toFrontend());
  }
});

app.get("/battle/:first/:second", (req, res) => {
  const first = idSchema.parse(+req.params.first);
  const second = idSchema.parse(+req.params.second);

  const battle = db.getBattle(first, second);

  if (battle) {
    res.send(battle.toFrontend());
  } else {
    res.status(404).send("Battle not found");
  }
});

app.patch("/battle/:first/:second/takeTurn", (req, res) => {
  const first = idSchema.parse(+req.params.first);
  const second = idSchema.parse(+req.params.second);

  const battle = db.getBattle(first, second);

  if (!battle) {
    res.status(404).send("Battle not found");
    return;
  }

  battle.iterate();

  return battle.toFrontend();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
