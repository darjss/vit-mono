import Phone from "@/icons/phone.astro";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useState } from "react";

const LoginComponent = () => {
  const [phone, setPhone] = useState("");
  const mutation = useMutation(trpc.customer.sendOtp.mutationOptions({}));
  mutation.mutate({ phone: phone });
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Нэвтрэх
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Утасны дугаараа оруулж нэвтэрнэ үү
          </p>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-lg sm:p-8">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Утасны дугаар
              </Label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  {/* <Phone
                  /> */}
                </div>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="Утасны дугаар оруулна уу"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  name="phone"
                  className="block w-full pl-10 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <Button
                className="flex w-full justify-center rounded-md py-3 text-base font-medium"
                onClick={() => {
                  mutation.mutate({ phone: phone });
                }}
              >
                Нэг удаагийн код илгээх
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Асуудал гарсан уу?{" "}
          <a
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Тусламж авах
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
