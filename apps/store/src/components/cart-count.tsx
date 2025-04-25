import type { Cart } from "@/utils/types";
import { useEffect, useState } from "react";

const CartCount = () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]") as Cart[];
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [cartCount, setCartCount] = useState(cartItemCount);
  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(cartItemCount);
    };
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "cart") {
        updateCartCount();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", updateCount);
    };
  }, []);
  return (
    <div className="w-5 h-5 bg-main  text-xs font-bold rounded-full flex items-center justify-center absolute -top-1 -right-1">
      {cartCount}
    </div>
  );
};

export default CartCount;
