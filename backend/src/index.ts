import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import suggestionsRouter from "./routes/suggestions.js";
import { getAdminAuth } from "./lib/firebaseAdmin.js";

if (
  !process.env.FIREBASE_SERVICE_ACCOUNT_PATH &&
  !process.env.FIREBASE_SERVICE_ACCOUNT_JSON
) {
  console.warn(
    "[firebase-admin] Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON in backend/.env (download JSON from Firebase Console → Project settings → Service accounts). Without it, verifying browser ID tokens usually fails with \"Invalid or expired token\"."
  );
}

const app = express();
const port = Number(process.env.PORT ?? 8787);
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.use(helmet());
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "512kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/me", async (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = header.slice("Bearer ".length).trim();
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    res.json({ uid: decoded.uid });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.use("/api/suggestions", suggestionsRouter);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${String(port)}`);
});
