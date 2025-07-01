const express = require("express");
const cors = require("cors");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ simulations: [] }).write();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/simulations", (req, res) => {
  const simulations = db
    .get("simulations")
    .sortBy("timestamp")
    .reverse()
    .value();

  res.json({
    message: "success",
    data: simulations,
  });
});

app.post("/api/simulations", async (req, res) => {
  try {
    const { nanoid } = await import("nanoid");
    const {
      valorEmprestimo,
      prazoMeses,
      dataNascimento,
      valorTotal,
      valorParcelas,
      totalJuros,
      idade,
    } = req.body;

    if (!valorEmprestimo || !prazoMeses || !dataNascimento) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newSimulation = {
      id: nanoid(),
      valorEmprestimo,
      prazoMeses,
      dataNascimento,
      valorTotal,
      valorParcelas,
      totalJuros,
      idade,
      timestamp: new Date().toISOString(),
    };

    db.get("simulations").push(newSimulation).write();

    res.status(201).json({
      message: "success",
      data: newSimulation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/reset-simulations", (req, res) => {
  db.set("simulations", []).write();
  res.sendStatus(200);
});

const HTTP_PORT = 3001;
app.listen(HTTP_PORT, () => {
  console.log(`Server with lowdb running on http://localhost:${HTTP_PORT}`);
  console.log("Database file is db.json");
});
