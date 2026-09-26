import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  Users, 
  Vote, 
  FileCheck2, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Leaf, 
  SearchCheck, 
  Building, 
  Calendar, 
  MapPin, 
  Lock,
  RefreshCw,
  AlertCircle,
  Clock,
  UserCheck,
  FileText,
  Layers,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/Feedback';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getTabFromPath = (path) => {
    if (path.includes('results') || path.includes('candidates') || path.includes('elections')) return 'results';
    if (path.includes('audit')) return 'audit';
    if (path.includes('mobility') || path.includes('analytics')) return 'mobility';
    return 'requests';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [tallyData, setTallyData] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [chainVerification, setChainVerification] = useState(null);
  const [verifyingChain, setVerifyingChain] = useState(false);
  const [mobilityData, setMobilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedElectionId && activeTab === 'results') {
      fetchTally(selectedElectionId);
    }
  }, [selectedElectionId, activeTab]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [statsRes, reqRes, elecRes, auditRes, mobRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/remote-requests'),
        api.get('/elections'),
        api.get('/audit/logs?limit=15'),
        api.get('/analytics/mobility-impact')
      ]);

      if (statsRes.data) setStats(statsRes.data.stats);
      if (reqRes.data) setRequests(reqRes.data.requests || []);
      if (elecRes.data && elecRes.data.elections) {
        setElections(elecRes.data.elections);
        if (elecRes.data.elections.length > 0 && !selectedElectionId) {
          setSelectedElectionId(elecRes.data.elections[0]._id);
        }
      }
      if (auditRes.data) setAuditLogs(auditRes.data.logs || []);
      if (mobRes.data) setMobilityData(mobRes.data.metrics);
    } catch (err) {
      console.warn('Failed to load admin initial data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTally = async (electionId) => {
    try {
      const res = await api.get(`/analytics/results/${electionId}`);
      if (res.data) {
        setTallyData(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch election tally:', err.message);
    }
  };

  const handleReviewRequest = async (requestId, status) => {
    try {
      await api.patch(`/remote-voting/requests/${requestId}/review`, {
        status,
        reviewNotes: `Reviewed by ${user.fullName} (${user.role})`
      });

      setActionMessage(`Pass #${requestId.substring(0, 6)} marked as ${status}`);
      setTimeout(() => setActionMessage(''), 3500);

      // Refresh requests list
      const reqRes = await api.get('/admin/remote-requests');
      if (reqRes.data) setRequests(reqRes.data.requests || []);
    } catch (err) {
      alert('Failed to update pass: ' + err.message);
    }
  };

  const handleVerifyChain = async () => {
    setVerifyingChain(true);
    try {
      const res = await api.get('/audit/verify');
      if (res.data && res.data.verification) {
        setChainVerification(res.data.verification);
      }
    } catch (err) {
      alert('Chain verification failed: ' + err.message);
    } finally {
      setVerifyingChain(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-sand min-h-screen">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sandstone gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-burgundy text-warmwhite border border-burgundy-light shadow-card">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-charcoal tracking-tight">
                Election Authority Operations Portal
              </h1>
              <Badge variant="burgundy" size="sm">SUPERVISORY</Badge>
            </div>
            <p className="text-xs text-warmgray font-mono mt-0.5">
              Remote Voting Clearance Queue · Real-Time Tally · Cryptographic SHA-256 Audit Trail
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={loadInitialData}
          icon={RefreshCw}
          iconPosition="left"
          className="self-start sm:self-auto font-bold"
        >
          Refresh Live Data
        </Button>
      </div>

      {actionMessage && (
        <div 
          role="alert"
          className="p-3.5 rounded-xl bg-jade/10 border border-jade/30 text-jade text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150"
        >
          <CheckCircle2 className="w-4 h-4 text-jade flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* 2. Top 4 Overarching Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1 */}
        <Card className="bg-warmwhite border-sandstone shadow-subtle">
          <div className="text-warmgray text-xs font-semibold flex items-center gap-1.5">
            <Users className="w-4 h-4 text-burgundy" />
            <span>Registered Voters</span>
          </div>
          <div className="text-2xl font-extrabold text-charcoal font-mono mt-2">
            {stats?.totalVoters ?? '—'}
          </div>
          <div className="text-[11px] text-warmgray mt-0.5">Electoral roll members</div>
        </Card>

        {/* Stat 2 */}
        <Card className="bg-warmwhite border-sandstone shadow-subtle">
          <div className="text-warmgray text-xs font-semibold flex items-center gap-1.5">
            <Vote className="w-4 h-4 text-terracotta" />
            <span>Active Elections</span>
          </div>
          <div className="text-2xl font-extrabold text-terracotta font-mono mt-2">
            {stats?.totalElections ?? elections.length}
          </div>
          <div className="text-[11px] text-warmgray mt-0.5">Under official supervision</div>
        </Card>

        {/* Stat 3 */}
        <Card className="bg-warmwhite border-sandstone shadow-subtle">
          <div className="text-warmgray text-xs font-semibold flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-saffron-dark" />
            <span>Pending Remote Passes</span>
          </div>
          <div className="text-2xl font-extrabold text-saffron-dark font-mono mt-2">
            {stats?.pendingRequests ?? requests.filter(r => r.status === 'PENDING').length}
          </div>
          <div className="text-[11px] text-warmgray mt-0.5">Awaiting officer clearance</div>
        </Card>

        {/* Stat 4 */}
        <Card className="bg-warmwhite border-sandstone shadow-subtle">
          <div className="text-warmgray text-xs font-semibold flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-jade" />
            <span>Encrypted Ballots Cast</span>
          </div>
          <div className="text-2xl font-extrabold text-jade font-mono mt-2">
            {stats?.totalBallots ?? '—'}
          </div>
          <div className="text-[11px] text-warmgray mt-0.5">AES-256-GCM vault recorded</div>
        </Card>

      </div>

      {/* 3. Tabbed Navigation Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-sand/70 rounded-2xl border border-sandstone text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'requests' 
              ? 'bg-warmwhite text-charcoal shadow-subtle border border-sandstone font-bold text-burgundy' 
              : 'text-warmgray hover:text-charcoal'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5 text-burgundy" />
          <span>Remote Passes Queue ({requests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'results' 
              ? 'bg-warmwhite text-charcoal shadow-subtle border border-sandstone font-bold text-terracotta' 
              : 'text-warmgray hover:text-charcoal'
          }`}
        >
          <Vote className="w-3.5 h-3.5 text-terracotta" />
          <span>Live Election Tally</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'audit' 
              ? 'bg-warmwhite text-charcoal shadow-subtle border border-sandstone font-bold text-jade' 
              : 'text-warmgray hover:text-charcoal'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-jade" />
          <span>Cryptographic Audit Trail</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mobility')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'mobility' 
              ? 'bg-warmwhite text-charcoal shadow-subtle border border-sandstone font-bold text-burgundy' 
              : 'text-warmgray hover:text-charcoal'
          }`}
        >
          <Leaf className="w-3.5 h-3.5 text-jade" />
          <span>Mobility & Carbon Model</span>
        </button>
      </div>

      {/* ================= TAB 1: Remote Voting Requests Review Queue ================= */}
      {activeTab === 'requests' && (
        <Card className="bg-warmwhite border-sandstone space-y-4 shadow-subtle">
          <CardHeader
            title="Remote Voting Eligibility Requests Queue"
            subtitle="Review declared remote residence credentials and issue remote voting authorization"
          />

          {requests.length === 0 ? (
            <div className="p-8 text-center text-warmgray text-xs">
              No remote voting requests currently pending in the queue.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-sandstone text-warmgray font-mono text-[11px]">
                    <th className="pb-3 font-semibold">VOTER & DECLARED REASON</th>
                    <th className="pb-3 font-semibold">REGISTERED CONSTITUENCY</th>
                    <th className="pb-3 font-semibold">REMOTE LOCATION</th>
                    <th className="pb-3 font-semibold">STATUS</th>
                    <th className="pb-3 font-semibold text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone/60">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-sand/40 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="font-bold text-charcoal text-xs">{req.voter?.fullName || 'Citizen Voter'}</div>
                        <div className="text-[11px] text-warmgray font-mono">{req.voter?.email}</div>
                        <div className="text-[11px] text-warmgray italic mt-0.5">"{req.reason}"</div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="text-charcoal font-semibold">{req.constituency?.name || 'Constituency'}</div>
                        <div className="text-[10px] text-burgundy font-mono font-bold">{req.constituency?.code} · {req.constituency?.state}</div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="text-terracotta font-bold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{req.currentCity}, {req.currentState}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <StatusBadge status={req.hasVoted ? 'VOTED' : req.status} />
                      </td>
                      <td className="py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {req.status === 'PENDING' ? (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              className="bg-jade hover:bg-jade-deep text-warmwhite font-bold"
                              onClick={() => handleReviewRequest(req._id, 'APPROVED')}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="bg-terracotta/10 border-terracotta/30 text-terracotta-red hover:bg-terracotta/20 font-bold"
                              onClick={() => handleReviewRequest(req._id, 'REJECTED')}
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <span className="text-[11px] text-warmgray font-mono">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* ================= TAB 2: Live Results & Candidate Tally ================= */}
      {activeTab === 'results' && (
        <Card className="bg-warmwhite border-sandstone space-y-6 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sandstone gap-3">
            <div>
              <h2 className="text-base font-bold text-charcoal">Live Election Results & Candidate Tally</h2>
              <p className="text-xs text-warmgray">Aggregated vote distribution computed from the anonymous encrypted vault</p>
            </div>

            <div className="w-full sm:w-72">
              <select
                value={selectedElectionId}
                onChange={(e) => setSelectedElectionId(e.target.value)}
                className="vr-input bg-warmwhite text-xs font-sans border-sandstone"
              >
                {elections.map(e => (
                  <option key={e._id} value={e._id}>{e.title}</option>
                ))}
              </select>
            </div>
          </div>

          {tallyData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-sand/60 border border-sandstone text-xs font-mono">
                <span className="text-charcoal font-bold">Total Valid Ballots Counted:</span>
                <span className="text-base font-bold text-burgundy">{tallyData.totalVotes}</span>
              </div>

              <div className="space-y-3">
                {tallyData.tally?.length === 0 ? (
                  <div className="p-8 text-center text-warmgray text-xs">
                    No ballots recorded for this election yet.
                  </div>
                ) : (
                  tallyData.tally?.map((cand) => (
                    <div 
                      key={cand.candidateId} 
                      className="p-4 rounded-xl bg-warmwhite border border-sandstone space-y-2.5 shadow-subtle"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span 
                            className="px-2 py-0.5 rounded text-[10px] font-bold font-mono text-white"
                            style={{ backgroundColor: cand.partyColor || '#5A2633' }}
                          >
                            {cand.partyAbbr}
                          </span>
                          <span className="font-bold text-charcoal text-sm">{cand.fullName}</span>
                          <span className="text-xs text-warmgray font-mono">({cand.party})</span>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-sm font-bold text-charcoal">{cand.votes} votes</span>
                          <span className="text-xs text-burgundy ml-2 font-bold">({cand.percentage}%)</span>
                        </div>
                      </div>

                      {/* Vote Share Progress Bar */}
                      <div className="w-full h-2.5 rounded-full bg-sand/70 overflow-hidden border border-sandstone">
                        <div 
                          className="h-full rounded-full transition-all duration-700"
                          style={{ 
                            width: `${cand.percentage}%`,
                            backgroundColor: cand.partyColor || '#5A2633' 
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ================= TAB 3: Cryptographic Audit Trail Explorer ================= */}
      {activeTab === 'audit' && (
        <Card className="bg-warmwhite border-sandstone space-y-6 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sandstone gap-3">
            <div>
              <h2 className="text-base font-bold text-charcoal">Tamper-Evident SHA-256 Audit Trail Explorer</h2>
              <p className="text-xs text-warmgray">
                Immutable cryptographic ledger where every security event is linked sequentially from Genesis block to tip.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              isLoading={verifyingChain}
              onClick={handleVerifyChain}
              icon={SearchCheck}
              iconPosition="left"
              className="self-start sm:self-auto font-bold bg-burgundy hover:bg-burgundy-deep text-warmwhite"
            >
              Run Integrity Verification
            </Button>
          </div>

          {chainVerification && (
            <div 
              role="status"
              className={`p-4 rounded-xl border text-xs font-mono space-y-1 animate-in fade-in duration-150 ${
                chainVerification.isValid 
                  ? 'bg-jade/10 border-jade/30 text-jade' 
                  : 'bg-terracotta/10 border-terracotta/30 text-terracotta-red'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-jade" />
                <span>{chainVerification.isValid ? 'CRYPTOGRAPHIC INTEGRITY CONFIRMED' : 'INTEGRITY VIOLATION DETECTED'}</span>
              </div>
              <div>{chainVerification.message}</div>
              {chainVerification.tipHash && (
                <div className="text-[11px] text-warmgray truncate pt-1">
                  Tip Block Hash: <code className="text-burgundy font-bold">{chainVerification.tipHash}</code>
                </div>
              )}
            </div>
          )}

          {/* Ledger Blocks List */}
          <div className="space-y-3 font-mono text-xs">
            {auditLogs.map((log, idx) => (
              <div key={log._id} className="p-3.5 rounded-xl bg-sand/60 border border-sandstone space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-sand text-burgundy font-bold text-[10px] border border-sandstone">
                      BLOCK #{auditLogs.length - idx}
                    </span>
                    <span className="font-bold text-charcoal">{log.action}</span>
                  </div>
                  <span className="text-[11px] text-warmgray font-sans">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-warmgray pt-1">
                  <div className="truncate">Actor: <span className="text-charcoal font-semibold">{log.actorRole} ({log.actorId})</span></div>
                  <div className="truncate">Prev Hash: <code className="text-charcoal">{log.previousHash?.substring(0, 18)}...</code></div>
                </div>

                <div className="text-[11px] text-warmgray truncate">
                  Block Hash: <code className="text-burgundy font-bold">{log.currentHash}</code>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= TAB 4: Mobility & Environmental Impact Module ================= */}
      {activeTab === 'mobility' && mobilityData && (
        <Card className="bg-warmwhite border-sandstone space-y-6 shadow-subtle">
          <CardHeader
            title="Mobility & Environmental Impact Analytics"
            subtitle="Estimated transit distance, citizen hours, and carbon emissions preserved through remote voting"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-sand/60 border border-sandstone space-y-1">
              <div className="text-warmgray text-xs font-semibold">Total Travel Avoided</div>
              <div className="text-2xl font-bold text-terracotta font-mono">
                {mobilityData.totalDistanceAvoidedKm?.toLocaleString()} km
              </div>
              <div className="text-[11px] text-warmgray">Cumulative inter-state distance</div>
            </div>

            <div className="p-4 rounded-xl bg-sand/60 border border-sandstone space-y-1">
              <div className="text-warmgray text-xs font-semibold">CO₂ Offsets Generated</div>
              <div className="text-2xl font-bold text-jade font-mono">
                {(mobilityData.totalCo2SavedKg / 1000).toFixed(1)} metric tons
              </div>
              <div className="text-[11px] text-warmgray">Emission reduction estimate</div>
            </div>

            <div className="p-4 rounded-xl bg-sand/60 border border-sandstone space-y-1">
              <div className="text-warmgray text-xs font-semibold">Productive Citizen Time</div>
              <div className="text-2xl font-bold text-saffron-dark font-mono">
                {mobilityData.totalHoursSaved?.toLocaleString()} hours
              </div>
              <div className="text-[11px] text-warmgray">Travel & waiting time eliminated</div>
            </div>
          </div>
        </Card>
      )}

    </div>
  );
};

export default AdminDashboard;

