import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Sparkles, ChevronDown, Check, UserCheck } from 'lucide-react';

export const DemoSwitcher = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { demoLogin, user } = useAuth();
  const [switching, setSwitching] = useState(false);

  const personas = [
    {
      role: 'VOTER',
      name: 'Vikram Aditya Rao',
      email: 'voter@voteremote.org',
      title: 'Remote Citizen Voter',
      badge: 'Visakhapatnam ➔ Bengaluru',
      icon: User,
    },
    {
      role: 'ADMIN',
      name: 'Smt. Radhika Krishnan',
      email: 'admin@voteremote.org',
      title: 'Chief Election Admin',
      badge: 'Full Authority Access',
      icon: Shield,
    },
    {
      role: 'ELECTION_OFFICER',
      name: 'K. Narayana Murthy',
      email: 'officer@voteremote.org',
      title: 'Verification Officer',
      badge: 'Pass Approvals Queue',
      icon: UserCheck,
    }
  ];

  const handleSwitch = async (role) => {
    setSwitching(true);
    setIsOpen(false);
    try {
      await demoLogin(role);
      if (onSelect) onSelect(role);
    } catch (err) {
      console.warn('Demo switch failed:', err.message);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={switching}
        className="px-3 py-1.5 rounded-xl bg-sand/80 hover:bg-sand border border-sandstone text-charcoal text-xs font-semibold flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-burgundy shadow-subtle"
        title="Switch persona for testing"
      >
        <Sparkles className="w-3.5 h-3.5 text-burgundy" />
        <span className="hidden lg:inline text-[11px] text-warmgray">Demo Persona:</span>
        <span className="font-bold text-charcoal text-[11px] truncate max-w-[120px]">
          {user?.fullName ? user.fullName.split(' ')[0] : 'Demo Switcher'}
        </span>
        <ChevronDown className="w-3 h-3 text-warmgray" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-warmwhite border border-sandstone p-2 shadow-elevated z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 border-b border-sandstone mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-warmgray font-bold">
                Instant Persona Switcher
              </span>
            </div>

            <div className="space-y-1">
              {personas.map((p) => {
                const Icon = p.icon;
                const isCurrent = user?.email === p.email;

                return (
                  <button
                    key={p.role}
                    onClick={() => handleSwitch(p.role)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                      isCurrent 
                        ? 'bg-burgundy/10 border border-burgundy/30 text-burgundy font-bold' 
                        : 'hover:bg-sand/60 text-charcoal'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg mt-0.5 ${
                      isCurrent ? 'bg-burgundy text-warmwhite' : 'bg-sand text-warmgray'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold truncate text-charcoal">{p.name}</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-jade flex-shrink-0" />}
                      </div>
                      <div className="text-[11px] text-warmgray font-medium">{p.title}</div>
                      <div className="text-[10px] font-mono text-burgundy font-semibold mt-0.5">{p.badge}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DemoSwitcher;

