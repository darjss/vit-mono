import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { navigate } from "astro:transitions/client";

interface AddToCartProps {
  id: number;
  name: string;
  price: number;
  image: string;
}

const AddToCart = ({ id, name, price, image }: AddToCartProps) => {
  const { addToCart, isLoading, cart } = useCart();
  const [quantity, setQuantity] = useState(1);


  const handleAddToCart = () => {
    const productToAdd = { id, name, price, image };
    addToCart(productToAdd, quantity);
  };
  const handleBuyNow=()=>{
    const productToadd={id, name, price, image}
    addToCart(productToadd, quantity)
    navigate("/checkout")
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between p-3 bg-secondary/40 border-4 border-border rounded-none shadow-[var(--shadow)]">
        <span className="font-[var(--heading-font-weight)] text-foreground uppercase text-sm md:text-base">
          Quantity
        </span>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity === 1}
            className="h-8 w-8 md:h-10 md:w-10 rounded-none p-0 flex items-center justify-center bg-background hover:bg-primary/20 border-2 border-border shadow-[2px_2px_0_0_var(--border)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Decrease quantity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
            </svg>
          </button>

          <span className="font-[var(--heading-font-weight)] text-lg min-w-[1.5rem] text-center border-b-2 border-primary">
            {quantity}
          </span>

          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            disabled={quantity === 5}
            className="h-8 w-8 md:h-10 md:w-10 rounded-none p-0 flex items-center justify-center bg-background hover:bg-primary/20 border-2 border-border shadow-[2px_2px_0_0_var(--border)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Increase quantity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          className="py-4 md:py-5 px-6 bg-main hover:bg-main/90 text-background font-[var(--heading-font-weight)] text-base md:text-lg uppercase tracking-wide rounded-none border-4 border-border shadow-[var(--shadow)] hover:shadow-[5px_5px_0_0_var(--border)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-background"
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
              Сагсанд нэмж байна ...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <p className="text-foreground">Сагсанд нэмэх</p>
            </div>
          )}
        </button>

        <button
          className="py-4 md:py-5 px-6 bg-main hover:bg-main/90 text-background font-[var(--heading-font-weight)] text-base md:text-lg uppercase tracking-wide rounded-none border-4 border-border shadow-[var(--shadow)] hover:shadow-[5px_5px_0_0_var(--border)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleBuyNow}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-background"
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
              Сагсанд нэмж байна...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <p className="text-foreground">Одоо авах </p>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
