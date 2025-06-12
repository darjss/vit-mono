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

  const sessionDataToStore = {
    id: session.id,
    user: session.user,
    expires_at: Math.floor(session.expiresAt.getTime() / 1000),
  };

  console.log("🔴 Creating session with ID:", sessionId);
  console.log("🔴 Session data to store:", sessionDataToStore);
  console.log("🔴 Redis key:", `store_session:${session.id}`);

  await redis.set(
    `store_session:${session.id}`,
    JSON.stringify(sessionDataToStore),
    {
      exat: Math.floor(session.expiresAt.getTime() / 1000),
    }
  );
  
  await redis.sadd(`store_user_sessions:${user.phone}`, sessionId);

  console.log("🔴 Session stored successfully");

  return { session, token };
}

export async function validateSessionToken(
  token: string
): Promise<Session | null> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  console.log("🔴 sessionId", sessionId);
  
  const sessionData = await redis.get(`store_session:${sessionId}`);
  console.log("🔴 Raw session data from Redis:", sessionData);

  if (!sessionData) {
    console.log("🔴 No session data found in Redis");
    return null;
  }

  let parsedSession: any;
  try {
    parsedSession = typeof sessionData === 'string' ? JSON.parse(sessionData) : sessionData;
    console.log("🔴 Parsed session data:", parsedSession);
  } catch (error) {
    console.log("🔴 Failed to parse session data:", error);
    return null;
  }

  if (
    !parsedSession ||
    !parsedSession.user ||
    !parsedSession.id
  ) {
    console.log("🔴 Invalid session structure:", parsedSession);
    return null;
  }

  // Convert the stored format back to Session format
  const expiresAt = new Date(parsedSession.expires_at * 1000); // Convert seconds to milliseconds
  console.log("🔴 Session expires at:", expiresAt);

  if (Date.now() >= expiresAt.getTime()) {
    console.log("🔴 Session expired, deleting");
    await redis.del(`store_session:${sessionId}`);
    return null;
  }

  const session: Session = {
    id: parsedSession.id,
    user: parsedSession.user,
    expiresAt: expiresAt,
  };

  // Refresh session if it's close to expiry (30 minutes)
  if (Date.now() >= expiresAt.getTime() - 1000 * 60 * 30) {
    console.log("🔴 Refreshing session");
    const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    const updatedSession: Session = {
      ...session,
      expiresAt: newExpiresAt,
    };
    
    // Store in the same format as createSession
    await redis.set(
      `store_session:${session.id}`,
      JSON.stringify({
        id: session.id,
        user: session.user,
        expires_at: Math.floor(newExpiresAt.getTime() / 1000),
      }),
      {
        exat: Math.floor(newExpiresAt.getTime() / 1000),
      }
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

  console.log("🔴 Auth function - checking token:", token);

  if (token === null) {
    return null;
  }

  return await validateSessionToken(token);
};
