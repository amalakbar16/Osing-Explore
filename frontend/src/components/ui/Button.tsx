import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center px-4 py-2 rounded-lg font-body font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base active:scale-95";

  const variants = {
    primary:
      "bg-accent-primary text-white hover:bg-accent-primary/90 focus:ring-accent-primary shadow-sm hover:shadow",
    secondary:
      "bg-surface border border-surface-alt text-ink hover:bg-surface-alt focus:ring-surface-alt shadow-sm",
    ghost:
      "bg-transparent text-ink-muted hover:text-ink hover:bg-surface-alt/50 focus:ring-surface-alt",
    danger:
      "bg-accent-rose text-white hover:bg-accent-rose/90 focus:ring-accent-rose shadow-sm",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      suppressHydrationWarning
      {...props}
    >
      {children}
    </button>
  );
}
