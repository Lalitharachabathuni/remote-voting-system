import React from 'react';
import { Check } from 'lucide-react';

export const ProgressSteps = ({
  steps = [],
  currentStep = 1,
  className = '',
}) => {
  return (
    <nav aria-label="Progress" className={`w-full ${className}`}>
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <li 
              key={step.title || index} 
              className={`relative flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all border ${
                    isCompleted
                      ? 'bg-jade border-jade text-warmwhite'
                      : isCurrent
                      ? 'bg-burgundy border-burgundy text-warmwhite ring-4 ring-burgundy/15'
                      : 'bg-sand-100 border-sandstone text-warmgray'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-warmwhite" />
                  ) : (
                    <span>{stepNumber.toString().padStart(2, '0')}</span>
                  )}
                </div>

                <div className="hidden sm:block">
                  <p className={`text-xs font-bold ${isCurrent ? 'text-charcoal' : isCompleted ? 'text-jade-700' : 'text-warmgray'}`}>
                    {step.title}
                  </p>
                  {step.subtitle && (
                    <p className="text-[11px] text-warmgray leading-tight">
                      {step.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div 
                  className={`flex-1 mx-3 h-[2px] transition-colors ${
                    stepNumber < currentStep ? 'bg-jade' : 'bg-sandstone'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default ProgressSteps;
