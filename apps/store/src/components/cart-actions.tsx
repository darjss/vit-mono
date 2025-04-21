import { useCart } from "@/hooks/use-cart";
import { useState } from "react";

interface CartActionsProps {
  quantity: number;
  productId:  number;
}

const CartActions = ({ quantity, productId   }: CartActionsProps) => {
  const { updateItem, removeFromCart } = useCart();
  return (
    <div className="flex flex-col">
      <div className="flex items-center border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] bg-white">
        <button
          className="font-bold text-xl px-3 py-1.5 hover:bg-primary/20 transition-colors"
          data-product-id={productId}
          data-action="decrease"
          onClick={()=>updateItem(productId,"remove")}

        >
          -
        </button>
        <span className="font-bold text-xl min-w-[2.5rem] text-center border-x-2 border-border px-2 py-1.5">
          {quantity}
        </span>
        <button
          className="font-bold text-xl px-3 py-1.5 hover:bg-primary/20 transition-colors"
          data-product-id={productId}
          data-action="increase"
          onClick={()=>updateItem(productId,"add")}
        >
          +
        </button>
      </div>

      <button
        data-product-id={productId}
        data-action="delete"
        className="mt-2 text-xs font-bold text-destructive hover:text-destructive/90 flex items-center gap-1 self-start border border-destructive py-1 px-2 shadow-[1px_1px_0px_0px_var(--destructive)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
        onClick={()=>removeFromCart(productId)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
        Устгах
      </button>
    </div>
  );
};

export default CartActions;
