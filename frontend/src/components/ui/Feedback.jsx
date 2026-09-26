import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', className = '', label = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`} role="status">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-burgundy`} />
      {label && <span className="text-xs text-warmgray font-medium">{label}</span>}
    </div>
  );
};

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`skeleton-shimmer rounded-md ${className}`}
      {...props}
    />
  );
};

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`vr-card text-center py-12 px-6 flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-sand-100 border border-sandstone flex items-center justify-center text-warmgray mb-4">
          <Icon className="w-6 h-6 text-warmgray" />
        </div>
      )}
      <h3 className="text-base font-bold text-charcoal tracking-tight mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-warmgray max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default LoadingSpinner;
