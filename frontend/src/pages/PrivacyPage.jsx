import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, EyeOff, FileText, ArrowLeft, Activity } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-sand min-h-screen">
      
      {/* Back Link */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-warmgray hover:text-burgundy transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warmwhite border border-sandstone text-xs font-mono font-bold text-burgundy">
          <ShieldCheck className="w-3.5 h-3.5 text-jade" />
          <span>CIVIC PRIVACY & DATA GOVERNANCE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
          Privacy Policy & Cryptographic Secrecy Standards
        </h1>
        <p className="text-xs sm:text-sm text-warmgray">
          Last updated: September 2026 · Standard Edition for Remote Digital Voting
        </p>
      </div>

      {/* Content Card */}
      <Card className="bg-warmwhite border-sandstone shadow-elevated p-6 sm:p-10 space-y-8 text-xs text-charcoal leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-burgundy" />
            <span>1. Zero-Linkage Ballot Secrecy Guarantee</span>
          </h2>
          <p className="text-warmgray">
            VoteRemote is engineered with strict mathematical identity decoupling. When a registered citizen initiates a ballot session, the platform issues a single-use high-entropy voting token (<code className="font-mono bg-sand px-1.5 py-0.5 rounded text-burgundy">x-voting-credential</code>) and detaches your user profile session. The ballot vault only records the encrypted candidate selection with zero relational linkage to your voter ID, email, IP address, or demographic profile.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
            <Lock className="w-4 h-4 text-jade" />
            <span>2. AES-256-GCM Cryptographic Vault Storage</span>
          </h2>
          <p className="text-warmgray">
            All submitted votes are encrypted with Authenticated Encryption with Associated Data (AEAD) using AES-256-GCM before entering the database. Even database administrators or election officials with root server access cannot inspect individual cast ballots or link votes to voters.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
            <Activity className="w-4 h-4 text-terracotta" />
            <span>3. Tamper-Evident SHA-256 Audit Trail</span>
          </h2>
          <p className="text-warmgray">
            Security actions (relocation pass approvals, single-use credential generation, ballot vault submission) are appended to a sequential cryptographic hash-chain. Any retrospective attempt to tamper with or alter recorded entries breaks the mathematical hash chain and triggers instant supervisor alerts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
            <FileText className="w-4 h-4 text-saffron-dark" />
            <span>4. Data Retention & Identity Verification</span>
          </h2>
          <p className="text-warmgray">
            Personal identity data declared during voter registration is used strictly to match against the official parliamentary electoral roll for your registered constituency. No tracking cookies, third-party analytics pixels, or commercial tracking services are embedded into the VoteRemote platform.
          </p>
        </section>

        <div className="pt-4 border-t border-sandstone flex items-center justify-between">
          <span className="text-[11px] font-mono text-warmgray">VoteRemote Privacy Charter · Version 2.0</span>
          <Link to="/">
            <Button variant="secondary" size="sm">Back to Home</Button>
          </Link>
        </div>
      </Card>

    </div>
  );
};

export default PrivacyPage;
