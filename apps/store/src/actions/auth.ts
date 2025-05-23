import { redis } from "@vit/db/redis";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { createSession, deleteSessionTokenCookie, setSessionTokenCookie } from "@/lib/session";
import { db } from "@vit/db";
import { CustomersTable } from "@vit/db/schema";
import { eq } from "drizzle-orm";
import { Delete } from "lucide-react";
export const auth = {
  otpLogin: defineAction({
    input: z.object({
      phone: z.string(),
      otp: z.string(),
    }),
    handler: async (input, context) => {
      const { phone, otp } = input;
      const otpFromRedis = await redis.get(phone);
      if (otpFromRedis === otp) {
        await redis.del(phone);
        const user = await db.query.CustomersTable.findFirst({
          where: eq(CustomersTable.phone, parseInt(phone)),
        });
        if (!user) {
          return false;
        }
        const session = await createSession(user);
        setSessionTokenCookie(context, session.id, session.expiresAt);
        return true;
      } else {
        return false;
      }
    },
  }),
  logOut: defineAction({
    handler: async (input, context) => {
        deleteSessionTokenCookie(context);
        return true;
    },
  }),
  
};