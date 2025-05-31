import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { type Session } from "./server-types";
import { redis } from "@vit/db/redis";
import type { CustomerSelectType } from "@vit/db/schema";
import type { ActionAPIContext } from "astro:actions";
import type { AstroCookies } from "astro";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}
export async function createSession(
  user: CustomerSelectType
): Promise<{ session: Session; token: string }> {
  const token = generateSessionToken();
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    user,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await redis.set(
    `store_session:${session.id}`,
    JSON.stringify({
      id: session.id,
      user: session.user,
      expires_at: Math.floor(session.expiresAt.getTime() / 1000),
    }),
    {
      exat: Math.floor(session.expiresAt.getTime() / 1000),
    }
  );
  await redis.sadd(`store_user_sessions:${user.phone}`, sessionId);

  return { session, token };
}

export async function validateSessionToken(
  token: string
): Promise<Session | null> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session = (await redis.get(`store_session:${sessionId}`)) as Session;

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
    await redis.del(`store_session:${sessionId}`);
    return null;
  }

  if (Date.now() >= expiresAt.getTime() - 1000 * 60 * 30) {
    const updatedSession = {
      ...session,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    };
    await redis.set(
      `store_session:${session.id}`,
      JSON.stringify(updatedSession)
    );
    return updatedSession;
  }

  return session;
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await redis.del(`store_session:${sessionId}`);
}

export async function setSessionTokenCookie(
  context: ActionAPIContext,
  token: string,
  expiresAt: Date
): Promise<void> {
  console.log("Setting cookie with token:", token.substring(0, 10) + "...");
  console.log("Cookie expires at:", expiresAt);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("STORE_DOMAIN:", process.env.STORE_DOMAIN);

  context.cookies.set("store_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
    domain:
      process.env.NODE_ENV === "production" && process.env.STORE_DOMAIN
        ? process.env.STORE_DOMAIN
        : undefined,
  });

  console.log("Cookie set successfully");
}

export async function deleteSessionTokenCookie(
  context: ActionAPIContext
): Promise<void> {
  const { cookies } = context;
  const sessionToken = cookies.get("store_session")?.value ?? null;

  if (sessionToken) {
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(sessionToken))
    );
    await invalidateSession(sessionId);

    context.cookies.set("store_session", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.STORE_DOMAIN
          : undefined,
    });
  } else {
    return;
  }
}

export const auth = async (cookies: AstroCookies): Promise<Session | null> => {
  const token = cookies.get("store_session")?.value ?? null;

  if (token === null) {
    return null;
  }

  return await validateSessionToken(token);
};
