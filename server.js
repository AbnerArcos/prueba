import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";

const app = express();
const stripe = new Stripe("TU_SECRET_KEY");

app.use("/webhook", bodyParser.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.static(".")); // sirve tu HTML

// 🧠 usuario (demo)
let usuario = { activo: false };

// ===============================
// VERIFICAR ACCESO
// ===============================
app.get("/verificar-acceso", (req, res) => {
  res.json({ activo: usuario.activo });
});

// ===============================
// CREAR CHECKOUT
// ===============================
app.get("/crear-checkout", async (req, res) => {

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{
      price: "TU_PRICE_ID",
      quantity: 1
    }],
    success_url: "http://localhost:3000",
    cancel_url: "http://localhost:3000"
  });

  res.json({ url: session.url });
});

// ===============================
// WEBHOOK
// ===============================
app.post("/webhook", (req, res) => {

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      "TU_WEBHOOK_SECRET"
    );
  } catch (err) {
    return res.sendStatus(400);
  }

  if (event.type === "invoice.paid") {
    usuario.activo = true;
    console.log("✅ ACTIVADO");
  }

  if (
    event.type === "invoice.payment_failed" ||
    event.type === "customer.subscription.deleted"
  ) {
    usuario.activo = false;
    console.log("❌ BLOQUEADO");
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("🚀 http://localhost:3000");
});