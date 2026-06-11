import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-[var(--color-leaf-dark)] to-[var(--color-leaf-light)] text-white hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
  secondary:
    'bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--color-leaf)]/30 hover:bg-[var(--color-leaf)]/5 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
  outline:
    'border-2 border-[var(--color-leaf)] text-[var(--color-leaf)] hover:bg-[var(--color-leaf)]/5 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
  danger:
    'bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/90 hover:shadow-lg hover:shadow-rose-500/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
  ghost: 'text-[var(--color-leaf)] hover:bg-[var(--color-leaf)]/5 active:scale-[0.98]',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3.5 py-2 text-sm min-h-9 min-w-9',
  md: 'px-5 py-2.5 text-sm min-h-11 min-w-11',
  lg: 'px-6 py-3.5 text-base min-h-12 min-w-12',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-bold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-leaf)] disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none ${variantStyles[variant]} ${sizeStyles[size]} ${className} `.trim()}
    >
      {loading && (
        <span
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
