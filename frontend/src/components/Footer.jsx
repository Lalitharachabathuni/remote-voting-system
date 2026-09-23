import React from 'react';
import { ShieldCheck, Lock, Activity, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-dark-950/90 text-slate-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/[0.06]">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-100 text-sm tracking-tight">VoteRemote</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
                ACADEMIC PROTOTYPE
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              Research prototype demonstrating secure digital remote voting for displaced and traveling citizens. 
              Built with cryptographic ballot secrecy, one-time anonymous voting tokens, and tamper-evident hash-chains.
            </p>
            <div className="text-[11px] text-civic-amber font-mono bg-civic-amber/10 border border-civic-amber/20 rounded-lg p-2.5 max-w-lg">
              ⚠️ <strong>Academic / Demonstration Notice:</strong> This system uses synthetic voter IDs and does not access actual government or official electoral registers.
            </div>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold text-xs mb-3 uppercase tracking-wider">
              Cryptographic Pillars
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center space-x-1.5 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-civic-cyan" />
                <span>AES-256-GCM Encrypted Ballots</span>
              </li>
              <li className="flex items-center space-x-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-civic-emerald" />
                <span>Identity-Ballot Separation</span>
              </li>
              <li className="flex items-center space-x-1.5 text-slate-400">
                <Activity className="w-3.5 h-3.5 text-brand-400" />
                <span>Tamper-Evident Hash Chain</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-semibold text-xs mb-3 uppercase tracking-wider">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300">MongoDB Atlas</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300">Express 4</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300">React 18</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300">Node.js 25</span>
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300">Tailwind CSS</span>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <div>
            © 2026 VoteRemote Civic Technology Prototype.
          </div>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0 font-mono text-[10px]">
            <span className="text-slate-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-civic-emerald animate-pulse"></span>
              <span>Atlas DB Connected</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
