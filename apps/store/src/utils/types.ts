export interface ProductCard {
  id: string;
  name: string;
  price: number;
  image: string;
}
export interface Cart{
  productId: number;
  quantity: number;
}