import { useCart } from "@/hooks/use-cart";
import { trpc } from "@/utils/trpc";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AddressForm from "./address-form";
import PaymentComponent from "./payement-component";

const CheckoutForm = ({
  productId,
  quantity,
}: {
  productId?: number;
  quantity?: number;
}) => {
  const [step, setStep] = useState<"address" | "payment">("address");
  const { cart, totalPrice, addToCart } = useCart();
  useEffect(() => {
    if (productId !== undefined || quantity !== undefined) {
      
    }
  });
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {step === "address" && <AddressForm />}
      {step === "payment" && <PaymentComponent />}
    </QueryClientProvider>
  );
};

export default CheckoutForm;
