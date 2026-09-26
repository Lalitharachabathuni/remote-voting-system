import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileCheck2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const TermsPage = () => {
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
          <FileCheck2 className="w-3.5 h-3.5 text-burgundy" />
          <span>CIVIC TERMS OF SERVICE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
          Terms of Digital Civic Participation
        </h1>
        <p className="text-xs sm:text-sm text-warmgray">
          Rules and responsibilities governing remote digital voting access
        </p>
      </div>

      {/* Content Card */}
      <Card className="bg-warmwhite border-sandstone shadow-elevated p-6 sm:p-10 space-y-8 text-xs text-charcoal leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-jade" />
            <span>1. Voter Eligibility & Relocation Declaration</span>
          </h2>
          <p className="text-warmgray">
            Remote voting is permitted for citizens registered on an official constituency electoral roll who are temporarily residing outside their registered constituency for professional employment, education, or essential transit. Voters must declare truthful and accurate residential details.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-terracotta-red" />
            <span>2. Strict Prohibition of Double-Voting</span>
          </h2>
          <p className="text-warmgray">
            Double-voting in any form—whether attempting multiple digital ballots or combining remote digital voting with in-person physical polling—is strictly prohibited and constitutes an electoral offense. Single-use cryptographic tokens are permanently invalidated upon first ballot sealing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-charcoal flex items-center gap-2">
            <Shield className="w-4 h-4 text-burgundy" />
            <span>3. Finality of Sealed Ballots</span>
          </h2>
          <p className="text-warmgray">
            Once a voter confirms candidate choice and requests cryptographic submission, the ballot is irreversibly recorded into the encrypted vault with zero identity linkage. Because ballot secrecy decouples voter identity, cast ballots cannot be retrieved, modified, or revoked after final confirmation.
          </p>
        </section>

        <div className="pt-4 border-t border-sandstone flex items-center justify-between">
          <span className="text-[11px] font-mono text-warmgray">VoteRemote Civic Framework · 2026</span>
          <Link to="/">
            <Button variant="secondary" size="sm">Back to Home</Button>
          </Link>
        </div>
      </Card>

    </div>
  );
};

export default TermsPage;
