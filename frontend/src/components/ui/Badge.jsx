import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-xs font-semibold',
  };

  const variantStyles = {
    default: 'bg-sand-100 text-charcoal border border-sandstone',
    brand: 'bg-burgundy-50 text-burgundy border border-burgundy-200 font-bold',
    burgundy: 'bg-burgundy-50 text-burgundy border border-burgundy-200 font-bold',
    jade: 'bg-jade-50 text-jade-700 border border-jade-200 font-bold',
    teal: 'bg-jade-50 text-jade-700 border border-jade-200 font-bold',
    terracotta: 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200 font-bold',
    amethyst: 'bg-terracotta-50 text-terracotta-700 border border-terracotta-200 font-bold',
    saffron: 'bg-saffron-50 text-saffron-800 border border-saffron-200 font-bold',
    amber: 'bg-saffron-50 text-saffron-800 border border-saffron-200 font-bold',
    coral: 'bg-terracotta-50 text-terracotta-red border border-terracotta-200 font-bold',
    success: 'bg-jade-50 text-jade-700 border border-jade-300 font-bold',
    warning: 'bg-saffron-50 text-saffron-800 border border-saffron-300 font-bold',
    error: 'bg-terracotta-50 text-terracotta-red border border-terracotta-300 font-bold',
    neutral: 'bg-sand-100 text-warmgray border border-sandstone',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium font-mono ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 flex-shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export const StatusBadge = ({ status, className = '' }) => {
  switch (status?.toUpperCase()) {
    case 'OPEN':
    case 'ACTIVE':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-jade-50 text-jade-700 border border-jade-300 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
          <span>OPEN</span>
        </span>
      );
    case 'UPCOMING':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-saffron-50 text-saffron-800 border border-saffron-300 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-saffron" />
          <span>UPCOMING</span>
        </span>
      );
    case 'CLOSED':
    case 'COMPLETED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sand-100 text-warmgray border border-sandstone ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-warmgray" />
          <span>CLOSED</span>
        </span>
      );
    case 'VOTED':
    case 'BALLOT_RECORDED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-burgundy-50 text-burgundy border border-burgundy-300 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-burgundy" />
          <span>VOTED</span>
        </span>
      );
    case 'APPROVED':
    case 'VERIFIED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-jade-50 text-jade-700 border border-jade-300 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-jade" />
          <span>APPROVED</span>
        </span>
      );
    case 'PENDING':
    case 'PENDING_VERIFICATION':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-saffron-50 text-saffron-800 border border-saffron-300 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
          <span>PENDING</span>
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-terracotta-50 text-terracotta-red border border-terracotta-300 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta-red" />
          <span>REJECTED</span>
        </span>
      );
    default:
      return <Badge variant="default" className={className}>{status || 'UNKNOWN'}</Badge>;
  }
};

export default Badge;
