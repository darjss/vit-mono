import { useCart } from "@/hooks/use-cart";
import { isAvailableForTransfer } from "@/lib/utils";
import { useState } from "react";
import { Copy, Check, Info, AlertCircle, X } from "lucide-react";

// Modal component for warnings
const WarningModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-3 border-black rounded-lg p-6 max-w-md w-full shadow-[var(--box-shadow-x)_var(--box-shadow-y)_0px_0px_var(--border)]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500" />
            <h3 className="text-lg font-bold">Анхааруулга</h3>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-black hover:bg-[hsl(var(--muted))]"
          >
            <X size={16} />
          </button>
        </div>

        <p className="mb-6">
          Хэрэв та дансаар шилжүүлэх бол таны захиалга маргааш хүртэл
          баталгаажихгүй. Та үргэлжлүүлэхдээ итгэлтэй байна уу? QPay ашиглавал
          таны захиалга шууд баталгаажна.
        </p>

        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 border-black rounded-md bg-white hover:bg-[hsl(var(--muted))]"
          >
            Буцах
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border-2 border-black rounded-md bg-[hsl(var(--primary))] shadow-[var(--box-shadow-x)_var(--box-shadow-y)_0px_0px_var(--border)] hover:translate-y-1 hover:shadow-none transition-all"
          >
            Үргэлжлүүлэх
          </button>
        </div>
      </div>
    </div>
  );
};

