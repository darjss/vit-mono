import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@vit/db";
import { BrandsTable } from "@vit/db/schema";
import { eq } from "drizzle-orm";

export const brand = createTRPCRouter({
  getAllBrands: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.BrandsTable.findMany({
      columns: {    
        id: true,
        name: true,
        logoUrl: true,
      },
    });
  }),
  getBrandById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const result = await db.query.BrandsTable.findFirst({
        columns: {
          id: true,
          name: true,
          logoUrl: true,
        },
        where: eq(BrandsTable.id, input.id),
      });
      if (result === null || result === undefined) {
        return null;
      }
      return result;
    }),
});
