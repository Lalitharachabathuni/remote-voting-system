import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Accordion = ({ items = [], className = '' }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={item.title || idx}
            className="vr-card border-sandstone overflow-hidden transition-colors"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 focus:outline-none hover:bg-sand-100 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-bold text-charcoal">
                {item.title}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-warmgray transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-burgundy' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs text-warmgray leading-relaxed border-t border-sandstone pt-3 animate-in fade-in duration-150">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const Tabs = ({
  tabs = [],
  activeTab: controlledActiveTab,
  defaultTab,
  onTabChange,
  children,
  className = '',
}) => {
  const [internalTab, setInternalTab] = useState(defaultTab || (tabs[0] && tabs[0].id));
  const active = controlledActiveTab !== undefined ? controlledActiveTab : internalTab;

  const handleSelect = (id) => {
    if (controlledActiveTab === undefined) {
      setInternalTab(id);
    }
    if (onTabChange) {
      onTabChange(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`flex flex-wrap items-center gap-1.5 p-1.5 bg-sand-100 rounded-xl border border-sandstone text-xs font-semibold ${className}`}>
        {tabs.map((tab) => {
          const isCurrent = active === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelect(tab.id)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                isCurrent
                  ? 'bg-warmwhite text-charcoal shadow-subtle border border-sandstone text-burgundy font-bold'
                  : 'text-warmgray hover:text-charcoal hover:bg-warmwhite/50'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5 text-current" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sand-200 font-mono text-charcoal border border-sandstone">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {typeof children === 'function' ? children(active) : children}
    </div>
  );
};

export default Accordion;
