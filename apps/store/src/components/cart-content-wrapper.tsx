import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/trpc"; // Assuming queryClient is exported here
import CartContent from "./cart-content";

const CartContentWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CartContent />
    </QueryClientProvider>
  );
};
export default CartContentWrapper;
