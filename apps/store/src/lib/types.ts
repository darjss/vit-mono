import type { CustomerSelectType } from "@vit/db/schema";

export interface ProductCard {
  id: number;
  name: string;
  price: number;
  image: string;
}
export interface Cart {
  productId: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
}
export interface Session {
  id: string;
  user: CustomerSelectType;
  expiresAt: Date;
}
