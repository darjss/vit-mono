import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@vit/db";
import { eq } from "drizzle-orm";

export const payment = createTRPCRouter({

})