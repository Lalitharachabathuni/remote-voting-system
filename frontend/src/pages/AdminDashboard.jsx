import React, { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'results', 'audit', 'mobility'
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
        if (elecRes.data.elections.length > 0) {
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

      setActionMessage(`Request #${requestId.substring(0, 6)}... marked as ${status}`);
      setTimeout(() => setActionMessage(''), 3000);

      // Refresh requests list
      const reqRes = await api.get('/admin/remote-requests');
      if (reqRes.data) setRequests(reqRes.data.requests || []);
    } catch (err) {
      alert('Failed to update request: ' + err.message);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-civic-cyan/10 border border-civic-cyan/20 text-civic-cyan">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Election Authority Operations Portal
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Administrative Control · Remote Clearance Queue · Tamper-Evident Audit
            </p>
          </div>
        </div>

        <button
          onClick={loadInitialData}
          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 flex items-center space-x-1.5 transition-all self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-xl bg-civic-emerald/15 border border-civic-emerald/30 text-civic-emerald text-xs font-medium flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Top 4 Overarching Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel border border-white/10">
          <div className="text-slate-400 text-xs flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-brand-400" />
            <span>Registered Voters</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-2">
            {stats?.totalVoters ?? '—'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Synthetic electorate</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10">
          <div className="text-slate-400 text-xs flex items-center space-x-1.5">
            <Vote className="w-4 h-4 text-civic-cyan" />
            <span>Active Elections</span>
          </div>
          <div className="text-2xl font-extrabold text-civic-cyan font-mono mt-2">
            {stats?.totalElections ?? '—'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Under administration</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10">
          <div className="text-slate-400 text-xs flex items-center space-x-1.5">
            <FileCheck2 className="w-4 h-4 text-civic-amber" />
            <span>Pending Remote Passes</span>
          </div>
          <div className="text-2xl font-extrabold text-civic-amber font-mono mt-2">
            {stats?.pendingRequests ?? requests.filter(r => r.status === 'PENDING').length}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Awaiting officer review</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10">
          <div className="text-slate-400 text-xs flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-civic-emerald" />
            <span>Anonymous Ballots Cast</span>
          </div>
          <div className="text-2xl font-extrabold text-civic-emerald font-mono mt-2">
            {stats?.totalBallots ?? '—'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">AES-256-GCM sealed</div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center space-x-1 p-1 bg-dark-900/80 rounded-xl border border-white/5 text-xs font-medium">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'requests' ? 'bg-white/10 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Remote Passes Queue ({requests.length})
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'results' ? 'bg-white/10 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Live Election Results & Tally
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'audit' ? 'bg-white/10 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Cryptographic Audit Trail
        </button>

        <button
          onClick={() => setActiveTab('mobility')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'mobility' ? 'bg-white/10 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Mobility & Carbon Savings
        </button>
      </div>

      {/* TAB 1: Remote Voting Requests Review Queue */}
      {activeTab === 'requests' && (
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h2 className="text-base font-bold text-white">Remote Voting Eligibility Requests</h2>
              <p className="text-xs text-slate-400">Review declared remote locations and grant voting access</p>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No remote voting requests submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px]">
                    <th className="pb-3 font-semibold">VOTER & REASON</th>
                    <th className="pb-3 font-semibold">REGISTERED CONSTITUENCY</th>
                    <th className="pb-3 font-semibold">DECLARED CURRENT LOCATION</th>
                    <th className="pb-3 font-semibold">STATUS</th>
                    <th className="pb-3 font-semibold text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="font-semibold text-white">{req.voter?.fullName || 'Voter'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{req.voter?.email}</div>
                        <div className="text-[11px] text-slate-300 italic mt-0.5">"{req.reason}"</div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="text-slate-200 font-medium">{req.constituency?.name || 'Constituency'}</div>
                        <div className="text-[10px] text-brand-400 font-mono">{req.constituency?.code} · {req.constituency?.state}</div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="text-civic-cyan font-medium flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{req.currentCity}, {req.currentState}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        {req.hasVoted ? (
                          <span className="px-2 py-0.5 rounded bg-civic-emerald/15 text-civic-emerald border border-civic-emerald/30 text-[10px] font-mono font-bold">
                            VOTED
                          </span>
                        ) : req.status === 'APPROVED' ? (
                          <span className="px-2 py-0.5 rounded bg-civic-cyan/15 text-civic-cyan border border-civic-cyan/30 text-[10px] font-mono font-bold">
                            APPROVED
                          </span>
                        ) : req.status === 'REJECTED' ? (
                          <span className="px-2 py-0.5 rounded bg-civic-rose/15 text-civic-rose border border-civic-rose/30 text-[10px] font-mono font-bold">
                            REJECTED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-civic-amber/15 text-civic-amber border border-civic-amber/30 text-[10px] font-mono font-bold">
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right space-x-1.5">
                        {req.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleReviewRequest(req._id, 'APPROVED')}
                              className="px-2.5 py-1 rounded-lg bg-civic-emerald/20 hover:bg-civic-emerald/30 border border-civic-emerald/40 text-civic-emerald text-[11px] font-semibold transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewRequest(req._id, 'REJECTED')}
                              className="px-2.5 py-1 rounded-lg bg-civic-rose/20 hover:bg-civic-rose/30 border border-civic-rose/40 text-civic-rose text-[11px] font-semibold transition-all"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Live Results & Candidate Tally */}
      {activeTab === 'results' && (
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-3">
            <div>
              <h2 className="text-base font-bold text-white">Election Results & Candidate Tally</h2>
              <p className="text-xs text-slate-400">Aggregated vote counts computed from the anonymous ballot vault</p>
            </div>

            <select
              value={selectedElectionId}
              onChange={(e) => setSelectedElectionId(e.target.value)}
              className="px-3 py-1.5 rounded-xl glass-input text-xs bg-dark-900"
            >
              {elections.map(e => (
                <option key={e._id} value={e._id}>{e.title}</option>
              ))}
            </select>
          </div>

          {tallyData && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-slate-300">
                Total Ballots Counted: <span className="font-bold text-white text-sm">{tallyData.totalVotes}</span>
              </div>

              <div className="space-y-3">
                {tallyData.tally?.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No votes have been submitted for this election yet.
                  </div>
                ) : (
                  tallyData.tally?.map((cand) => (
                    <div key={cand.candidateId} className="p-4 rounded-xl bg-dark-900/80 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span 
                            className="px-2 py-0.5 rounded text-[10px] font-bold font-mono text-white"
                            style={{ backgroundColor: cand.partyColor || '#3B82F6' }}
                          >
                            {cand.partyAbbr}
                          </span>
                          <span className="font-bold text-white text-sm">{cand.fullName}</span>
                          <span className="text-xs text-slate-400 font-mono">({cand.party})</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-white font-mono">{cand.votes} votes</span>
                          <span className="text-xs text-brand-300 font-mono ml-2">({cand.percentage}%)</span>
                        </div>
                      </div>

                      {/* Vote share progress bar */}
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${cand.percentage}%`,
                            backgroundColor: cand.partyColor || '#3B82F6' 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Cryptographic Audit Trail Explorer */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-3">
            <div>
              <h2 className="text-base font-bold text-white">Tamper-Evident Hash Chain Audit Explorer</h2>
              <p className="text-xs text-slate-400">
                Every login, credential issuance, and anonymous vote appends an immutable block linked by SHA-256
              </p>
            </div>

            <button
              onClick={handleVerifyChain}
              disabled={verifyingChain}
              className="px-4 py-2 rounded-xl bg-civic-emerald/20 hover:bg-civic-emerald/30 border border-civic-emerald/40 text-civic-emerald text-xs font-semibold flex items-center space-x-1.5 transition-all self-start sm:self-auto"
            >
              <SearchCheck className="w-4 h-4" />
              <span>{verifyingChain ? 'Computing Hashes...' : 'Run Integrity Verification'}</span>
            </button>
          </div>

          {chainVerification && (
            <div className={`p-4 rounded-xl border text-xs font-mono space-y-1 ${
              chainVerification.isValid 
                ? 'bg-civic-emerald/10 border-civic-emerald/30 text-civic-emerald' 
                : 'bg-civic-rose/10 border-civic-rose/30 text-civic-rose'
            }`}>
              <div className="font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{chainVerification.isValid ? 'CRYPTOGRAPHIC INTEGRITY CONFIRMED' : 'INTEGRITY VIOLATION DETECTED'}</span>
              </div>
              <div>{chainVerification.message}</div>
              {chainVerification.tipHash && (
                <div className="text-[11px] text-slate-300 truncate">
                  Latest Tip Hash: <code>{chainVerification.tipHash}</code>
                </div>
              )}
            </div>
          )}

          {/* Audit Log Blocks */}
          <div className="space-y-3 font-mono text-xs">
            {auditLogs.map((log, idx) => (
              <div key={log._id} className="p-3.5 rounded-xl bg-dark-900/80 border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-bold text-[10px]">
                      BLOCK #{auditLogs.length - idx}
                    </span>
                    <span className="font-bold text-white">{log.action}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div className="truncate">Actor: <span className="text-slate-200">{log.actorRole} ({log.actorId})</span></div>
                  <div className="truncate">Prev Hash: <code className="text-slate-300">{log.previousHash?.substring(0, 16)}...</code></div>
                </div>

                <div className="text-[11px] text-slate-400 truncate">
                  Block Hash: <code className="text-civic-cyan font-bold">{log.currentHash}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Mobility & Environmental Impact Module */}
      {activeTab === 'mobility' && mobilityData && (
        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-6">
          <div className="pb-4 border-b border-white/5">
            <h2 className="text-base font-bold text-white">Mobility & Environmental Impact Analytics</h2>
            <p className="text-xs text-slate-400">
              Estimated travel, financial, and environmental savings achieved by digital remote voting
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-dark-900/80 border border-white/5 space-y-1">
              <div className="text-slate-400 text-xs">Total Travel Avoided</div>
              <div className="text-2xl font-bold text-civic-cyan font-mono">
                {mobilityData.totalDistanceAvoidedKm?.toLocaleString()} km
              </div>
              <div className="text-[11px] text-slate-400">Cumulative inter-state distance</div>
            </div>

            <div className="p-4 rounded-xl bg-dark-900/80 border border-white/5 space-y-1">
              <div className="text-slate-400 text-xs">CO₂ Offsets Generated</div>
              <div className="text-2xl font-bold text-civic-emerald font-mono">
                {(mobilityData.totalCo2SavedKg / 1000).toFixed(1)} metric tons
              </div>
              <div className="text-[11px] text-slate-400">Emission reduction estimate</div>
            </div>

            <div className="p-4 rounded-xl bg-dark-900/80 border border-white/5 space-y-1">
              <div className="text-slate-400 text-xs">Productive Citizen Time</div>
              <div className="text-2xl font-bold text-civic-amber font-mono">
                {mobilityData.totalHoursSaved?.toLocaleString()} hours
              </div>
              <div className="text-[11px] text-slate-400">Travel & waiting time eliminated</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
