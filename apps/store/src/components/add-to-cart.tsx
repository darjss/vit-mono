import type { Cart } from "@/utils/types";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";

const AddToCart = ({ id }: { id: number }) => {
  console.log("id", id);
  const [quantity, setQuantity] = useState(1);
  const handleAddToCart = () => {
    console.log("add to cart with id", id);
    const currentCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    ) as Cart[];
    const newCart = [...currentCart, { productId: id, quantity }];
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 self-center">
        <Button
          onClick={() => setQuantity(quantity - 1)}
          disabled={quantity === 1}
          className="bg-background/80 hover:bg-background font-bold text-lg *:"
        >
          -
        </Button>
        <p>{quantity}</p>
        <Button
          onClick={() => setQuantity(quantity + 1)}
          disabled={quantity === 10}
          className="bg-background/80 hover:bg-background font-bold text-lg"
        >
          +
        </Button>
      </div>

      <Button
        className="w-full py-3 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md shadow-[var(--shadow)] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        variant={"default"}
        onClick={handleAddToCart}
      >
        Add to cart
      </Button>
    </div>
  );
};

export default AddToCart;
