import type { Cart } from "@/utils/types";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const useCart = () => {
  const [cart, setCart] = useState<Cart[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(Cookies.get("cart") || "[]") as Cart[];
      setCart(cart);
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
    Cookies.set("cart", JSON.stringify(newCart));
    localStorage.setItem("cartUpdatedAt", new Date().toISOString());
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const addToCart = (id: number, quantity: number) => {
    setIsLoading(true);

    try {
      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex((item) => item.productId === id);

      let newCart: Cart[];
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        newCart = cart.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      } else {
        // Add new item if it doesn't exist
        newCart = [...cart, { productId: id, quantity }];
      }

      updateCartAndNotify(newCart);

      // Show success feedback
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
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

      // Show success feedback
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to remove from cart:", error);
    }
  };

  const clearCart = () => {
    setIsLoading(true);

    try {
      Cookies.remove("cart");
      localStorage.setItem("cartUpdatedAt", new Date().toISOString());
      window.dispatchEvent(new Event("cartUpdated"));

      // Show success feedback
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to clear cart:", error);
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  return { cart, isLoading, addToCart, removeFromCart, clearCart, cartCount };
};
