import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  elevated = false,
  dark = false,
  onClick,
  ...props
}) => {
  const cardClass = dark
    ? 'vr-card-dark text-warmwhite'
    : elevated
    ? 'vr-card-elevated text-charcoal'
    : hoverable
    ? 'vr-card vr-card-hover cursor-pointer text-charcoal'
    : 'vr-card text-charcoal';

  return (
    <div
      onClick={onClick}
      className={`${cardClass} p-5 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className = '',
  title,
  subtitle,
  action,
}) => {
  return (
    <div className={`flex items-start justify-between pb-4 border-b border-sandstone gap-4 ${className}`}>
      <div>
        {title && <h3 className="text-base font-bold text-charcoal tracking-tight">{title}</h3>}
        {subtitle && <p className="text-xs text-warmgray mt-0.5">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`pt-4 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`pt-4 mt-4 border-t border-sandstone flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
};

export default Card;
