export const runtime = "nodejs";
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as schema from "./schema";

/**
 * Cache the database connection in development to avoid creating
 * a new connection on every HMR update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

const isDevelopment = process.env.NODE_ENV !== "production";

const getDbUrl = () => {
  if (isDevelopment) {
    // Construct path relative to this file's location within the package
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    // Go up one level from src/ to the package root packages/db/
    const dbPath = path.join(currentDir, "..", "dev.db");
    // Ensure the path format works with file: protocol (especially on Windows)
    return `file:${path.resolve(dbPath)}`;
  }

  if (!process.env.TURSO_CONNECTION_URL) {
    throw new Error(
      "TURSO_CONNECTION_URL environment variable is not defined in production"
    );
  }
  return process.env.TURSO_CONNECTION_URL;
};

export const client =
  globalForDb.client ??
  createClient({
    url: getDbUrl(),
    ...(isDevelopment ? {} : { authToken: process.env.TURSO_AUTH_TOKEN }),
  });

if (isDevelopment) globalForDb.client = client;

export const db = drizzle(client, { schema: schema, logger: true });
