import { ReactNode, ButtonHTMLAttributes } from 'react';

// Nếu bạn dùng TypeScript, định nghĩa interface này (nếu dùng JS thường thì bỏ qua)
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Button({ children, onClick, disabled, className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        'rounded-lg px-4 py-2 text-sm font-medium',
        disabled
          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
          : 'bg-stone-900 text-white hover:bg-stone-800',
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}