import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { CustomersTable } from "@vit/db/schema";
import { redis } from "@vit/db/redis";
import { customAlphabet, nanoid } from "nanoid";

export const customer = createTRPCRouter({
  sendOtp: publicProcedure
    .input(
      z.object({
        phone: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
      console.log("sendOtp called", input)
      const nanoid = customAlphabet("1234567890", 4);
      const otp = nanoid();
      console.log("otp", otp, input.phone);
      await redis.set(input.phone, otp);
      const body = {
        message: `Tanii nevtreh kod ${otp}`,
        phoneNumbers: [`+976${input.phone}`],
        simNumber: 2,
        ttl: 3600,
        withDeliveryReport: true,
        priority: 100,
      };
      console.log("body", body);
      const response = await fetch(
        "https://api.sms-gate.app/3rdparty/v1/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic UTFTM1FQOi16djJzeF9sMms2bnBy",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }
        console.log("response", response);
        return response;
      } catch (error) {
        console.error("error", error);
        throw error;
      }
    }),
  checkOtp: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        otp: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (process.env.NODE_ENV === "development") {
        return true;
      }
      const otpFromRedis = await redis.get(input.phone);

      if (otpFromRedis === input.otp) {
        await redis.del(input.phone);
        return true;
      } else {
        return false;
      }
    }),
});
