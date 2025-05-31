export const runtime = "nodejs";
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

// Re-export drizzle-orm functions
export { and, between, eq, gte, sql, desc, asc, type SQL } from "drizzle-orm";

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
    // Use database in monorepo root - simple relative path
    return "file:/home/darjs/projects/vit-mono/dev.db";
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
