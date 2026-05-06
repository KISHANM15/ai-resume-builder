import type { Request, Response, NextFunction } from "express";
import { getAdminAuth } from "../lib/firebaseAdmin.js";

export interface AuthedRequest extends Request {
  uid?: string;
}

export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }
  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    res.status(401).json({ error: "Missing token" });
    return;
  }
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    req.uid = decoded.uid;
    next();
  } catch (err) {
    console.error(
      "[requireAuth] verifyIdToken failed — same Firebase project as the web app and FIREBASE_SERVICE_ACCOUNT_PATH (or JSON) must be set on the backend:",
      err instanceof Error ? err.message : err
    );
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
