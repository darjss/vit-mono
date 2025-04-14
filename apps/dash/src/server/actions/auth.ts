"use server";
import "server-only";
import { db } from "../db";
import { UserSelectType, UsersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { Session } from "@/lib/types";
import {
  unstable_cacheLife as cacheLife,
  revalidateTag,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { redis } from "../db/redis";
export const insertSession = async (session: Session) => {
  const sessionToStore = {
    ...session,
    expiresAt: session.expiresAt.toISOString(),
  };
  return await redis.json.set(session.id, "$", sessionToStore);
};

export const getSession = async (sessionId: string) => {
  console.log("Getting session from redis");
  const session = (await redis.get(`session:${sessionId}`)) as Session;
  if (session === null || session === undefined) {
    return session;
  }

  const user = session.user;
  if (user === null || user === undefined) {
    return null;
  }
  console.log("Session result", session);
  return {
    session: session as Session,
    user: user as UserSelectType,
  };
};

export const redisBenchmark = async () => {
  if (process.env.NODE_ENV === "production") {
    const setStart = performance.now();
    redis.set("test", "test");
    const setEnd = performance.now();
    const getStart = performance.now();
    redis.get("test");
    const getEnd = performance.now();
    return {
      set: setEnd - setStart,
      get: getEnd - getStart,
    };
  } else {
    return {
      set: 0,
      get: 0,
    };
  }
};  

export const deleteSession = async (sessionId: string) => {
  revalidateTag("session");
  return await redis.del(`session:${sessionId}`);
};
export const updateSession = async (session: Session) => {
  revalidateTag("session");
  return await redis.set(session.id, JSON.stringify(session));
};
export const createUser = async (
  googleId: string,
  username: string,
  isApproved: boolean = false,
) => {
  const [user] = await db
    .insert(UsersTable)
    .values({
      googleId,
      username,
      isApproved,
    })
    .returning({
      id: UsersTable.id,
      username: UsersTable.username,
      googleId: UsersTable.googleId,
      isApproved: UsersTable.isApproved,
      createdAt: UsersTable.createdAt,
      updatedAt: UsersTable.updatedAt,
    });
  if (user === null || user == undefined) {
    throw new Error("User not found");
  }
  return user;
};
export const getUserFromGoogleId = async (googleId: string) => {
  const result = await db
    .select({ user: UsersTable })
    .from(UsersTable)
    .where(eq(UsersTable.googleId, googleId));
  if (result.length < 1 || result[0] === undefined) {
    return null;
  }
  return result[0].user as UserSelectType;
};
