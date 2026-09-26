import React, { useState } from 'react';
import { User, ShieldCheck, KeyRound, Layers, Vote, Activity, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export const SecurityFlow3D = () => {
  const [activeStep, setActiveStep] = useState(0);

  const stages = [
    {
      id: 'voter',
      title: 'Voter',
      subtitle: 'Eligible Citizen',
      icon: User,
      color: '#5A2633', // Deep Burgundy (Core System)
      accent: '#5A2633',
      badge: 'Identity Layer',
      details: 'Eligible voter away from home constituency initiates secure digital session.',
      cryptography: 'Electoral roll verification via synthetic national VID.',
    },
    {
      id: 'identity',
      title: 'Identity',
      subtitle: 'Clearance Pass',
      icon: ShieldCheck,
      color: '#2F8F83', // Jade (Verification)
      accent: '#2F8F83',
      badge: 'Jurisdiction Check',
      details: 'Electoral officer verifies temporary relocation credentials and approves remote pass.',
      cryptography: 'Verified against registered home parliamentary constituency.',
    },
    {
      id: 'auth',
      title: 'Authentication',
      subtitle: 'Decoupled Token',
      icon: KeyRound,
      color: '#C75C3C', // Terracotta (Interaction)
      accent: '#C75C3C',
      badge: 'Anonymization Boundary',
      details: 'System issues a single-use 30-minute anonymous voting token and discards user identity context.',
      cryptography: 'HMAC-SHA256 high-entropy token, zero link to user database ID.',
    },
    {
      id: 'election',
      title: 'Election',
      subtitle: 'Neutral Ballot',
      icon: Layers,
      color: '#5A2633', // Deep Burgundy (Core System)
      accent: '#5A2633',
      badge: 'Fair Representation',
      details: 'Ballot presents nominated candidates in randomized order with equal visual prominence.',
      cryptography: 'Dynamic ballot token header authentication.',
    },
    {
      id: 'vote',
      title: 'Vote',
      subtitle: 'Encrypted Vault',
      icon: Vote,
      color: '#2F8F83', // Jade (Verification / Secure Vault)
      accent: '#2F8F83',
      badge: 'Ballot Secrecy',
      details: 'Vote selection is sealed with AES-256-GCM. The one-time token is permanently destroyed.',
      cryptography: 'AES-256-GCM authenticated cipher with single-use token burn.',
    },
    {
      id: 'audit',
      title: 'Audit',
      subtitle: 'Immutable Chain',
      icon: Activity,
      color: '#E5A83B', // Saffron (Verification Checkpoint)
      accent: '#E5A83B',
      badge: 'Tamper-Evident Trail',
      details: 'Ballot hash and timestamp append to public cryptographic SHA-256 audit ledger.',
      cryptography: 'Sequential SHA-256 hash-chain verifiable from Genesis block.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Interactive Horizontal Pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isSelected = activeStep === idx;

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden focus:outline-none ${
                isSelected
                  ? 'bg-warmwhite border-burgundy shadow-glow-burgundy ring-2 ring-burgundy/20'
                  : 'bg-warmwhite border-sandstone hover:border-burgundy/60 hover:bg-sand-50 shadow-subtle'
              }`}
            >
              {/* Active Top Glow Line */}
              {isSelected && (
                <div 
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-burgundy via-terracotta to-saffron"
                />
              )}

              <div className="flex items-center justify-between mb-2">
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center shadow-subtle"
                  style={{ backgroundColor: `${stage.color}15`, border: `1px solid ${stage.color}35` }}
                >
                  <Icon className="w-4 h-4" style={{ color: stage.color }} />
                </div>
                <span className="font-mono text-[10px] text-warmgray font-bold">
                  0{idx + 1}
                </span>
              </div>

              <div className="text-xs font-bold text-charcoal truncate">
                {stage.title}
              </div>
              <div className="text-[10px] text-warmgray truncate">
                {stage.subtitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Showcase Panel for Selected Node */}
      <div className="p-6 sm:p-7 rounded-3xl bg-warmwhite border border-sandstone space-y-4 animate-in fade-in duration-150 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sandstone">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-burgundy px-2.5 py-0.5 rounded-md bg-burgundy-50 border border-burgundy-200">
              STAGE 0{activeStep + 1}
            </span>
            <h3 className="text-base font-extrabold text-charcoal">
              {stages[activeStep].title} — {stages[activeStep].subtitle}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-sand-100 text-charcoal border border-sandstone self-start sm:self-auto">
            {stages[activeStep].badge}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-charcoal">
          <div className="space-y-1">
            <div className="text-[10px] font-mono text-warmgray uppercase tracking-wider font-bold">
              OPERATIONAL WORKFLOW
            </div>
            <p className="text-warmgray leading-relaxed">
              {stages[activeStep].details}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-sand-100 border border-sandstone space-y-1">
            <div className="text-[10px] font-mono text-jade uppercase tracking-wider flex items-center gap-1 font-bold">
              <Lock className="w-3 h-3" />
              <span>CRYPTOGRAPHIC PROTOCOL</span>
            </div>
            <p className="text-charcoal font-mono text-[11px] leading-relaxed">
              {stages[activeStep].cryptography}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityFlow3D;
