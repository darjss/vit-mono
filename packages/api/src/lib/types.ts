import type { CustomerSelectType } from "@vit/db/schema";

export interface Session {
  id: string;
  user: CustomerSelectType;
  expiresAt: Date;
}
