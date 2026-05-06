import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "node:fs";

let app: App | null = null;

function loadCredential() {
  const jsonPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const jsonRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (jsonPath) {
    const raw = readFileSync(jsonPath, "utf8");
    return JSON.parse(raw) as Parameters<typeof cert>[0];
  }
  if (jsonRaw) {
    return JSON.parse(jsonRaw) as Parameters<typeof cert>[0];
  }
  return undefined;
}

export function getFirebaseApp(): App {
  if (app) return app;
  const first = getApps().at(0);
  if (first) {
    app = first;
    return app;
  }
  const credentialPayload = loadCredential();
  if (credentialPayload) {
    app = initializeApp({ credential: cert(credentialPayload) });
  } else {
    app = initializeApp();
  }
  return app;
}

export function getAdminAuth() {
  return getAuth(getFirebaseApp());
}
