import type { Cart } from "@/utils/types";
import { useEffect, useState } from "react";

interface ProductDetails {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const useCart = () => {
  const [cart, setCart] = useState<Cart[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const updateCart = () => {
      try {
        const cartData = localStorage.getItem("cart");
        const cart = cartData ? (JSON.parse(cartData) as Cart[]) : [];
        setCart(cart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        setCart([]);
      } finally {
        setIsLoading(false);
      }
    };
    updateCart();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "cart" || event.key === "cartUpdatedAt") {
        updateCart();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  const updateCartAndNotify = (newCart: Cart[]) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    localStorage.setItem("cartUpdatedAt", new Date().toISOString());
    window.dispatchEvent(new Event("cartUpdated"));
    console.log("New cart", newCart);
  };

  const addToCart = (product: ProductDetails, quantity: number) => {
    setIsLoading(true);

    try {
      const existingItemIndex = cart.findIndex(
        (item) => item.productId === product.id
      );

      let newCart: Cart[];
      if (existingItemIndex >= 0) {
        newCart = cart.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      } else {
        newCart = [
          ...cart,
          {
            productId: product.id,
            quantity,
            name: product.name,
            price: product.price,
            image: product.image,
          },
        ];
      }

      updateCartAndNotify(newCart);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to add to cart:", error);
    }
  };

  const removeFromCart = (id: number) => {
    setIsLoading(true);

    try {
      const newCart = cart.filter((item) => item.productId !== id);
      updateCartAndNotify(newCart);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to remove from cart:", error);
    }
  };

  const clearCart = () => {
    setIsLoading(true);

    try {
      localStorage.removeItem("cart");
      localStorage.setItem("cartUpdatedAt", new Date().toISOString());
      window.dispatchEvent(new Event("cartUpdated"));

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to clear cart:", error);
    }
  };

  const updateItem = (id: number, type: "add" | "remove") => {
    setIsLoading(true);
    try {
      const existingItemIndex = cart.findIndex((item) => item.productId === id);

      if (existingItemIndex >= 0) {
        const currentItem = cart[existingItemIndex];
        const newQuantity =
          type === "add" ? currentItem.quantity + 1 : currentItem.quantity - 1;

        let newCart: Cart[];
        if (newQuantity <= 0) {
          newCart = cart.filter((_, index) => index !== existingItemIndex);
        } else {
          newCart = cart.map((item, index) => {
            if (index === existingItemIndex) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          });
        }
        updateCartAndNotify(newCart);
      } else {
        console.warn("Attempted to update item not in cart:", id);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to update item quantity:", error);
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount,
    updateItem,
    totalPrice,
  };
};
