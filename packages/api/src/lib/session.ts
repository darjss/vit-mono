import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeHexLowerCase,
  encodeBase32LowerCaseNoPadding,
} from "@oslojs/encoding";

import { type Session } from "./types"
import { redis } from "@vit/db/redis";
import type { CustomerSelectType } from "@vit/db/schema";
import {serialize, parse} from "cookie"

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

const cookieConfig = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60*60*24*7,
  path: "/",
};

export async function createSession(
  user: CustomerSelectType
): Promise<{ session: Session; token: string }> {
    const token = generateSessionToken();
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    user,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  };
  await redis.set(
    `session:${session.id}`,
    JSON.stringify({
      id: session.id,
      user: session.user,
      expires_at: Math.floor(session.expiresAt.getTime() / 1000),
    }),
    {
      exat: Math.floor(session.expiresAt.getTime() / 1000),
    }
  );
  await redis.sadd(`user_sessions:${user.phone}`, sessionId);

  return { session, token };
}

export async function validateSessionToken(
  token: string
): Promise<Session | null> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session = (await redis.get(`session:${sessionId}`)) as Session;

  if (
    session === null ||
    session === undefined ||
    session.user === null ||
    session.user === undefined ||
    session.id === null ||
    session.id === undefined
  ) {
    return null;
  }

  const expiresAt = new Date(session.expiresAt);

  if (Date.now() >= expiresAt.getTime()) {
    await redis.del(`session:${sessionId}`);
    return null;
  }

  if (Date.now() >= expiresAt.getTime() - 1000 * 60 * 30) {
    const updatedSession = {
      ...session,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    };
    await redis.set(session.id, JSON.stringify(session));
    return session;
  }

  return session;
}

export async function invalidateSession(sessionId: string): Promise<void> {
   await redis.del(`session:${sessionId}`);
}

export function setSessionTokenCookie(
  resHeaders: Headers,
  token: string,
  expiresAt: Date
): void {
  const isProduction = process.env.NODE_ENV === "production";
  const isDevelopment = process.env.NODE_ENV === "development";
  
  const cookieString = serialize("store_session", token, {
    httpOnly: true,
    // In production: "lax" for same-domain, in dev: "none" for cross-origin  
    sameSite: isProduction ? "lax" : "none",
    // Secure required for sameSite: "none", but only if HTTPS is available
    secure: isProduction || process.env.HTTPS === "true",
    expires: expiresAt,
    path: "/",
    // Set domain only in production for subdomain sharing (store.com -> admin.store.com)
    domain: isProduction ? process.env.STORE_DOMAIN : undefined,
  });
  resHeaders.set("Set-Cookie", cookieString);
}

export function deleteSessionTokenCookie(resHeaders: Headers): void {
  const isProduction = process.env.NODE_ENV === "production";
  
  const cookieString = serialize("store_session", "", {
    httpOnly: true,
    sameSite: isProduction ? "lax" : "none",
    secure: isProduction || process.env.HTTPS === "true",
    maxAge: 0,
    path: "/",
    domain: isProduction ? process.env.STORE_DOMAIN : undefined,
  });
  resHeaders.set("Set-Cookie", cookieString);
}

export const auth = async (token: string | null): Promise<Session | null> => {
  

  console.log("checking auth with session", token);

  if (token === null) {
    return null;
  }

  return await validateSessionToken(token);
};
