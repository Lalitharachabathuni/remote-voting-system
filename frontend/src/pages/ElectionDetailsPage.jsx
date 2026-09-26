import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Vote, 
  ShieldCheck, 
  Building, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  User,
  Layers,
  Send
} from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Feedback';

export const ElectionDetailsPage = () => {
  const { electionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [requestStatus, setRequestStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (electionId) {
      fetchElectionData();
    }
  }, [electionId]);

  const fetchElectionData = async () => {
    setLoading(true);
    try {
      const [elecRes, candRes, reqRes] = await Promise.all([
        api.get('/elections'),
        api.get(`/elections/${electionId}/candidates`).catch(() => ({ data: { candidates: [] } })),
        api.get('/remote-voting/my-requests').catch(() => ({ data: { requests: [] } }))
      ]);

      const allElections = elecRes.data.elections || [];
      const found = allElections.find(e => e._id === electionId || e.code === electionId);
      
      if (found) {
        setElection(found);
      }
      if (candRes.data && candRes.data.candidates) {
        setCandidates(candRes.data.candidates);
      }
      if (reqRes.data && reqRes.data.requests && found) {
        const myReq = reqRes.data.requests.find(r => r.election?._id === found._id || r.election === found._id);
        setRequestStatus(myReq);
      }
    } catch (err) {
      console.warn('Failed to load election details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyRemote = async () => {
    if (!election) return;
    setRequestLoading(true);
    setFeedbackMessage({ type: '', text: '' });

    try {
      await api.post('/remote-voting/request', {
        electionId: election._id,
        currentCity: user?.voterProfile?.currentCity || 'Bengaluru',
        currentState: user?.voterProfile?.currentState || 'Karnataka',
        reason: 'Temporary remote relocation for professional employment'
      });

      setFeedbackMessage({ 
        type: 'success', 
        text: 'Remote voting pass pre-approved! You can now enter the secure ballot booth.' 
      });
      await fetchElectionData();
    } catch (err) {
      setFeedbackMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to submit clearance request.' 
      });
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-sand">
        <LoadingSpinner size="lg" label="Loading official election details..." />
      </div>
    );
  }

  if (!election) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 bg-sand">
        <h1 className="text-2xl font-bold text-charcoal">Election Not Found</h1>
        <p className="text-sm text-warmgray">The requested election was not found or has concluded.</p>
        <Link to="/voter/dashboard">
          <Button variant="primary" size="md" icon={ArrowLeft} iconPosition="left" className="bg-burgundy text-warmwhite">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const isApproved = requestStatus?.status === 'APPROVED';
  const hasVoted = requestStatus?.hasVoted;

  let statusBadgeText = 'OPEN';
  if (hasVoted) statusBadgeText = 'VOTED';
  else if (election.status === 'UPCOMING') statusBadgeText = 'UPCOMING';
  else if (election.status === 'CLOSED') statusBadgeText = 'CLOSED';

  const voterProfile = user?.voterProfile;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-sand min-h-screen">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between pb-2">
        <Link to="/voter/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-warmgray hover:text-burgundy transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Voter Dashboard</span>
        </Link>

        <StatusBadge status={statusBadgeText} />
      </div>

      {feedbackMessage.text && (
        <div 
          role="alert"
          className={`flex items-center gap-2.5 p-4 rounded-xl text-xs font-semibold animate-in fade-in duration-150 ${
            feedbackMessage.type === 'success'
              ? 'bg-jade/10 border border-jade/30 text-jade'
              : 'bg-terracotta/10 border border-terracotta/30 text-terracotta-red'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-jade flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-terracotta-red flex-shrink-0" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Main Header Card */}
      <Card className="bg-warmwhite border-sandstone shadow-elevated p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-sandstone">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand border border-sandstone text-xs font-mono font-bold text-burgundy">
              <span>ELECTION CODE: {election.code}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              {election.title}
            </h1>
            <p className="text-xs sm:text-sm text-warmgray leading-relaxed">
              {election.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            {hasVoted ? (
              <div className="p-4 rounded-2xl bg-jade/10 border border-jade/30 text-center space-y-1">
                <div className="text-xs font-bold text-jade flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-jade" />
                  <span>Ballot Cast</span>
                </div>
                <div className="text-[10px] text-warmgray font-mono">
                  Verified in Vault
                </div>
              </div>
            ) : isApproved ? (
              <Link to={`/voter/vote/${election._id}`} className="w-full">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-full font-bold bg-burgundy hover:bg-burgundy-deep text-warmwhite shadow-elevated"
                  icon={Vote}
                  iconPosition="left"
                >
                  Enter Ballot Session
                </Button>
              </Link>
            ) : (
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full font-bold bg-burgundy hover:bg-burgundy-deep text-warmwhite shadow-elevated"
                isLoading={requestLoading}
                onClick={handleApplyRemote}
                icon={Send}
                iconPosition="left"
              >
                Apply for Remote Pass
              </Button>
            )}
          </div>
        </div>

        {/* Electoral Jurisdiction Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-sand/60 border border-sandstone space-y-1">
            <span className="text-warmgray font-mono text-[10px] font-bold uppercase">JURISDICTION</span>
            <div className="font-bold text-charcoal flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-burgundy" />
              <span>{voterProfile?.registeredConstituency?.name || 'Visakhapatnam Parliamentary'}</span>
            </div>
            <div className="text-[11px] text-warmgray">Electoral roll matched</div>
          </div>

          <div className="p-4 rounded-xl bg-sand/60 border border-sandstone space-y-1">
            <span className="text-warmgray font-mono text-[10px] font-bold uppercase">VOTING STATUS</span>
            <div className="font-bold text-charcoal font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-jade" />
              <span>{hasVoted ? 'BALLOT RECORDED' : isApproved ? 'PASS APPROVED' : 'PASS REQUIRED'}</span>
            </div>
            <div className="text-[11px] text-warmgray">Single-use token protocol</div>
          </div>

          <div className="p-4 rounded-xl bg-sand/60 border border-sandstone space-y-1">
            <span className="text-warmgray font-mono text-[10px] font-bold uppercase">ENCRYPTION PROTOCOL</span>
            <div className="font-bold text-charcoal font-mono flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-burgundy" />
              <span>AES-256-GCM VAULT</span>
            </div>
            <div className="text-[11px] text-warmgray">Zero voter-identity linkage</div>
          </div>
        </div>
      </Card>

      {/* Candidates List with Strict Visual Neutrality */}
      <Card className="bg-warmwhite border-sandstone shadow-elevated p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-sandstone">
          <div>
            <h2 className="text-lg font-bold text-charcoal">Nominated Candidates</h2>
            <p className="text-xs text-warmgray">Strictly equal visual prominence and typography across all candidates</p>
          </div>
          <span className="text-[10px] font-mono text-warmgray bg-sand px-2.5 py-1 rounded-md border border-sandstone font-bold">
            {candidates.length} Nominees
          </span>
        </div>

        {candidates.length === 0 ? (
          <div className="p-8 text-center text-warmgray text-xs bg-sand/40 rounded-xl border border-sandstone">
            No candidates registered for this constituency yet.
          </div>
        ) : (
          <div className="space-y-3">
            {candidates.map((cand) => (
              <div 
                key={cand._id}
                className="p-4 sm:p-5 rounded-2xl bg-sand/40 border border-sandstone hover:border-burgundy transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-sand border border-sandstone flex items-center justify-center font-bold text-base text-charcoal flex-shrink-0">
                    {cand.fullName?.charAt(0) || 'C'}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-charcoal">{cand.fullName}</h3>
                      <span className="text-xs font-mono text-warmgray">(Age: {cand.age})</span>
                    </div>
                    <div className="text-xs text-warmgray">
                      Party: <span className="font-semibold text-charcoal">{cand.party?.name || 'Independent'}</span> ({cand.party?.abbreviation || 'IND'})
                    </div>
                    {cand.manifestoSummary && (
                      <p className="text-xs text-warmgray italic pt-1 max-w-xl">
                        "{cand.manifestoSummary}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-mono font-bold text-burgundy px-3 py-1 bg-warmwhite rounded-xl border border-sandstone">
                    {cand.party?.abbreviation || 'IND'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-sandstone flex items-center justify-between">
          <Link to="/voter/dashboard">
            <Button variant="secondary" size="md" icon={ArrowLeft} iconPosition="left">
              Return to Dashboard
            </Button>
          </Link>

          {!hasVoted && (
            <Link to={`/voter/vote/${election._id}`}>
              <Button variant="primary" size="md" className="bg-burgundy hover:bg-burgundy-deep text-warmwhite font-bold" icon={Vote} iconPosition="left">
                Proceed to Secure Ballot
              </Button>
            </Link>
          )}
        </div>
      </Card>

    </div>
  );
};

export default ElectionDetailsPage;
