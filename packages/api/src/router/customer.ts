import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { CustomersTable } from "@vit/db/schema";
import { redis } from "@vit/db/redis";
import { customAlphabet, nanoid } from "nanoid";
import { addCustomerToDB } from "../lib/queries";
import {
  createSession,
  setSessionTokenCookie,
  deleteSessionTokenCookie,
  invalidateSession,
} from "../lib/session";
import { TRPCError } from "@trpc/server";

export const customer = createTRPCRouter({
  sendOtp: publicProcedure
    .input(
      z.object({
        phone: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log("sendOtp called", input);

        const nanoid = customAlphabet("1234567890", 4);
        const otp = nanoid();
        console.log("otp", otp, input.phone);
        await redis.set(input.phone, otp, { ex: 3600 });
        // const body = {
        //   message: `Tanii nevtreh kod ${otp}`,
        //   phoneNumbers: [`+976${input.phone}`],
        //   simNumber: 2,
        //   ttl: 3600,
        //   withDeliveryReport: true,
        //   priority: 100,
        // };
        // console.log("body", body);
        // const response = await fetch(
        //   "https://api.sms-gate.app/3rdparty/v1/messages",
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: "Basic UTFTM1FQOi16djJzeF9sMms2bnBy",
        //     },
        //     body: JSON.stringify(body),
        //   }
        // );

        // if (!response.ok) {
        //   const errorText = await response.text();
        //   throw new Error(
        //     `HTTP error! status: ${response.status}, message: ${errorText}`
        //   );
        // }
        //   console.log("response", response);
        //   return response;
      } catch (error) {
        console.error("error", error);
        throw error;
      }
    }),
  login: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        otp: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        let isValidOtp = false;

        if (process.env.NODE_ENV === "development") {
          isValidOtp = true;
        } else {
          const otpFromRedis = (await redis.get(input.phone)) + "";
          console.log(
            "otpFromRedis",
            otpFromRedis,
            input.otp,
            typeof otpFromRedis,
            typeof input.otp
          );
          isValidOtp = otpFromRedis === input.otp;

          if (isValidOtp) {
            await redis.del(input.phone);
          }
        }

        if (!isValidOtp) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid OTP",
          });
        }

        // Add customer to DB if not exists
        const user = await addCustomerToDB(input.phone);

        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create or retrieve user",
          });
        }

        // Create session
        const { session, token } = await createSession(user);

        // Always set cookie since we assume server can set it
        console.log("Setting session cookie for user:", user.phone);
        console.log("resHeaders available:", !!ctx.resHeaders);

        if (ctx.resHeaders) {
          setSessionTokenCookie(ctx.resHeaders, token, session.expiresAt);
          console.log("Session cookie set via resHeaders");
        }

        return {
          success: true,
          user: session.user,
          // Always assume cookie was set successfully
        };
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      if (ctx.session) {
        await invalidateSession(ctx.session.id);
      }

      // Clear cookie
      if (ctx.resHeaders) {
        deleteSessionTokenCookie(ctx.resHeaders);
      }

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }),

  me: publicProcedure.query(async ({ ctx }) => {
    return ctx.session?.user;
  }),
});
