interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className = "", ...rest }: ButtonProps) {
  return (
    <button
      className={`flex h-9 items-center justify-center rounded-full bg-blue-500 
        text-sm font-medium text-white transition-colors
        focus-visible:outline focus-visible:outline-2 hover:bg-blue-600
         focus-visible:outline-offset-2 focus-visible:outline-blue-500
          active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50
         ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
