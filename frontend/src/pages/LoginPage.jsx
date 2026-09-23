import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user?.role === 'ADMIN' || res.user?.role === 'ELECTION_OFFICER' || res.user?.role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/voter/dashboard');
      }
    } else {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Sign In to VoteRemote
          </h2>
          <p className="text-xs text-slate-400">
            Secure digital access for eligible voters & election authorities
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl glass-panel p-6 sm:p-8 shadow-glass border border-white/10 space-y-5">
          
          {errorMessage && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-civic-rose/10 border border-civic-rose/20 text-civic-rose text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voter@voteremote.org"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl glass-input text-xs"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pl-10 rounded-xl glass-input text-xs"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In Securely'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 border-t border-white/[0.08] text-center text-[11px] text-slate-400 flex items-center justify-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-civic-cyan" />
            <span>Encrypted Session & Rate-Limit Protected</span>
          </div>

        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400">
          Need a voter account?{' '}
          <Link to="/register" className="text-brand-400 hover:underline font-semibold">
            Register for Remote Voting
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
