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
  Sparkles
} from 'lucide-react';
import api from '../services/api';

const VoterDashboard = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestError, setRequestError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(false);
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
    }
  };

  const handleApplyRemote = async (electionId) => {
    setRequestLoading(true);
    setRequestError('');
    setRequestSuccess('');

    try {
      const res = await api.post('/remote-voting/request', {
        electionId,
        currentCity: user?.voterProfile?.currentCity || 'Bengaluru',
        currentState: user?.voterProfile?.currentState || 'Karnataka',
        reason: 'Temporary remote work / academic displacement'
      });

      setRequestSuccess('Remote voting request submitted and approved!');
      await fetchDashboardData();
      setTimeout(() => {
        setRequestModalOpen(false);
      }, 1500);
    } catch (err) {
      setRequestError(err.response?.data?.message || 'Failed to submit remote voting request');
    } finally {
      setRequestLoading(false);
    }
  };

  const voterProfile = user?.voterProfile;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Voter Profile Banner Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 shadow-glass border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-civic-cyan p-[1px] shadow-glow-cyan flex-shrink-0">
              <div className="w-full h-full bg-dark-900 rounded-[15px] flex items-center justify-center">
                <User className="w-7 h-7 text-civic-cyan" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {user?.fullName}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-civic-emerald/10 text-civic-emerald border border-civic-emerald/20 text-[11px] font-mono font-medium flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>VERIFIED VOTER</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Prototype ID: <span className="text-brand-300 font-bold">{voterProfile?.syntheticVoterId || 'VID-2026-X89K2Q'}</span>
              </p>
            </div>
          </div>

          {/* Registered vs Current Location Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-dark-900/80 px-4 py-2.5 rounded-xl border border-white/5 text-xs">
              <div className="text-[10px] text-slate-400 font-mono">HOME CONSTITUENCY</div>
              <div className="text-white font-semibold flex items-center space-x-1 mt-0.5">
                <Building className="w-3.5 h-3.5 text-brand-400" />
                <span>{voterProfile?.registeredConstituency?.name || 'Visakhapatnam Parliamentary'}</span>
              </div>
            </div>

            <div className="bg-dark-900/80 px-4 py-2.5 rounded-xl border border-white/5 text-xs">
              <div className="text-[10px] text-slate-400 font-mono">DECLARED CURRENT LOCATION</div>
              <div className="text-civic-cyan font-semibold flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-civic-cyan" />
                <span>{voterProfile?.currentCity || 'Bengaluru'}, {voterProfile?.currentState || 'Karnataka'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Available Elections & Remote Voting Passes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Elections & Remote Voting Clearance
            </h2>
            <p className="text-xs text-slate-400">
              Review elections open for your home constituency and cast anonymous ballots
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map((election) => {
            const request = myRequests.find(r => r.election?._id === election._id || r.election === election._id);
            const isApproved = request?.status === 'APPROVED';
            const hasVoted = request?.hasVoted;

            return (
              <div 
                key={election._id}
                className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4 flex flex-col justify-between hover:border-brand-500/30 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[10px] font-mono font-semibold">
                      {election.code}
                    </span>
                    
                    {hasVoted ? (
                      <span className="px-2 py-0.5 rounded bg-civic-emerald/15 text-civic-emerald border border-civic-emerald/30 text-[10px] font-mono font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>VOTE RECORDED</span>
                      </span>
                    ) : isApproved ? (
                      <span className="px-2 py-0.5 rounded bg-civic-cyan/15 text-civic-cyan border border-civic-cyan/30 text-[10px] font-mono font-bold flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>PASS APPROVED</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-civic-amber/15 text-civic-amber border border-civic-amber/30 text-[10px] font-mono font-bold">
                        CLEARANCE NEEDED
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {election.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {election.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Voting Window:</span>
                      <span className="text-slate-200">Active Now</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Constituency:</span>
                      <span className="text-brand-300 font-semibold">{voterProfile?.registeredConstituency?.name || 'Visakhapatnam'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  {hasVoted ? (
                    <div className="p-2.5 rounded-xl bg-civic-emerald/10 border border-civic-emerald/20 text-center">
                      <div className="text-xs font-semibold text-civic-emerald flex items-center justify-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Ballot Cryptographically Sealed</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Double-voting blocked by single-use token
                      </div>
                    </div>
                  ) : isApproved ? (
                    <Link
                      to={`/voter/vote/${election._id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-civic-cyan hover:from-brand-500 hover:to-civic-cyan text-white text-center font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <Vote className="w-4 h-4" />
                      <span>Enter Secure Ballot Session</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleApplyRemote(election._id)}
                      disabled={requestLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-center font-semibold text-xs transition-all flex items-center justify-center space-x-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{requestLoading ? 'Submitting...' : 'Apply for Remote Voting Pass'}</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Security & Privacy Notice */}
      <div className="p-4 rounded-2xl bg-dark-900/60 border border-white/5 flex items-start space-x-3 text-xs text-slate-400">
        <KeyRound className="w-4 h-4 text-civic-cyan flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 font-semibold">Ballot Secrecy Guarantee:</strong> When you enter the ballot session, the platform issues a one-time anonymous voting token and discards your identity context. No database query can ever link your voter profile with your candidate choice.
        </div>
      </div>

    </div>
  );
};

export default VoterDashboard;
