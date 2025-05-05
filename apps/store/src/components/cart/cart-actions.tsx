import { useCart } from "@/hooks/use-cart";
import { useState } from "react";

interface CartActionsProps {
  quantity: number;
  productId: number;
}

const CartActions = ({ quantity, productId }: CartActionsProps) => {
  const { updateItem, removeFromCart } = useCart();
  const [itemQuantity, setItemQuantity] = useState(quantity);

  const handleDecrease = () => {
    if (itemQuantity > 1) {
      setItemQuantity(itemQuantity - 1);
      updateItem(productId, "remove");
    }
  };

  const handleIncrease = () => {
    setItemQuantity(itemQuantity + 1);
    updateItem(productId, "add");
  };

  return (
    <div className="border-4 border-border p-2 mb-3 flex items-center bg-background">
      <span className="font-[var(--heading-font-weight)] text-sm sm:text-base mr-auto">
        ТОО
      </span>
      <button
        className="border-4 border-border p-2 h-10 w-10 flex items-center justify-center bg-background hover:bg-secondary/50 transition-colors"
        data-product-id={productId}
        data-action="decrease"
        onClick={handleDecrease}
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
          <path d="M5 12h14"></path>
        </svg>
      </button>
      <div className="px-4 border-b-4 border-accent mx-2 text-lg font-[var(--heading-font-weight)]">
        {itemQuantity}
      </div>
      <button
        className="border-4 border-border p-2 h-10 w-10 flex items-center justify-center bg-background hover:bg-secondary/50 transition-colors"
        data-product-id={productId}
        data-action="increase"
        onClick={handleIncrease}
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
          <path d="M5 12h14"></path>
          <path d="M12 5v14"></path>
        </svg>
      </button>
    </div>
  );
};

export default CartActions;
