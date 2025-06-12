"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { OTPInput, type SlotProps } from "input-otp";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "@tanstack/react-query";
import { actions } from "astro:actions";
import { trpc } from "@/lib/trpc";
import { navigate } from "astro:transitions/client";

interface AnimatedNumberProps {
  value: string | null;
  placeholder: string;
}

const AnimatedNumber = ({ value, placeholder }: AnimatedNumberProps) => {
  return (
    <div className="relative flex h-[56px] w-[48px] items-center justify-center overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={value}
          initial={{ opacity: 0.25, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.08, ease: "easeInOut" }}
          className={cn(
            "absolute text-lg",
            value === null ? "text-gray-400" : ""
          )}
        >
          {value ?? placeholder}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const Slot = (
  props: SlotProps & {
    isShaking?: boolean;
    isVerifying: boolean;
    delay: number;
  }
) => {
  const placeholderChar = "0";

  return (
    <motion.div
      layout
      className={cn(
        "relative flex h-[56px] w-[48px] items-center justify-center rounded-md bg-gray-50 text-lg font-semibold text-gray-900",
        props.isVerifying && "fast-pulse duration-100 text-gray-500"
      )}
      style={{
        animationDelay: `${props.delay}ms`,
      }}
    >
      <AnimatedNumber value={props.char} placeholder={placeholderChar} />
      {props.isActive ? (
        <motion.div
          layoutId="indicator"
          className={cn(
            "absolute inset-0 z-10 rounded-md border-2",
            props.isShaking ? "border-red-500" : "border-gray-900",
            props.isVerifying && "border-none"
          )}
          transition={{ duration: 0.12, ease: "easeInOut" }}
        />
      ) : null}
    </motion.div>
  );
};

const Otp = ({ phoneNumber }: { phoneNumber: string }) => {
  const [value, setValue] = useState("");
  const [disableSubmitButton, setDisableSubmitButton] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const otpRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    ...trpc.customer.login.mutationOptions(),
    onSuccess: (data) => {
      if (data && data.success) {
        setIsVerifying(false);
        navigate("/profile");
      } else {
        setIsShaking(true);
        setErrorMessage("Буруу код");
        setValue("");
        setIsVerifying(false);
      }
    },
    onError: () => {
      setIsShaking(true);
      setErrorMessage("Буруу код");
      setValue("");
      setIsVerifying(false);
      if (otpRef.current) {
        otpRef.current.focus();
        otpRef.current.setSelectionRange(0, 0);
      }
    },
  });

  useEffect(() => {
    setDisableSubmitButton(value.length !== 4);
  }, [value]);

  const handleSubmit = () => {
    if (isVerifying) return;

    setIsVerifying(true);
    setDisableSubmitButton(true);
    setErrorMessage("");

    mutation.mutate({ phone: phoneNumber, otp: value });
  };
  return (
    <div className="flex flex-col space-y-6">
      <motion.div
        animate={isShaking ? { x: [0, -5, 5, -2.5, 2.5, 0] } : { x: 0 }}
        transition={{ duration: 0.3 }}
        onAnimationComplete={() => setIsShaking(false)}
      >
        <OTPInput
          ref={otpRef}
          value={value}
          maxLength={4}
          containerClassName="group flex gap-4 items-center justify-center"
          onChange={(newValue) => {
            if (!/^\d*$/.test(newValue)) {
              setIsShaking(true);
              return;
            }
            setValue(newValue);
            if (errorMessage) setErrorMessage("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (value.length < 4) return;
              handleSubmit();
            }
          }}
          render={({ slots }) => (
            <div className="flex gap-4">
              {slots.map((slot, idx) => (
                <Slot
                  key={idx}
                  {...slot}
                  isShaking={isShaking}
                  isVerifying={isVerifying}
                  delay={idx * 100}
                />
              ))}
            </div>
          )}
        />
      </motion.div>

      <div className="h-[28px]">
        <AnimatePresence mode="wait" initial={false}>
          {errorMessage && (
            <motion.p
              key="error-message"
              className="flex h-[28px] w-fit items-center rounded-full bg-red-50 px-2.5 text-[13px] font-medium text-red-500"
              initial={{ scale: 0.2, opacity: 0, x: -80 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.2, opacity: 0, x: -80 }}
              transition={{ duration: 0.1 }}
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <Button
        disabled={disableSubmitButton}
        onClick={handleSubmit}
        className={cn("w-full", isVerifying && "cursor-not-allowed opacity-50")}
      >
        <AnimatePresence initial={false}>
          {isVerifying ? (
            <motion.div
              className="flex w-fit items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin"
              >
                <path
                  d="M14 8C14 8.78793 13.8448 9.56815 13.5433 10.2961C13.2417 11.0241 12.7998 11.6855 12.2426 12.2426C11.6855 12.7998 11.024 13.2418 10.2961 13.5433C9.56814 13.8448 8.78793 14 8 14C7.21206 14 6.43185 13.8448 5.70389 13.5433C4.97594 13.2418 4.31451 12.7998 3.75736 12.2426C3.2002 11.6855 2.75825 11.0241 2.45672 10.2961C2.15519 9.56815 2 8.78793 2 8C2 7.21207 2.15519 6.43186 2.45672 5.7039C2.75825 4.97595 3.2002 4.31451 3.75736 3.75736C4.31451 3.20021 4.97594 2.75825 5.7039 2.45673C6.43185 2.1552 7.21207 2 8 2C8.78793 2 9.56814 2.1552 10.2961 2.45673C11.0241 2.75826 11.6855 3.20021 12.2426 3.75736C12.7998 4.31452 13.2417 4.97595 13.5433 5.7039C13.8448 6.43186 14 7.21207 14 8L14 8Z"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  d="M14 8C14 8.94687 13.7759 9.88029 13.346 10.7239C12.9162 11.5676 12.2927 12.2976 11.5267 12.8541C10.7607 13.4107 9.87381 13.778 8.9386 13.9261C8.0034 14.0743 7.04641 13.9989 6.14589 13.7063"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Шалгаж байна
            </motion.div>
          ) : (
            <span>Баталгаажуулах</span>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
};

export default Otp;