const TransferInfo = () => {
  const { totalPrice } = useCart();
  const [copied, setCopied] = useState<{
    account?: boolean;
    amount?: boolean;
    reference?: boolean;
  }>({});

  const accountNumber = "5063627657";
  const accountName = "Олуулаа Икоммерс ХХК";
  const reference = "20250507-014445";

  const handleCopy = (
    text: string,
    type: "account" | "amount" | "reference"
  ) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  return (
    <div className="mt-6 p-4 sm:p-6 md:p-8 bg-[hsl(var(--secondary))] border-[3px] border-black rounded-lg shadow-[var(--box-shadow-x)_var(--box-shadow-y)_0px_0px_var(--border)]">
      <div className="mb-4 p-3 sm:p-4 md:p-5 bg-[hsl(var(--accent))] border-[2px] border-black rounded-lg">
        <div className="flex items-center gap-2">
          <Info size={20} className="md:w-6 md:h-6" />
          <h2 className="text-base sm:text-xl md:text-2xl font-[var(--heading-font-weight)]">
            Захиалга бүртгэгдлээ
          </h2>
        </div>
        <p className="mt-2 text-sm sm:text-base md:text-lg">
          Төлбөр төлөгдсөний дараа таны захиалга автоматаар баталгаажна.
        </p>
      </div>

      <div className="space-y-4 md:space-y-6">
        <h3 className="text-base sm:text-lg md:text-xl font-[var(--heading-font-weight)]">
          Дансаар шилжүүлэх
        </h3>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12  rounded-full flex items-center justify-center ">
            <img src="/khaan.png" alt="Khaan logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-sm sm:text-base md:text-lg">
            Хаан банк
          </span>
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-4 space-y-3 md:space-y-0">
          <div className="flex flex-col">
            <label className="text-xs sm:text-sm md:text-base text-[hsl(var(--muted-foreground))]">
              Хүлээн авах данс
            </label>
            <div className="flex items-center mt-1">
              <div className="flex-1 p-2 sm:p-3 md:p-4 bg-white border-2 border-black rounded-l-md text-sm sm:text-base md:text-lg">
                {accountNumber}
              </div>
              <button
                onClick={() => handleCopy(accountNumber, "account")}
                className="p-2 sm:p-3 md:p-4 bg-[hsl(var(--primary))] border-2 border-l-0 border-black rounded-r-md hover:bg-[hsl(var(--primary))] transition-all"
              >
                {copied.account ? (
                  <Check size={18} className="md:w-6 md:h-6" />
                ) : (
                  <Copy size={18} className="md:w-6 md:h-6" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs sm:text-sm md:text-base text-[hsl(var(--muted-foreground))]">
              Хүлээн авагч
            </label>
            <div className="flex items-center mt-1">
              <div className="flex-1 p-2 sm:p-3 md:p-4 bg-white border-2 border-black rounded-l-md text-sm sm:text-base md:text-lg">
                {accountName}
              </div>
              <button
                onClick={() => handleCopy(accountName, "account")}
                className="p-2 sm:p-3 md:p-4 bg-[hsl(var(--primary))] border-2 border-l-0 border-black rounded-r-md hover:bg-[hsl(var(--primary))] transition-all"
              >
                {copied.account ? (
                  <Check size={18} className="md:w-6 md:h-6" />
                ) : (
                  <Copy size={18} className="md:w-6 md:h-6" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs sm:text-sm md:text-base text-[hsl(var(--muted-foreground))]">
              Захиалгын дүн
            </label>
            <div className="flex items-center mt-1">
              <div className="flex-1 p-2 sm:p-3 md:p-4 bg-white border-2 border-black rounded-l-md font-bold text-sm sm:text-base md:text-lg">
                {totalPrice?.toLocaleString()}₮
              </div>
              <button
                onClick={() => handleCopy(`${totalPrice}`, "amount")}
                className="p-2 sm:p-3 md:p-4 bg-[hsl(var(--primary))] border-2 border-l-0 border-black rounded-r-md hover:bg-[hsl(var(--primary))] transition-all"
              >
                {copied.amount ? (
                  <Check size={18} className="md:w-6 md:h-6" />
                ) : (
                  <Copy size={18} className="md:w-6 md:h-6" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs sm:text-sm md:text-base text-[hsl(var(--muted-foreground))]">
              Захиалгын дугаар
            </label>
            <div className="flex items-center mt-1">
              <div className="flex-1 p-2 sm:p-3 md:p-4 bg-white border-2 border-black rounded-l-md text-sm sm:text-base md:text-lg">
                {reference}
              </div>
              <button
                onClick={() => handleCopy(reference, "reference")}
                className="p-2 sm:p-3 md:p-4 bg-[hsl(var(--primary))] border-2 border-l-0 border-black rounded-r-md hover:bg-[hsl(var(--primary))] transition-all"
              >
                {copied.reference ? (
                  <Check size={18} className="md:w-6 md:h-6" />
                ) : (
                  <Copy size={18} className="md:w-6 md:h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm md:text-base">
          Төлбөрөө төлсөний дараа дараах товч дээр дарна уу. Таны захиалга 5-15
          минутын дараа баталгаажихыг анхаарна уу. Та баталгаажсан эсэхийг
          өөрийн профайл цэснээс шалгаж болно.
        </p>

        <button className="w-full p-2 sm:p-3 md:p-4 mt-4 bg-[hsl(var(--primary))] border-2 border-black rounded-md shadow-[var(--box-shadow-x)_var(--box-shadow-y)_0px_0px_var(--border)] hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_var(--border)] transition-all font-bold text-sm sm:text-base md:text-lg">
          Төлбөр шалгах
        </button>
      </div>
    </div>
  );
};

const QPayButton = () => {
  return (
    <div className="mt-6 p-4 sm:p-6 md:p-8 bg-[hsl(var(--secondary))] border-[3px] border-black rounded-lg shadow-[var(--box-shadow-x)_var(--box-shadow-y)_0px_0px_var(--border)]">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-10">
        <div className="w-24 h-24 md:w-36 md:h-36 bg-[#21399C] rounded-xl flex items-center justify-center border-2 border-black p-3 md:p-4">
          <img src="/qpay.png" alt="QPay logo" className="w-full h-full object-contain" />
         
        </div>

        <div className="md:flex-1 flex flex-col items-center md:items-start gap-4 md:gap-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-[var(--heading-font-weight)]">
            QPay-ээр төлөх
          </h3>

          <p className="text-center md:text-left text-sm md:text-lg hidden md:block">
            QPay-ээр төлбөр төлснөөр таны захиалга хамгийн хурдан хугацаанд
            баталгаажих болно. Та дараах товч дээр дарж үргэлжлүүлнэ үү.
          </p>

          <a
            href="/qpay"
            className="w-full md:max-w-xs p-3 sm:p-4 md:p-5 bg-[hsl(var(--primary))] border-2 border-black rounded-md shadow-[var(--box-shadow-x)_var(--box-shadow-y)_0px_0px_var(--border)] hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_var(--border)] transition-all font-bold text-center text-base sm:text-lg md:text-xl"
          >
            QPay руу үсрэх
          </a>
        </div>
      </div>
    </div>
  );
};

const PaymentComponent = () => {
  const [method, setMethod] = useState<"transfer" | "qpay">("transfer");
  const [showWarning, setShowWarning] = useState(false);
  const { totalPrice } = useCart();

  const handleSelectTransfer = () => {
    if (isAvailableForTransfer()) {
      setMethod("transfer");
    } else {
      setShowWarning(true);
    }
  };

  const handleConfirmTransfer = () => {
    setMethod("transfer");
    setShowWarning(false);
  };

  return (
    <div className="max-w-md md:max-w-3xl mx-auto p-3 sm:p-4 md:p-6">
      <WarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        onConfirm={handleConfirmTransfer}
      />

      <div className="p-4 sm:p-6 md:p-8 bg-[hsl(var(--background))] border-[3px] border-black rounded-lg shadow-[var(--box-shadow-x)_var(--box-shadow-y)_0px_0px_var(--border)]">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-[var(--heading-font-weight)] mb-5 sm:mb-6 md:mb-8">
          Төлбөр хийх
        </h1>

        <div className="flex gap-2 md:gap-4 mb-5 sm:mb-6 md:mb-8 md:max-w-md md:mx-auto">
          <button
            onClick={handleSelectTransfer}
            className={`flex-1 p-3 sm:p-4 md:p-5 border-2 border-black rounded-md font-bold transition-all text-sm sm:text-base md:text-lg ${
              method === "transfer"
                ? "bg-[hsl(var(--primary))] shadow-[var(--box-shadow-x)_var(--box-shadow-y)_0px_0px_var(--border)]"
                : "bg-white hover:bg-[hsl(var(--muted))]"
            }`}
          >
            Шилжүүлэг
          </button>

          <button
            onClick={() => setMethod("qpay")}
            className={`flex-1 p-3 sm:p-4 md:p-5 border-2 border-black rounded-md font-bold transition-all text-sm sm:text-base md:text-lg ${
              method === "qpay"
                ? "bg-[hsl(var(--primary))] shadow-[var(--box-shadow-x)_var(--box-shadow-y)_0px_0px_var(--border)]"
                : "bg-white hover:bg-[hsl(var(--muted))]"
            }`}
          >
            QPay
          </button>
        </div>

        {method === "transfer" && <TransferInfo />}
        {method === "qpay" && <QPayButton />}
      </div>
    </div>
  );
};

export default PaymentComponent;
