import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/trpc"; // Assuming queryClient is exported here
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CartContent from "./cart-content";

const CartContentWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CartContent />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
};
export default CartContentWrapper;
