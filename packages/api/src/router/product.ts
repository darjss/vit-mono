import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "@vit/db";
import { and, eq, sql } from "drizzle-orm";
import { ProductImagesTable, ProductsTable } from "@vit/db/schema";


export const product = createTRPCRouter({
    getFeauturedProducts: publicProcedure
        .query( async () => {
            const result= await db.query.ProductsTable.findMany({
                columns: {
                    id: true,
                    name: true,
                    price: true,
                },
                orderBy: sql`RANDOM()`,
                limit: 6,
                where: eq(ProductsTable.status, "active"),
                with: {
                    images: {
                        columns: {
                            url: true,
                        },
                        where: eq(ProductImagesTable.isPrimary, true),
                    },
                },
            });
            return result.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0]?.url,
            }));
        },
    
    ),
    getAllProducts: publicProcedure
        .query( async () => {
            return await db.query.ProductsTable.findMany({
                columns: {
                    id: true,
                    slug: true,
                }
            });

    }
),
getProductById: publicProcedure
    .input(z.object({
        id: z.number(),
    }))
    .query( async ({ input }) => {

        const result =await db.query.ProductsTable.findFirst({
            columns: {
                id: true,
                name: true,
                price: true,
                status: true,
                description: true,
                discount: true,
                amount: true,
                potency: true,
                dailyIntake: true,
                categoryId: true,
                brandId: true,
                },
            where: eq(ProductsTable.id, input.id),
            with: {
                images: {
                    columns: {
                        url: true,
                        isPrimary: true,
                    },
                },
            },
        });
        if(result === null || result === undefined) {
            return null;
        }
        return result
    }
),
}
)
