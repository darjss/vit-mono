import { useCart } from "@/hooks/use-cart";

const CartCount = () => {
  const { cartCount } = useCart();


  return (
    <>
      {cartCount !== 0 && (
        <div className="w-5 h-5 bg-main text-xs font-bold rounded-full flex items-center justify-center absolute -top-1 -right-1">
          {cartCount}
        </div>
      )}
    </>
  );
};

export default CartCount;
