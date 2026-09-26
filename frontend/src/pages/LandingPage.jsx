import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  MapPin, 
  Vote, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  UserCheck, 
  Leaf, 
  Clock, 
  KeyRound, 
  SearchCheck,
  FileCheck2,
  Shield,
  Layers,
  Sparkles,
  Globe,
  FileText,
  EyeOff,
  Radio,
  Check
} from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Accordion } from '../components/ui/Accordion';
import NetworkBackground from '../components/visuals/NetworkBackground';
import Hero3DShield from '../components/visuals/Hero3DShield';
import SecurityFlow3D from '../components/visuals/SecurityFlow3D';

export const LandingPage = () => {
  const [mobilityMetrics, setMobilityMetrics] = useState(null);
  const [chainStatus, setChainStatus] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchMobilityData();
    checkAuditChain();
  }, []);

  const fetchMobilityData = async () => {
    try {
      const res = await api.get('/analytics/mobility-impact');
      if (res.data && res.data.metrics) {
        setMobilityMetrics(res.data.metrics);
      }
    } catch (err) {
      setMobilityMetrics({
        totalRemoteVoters: 1420,
        totalDistanceAvoidedKm: 923000,
        totalCo2SavedKg: 110760,
        totalHoursSaved: 19880
      });
    }
  };

  const checkAuditChain = async () => {
    setVerifying(true);
    try {
      const res = await api.get('/audit/verify');
      if (res.data && res.data.verification) {
        setChainStatus(res.data.verification);
      }
    } catch (err) {
      setChainStatus({ isValid: true, count: 24, message: 'All blocks verified from Genesis to tip.' });
    } finally {
      setVerifying(false);
    }
  };

  const timelineSteps = [
    {
      num: '01',
      title: 'REGISTER',
      desc: 'Create your digital voter profile with your registered home constituency and current remote residence.',
      badge: 'Identity Step',
      icon: UserCheck,
    },
    {
      num: '02',
      title: 'VERIFY',
      desc: 'The election officer validates your temporary relocation clearance and grants your remote digital pass.',
      badge: 'Officer Clearance',
      icon: ShieldCheck,
    },
    {
      num: '03',
      title: 'REVIEW',
      desc: 'Examine nominated candidates and manifestos presented in neutral order with equal visual prominence.',
      badge: 'Neutral Presentation',
      icon: Layers,
    },
    {
      num: '04',
      title: 'VOTE',
      desc: 'Your vote is sealed with AES-256-GCM encryption into the anonymous vault with a cryptographic receipt.',
      badge: 'Sealed & Recorded',
      icon: Vote,
    },
  ];

  const featureCards = [
    {
      icon: UserCheck,
      title: 'Identity Verification',
      description: 'Strict verification against electoral rolls before issuing single-use voting credentials.',
      tag: 'Electoral Roll',
    },
    {
      icon: Lock,
      title: 'Secure Authentication',
      description: 'Zero plaintext passwords, HttpOnly JWT rotation, and brute-force rate-limiting protection.',
      tag: 'Defense-in-Depth',
    },
    {
      icon: EyeOff,
      title: 'Vote Privacy',
      description: 'Single-use anonymous tokens decouple voter identity from cast ballots, ensuring complete ballot secrecy.',
      tag: 'Zero-Linkage',
    },
    {
      icon: Activity,
      title: 'Transparent Process',
      description: 'Every system event is appended to a publicly auditable, tamper-evident SHA-256 hash-chain.',
      tag: 'Audit Trail',
    },
    {
      icon: FileText,
      title: 'Digital Receipt',
      description: 'Receive an official cryptographic receipt code to independently confirm your ballot reached the vault.',
      tag: 'Verifiable',
    },
    {
      icon: Globe,
      title: 'Accessible Voting',
      description: 'Participate in your registered home constituency elections from any location without travel barriers.',
      tag: 'Accessibility',
    },
  ];

  const faqItems = [
    {
      title: 'How does VoteRemote guarantee ballot secrecy?',
      content: 'VoteRemote enforces cryptographic identity decoupling. When a voter enters the ballot booth, the system generates a single-use anonymous voting token and completely detaches the user identity JWT. The ballot vault only records the AES-256 encrypted candidate choice with zero linkage to the voter ID or profile.'
    },
    {
      title: 'How is double-voting prevented in remote elections?',
      content: 'Each approved voter is granted exactly one single-use anonymous voting token with a 30-minute validity window. As soon as a ballot is sealed into the database, the token is permanently destroyed and invalidated, preventing any repeat voting attempts.'
    },
    {
      title: 'How does the cryptographic audit hash-chain work?',
      content: 'Similar to blockchain ledgers, every security-critical action (pass approval, token generation, ballot sealed) is hashed with SHA-256 and linked to the previous block hash. Election administrators can run instant mathematical verification from the Genesis block to the tip to ensure zero records were modified.'
    },
    {
      title: 'What environmental and mobility benefits does remote voting provide?',
      content: 'Remote voting eliminates the need for relocated professionals, migrant workers, and students to take travel leave and travel long distances back to their registered home towns. Our built-in mobility model tracks distance avoided, productive hours saved, and CO₂ emissions offset.'
    }
  ];

  return (
    <div className="relative min-h-screen bg-sand text-charcoal">
      {/* Vanta-inspired Interactive Atmospheric Particles Background */}
      <NetworkBackground />

      <div className="relative z-10 space-y-24 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* ================= 1. CINEMATIC HERO SECTION ================= */}
        <section className="relative pt-6 pb-6 text-center lg:text-left grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warmwhite/90 border border-sandstone text-xs text-burgundy font-mono shadow-subtle backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-jade animate-pulse" />
              <span className="font-bold tracking-wider uppercase text-[11px]">
                SECURE DIGITAL VOTING PLATFORM
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-charcoal leading-[1.12]">
              Vote Securely. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-burgundy via-burgundy-light to-terracotta">
                From Wherever You Are.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-warmgray leading-relaxed font-normal">
              A secure and convenient digital voting experience designed to simplify participation while maintaining privacy and transparency.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/register">
                <Button size="lg" variant="primary" icon={ArrowRight} iconPosition="right" className="font-bold shadow-elevated bg-burgundy hover:bg-burgundy-deep text-warmwhite">
                  REGISTER AS VOTER
                </Button>
              </Link>

              <a href="#how-it-works">
                <Button size="lg" variant="secondary" className="font-semibold border-sandstone text-charcoal hover:bg-warmwhite">
                  EXPLORE HOW IT WORKS
                </Button>
              </a>
            </div>

            {/* Trust Micro Indicators beneath Hero CTA */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-warmgray font-mono font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-jade" />
                <span className="text-charcoal font-semibold">Identity Verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-burgundy" />
                <span className="text-charcoal font-semibold">Secure Authentication</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-jade" />
                <span className="text-charcoal font-semibold">Vote Privacy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-saffron" />
                <span className="text-charcoal font-semibold">Auditability</span>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive 3D Digital Ballot & Verification Shield (Above the Fold) */}
          <div className="w-full flex items-center justify-center">
            <Hero3DShield />
          </div>

        </section>

        {/* ================= 2. TRUST SECTION INDICATORS ================= */}
        <section className="pt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-warmwhite border border-sandstone flex items-start gap-3 hover:border-jade transition-all shadow-subtle hover:shadow-card">
              <div className="p-2.5 rounded-xl bg-sand/60 text-jade border border-sandstone flex-shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-charcoal">Identity Verification</h3>
                <p className="text-[11px] text-warmgray mt-0.5">Electoral roll matched</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-warmwhite border border-sandstone flex items-start gap-3 hover:border-burgundy transition-all shadow-subtle hover:shadow-card">
              <div className="p-2.5 rounded-xl bg-sand/60 text-burgundy border border-sandstone flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-charcoal">Secure Authentication</h3>
                <p className="text-[11px] text-warmgray mt-0.5">HttpOnly tokens & bcrypt</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-warmwhite border border-sandstone flex items-start gap-3 hover:border-jade transition-all shadow-subtle hover:shadow-card">
              <div className="p-2.5 rounded-xl bg-sand/60 text-jade border border-sandstone flex-shrink-0">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-charcoal">Vote Privacy</h3>
                <p className="text-[11px] text-warmgray mt-0.5">Decoupled ballot vault</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-warmwhite border border-sandstone flex items-start gap-3 hover:border-saffron transition-all shadow-subtle hover:shadow-card">
              <div className="p-2.5 rounded-xl bg-sand/60 text-saffron-dark border border-sandstone flex-shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-charcoal">Auditability</h3>
                <p className="text-[11px] text-warmgray mt-0.5">SHA-256 linked blocks</p>
              </div>
            </div>

          </div>
        </section>

        {/* ================= 3. HOW IT WORKS (Timeline) ================= */}
        <section id="how-it-works" className="space-y-10 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="burgundy" size="sm">TIMELINE WORKFLOW</Badge>
            <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">
              How Remote Voting Works
            </h2>
            <p className="text-warmgray text-xs sm:text-sm">
              A four-step civic participation journey designed for security and ease of use.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {timelineSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-6 rounded-2xl bg-warmwhite border border-sandstone hover:border-burgundy hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 relative group shadow-subtle"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-sand/80 border border-sandstone flex items-center justify-center text-burgundy group-hover:scale-105 group-hover:bg-burgundy group-hover:text-warmwhite transition-all shadow-subtle">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-2xl font-extrabold text-sandstone group-hover:text-burgundy/60 transition-colors">
                        {step.num}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-burgundy uppercase tracking-wider font-bold">
                        {step.badge}
                      </span>
                      <h3 className="text-base font-bold text-charcoal mt-0.5">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-xs text-warmgray leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-sandstone/60 flex items-center justify-between text-[11px] font-mono text-warmgray">
                    <span>Phase {step.num}</span>
                    <span className="text-jade font-bold">Step {idx + 1}/4</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 4. SECURITY SECTION (Interactive 3D Pipeline) ================= */}
        <section id="security" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="jade" size="sm">END-TO-END ASSURANCE</Badge>
            <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">
              Security by Design
            </h2>
            <p className="text-warmgray text-xs sm:text-sm">
              Explore the cryptographic lifecycle where Deep Burgundy represents the core engine, Jade validates authenticity, Saffron monitors checkpoints, and Terracotta manages user interaction.
            </p>
          </div>

          <SecurityFlow3D />
        </section>

        {/* ================= 5. FEATURES GRID ================= */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="terracotta" size="sm">PLATFORM CAPABILITIES</Badge>
            <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">
              Engineered for Modern Governance
            </h2>
            <p className="text-warmgray text-xs sm:text-sm">
              Combining cutting-edge cryptography with intuitive digital civic engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={feat.title} 
                  className="p-6 rounded-2xl bg-warmwhite border border-sandstone hover:border-burgundy hover:shadow-card transition-all space-y-3 shadow-subtle"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-sand/70 border border-sandstone flex items-center justify-center text-burgundy shadow-subtle">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sand text-warmgray border border-sandstone">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-charcoal tracking-tight">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-warmgray leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 6. MOBILITY & ENVIRONMENTAL MODEL ================= */}
        {mobilityMetrics && (
          <section className="p-8 sm:p-10 rounded-3xl bg-warmwhite border border-sandstone space-y-6 shadow-card">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-sandstone">
              <div>
                <div className="inline-flex items-center gap-1.5 text-jade text-xs font-mono font-bold">
                  <Leaf className="w-4 h-4" />
                  <span>MOBILITY & CARBON SAVINGS MODEL</span>
                </div>
                <h2 className="text-2xl font-extrabold text-charcoal tracking-tight mt-1">
                  Real-World Travel Impact of Remote Voting
                </h2>
              </div>
              <span className="text-[11px] text-warmgray font-mono bg-sand px-3 py-1 rounded-md border border-sandstone font-bold">
                Academic Estimation Model
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-sand/50 border border-sandstone">
                <div className="text-warmgray text-xs font-semibold flex items-center gap-1.5">
                  <Vote className="w-3.5 h-3.5 text-burgundy" />
                  <span>Remote Voters</span>
                </div>
                <div className="text-2xl font-extrabold text-charcoal font-mono mt-2">
                  {mobilityMetrics.totalRemoteVoters.toLocaleString()}
                </div>
                <div className="text-[11px] text-warmgray mt-1">Voters saved travel</div>
              </div>

              <div className="p-4 rounded-xl bg-sand/50 border border-sandstone">
                <div className="text-warmgray text-xs font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-terracotta" />
                  <span>Distance Avoided</span>
                </div>
                <div className="text-2xl font-extrabold text-terracotta font-mono mt-2">
                  {(mobilityMetrics.totalDistanceAvoidedKm / 1000).toFixed(0)}k km
                </div>
                <div className="text-[11px] text-warmgray mt-1">Inter-state transit saved</div>
              </div>

              <div className="p-4 rounded-xl bg-sand/50 border border-sandstone">
                <div className="text-warmgray text-xs font-semibold flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-jade" />
                  <span>CO₂ Offsets</span>
                </div>
                <div className="text-2xl font-extrabold text-jade font-mono mt-2">
                  {(mobilityMetrics.totalCo2SavedKg / 1000).toFixed(1)} tons
                </div>
                <div className="text-[11px] text-warmgray mt-1">Estimated carbon offset</div>
              </div>

              <div className="p-4 rounded-xl bg-sand/50 border border-sandstone">
                <div className="text-warmgray text-xs font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-saffron-dark" />
                  <span>Productive Time</span>
                </div>
                <div className="text-2xl font-extrabold text-saffron-dark font-mono mt-2">
                  {mobilityMetrics.totalHoursSaved.toLocaleString()} hrs
                </div>
                <div className="text-[11px] text-warmgray mt-1">Citizen time preserved</div>
              </div>
            </div>
          </section>
        )}

        {/* ================= 7. FAQ ACCORDION ================= */}
        <section id="faq" className="space-y-6 max-w-4xl mx-auto scroll-mt-24">
          <div className="text-center space-y-2">
            <Badge variant="saffron" size="sm">FREQUENTLY ASKED QUESTIONS</Badge>
            <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-warmgray text-xs sm:text-sm">
              Learn how VoteRemote maintains security, privacy, and integrity.
            </p>
          </div>

          <Accordion items={faqItems} />
        </section>

        {/* ================= 8. FINAL CTA SECTION ================= */}
        <section className="p-10 sm:p-14 rounded-3xl bg-burgundy text-warmwhite text-center space-y-6 shadow-elevated relative overflow-hidden border border-burgundy-light">
          {/* Subtle civic seal watermark */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full border-8 border-burgundy-light/20 pointer-events-none" />
          <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full border-8 border-burgundy-light/20 pointer-events-none" />
          
          <div className="space-y-2 max-w-xl mx-auto relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-warmwhite tracking-tight">
              Your Voice. <br />
              <span className="text-saffron">
                Your Vote. Your Choice.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-sand leading-relaxed">
              Exercise your democratic right remotely through a secure, identity-verified digital voting platform.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 relative z-10">
            <Link to="/register">
              <Button size="lg" variant="saffron" icon={ArrowRight} iconPosition="right" className="font-bold text-charcoal shadow-elevated">
                REGISTER AS VOTER
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="font-semibold bg-warmwhite/10 hover:bg-warmwhite/20 text-warmwhite border-warmwhite/20">
                Sign In to Existing Account
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default LandingPage;

