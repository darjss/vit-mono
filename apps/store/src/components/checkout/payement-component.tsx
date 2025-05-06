import { useCart } from "@/hooks/use-cart";
import { isAvailableForTransfer } from "@/utils";
import { useState } from "react";

const TransferInfo = () => {
  const { totalPrice } = useCart();
  return (
    <div>
      <h1>
        Та хаан банкны 1234567890 дансанд {totalPrice} төгрөгийг шилжүүлнэ
        үү.Гүйлгээний утган дээрээ өөрийхөө утсыг заавал бичнэ үү. Төлбөрөө
        төлсөний дараа дараах товч дээр дарна уу. Таны захиалга 5-15 минутын
        дараа баталгаажихыг анхаарна уу.Та баталгаажсан эсэхийг өөрийн профайл цэснээс шалгаж болно.
      </h1>
    </div>
  );
};

const PaymentComponent = () => {
  const [method, setMethod] = useState<"transfer" | "qpay">("qpay");
  const { totalPrice } = useCart();
  const handleSelectTransfer = () => {
    if(isAvailableForTransfer()){
      setMethod("transfer");
    }
    else{
      console.log("not available")
    }
  };

  return (
    <div>
      <h1>Та төлбөрийн аргаа сонгоно уу </h1>
      <button onClick={() => setMethod("qpay")}>Qpay</button>
      <button onClick={handleSelectTransfer}>Transfer</button>
      {method === "transfer" && <TransferInfo />}
    </div>
  );
};

export default PaymentComponent;
