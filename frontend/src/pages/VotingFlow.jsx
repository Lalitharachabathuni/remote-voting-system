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
  Timer, 
  Printer, 
  Copy, 
  Check, 
  EyeOff 
} from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/Feedback';
import VoteSuccess3DVisual from '../components/visuals/VoteSuccess3DVisual';

export const VotingFlow = () => {
  const { electionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 4 Steps: 1 (SELECT), 2 (REVIEW), 3 (CONFIRM), 4 (SUCCESS)
  const [currentStage, setCurrentStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Cryptographic Credential State
  const [credentialToken, setCredentialToken] = useState('');
  const [ballotId, setBallotId] = useState('');

  // Ballot State
  const [electionDetails, setElectionDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [constituency, setConstituency] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  
  // Confirmation Modal State
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  
  // Receipt State
  const [receiptData, setReceiptData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (electionId) {
      initBallotSession();
    }
  }, [electionId]);

  const initBallotSession = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await api.get(`/elections`);
      const allElections = res.data.elections || [];
      const found = allElections.find(e => e._id === electionId || e.code === electionId);
      
      if (!found) {
        setErrorMessage('The requested election was not found or has concluded.');
        setLoading(false);
        return;
      }

      setElectionDetails(found);

      // Check voting status
      const statusRes = await api.get(`/voting/status/${found._id}`);
      if (statusRes.data.hasVoted) {
        setErrorMessage('You have already cast an encrypted ballot in this election. Double-voting is strictly prohibited.');
        setLoading(false);
        return;
      }

      // Automatically issue anonymous single-use credential
      const credRes = await api.post('/voting/credential', {
        electionId: found._id
      });

      const { credentialToken: rawToken, ballotId: bId } = credRes.data;
      setCredentialToken(rawToken);
      setBallotId(bId);

      // Retrieve anonymous ballot with only credential header
      const ballotRes = await api.get('/voting/ballot', {
        headers: {
          'x-voting-credential': rawToken
        }
      });

      setCandidates(ballotRes.data.candidates || []);
      setConstituency(ballotRes.data.constituency);
      setCurrentStage(1); // 01 SELECT
    } catch (err) {
      console.error('Session init error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to initialize secure ballot session.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToReview = () => {
    if (!selectedCandidateId) {
      setErrorMessage('Please select a candidate before proceeding.');
      return;
    }
    setErrorMessage('');
    setCurrentStage(2); // 02 REVIEW
  };

  const handleOpenConfirm = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirmVoteSubmission = async () => {
    if (!selectedCandidateId) {
      setErrorMessage('Please select a candidate before submitting your vote.');
      return;
    }

    setConfirmModalOpen(false);
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
      setCurrentStage(4); // 04 SUCCESS
    } catch (err) {
      console.error('Vote submission error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to seal and record your ballot. Please try again.');
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

  const handlePrintReceipt = () => {
    window.print();
  };

  const selectedCandidate = candidates.find(c => c._id === selectedCandidateId);

  const stepsData = [
    { num: '01', title: 'SELECT' },
    { num: '02', title: 'REVIEW' },
    { num: '03', title: 'CONFIRM' },
    { num: '04', title: 'SUCCESS' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-sand min-h-screen">
      
      {/* 4-Step Progress Indicator (Always Visible) */}
      <div className="p-4 bg-warmwhite rounded-2xl border border-sandstone shadow-subtle">
        <div className="grid grid-cols-4 gap-2 text-center">
          {stepsData.map((s, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStage > stepNum;
            const isCurrent = currentStage === stepNum;

            return (
              <div
                key={s.num}
                className={`py-2 px-1 sm:px-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-burgundy/10 border-burgundy text-burgundy font-bold shadow-subtle'
                    : isCompleted
                    ? 'bg-jade/10 border-jade/30 text-jade font-bold'
                    : 'bg-sand/40 border-sandstone text-warmgray'
                }`}
              >
                <div className="flex items-center justify-center gap-1 font-mono text-xs">
                  {isCompleted ? <Check className="w-3.5 h-3.5 text-jade" /> : <span>{s.num}</span>}
                  <span>{s.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {errorMessage && (
        <div 
          role="alert"
          className="flex items-start gap-2.5 p-4 rounded-xl bg-terracotta/10 border border-terracotta/30 text-terracotta-red text-xs animate-in fade-in duration-150 font-semibold"
        >
          <AlertCircle className="w-4 h-4 text-terracotta-red flex-shrink-0 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      {/* ================= STEP 01: CANDIDATE SELECTION ================= */}
      {currentStage === 1 && (
        <Card className="bg-warmwhite border-sandstone shadow-elevated p-6 sm:p-10 space-y-6 animate-in fade-in duration-150">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sandstone gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sand text-burgundy border border-sandstone text-[10px] font-mono font-bold">
                <Lock className="w-3 h-3" />
                <span>ANONYMOUS BALLOT SESSION</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal tracking-tight mt-1">
                Official Ballot: {constituency?.name || electionDetails?.title}
              </h2>
            </div>

            <div className="text-right font-mono text-[11px] text-warmgray bg-sand/60 px-3 py-1.5 rounded-xl border border-sandstone">
              <div>Session: <span className="text-charcoal font-bold">{ballotId ? ballotId.substring(0, 10) : 'Active'}...</span></div>
              <div className="text-jade font-semibold flex items-center gap-1 justify-end mt-0.5">
                <Timer className="w-3 h-3" />
                <span>AES-256 Vault Active</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-warmgray leading-relaxed">
            Please select your chosen candidate below. In accordance with democratic standards, all candidates receive <strong>strictly identical card sizing, typography, and visual weight</strong>.
          </p>

          {/* Candidate List (Visually Neutral) */}
          <div className="space-y-3" role="radiogroup" aria-label="Nominated Candidates">
            {candidates.map((cand) => {
              const isSelected = selectedCandidateId === cand._id;

              return (
                <div
                  key={cand._id}
                  onClick={() => setSelectedCandidateId(cand._id)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      setSelectedCandidateId(cand._id);
                    }
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-burgundy/5 border-burgundy shadow-subtle ring-2 ring-burgundy/20'
                      : 'bg-warmwhite border-sandstone hover:border-sandstone-dark hover:bg-sand/30'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Neutral Avatar */}
                    <div className="w-11 h-11 rounded-full bg-sand border border-sandstone flex items-center justify-center font-bold text-sm text-charcoal flex-shrink-0">
                      {cand.fullName?.charAt(0) || 'C'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-charcoal">
                          {cand.fullName}
                        </h3>
                        <span className="text-xs font-mono text-warmgray">
                          (Age: {cand.age})
                        </span>
                      </div>

                      <div className="text-xs text-warmgray">
                        Party: <span className="font-semibold text-charcoal">{cand.party?.name || 'Independent'}</span> ({cand.party?.abbreviation || 'IND'})
                      </div>
                    </div>
                  </div>

                  {/* Neutral Selection Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedCandidateId(cand._id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-burgundy text-warmwhite border border-burgundy'
                        : 'bg-sand/70 text-charcoal border border-sandstone hover:border-burgundy'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-jade" />
                        <span>SELECTED</span>
                      </>
                    ) : 'SELECT'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-sandstone flex items-center justify-between">
            <Link to="/voter/dashboard">
              <Button variant="secondary" size="md" icon={ArrowLeft} iconPosition="left">
                Return
              </Button>
            </Link>

            <Button
              variant="primary"
              size="md"
              disabled={!selectedCandidateId}
              onClick={handleProceedToReview}
              icon={ArrowRight}
              iconPosition="right"
              className="font-bold bg-burgundy hover:bg-burgundy-deep text-warmwhite"
            >
              Proceed to Review
            </Button>
          </div>
        </Card>
      )}

      {/* ================= STEP 02: REVIEW SELECTION ================= */}
      {currentStage === 2 && (
        <Card className="bg-warmwhite border-sandstone shadow-elevated p-6 sm:p-10 space-y-6 animate-in fade-in duration-150">
          <div className="space-y-2">
            <div className="inline-flex p-2 rounded-xl bg-sand border border-sandstone text-burgundy">
              <ShieldCheck className="w-5 h-5 text-jade" />
            </div>
            <h2 className="text-2xl font-extrabold text-charcoal tracking-tight">
              02 Review Your Selection
            </h2>
            <p className="text-xs text-warmgray">
              Verify your chosen candidate before requesting cryptographic sealing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-sand/60 border border-sandstone space-y-3">
            <div className="text-[10px] font-mono text-burgundy font-bold uppercase tracking-wider">
              CONFIRMED CANDIDATE CHOICE
            </div>
            <div className="text-xl font-extrabold text-charcoal">
              {selectedCandidate?.fullName}
            </div>
            <div className="text-xs text-warmgray">
              Party Affiliation: <span className="font-semibold text-charcoal">{selectedCandidate?.party?.name}</span> ({selectedCandidate?.party?.abbreviation})
            </div>
            <div className="text-xs text-warmgray">
              Constituency: <span className="font-semibold text-charcoal">{constituency?.name}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sand/80 border border-sandstone text-xs text-charcoal flex items-start gap-3">
            <EyeOff className="w-4 h-4 text-jade flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-burgundy">Zero-Knowledge Sealing:</span> Your voter identity is completely decoupled from this candidate choice before cryptographic transmission.
            </div>
          </div>

          <div className="pt-4 border-t border-sandstone flex items-center justify-between">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setCurrentStage(1)}
              icon={ArrowLeft}
              iconPosition="left"
            >
              Change Selection
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleOpenConfirm}
              icon={Lock}
              iconPosition="left"
              className="font-bold bg-burgundy hover:bg-burgundy-deep text-warmwhite"
            >
              Confirm Selection
            </Button>
          </div>
        </Card>
      )}

      {/* ================= STEP 04: VOTE SUCCESS SCREEN ================= */}
      {currentStage === 4 && receiptData && (
        <Card className="bg-warmwhite border border-jade/40 shadow-elevated p-6 sm:p-10 space-y-6 text-center animate-in zoom-in-95 duration-150">
          
          {/* 3D Verification Check Visual */}
          <VoteSuccess3DVisual />

          <div className="space-y-1.5 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              Vote Successfully Recorded
            </h2>
            <p className="text-xs text-warmgray leading-relaxed">
              Your anonymous encrypted vote has been sealed into the ballot vault. Your one-time credential token has been permanently destroyed.
            </p>
          </div>

          {/* Official Cryptographic Receipt Card */}
          <div className="max-w-md mx-auto p-5 rounded-2xl bg-sand/60 border border-sandstone space-y-3 text-left font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] text-warmgray pb-2 border-b border-sandstone">
              <span className="font-bold text-charcoal">OFFICIAL VOTING RECEIPT</span>
              <span className="text-jade font-bold">SEALED & RECORDED</span>
            </div>

            <div>
              <div className="text-[10px] text-warmgray">RECEIPT ID</div>
              <div className="text-base sm:text-lg font-bold text-burgundy flex items-center justify-between mt-1">
                <span>{receiptData.receiptCode}</span>
                <button
                  type="button"
                  onClick={handleCopyReceipt}
                  className="p-1.5 rounded-lg bg-warmwhite hover:bg-sand text-charcoal text-xs flex items-center gap-1 border border-sandstone shadow-subtle"
                  title="Copy Receipt Code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-jade" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] font-sans">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1 text-[11px] pt-2 border-t border-sandstone text-warmgray">
              <div>Election: <span className="text-charcoal font-semibold">{electionDetails?.title}</span></div>
              <div>Date & Time: <span className="text-charcoal font-semibold">{new Date(receiptData.timestamp).toLocaleString()}</span></div>
              <div className="truncate">Receipt Hash: <span className="text-charcoal font-semibold">{receiptData.integrityHash?.substring(0, 24)}...</span></div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrintReceipt}
              icon={Printer}
              iconPosition="left"
              className="font-bold"
            >
              VIEW RECEIPT
            </Button>

            <Link to="/voter/dashboard">
              <Button
                variant="primary"
                size="md"
                icon={ArrowRight}
                iconPosition="right"
                className="font-bold bg-burgundy hover:bg-burgundy-deep text-warmwhite"
              >
                RETURN TO DASHBOARD
              </Button>
            </Link>
          </div>

        </Card>
      )}

      {/* ================= STEP 03: EXPLICIT CONFIRMATION MODAL ================= */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm and Cast Vote"
        subtitle="Please review your selection carefully before submitting your vote"
      >
        <div className="space-y-4 text-xs text-charcoal">
          <div className="p-4 rounded-xl bg-saffron/15 border border-saffron/40 text-charcoal font-semibold space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-burgundy">
              <AlertCircle className="w-4 h-4 text-saffron-dark flex-shrink-0" />
              <span>WARNING: PERMANENT SUBMISSION</span>
            </div>
            <p className="text-[11px] text-warmgray">
              Please review your selection carefully before submitting your vote. Once submitted, your vote cannot be changed or recalled.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-sand/60 border border-sandstone space-y-1.5">
            <div>• <strong>Selected Candidate:</strong> {selectedCandidate?.fullName} ({selectedCandidate?.party?.name})</div>
            <div>• <strong>Constituency:</strong> {constituency?.name}</div>
            <div>• <strong>Single-Use Action:</strong> Your one-time voting token will be permanently destroyed.</div>
          </div>

          <div className="pt-3 border-t border-sandstone flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmModalOpen(false)}
            >
              Go Back
            </Button>

            <Button
              variant="primary"
              size="sm"
              isLoading={loading}
              onClick={handleConfirmVoteSubmission}
              icon={CheckCircle2}
              iconPosition="left"
              className="font-bold bg-burgundy hover:bg-burgundy-deep text-warmwhite"
            >
              CONFIRM AND CAST VOTE
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default VotingFlow;

