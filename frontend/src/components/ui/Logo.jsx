import React from 'react';

export const Logo = ({ size = 'md', showText = true, subtitle = 'Secure Digital Voting Platform' }) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', svg: 'w-4 h-4', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', svg: 'w-5 h-5', text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', svg: 'w-7 h-7', text: 'text-2xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className="inline-flex items-center gap-2.5 group select-none">
      {/* Official Civic Seal Emblem in Deep Burgundy & Jade */}
      <div className={`${currentSize.icon} rounded-xl bg-burgundy border border-burgundy/80 p-1 flex items-center justify-center shadow-card group-hover:border-saffron transition-colors`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`${currentSize.svg}`}
        >
          {/* Civic Seal Outer Circle / Shield Contour */}
          <path 
            d="M12 2L4 5V11.5C4 16.5 7.5 21.1 12 22C16.5 21.1 20 16.5 20 11.5V5L12 2Z" 
            stroke="#FFFDF8" 
            strokeWidth="1.75" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Inner Ballot Box Checkmark in Jade & Saffron */}
          <path 
            d="M8.5 12L11 14.5L16 9" 
            stroke="#2F8F83" 
            strokeWidth="2.4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Top Saffron Seal Accent */}
          <circle cx="12" cy="6" r="1.2" fill="#E5A83B" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-charcoal ${currentSize.text} leading-none group-hover:text-burgundy transition-colors`}>
              VoteRemote
            </span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 bg-burgundy-50 text-burgundy border border-burgundy-200 rounded-md">
              CIVIC
            </span>
          </div>
          {subtitle && (
            <span className={`${currentSize.sub} font-medium text-warmgray tracking-normal mt-0.5 leading-none`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
