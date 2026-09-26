import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  showClose = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-md animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div 
        className={`relative w-full ${maxWidth} bg-warmwhite border border-sandstone rounded-2xl p-6 sm:p-7 shadow-elevated z-10 animate-in zoom-in-95 duration-150 text-charcoal`}
      >
        <div className="flex items-start justify-between pb-4 border-b border-sandstone gap-4">
          <div>
            {title && (
              <h3 id="modal-title" className="text-lg font-bold text-charcoal tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-warmgray mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {showClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-warmgray hover:text-charcoal hover:bg-sand-100 transition-colors focus:outline-none focus:ring-2 focus:ring-burgundy"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
