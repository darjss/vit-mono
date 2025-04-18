import { useCart } from "@/hooks/use-cart";

import { Button } from "@workspace/ui/components/button";
import { useState } from "react";

const AddToCart = ({ id }: { id: number }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isLoading } = useCart();
  const handleAddToCart = () => {
    addToCart(id, quantity);
  };
 
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg border border-border">
        <span className="font-medium text-foreground">Quantity</span>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity === 1}
            className="h-9 w-9 rounded-full p-0 flex items-center justify-center bg-background hover:bg-background/80 border border-border"
            aria-label="Decrease quantity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
            </svg>
          </Button>

          <span className="font-semibold text-lg min-w-[1.5rem] text-center">
            {quantity}
          </span>

          <Button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            disabled={quantity === 10}
            className="h-9 w-9 rounded-full p-0 flex items-center justify-center bg-background hover:bg-background/80 border border-border"
            aria-label="Increase quantity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </Button>
        </div>
      </div>

      <Button
        className="w-full py-6 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md shadow-[var(--shadow)] transition-all active:scale-[0.98] text-base"
        variant={"default"}
        onClick={handleAddToCart}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Adding to cart...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            Add to cart
          </div>
        )}
      </Button>
    </div>
  );
};

export default AddToCart;
