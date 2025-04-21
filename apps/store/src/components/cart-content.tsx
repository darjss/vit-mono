import { useCart } from "@/hooks/use-cart";
import Loading from "./loading";
import CartActions from "./cart-actions";
import { deliveryFee } from "@/utils/constants";

const CartContent = () => {
  const { cart, isLoading: isCartLoading } = useCart();

  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  if (isCartLoading) {
    return (
      <div className="h-screen border-b-4 border-border flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-xl font-bold mb-8 uppercase">
          Таны сагс хоосон байна
        </p>
        <a
          href="/"
          className="inline-block px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg uppercase tracking-wider rounded-none border-4 border-border shadow-[var(--shadow)] transition-transform hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none active:scale-[0.98]"
        >
          Худалдан авалт хийх
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="mb-10">
        {cart.map((item, index) => {
          return (
            <div
              key={item.productId}
              className={`py-6 ${index !== cart.length - 1 ? "border-b-4 border-border" : ""}`}
            >
              <div className="md:flex md:items-center hidden">
                <div className="w-2/5 flex items-center">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden border-4 border-border shadow-[var(--shadow)]">
                    <img
                      src={item.image}
                      alt={`${item.name} image`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-5">
                    <h2 className="text-xl font-bold">{item.name}</h2>
                  </div>
                </div>

                <div className="w-1/5 flex justify-center">
                  <div className="flex-shrink-0">
                    <CartActions
                      quantity={item.quantity}
                      productId={item.productId}
                    />
                  </div>
                </div>

                <div className="w-1/5 justify-center text-foreground font-bold text-xl flex">
                  ₮{item.price.toLocaleString()}
                </div>

                <div className="w-1/5 flex justify-end">
                  <div className="text-primary font-bold">
                    <p className="text-right text-xl">
                      ₮{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:hidden">
                <div className="flex mb-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden border-4 border-border shadow-[var(--shadow)]">
                    <img
                      src={item.image}
                      alt={`${item.name} image`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <h2 className="text-base font-bold">{item.name}</h2>
                    <p className="mt-1 text-md font-bold">
                      ₮{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-shrink-0">
                    <CartActions
                      quantity={item.quantity}
                      productId={item.productId}
                    />
                  </div>

                  <div className="text-primary font-bold">
                    <p className="text-right text-base">
                      ₮{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 pt-6 border-t-4 border-border">
        <div className="md:w-1/2 md:ml-auto">
          <h2 className="text-2xl font-[var(--heading-font-weight)] mb-6 uppercase tracking-tight">
            Захиалгын дүн
          </h2>

          <div className="flex justify-between py-3 border-b-2 border-border">
            <p className="text-lg font-bold">Нийт бүтээгдэхүүн</p>
            <p className="text-xl font-bold">{cart.length}</p>
          </div>

          <div className="flex justify-between py-3 border-b-2 border-border">
            <p className="text-lg font-bold">Дэд дүн</p>
            <p className="text-xl font-bold">₮{totalPrice.toLocaleString()}</p>
          </div>

          <div className="flex justify-between py-3">
            <p className="text-lg font-bold">Хүргэлт</p>
            <p className="text-xl font-bold">₮{deliveryFee.toLocaleString()}</p>
          </div>

          <div className="flex justify-between py-4 border-t-4 border-border mt-3">
            <p className="text-xl font-bold">Нийт дүн</p>
            <p className="text-2xl font-bold text-primary">
              ₮{(totalPrice + deliveryFee).toLocaleString()}
            </p>
          </div>

          <button className="w-full mt-6 py-3 px-6 h-14 inline-flex items-center justify-center whitespace-nowrap text-lg font-bold text-mtext bg-main border-4 border-border shadow-[var(--shadow)] hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transform transition-transform uppercase tracking-wider">
            Худалдан авах
          </button>
        </div>
      </div>
    </div>
  );
};
export default CartContent;
