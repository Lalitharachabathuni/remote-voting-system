import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Activity, FileText } from 'lucide-react';
import Logo from './ui/Logo';

export const Footer = () => {
  return (
    <footer className="border-t border-sandstone bg-warmwhite text-warmgray text-xs py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-sandstone">
          
          {/* Brand & Mission Statement */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="sm" subtitle="Digital Remote Civic Participation Platform" />
            
            <p className="text-warmgray text-xs max-w-md leading-relaxed">
              VoteRemote is a secure digital remote voting platform designed for citizens temporarily away from their registered home constituency. Demonstrates cryptographic ballot secrecy, single-use anonymous credential decoupling, and tamper-evident audit logging.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-warmgray font-mono">
              <span className="inline-flex items-center gap-1 text-jade font-bold">
                <span className="w-2 h-2 rounded-full bg-jade animate-pulse" />
                <span>API Gateway Active</span>
              </span>
              <span>•</span>
              <span className="text-warmgray">Node v24 / React 19 MERN Architecture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-charcoal font-bold text-xs uppercase tracking-wider mb-3">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link to="/" className="text-warmgray hover:text-burgundy transition-colors">
                  Overview & Architecture
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="text-warmgray hover:text-burgundy transition-colors">
                  4-Step Voting Flow
                </Link>
              </li>
              <li>
                <Link to="/#security" className="text-warmgray hover:text-burgundy transition-colors">
                  Security by Design
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="text-warmgray hover:text-burgundy transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-warmgray hover:text-burgundy transition-colors">
                  Voter Registration
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-warmgray hover:text-burgundy transition-colors">
                  Account Sign In / Authority Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Cryptography Standards */}
          <div>
            <h4 className="text-charcoal font-bold text-xs uppercase tracking-wider mb-3">
              Security & Legal
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li className="flex items-center gap-2 text-warmgray">
                <Lock className="w-3.5 h-3.5 text-burgundy flex-shrink-0" />
                <span>AES-256-GCM Ballot Cipher</span>
              </li>
              <li className="flex items-center gap-2 text-warmgray">
                <ShieldCheck className="w-3.5 h-3.5 text-jade flex-shrink-0" />
                <span>One-Time Token Decoupling</span>
              </li>
              <li className="flex items-center gap-2 text-warmgray">
                <Activity className="w-3.5 h-3.5 text-saffron-dark flex-shrink-0" />
                <span>SHA-256 Hash Chain Trail</span>
              </li>
              <li className="pt-2">
                <Link to="/privacy" className="text-warmgray hover:text-burgundy transition-colors block">
                  Privacy & Data Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-warmgray hover:text-burgundy transition-colors block">
                  Terms of Participation
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Academic Prototype Notice & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-warmgray">
          <div>
            © 2026 VoteRemote Civic Technology. Secure Digital Voting Platform.
          </div>
          <div className="flex items-center gap-4 text-[11px] text-warmgray">
            <Link to="/privacy" className="hover:text-burgundy underline">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-burgundy underline">Terms</Link>
            <span>•</span>
            <span className="font-mono">Zero Identity Linkage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
