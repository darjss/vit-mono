import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import Otp from "./otp";

interface OtpWrapperProps {
  phone: string;
}

const OtpWrapper = ({ phone }: OtpWrapperProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Код оруулах
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Таны утсанд очсон 4 оронтой кодыг оруулна уу.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <Otp phoneNumber={phone} />
            <div className="mt-4 text-center text-sm text-gray-600">
              Код очоогүй юу?{" "}
              <a
                href={`/auth/login?phone=${encodeURIComponent(phone)}`}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Буцаж илгээх
              </a>
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default OtpWrapper;
