import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sand-100 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-burgundy hover:bg-burgundy-700 text-warmwhite shadow-card focus:ring-burgundy border border-burgundy/80 hover:shadow-glow-burgundy',
    burgundy: 'bg-burgundy hover:bg-burgundy-700 text-warmwhite shadow-card focus:ring-burgundy border border-burgundy/80 hover:shadow-glow-burgundy',
    electric: 'bg-jade hover:bg-jade-600 text-warmwhite shadow-card focus:ring-jade border border-jade/80 hover:shadow-glow-jade',
    jade: 'bg-jade hover:bg-jade-600 text-warmwhite shadow-card focus:ring-jade border border-jade/80 hover:shadow-glow-jade',
    terracotta: 'bg-terracotta hover:bg-terracotta-600 text-warmwhite shadow-card focus:ring-terracotta border border-terracotta/80 hover:shadow-glow-terracotta',
    amethyst: 'bg-terracotta hover:bg-terracotta-600 text-warmwhite shadow-card focus:ring-terracotta border border-terracotta/80 hover:shadow-glow-terracotta',
    saffron: 'bg-saffron hover:bg-saffron-500 text-charcoal shadow-card focus:ring-saffron font-bold border border-saffron/80 hover:shadow-glow-saffron',
    amber: 'bg-saffron hover:bg-saffron-500 text-charcoal shadow-card focus:ring-saffron font-bold border border-saffron/80 hover:shadow-glow-saffron',
    secondary: 'bg-warmwhite hover:bg-sand-100 text-charcoal border border-sandstone focus:ring-burgundy shadow-subtle',
    outline: 'bg-transparent hover:bg-sand-100 text-charcoal border border-sandstone hover:border-burgundy focus:ring-burgundy',
    ghost: 'bg-transparent hover:bg-sand-100 text-warmgray hover:text-charcoal focus:ring-burgundy',
    danger: 'bg-terracotta-red hover:bg-terracotta-600 text-warmwhite shadow-card focus:ring-terracotta-red',
    success: 'bg-jade hover:bg-jade-600 text-warmwhite shadow-card focus:ring-jade',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 text-current flex-shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 text-current flex-shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
