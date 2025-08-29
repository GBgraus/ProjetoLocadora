import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Banco em memória (troque por Postgres/MySQL/Mongo depois)
const db = { orders: [], appointments: [] };

// Criar pedido
app.post("/api/orders", (req, res) => {
  const order = req.body;
  db.orders.unshift(order);
  return res.json({ ok: true, id: order.id });
});

// Criar agendamento
app.post("/api/appointments", (req, res) => {
  const ap = req.body;
  db.appointments.unshift(ap);
  return res.json({ ok: true, id: ap.id });
});

// (opcionais) listar para o painel admin real
app.get("/api/orders", (_req, res) => res.json(db.orders));
app.get("/api/appointments", (_req, res) => res.json(db.appointments));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
