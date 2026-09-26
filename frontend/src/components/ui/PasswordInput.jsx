import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';

export const PasswordInput = React.forwardRef(({
  label = 'Password',
  error,
  helperText,
  showStrengthMeter = false,
  value = '',
  onChange,
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-sand-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-terracotta-red' };
    if (score <= 3) return { score: 2, label: 'Moderate', color: 'bg-saffron' };
    if (score <= 4) return { score: 3, label: 'Good', color: 'bg-jade' };
    return { score: 4, label: 'Strong', color: 'bg-jade-600' };
  };

  const strength = showStrengthMeter ? getStrength(value) : null;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <label 
          htmlFor={inputId} 
          className="block text-xs font-semibold text-charcoal tracking-wide"
        >
          {label} {required && <span className="text-terracotta-red">*</span>}
        </label>
        {showStrengthMeter && value && (
          <span className="text-[11px] font-mono text-warmgray">
            Strength: <span className="font-semibold text-charcoal">{strength.label}</span>
          </span>
        )}
      </div>

      <div className="relative rounded-lg shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warmgray">
          <Lock className="w-4 h-4" />
        </div>

        <input
          ref={ref}
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className={`vr-input pl-10 pr-10 ${error ? '!border-terracotta-red focus:!ring-terracotta-red/20' : ''} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-warmgray hover:text-charcoal focus:outline-none transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Eye className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {showStrengthMeter && value && (
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <div className={`h-1.5 rounded-full ${strength.score >= 1 ? strength.color : 'bg-sand-200'}`} />
          <div className={`h-1.5 rounded-full ${strength.score >= 2 ? strength.color : 'bg-sand-200'}`} />
          <div className={`h-1.5 rounded-full ${strength.score >= 3 ? strength.color : 'bg-sand-200'}`} />
          <div className={`h-1.5 rounded-full ${strength.score >= 4 ? strength.color : 'bg-sand-200'}`} />
        </div>
      )}

      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-terracotta-red flex items-center gap-1 font-semibold">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="text-xs text-warmgray">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
