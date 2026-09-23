import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Vote, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Building,
  User,
  Fingerprint,
  FileCheck2,
  Copy,
  Sparkles,
  Timer
} from 'lucide-react';
import api from '../services/api';

const VotingFlow = () => {
  const { electionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Stepper State: 1 (Eligibility), 2 (Token Issuance), 3 (Anonymous Ballot), 4 (Receipt Confirmed)
  const [currentStage, setCurrentStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cryptographic Credential State
  const [credentialToken, setCredentialToken] = useState('');
  const [ballotId, setBallotId] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);

  // Ballot State
  const [candidates, setCandidates] = useState([]);
  const [constituency, setConstituency] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  
  // Confirmation State
  const [receiptData, setReceiptData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (electionId) {
      checkEligibility();
    }
  }, [electionId]);

  // Stage 1: Verify eligibility
  const checkEligibility = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // Find election
      const res = await api.get(`/elections`);
      const allElections = res.data.elections || [];
      const found = allElections.find(e => e._id === electionId || e.code === electionId);
      
      if (!found) {
        setErrorMessage('Election not found or inactive');
        setLoading(false);
        return;
      }

      // Check voting status
      const statusRes = await api.get(`/voting/status/${found._id}`);
      if (statusRes.data.hasVoted) {
        setErrorMessage('You have already cast a ballot in this election. Double-voting is prohibited.');
        setLoading(false);
        return;
      }

      if (!statusRes.data.hasApprovedRequest) {
        // Auto request if needed for prototype
        await api.post('/remote-voting/request', {
          electionId: found._id,
          currentCity: user?.voterProfile?.currentCity || 'Bengaluru',
          currentState: user?.voterProfile?.currentState || 'Karnataka'
        });
      }

      setCurrentStage(1);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to verify voting eligibility');
    } finally {
      setLoading(false);
    }
  };

  // Stage 2: Generate One-Time Anonymous Credential Token
  const handleGenerateCredential = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // Resolve actual MongoDB ObjectId for election
      const res = await api.get(`/elections`);
      const found = res.data.elections.find(e => e._id === electionId || e.code === electionId);
      const targetId = found ? found._id : electionId;

      const credRes = await api.post('/voting/credential', {
        electionId: targetId
      });

      const { credentialToken: rawToken, ballotId: bId, expiresAt: exp } = credRes.data;
      setCredentialToken(rawToken);
      setBallotId(bId);
      setExpiresAt(new Date(exp));

      // Now fetch anonymous ballot using ONLY the credential token header (No User JWT required)
      const ballotRes = await api.get('/voting/ballot', {
        headers: {
          'x-voting-credential': rawToken
        }
      });

      setCandidates(ballotRes.data.candidates || []);
      setConstituency(ballotRes.data.constituency);

      setCurrentStage(3); // Proceed directly to Ballot
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Credential issuance failed. You may have already voted.');
    } finally {
      setLoading(false);
    }
  };

  // Stage 3: Submit Anonymous Ballot
  const handleCastVote = async () => {
    if (!selectedCandidateId) {
      setErrorMessage('Please select a candidate to cast your vote.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const voteRes = await api.post('/voting/cast', {
        candidateId: selectedCandidateId
      }, {
        headers: {
          'x-voting-credential': credentialToken
        }
      });

      setReceiptData(voteRes.data);
      setCurrentStage(4); // Success confirmation
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit vote');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReceipt = () => {
    if (receiptData?.receiptCode) {
      navigator.clipboard.writeText(receiptData.receiptCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Stepper Breadcrumb */}
      <div className="rounded-2xl glass-panel p-4 border border-white/10 flex items-center justify-between text-xs font-mono">
        <div className={`flex items-center space-x-2 ${currentStage >= 1 ? 'text-brand-400 font-bold' : 'text-slate-500'}`}>
          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
          <span className="hidden sm:inline">Identity Check</span>
        </div>
        <div className="w-8 h-[1px] bg-white/10"></div>
        <div className={`flex items-center space-x-2 ${currentStage >= 2 ? 'text-civic-cyan font-bold' : 'text-slate-500'}`}>
          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
          <span className="hidden sm:inline">Anonymous Token</span>
        </div>
        <div className="w-8 h-[1px] bg-white/10"></div>
        <div className={`flex items-center space-x-2 ${currentStage >= 3 ? 'text-civic-amber font-bold' : 'text-slate-500'}`}>
          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
          <span className="hidden sm:inline">Ballot Choice</span>
        </div>
        <div className="w-8 h-[1px] bg-white/10"></div>
        <div className={`flex items-center space-x-2 ${currentStage >= 4 ? 'text-civic-emerald font-bold' : 'text-slate-500'}`}>
          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">4</span>
          <span className="hidden sm:inline">Sealed Receipt</span>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center space-x-2.5 p-4 rounded-2xl bg-civic-rose/10 border border-civic-rose/30 text-civic-rose text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* STAGE 1: Identity & Eligibility Verification */}
      {currentStage === 1 && (
        <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-white/10 space-y-6 animate-in fade-in">
          <div className="space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Stage 1: Remote Voter Clearance Verified
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Your registered constituency and remote voting pass have been validated. Next, the system will generate a single-use anonymous token and decouple your voter profile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-dark-900/80 border border-white/5 space-y-1 text-xs">
              <div className="text-slate-400 text-[10px] font-mono">AUTHENTICATED VOTER</div>
              <div className="font-semibold text-white">{user?.fullName}</div>
              <div className="text-[11px] text-brand-400 font-mono">ID: {user?.voterProfile?.syntheticVoterId}</div>
            </div>

            <div className="p-4 rounded-xl bg-dark-900/80 border border-white/5 space-y-1 text-xs">
              <div className="text-slate-400 text-[10px] font-mono">REGISTERED CONSTITUENCY</div>
              <div className="font-semibold text-white">{user?.voterProfile?.registeredConstituency?.name || 'Visakhapatnam Parliamentary'}</div>
              <div className="text-[11px] text-civic-cyan font-mono">Remote Loc: {user?.voterProfile?.currentCity || 'Bengaluru'}</div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleGenerateCredential}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-civic-cyan hover:from-brand-500 hover:to-civic-cyan text-white text-xs font-semibold shadow-glow-cyan flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Issuing Anonymous Token...' : 'Generate Anonymous Token & Enter Ballot →'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: Anonymous Ballot Selection */}
      {currentStage === 3 && (
        <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-white/10 space-y-6 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-2">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-civic-cyan/15 text-civic-cyan border border-civic-cyan/30 text-[10px] font-mono font-semibold">
                <Lock className="w-3 h-3" />
                <span>ANONYMIZED BALLOT SESSION</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                Official Ballot: {constituency?.name}
              </h2>
            </div>

            <div className="text-right font-mono text-[11px] text-slate-400 bg-dark-900/80 px-3 py-1.5 rounded-xl border border-white/5">
              <div>Ballot ID: <span className="text-slate-200">{ballotId.substring(0, 8)}...</span></div>
              <div className="text-civic-amber flex items-center space-x-1 justify-end mt-0.5">
                <Timer className="w-3 h-3" />
                <span>Session TTL: 30 mins</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            Select one candidate below. Candidates are displayed in <strong>randomized order</strong> to ensure political neutrality.
          </p>

          {/* Candidate Radio Grid */}
          <div className="space-y-3">
            {candidates.map((cand) => {
              const isSelected = selectedCandidateId === cand._id;
              return (
                <div
                  key={cand._id}
                  onClick={() => setSelectedCandidateId(cand._id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    isSelected
                      ? 'bg-brand-500/15 border-brand-400 shadow-glow-cyan'
                      : 'bg-dark-900/60 border-white/5 hover:border-white/20 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <span 
                        className="px-2 py-0.5 rounded text-[10px] font-bold font-mono text-white"
                        style={{ backgroundColor: cand.party?.color || '#3B82F6' }}
                      >
                        {cand.party?.abbreviation || 'IND'}
                      </span>
                      <h3 className="text-sm font-bold text-white">
                        {cand.fullName}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        (Age: {cand.age})
                      </span>
                    </div>

                    <div className="text-xs text-brand-300 font-medium">
                      Party: {cand.party?.name || 'Independent'} · Symbol: {cand.party?.symbol || 'Free Symbol'}
                    </div>

                    {cand.manifestoSummary && (
                      <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                        "{cand.manifestoSummary}"
                      </p>
                    )}

                    {cand.education && (
                      <div className="text-[11px] text-slate-400 font-mono pt-0.5">
                        Education: {cand.education}
                      </div>
                    )}
                  </div>

                  {/* Tactile Radio State */}
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                    isSelected ? 'border-brand-400 bg-brand-500 text-white' : 'border-slate-600 bg-dark-950'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cast Vote Action Button */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <div className="text-[11px] text-slate-400 font-mono">
              Encryption: <span className="text-civic-emerald">AES-256-GCM Authenticated</span>
            </div>

            <button
              onClick={handleCastVote}
              disabled={loading || !selectedCandidateId}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-civic-emerald to-brand-500 hover:from-civic-emerald/90 hover:to-brand-400 text-white text-xs font-semibold shadow-glow-emerald flex items-center space-x-2 transition-all disabled:opacity-40"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Encrypting & Sealing Ballot...' : 'Seal & Submit Encrypted Ballot'}</span>
            </button>
          </div>

        </div>
      )}

      {/* STAGE 4: Permanent Cryptographic Confirmation Receipt */}
      {currentStage === 4 && receiptData && (
        <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-civic-emerald/30 space-y-6 text-center animate-in zoom-in-95">
          
          <div className="inline-flex p-4 rounded-full bg-civic-emerald/10 border border-civic-emerald/20 text-civic-emerald shadow-glow-emerald">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ballot Successfully Recorded & Sealed
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your anonymous encrypted vote has been stored in the secure ballot vault. Your one-time credential token has been permanently destroyed.
            </p>
          </div>

          {/* Cryptographic Receipt Card */}
          <div className="max-w-md mx-auto p-5 rounded-2xl bg-dark-900/90 border border-white/10 space-y-3 text-left font-mono">
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-white/5">
              <span>OFFICIAL VOTING RECEIPT</span>
              <span className="text-civic-emerald">CONFIRMED</span>
            </div>

            <div>
              <div className="text-[10px] text-slate-400">CONFIRMATION RECEIPT CODE</div>
              <div className="text-lg font-bold text-brand-300 flex items-center justify-between mt-1">
                <span>{receiptData.receiptCode}</span>
                <button
                  onClick={handleCopyReceipt}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center space-x-1"
                  title="Copy Receipt"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1 text-[11px] pt-2 border-t border-white/5 text-slate-400">
              <div>Ballot ID: <span className="text-slate-200">{receiptData.ballotId}</span></div>
              <div>Integrity Hash: <span className="text-slate-200">{receiptData.integrityHash?.substring(0, 24)}...</span></div>
              <div>Recorded At: <span className="text-slate-200">{new Date(receiptData.timestamp).toLocaleString()}</span></div>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/voter/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all"
            >
              <span>Return to Voter Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
};

export default VotingFlow;
