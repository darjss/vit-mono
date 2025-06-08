import { db } from "@vit/db";
import { CustomersTable } from "@vit/db/schema";
import { eq } from "drizzle-orm";

export const addCustomerToDB = async (phone: string) => {
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