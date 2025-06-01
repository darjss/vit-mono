import { redis } from "@vit/db/redis";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import {
  createSession,
  deleteSessionTokenCookie,
  setSessionTokenCookie,
} from "@/lib/session";
import { db } from "@vit/db";
import { CustomersTable } from "@vit/db/schema";
import { eq } from "drizzle-orm";

// Helper function moved to top for better hoisting
const addUserToDB = async (phone: string) => {
  try {
    const user = await db.query.CustomersTable.findFirst({
      where: eq(CustomersTable.phone, parseInt(phone)),
    });
    console.log("user", user);
    if (!user) {
      const newUser = await db
        .insert(CustomersTable)
        .values({
          phone: parseInt(phone),
          address: "",
        })
        .returning();
      console.log("newUser", newUser);
      return newUser[0];
    }
    return user;
  } catch (error) {
    console.error(error);
  }
};

// Define actions separately for better tree shaking and bundling
const otpLogin = defineAction({
  input: z.object({
    phone: z.string(),
    otp: z.string(),
  }),
  handler: async (input, context) => {
    try {
      const { phone, otp } = input;
      const otpFromRedis = await redis.get(phone);
      console.log("otpFromRedis", otpFromRedis, "type", typeof otpFromRedis);
      console.log("otpInput", otp, "type", typeof otp);
      if (otpFromRedis === parseInt(otp)) {
        await redis.del(phone);
        const user = await addUserToDB(phone);
        if (!user) {
          return false;
        }
        console.log("user", user);
        const { session, token } = await createSession(user);
        console.log("session", session);
        console.log("token", token);
        await setSessionTokenCookie(context, token, session.expiresAt);
        console.log("session token cookie set");
        return true;
      } else {
        console.log("otp not matched");
        return false;
      }
    } catch (error) {
      console.error(error);

      return false;
    }
  },
});

const logOut = defineAction({
  handler: async (input, context) => {
    console.log("logOut", input, context);
    await deleteSessionTokenCookie(context);
    return true;
  },
});

const sendOtp = defineAction({
  input: z.object({
    phone: z.string(),
  }),
  handler: async (input, context) => {
    try {
      const { phone } = input;
      const otp = Math.floor(1000 + Math.random() * 9000);
      const res = await redis.set(phone, otp, { ex: 3600 });
      console.log(res);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

// Explicitly construct and export the auth object
export const auth = {
  otpLogin,
  logOut,
  sendOtp,
};
