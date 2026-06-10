import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'leaf' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const variantClasses: Record<string, string> = {
  default:  'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-[var(--shadow-card)]',
  elevated: 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-[var(--shadow-card-hover)]',
  bordered: 'bg-[var(--bg-card)] border-[var(--color-leaf)]/20',
  leaf:     'bg-[var(--color-leaf)]/5 border-[var(--color-leaf)]/20',
  glass:    'glass-panel',
};

const paddingStyles: Record<string, string> = {
  none: '',
  sm:   'p-4',
  md:   'p-5 sm:p-6',
  lg:   'p-6 sm:p-8',
};

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  style,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={`
        rounded-2xl border transition-all duration-300
        ${variantClasses[variant]}
        ${paddingStyles[padding]}
        ${hover ? 'hover:-translate-y-1 hover:shadow-lg hover:border-[var(--color-leaf)]/30 cursor-pointer' : ''}
        ${className}
      `.trim()}
      style={style}
    >
      {children}
    </div>
  );
}
