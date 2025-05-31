import { trpc } from "@/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useState, useEffect } from "react";
import { actions } from "astro:actions";
import { navigate } from "astro:transitions/client";

const LoginComponent = () => {
  const [phone, setPhone] = useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("phone") || "";
    }
    return "";
  });

  const mutation = useMutation({
    mutationFn: actions.auth.sendOtp,
    onSuccess: () => {
      console.log("🟢 mutation success, redirecting to OTP page", {
        phone,
      });
      navigate(`/auth/login/otp?phone=${encodeURIComponent(phone)}`);
    },
    onError: (error) => {
      console.error("🔴 mutation error", error);
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
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
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (phone.length >= 8) {
                mutation.mutate({ phone: phone });
              }
            }}
          >
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Утасны дугаар
              </Label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="Утасны дугаар оруулна уу"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^[6-9]/.test(value)) {
                      setPhone(value);
                    }
                  }}
                  name="phone"
                  className="block w-full pl-10 focus:ring-2 focus:ring-indigo-500"
                  disabled={mutation.isPending}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="flex w-full justify-center rounded-md py-3 text-base font-medium"
                disabled={mutation.isPending || phone.length < 8}
              >
                {mutation.isPending
                  ? "Илгээж байна..."
                  : "Нэг удаагийн код илгээх"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
