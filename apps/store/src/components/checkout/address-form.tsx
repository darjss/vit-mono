import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { orderSchema, type orderType } from "@vit/api/lib/schema";
import { useCart } from "@/hooks/use-cart";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import SubmitButton from "../submit-button";

const AddressForm = ({
  setStep,
}: {
  setStep: (step: "address" | "payment") => void;
}) => {
  const form = useForm<orderType>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      phone: 0,
      address: "",
      total: 0,
      notes: "",
      items: [],
    },
  });
  console.log("Form errors:", form.formState.errors);
  const mutation = useMutation(trpc.order.createOrder.mutationOptions({}));
  const { cart, totalPrice } = useCart();

  const onSubmit = (values: orderType) => {
    console.log(cart);
    const cartItems = cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    console.log(cartItems);
    const data: orderType = {
      ...values,
      items: cartItems,
      total: totalPrice,
    };
    mutation.mutate(data);
    setStep("payment");
  };
  return (
    <div className="max-w-[400px] mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Утас</FormLabel>
                <FormControl>
                  <Input placeholder="99999999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Хаяг</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="СБД, 11-р хороо 13-р байр, 2р орц, 6 давхар, 58 тоот "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Нэмэлт мэдээлэл </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Орцны код, хамгаалагчид үлдээх гм"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            onClick={() => console.log("pressed")}
            isPending={mutation.isPending}
          >
            Submit
          </SubmitButton>
        </form>
      </Form>
      <Button onClick={() => setStep("payment")}>Next step</Button>
    </div>
  );
};

export default AddressForm;
