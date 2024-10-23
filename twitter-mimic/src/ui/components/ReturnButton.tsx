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
    <header className="w-full sticky top-0 bg-white z-50 border-b border-gray-200">
      <button
        className={className}
        {...rest}
        onClick={() => window.history.back()}
        aria-label="return-button"
      >
        {children}
      </button>
    </header>
  );
}
