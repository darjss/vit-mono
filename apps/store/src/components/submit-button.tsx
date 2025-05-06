import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "@workspace/ui/components/button";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isPending: boolean;
  children: ReactNode;
  className?: string;
  spinnerSize?: number;
  variant?:
    | "default"
    | "destructive"
    | "neutral"
    | "noShadow"
    | "reverse"
    | null
    | undefined;
}

const Loader = () => {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="#3498db"
        stroke-width="5"
        stroke-dasharray="62.83"
        stroke-dashoffset="62.83"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="62.83"
          to="0"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

const SubmitButton = ({
  isPending,
  children,
  className,
  variant = "default",
  ...props
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className={`flex gap-2 ${className}`}
      variant={variant}
      disabled={isPending}
      {...props}
    >
      {isPending && <Loader  />}
      {children}
    </Button>
  );
};
export default SubmitButton;
