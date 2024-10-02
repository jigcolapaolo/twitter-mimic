"use client";

interface ReturnButtonProps {
  children: React.ReactNode;
  className?: string;
  rest?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export default function ReturnButton({
  children,
  className = "",
  ...rest
}: ReturnButtonProps) {
  return (
    <button
      className={className}
      {...rest}
      onClick={() => window.history.back()}
    >
      {children}
    </button>
  );
}
