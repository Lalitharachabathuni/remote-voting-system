import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Vote, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  KeyRound, 
  Building, 
  Send,
  User,
  Sparkles,
  Copy,
  Check,
  Eye,
  Layers,
  FileCheck2,
  Shield
} from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/Feedback';

export const VoterDashboard = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });
  
  // Election Details Modal State
  const [selectedElection, setSelectedElection] = useState(null);
  const [electionCandidates, setElectionCandidates] = useState([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  
  // Voter ID Copy State
  const [copiedId, setCopiedId] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [elecRes, reqRes] = await Promise.all([
        api.get('/elections'),
        api.get('/remote-voting/my-requests')
      ]);

      if (elecRes.data && elecRes.data.elections) {
        setElections(elecRes.data.elections);
      }
      if (reqRes.data && reqRes.data.requests) {
        setMyRequests(reqRes.data.requests);
      }
    } catch (err) {
      console.warn('Dashboard data fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyRemote = async (electionId) => {
    setRequestLoading(true);
    setFeedbackMessage({ type: '', text: '' });

    try {
      await api.post('/remote-voting/request', {
        electionId,
        currentCity: user?.voterProfile?.currentCity || 'Bengaluru',
        currentState: user?.voterProfile?.currentState || 'Karnataka',
        reason: 'Temporary remote relocation for professional employment'
      });

      setFeedbackMessage({ 
        type: 'success', 
        text: 'Remote voting clearance request submitted and pre-approved!' 
      });
      await fetchDashboardData();
      setTimeout(() => setFeedbackMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setFeedbackMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to submit remote voting request.' 
      });
    } finally {
      setRequestLoading(false);
    }
  };

  const handleViewElectionDetails = async (election) => {
    setSelectedElection(election);
    setCandidatesLoading(true);
    try {
      const res = await api.get(`/elections/${election._id}/candidates`);
      if (res.data && res.data.candidates) {
        setElectionCandidates(res.data.candidates);
      }
    } catch (err) {
      console.warn('Failed to load candidate list:', err.message);
      setElectionCandidates([]);
    } finally {
      setCandidatesLoading(false);
    }
  };

  const handleCopyVoterId = (id) => {
    if (id) {
      navigator.clipboard.writeText(id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Determine Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const voterProfile = user?.voterProfile;
  const rawVoterId = voterProfile?.syntheticVoterId || 'VID-2026-X89K2Q';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-sand">
      
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-sandstone">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            {getGreeting()}, {user?.fullName || 'Citizen Voter'}
          </h1>
          <p className="text-xs sm:text-sm text-warmgray mt-0.5">
            Your Digital Voting Dashboard & Remote Electoral Roll Clearance
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Badge variant="jade" size="lg" icon={ShieldCheck}>
            VERIFICATION ACTIVE
          </Badge>
        </div>
      </div>

      {feedbackMessage.text && (
        <div 
          role="alert"
          className={`flex items-center gap-2.5 p-3.5 rounded-xl text-xs font-semibold animate-in fade-in duration-150 ${
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

      {/* 2. OVERVIEW CARDS GRID (4 MAIN STATS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Registration Status */}
        <Card className="bg-warmwhite border-sandstone shadow-subtle">
          <div className="text-warmgray text-xs font-semibold">Registration Status</div>
          <div className="text-base font-bold text-charcoal font-mono mt-2 flex items-center gap-2">
            <span>REGISTERED</span>
            <span className="w-2 h-2 rounded-full bg-jade animate-pulse" />
          </div>
          <div className="text-[11px] text-warmgray mt-1">Electoral roll confirmed</div>
        </Card>

        {/* Card 2: Verification Status */}
        <Card className="bg-warmwhite border-sandstone shadow-subtle">
          <div className="text-warmgray text-xs font-semibold">Verification Status</div>
          <div className="text-base font-bold text-jade font-mono mt-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>APPROVED</span>
          </div>
          <div className="text-[11px] text-warmgray mt-1">Remote clearance granted</div>
        </Card>

        {/* Card 3: Active Elections */}
        <Card className="bg-warmwhite border-sandstone shadow-subtle">
          <div className="text-warmgray text-xs font-semibold">Active Elections</div>
          <div className="text-xl font-bold text-burgundy font-mono mt-2">
            {elections.length} Available
          </div>
          <div className="text-[11px] text-warmgray mt-1">For your home constituency</div>
        </Card>

        {/* Card 4: Voting Status */}
        <Card className="bg-warmwhite border-sandstone shadow-subtle">
          <div className="text-warmgray text-xs font-semibold">Voting Status</div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-mono text-sm font-bold text-burgundy tracking-wider">
              {rawVoterId}
            </span>
            <button
              onClick={() => handleCopyVoterId(rawVoterId)}
              className="p-1.5 rounded-lg hover:bg-sand text-warmgray hover:text-charcoal transition-colors"
              title="Copy Voter ID"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-jade" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="text-[11px] text-warmgray mt-1">Single voter identifier</div>
        </Card>

      </div>

      {/* 3. LOCATION & CONSTITUENCY BANNER */}
      <Card className="bg-warmwhite border-sandstone shadow-subtle">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-burgundy font-bold">
              ELECTORAL JURISDICTION
            </span>
            <h2 className="text-lg font-bold text-charcoal">
              Registered Constituency vs. Declared Remote Residency
            </h2>
            <p className="text-xs text-warmgray">
              Your ballot is issued strictly for your registered constituency, regardless of where you currently reside.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
            <div className="p-3.5 rounded-xl bg-sand/60 border border-sandstone">
              <div className="text-[10px] text-warmgray font-mono font-bold">HOME CONSTITUENCY</div>
              <div className="text-xs font-bold text-charcoal flex items-center gap-1.5 mt-0.5">
                <Building className="w-3.5 h-3.5 text-burgundy" />
                <span>{voterProfile?.registeredConstituency?.name || 'Visakhapatnam Parliamentary'}</span>
              </div>
              <div className="text-[10px] text-burgundy font-mono mt-0.5 font-bold">
                {voterProfile?.registeredState || 'Andhra Pradesh'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-sand/60 border border-sandstone">
              <div className="text-[10px] text-warmgray font-mono font-bold">DECLARED REMOTE LOCATION</div>
              <div className="text-xs font-bold text-terracotta flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{voterProfile?.currentCity || 'Bengaluru'}, {voterProfile?.currentState || 'Karnataka'}</span>
              </div>
              <div className="text-[10px] text-warmgray mt-0.5">
                Pincode: {voterProfile?.currentPincode || '560001'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 4. UPCOMING & ELIGIBLE ELECTIONS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-charcoal tracking-tight">
              Upcoming & Active Elections
            </h2>
            <p className="text-xs text-warmgray">
              Review elections open for your constituency, check neutral candidate lists, and access encrypted ballot sessions.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner label="Loading eligible elections..." />
          </div>
        ) : elections.length === 0 ? (
          <Card className="text-center py-12 bg-warmwhite border-sandstone">
            <p className="text-warmgray text-xs">No active elections currently scheduled for your constituency.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => {
              const request = myRequests.find(r => r.election?._id === election._id || r.election === election._id);
              const isApproved = request?.status === 'APPROVED';
              const hasVoted = request?.hasVoted;

              let statusText = 'OPEN';
              if (hasVoted) statusText = 'VOTED';
              else if (election.status === 'UPCOMING') statusText = 'UPCOMING';
              else if (election.status === 'CLOSED') statusText = 'CLOSED';

              return (
                <Card 
                  key={election._id}
                  className="bg-warmwhite border-sandstone flex flex-col justify-between hover:border-burgundy transition-all shadow-subtle hover:shadow-card"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-burgundy px-2.5 py-0.5 rounded-md bg-sand border border-sandstone">
                        {election.code}
                      </span>
                      <StatusBadge status={statusText} />
                    </div>

                    <h3 className="text-base font-bold text-charcoal leading-snug">
                      {election.title}
                    </h3>

                    <p className="text-xs text-warmgray line-clamp-2 leading-relaxed">
                      {election.description}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-sandstone/70 text-xs text-warmgray">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px]">Voting Period:</span>
                        <span className="font-semibold text-charcoal">Active Now</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px]">Constituency:</span>
                        <span className="font-semibold text-burgundy">{voterProfile?.registeredConstituency?.name || 'Visakhapatnam'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-sandstone space-y-2">
                    {hasVoted ? (
                      <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-jade/10 border border-jade/30 text-center">
                          <div className="text-xs font-bold text-jade flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-jade" />
                            <span>Ballot Encrypted & Cast</span>
                          </div>
                          <div className="text-[10px] text-warmgray mt-0.5 font-mono">
                            Single-use token destroyed
                          </div>
                        </div>
                        <Link to={`/voter/elections/${election._id}`} className="block">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-xs font-semibold text-charcoal hover:bg-sand"
                          >
                            VIEW ELECTION
                          </Button>
                        </Link>
                      </div>
                    ) : isApproved ? (
                      <div className="space-y-2">
                        <Link to={`/voter/vote/${election._id}`} className="block">
                          <Button variant="primary" size="md" className="w-full font-bold bg-burgundy hover:bg-burgundy-deep text-warmwhite" icon={Vote} iconPosition="left">
                            Enter Secure Ballot Session
                          </Button>
                        </Link>
                        <Link to={`/voter/elections/${election._id}`} className="block">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-xs font-semibold text-charcoal hover:bg-sand"
                          >
                            VIEW ELECTION
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          variant="primary"
                          size="md"
                          className="w-full font-bold bg-burgundy hover:bg-burgundy-deep text-warmwhite"
                          isLoading={requestLoading}
                          onClick={() => handleApplyRemote(election._id)}
                          icon={Send}
                          iconPosition="left"
                        >
                          Apply for Remote Voting Pass
                        </Button>
                        <Link to={`/voter/elections/${election._id}`} className="block">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-xs font-semibold text-charcoal hover:bg-sand"
                          >
                            VIEW ELECTION
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. BALLOT SECRECY SECURITY NOTICE */}
      <div className="p-4 rounded-2xl bg-warmwhite border border-sandstone flex items-start gap-3 text-xs text-warmgray shadow-subtle">
        <KeyRound className="w-4 h-4 text-burgundy flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-charcoal">Ballot Secrecy Architecture Guarantee:</span> When entering an active ballot session, your user session is completely detached. A high-entropy one-time voting token is used to submit your encrypted candidate choice into the anonymous vault.
        </div>
      </div>

      {/* 6. ELECTION DETAILS & CANDIDATES MODAL */}
      <Modal
        isOpen={!!selectedElection}
        onClose={() => setSelectedElection(null)}
        title={selectedElection?.title || 'Election Details'}
        subtitle={`Code: ${selectedElection?.code} · Parliamentary Constituency`}
        maxWidth="max-w-2xl"
      >
        {selectedElection && (
          <div className="space-y-5 text-xs text-charcoal">
            <div>
              <h4 className="font-bold text-charcoal uppercase tracking-wider text-[11px] font-mono mb-1">
                ELECTION SUMMARY
              </h4>
              <p className="text-warmgray leading-relaxed">
                {selectedElection.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-sand/60 border border-sandstone">
              <div>
                <span className="text-[10px] text-warmgray font-bold">ELECTION STATUS</span>
                <div className="font-semibold text-charcoal font-mono">{selectedElection.status}</div>
              </div>
              <div>
                <span className="text-[10px] text-warmgray font-bold">REMOTE VOTING STATUS</span>
                <div className="font-semibold text-jade font-mono">ENABLED & ACTIVE</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-charcoal uppercase tracking-wider text-[11px] font-mono">
                  NOMINATED CANDIDATES (STRICTLY NEUTRAL VISUAL TREATMENT)
                </h4>
                <span className="text-[10px] text-warmgray">Neutral layout</span>
              </div>

              {candidatesLoading ? (
                <div className="py-6 flex justify-center">
                  <LoadingSpinner size="sm" label="Fetching candidate profiles..." />
                </div>
              ) : electionCandidates.length === 0 ? (
                <div className="p-4 rounded-xl bg-sand/50 text-warmgray text-center">
                  No candidates registered for this constituency yet.
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {electionCandidates.map((cand) => (
                    <div 
                      key={cand._id} 
                      className="p-4 rounded-xl bg-warmwhite border border-sandstone space-y-1.5 shadow-subtle"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-sand text-burgundy border border-sandstone flex items-center justify-center font-bold text-xs">
                            {cand.fullName?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <span className="font-bold text-charcoal text-sm block">{cand.fullName}</span>
                            <span className="text-[11px] text-warmgray">{cand.party?.name || 'Independent'} · Age: {cand.age}</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-burgundy px-2 py-0.5 bg-sand rounded border border-sandstone">
                          {cand.party?.abbreviation || 'IND'}
                        </span>
                      </div>

                      {cand.manifestoSummary && (
                        <p className="text-xs text-warmgray italic pt-1">
                          "{cand.manifestoSummary}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-sandstone flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedElection(null)}
              >
                Close
              </Button>

              <Link to={`/voter/vote/${selectedElection._id}`}>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Vote}
                  iconPosition="left"
                  className="font-bold bg-burgundy hover:bg-burgundy-deep text-warmwhite"
                >
                  Proceed to Ballot
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default VoterDashboard;

