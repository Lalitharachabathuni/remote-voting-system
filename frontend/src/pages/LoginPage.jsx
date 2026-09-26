import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck,
  User,
  Shield,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Modal } from '../components/ui/Modal';
import Login3DVisual from '../components/visuals/Login3DVisual';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please provide your registered email or voter ID and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await login(email.trim().toLowerCase(), password);
      setLoading(false);

      if (res.success) {
        if (res.user?.role === 'ADMIN' || res.user?.role === 'ELECTION_OFFICER' || res.user?.role === 'SUPER_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/voter/dashboard');
        }
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage('Unable to connect to authentication server. Please try again.');
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await demoLogin(role);
      setLoading(false);
      if (res.success) {
        if (role === 'ADMIN' || role === 'ELECTION_OFFICER') {
          navigate('/admin');
        } else {
          navigate('/voter/dashboard');
        }
      } else {
        setErrorMessage(res.error || 'Demo login failed. Ensure database is initialized.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage('Demo login encountered an issue.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-sand">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 rounded-3xl bg-warmwhite border border-sandstone overflow-hidden shadow-elevated">
        
        {/* ================= LEFT SPLIT: 3D SECURITY VISUALIZATION ================= */}
        <div className="hidden md:block md:col-span-5 h-full bg-sand/30 border-r border-sandstone">
          <Login3DVisual />
        </div>

        {/* ================= RIGHT SPLIT: LOGIN FORM CARD ================= */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-warmwhite text-charcoal">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand border border-sandstone text-xs font-mono font-bold text-burgundy">
              <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
              <span>AUTHENTICATION GATEWAY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-warmgray">
              Securely access your VoteRemote digital voting account.
            </p>
          </div>

          {errorMessage && (
            <div 
              role="alert"
              className="flex items-start gap-2.5 p-3.5 rounded-xl bg-terracotta/10 border border-terracotta/30 text-terracotta-red text-xs animate-in fade-in duration-150"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-terracotta-red" />
              <div className="flex-1 font-semibold">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email / Voter ID"
              type="text"
              required
              icon={Mail}
              placeholder="voter@voteremote.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />

            <PasswordInput
              label="Password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-charcoal font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-sandstone text-burgundy focus:ring-burgundy w-4 h-4"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-burgundy hover:text-burgundy-deep font-semibold hover:underline focus:outline-none"
              >
                Forgot password?
              </button>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-bold uppercase tracking-wider bg-burgundy hover:bg-burgundy-deep text-warmwhite"
                isLoading={loading}
                icon={ArrowRight}
                iconPosition="right"
              >
                SIGN IN SECURELY
              </Button>
            </div>

            <div className="text-center text-[11px] text-warmgray flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-jade" />
              <span>Protected by cryptographic identity decoupling</span>
            </div>
          </form>

          {/* Quick 1-Click Evaluation Personas */}
          <div className="pt-4 border-t border-sandstone space-y-2">
            <div className="text-[10px] font-mono text-warmgray uppercase tracking-wider text-center font-bold">
              1-Click Demo Evaluation Sign In
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('VOTER')}
                disabled={loading}
                className="p-2.5 rounded-xl bg-sand/60 hover:bg-sand border border-sandstone text-xs text-charcoal font-semibold flex items-center justify-center gap-2 transition-all shadow-subtle hover:border-burgundy"
              >
                <User className="w-3.5 h-3.5 text-burgundy" />
                <span>Citizen Voter</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN')}
                disabled={loading}
                className="p-2.5 rounded-xl bg-sand/60 hover:bg-sand border border-sandstone text-xs text-charcoal font-semibold flex items-center justify-center gap-2 transition-all shadow-subtle hover:border-burgundy"
              >
                <Shield className="w-3.5 h-3.5 text-terracotta" />
                <span>Election Admin</span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center text-xs text-warmgray pt-2 border-t border-sandstone">
            Don't have an account?{' '}
            <Link to="/register" className="text-burgundy hover:text-burgundy-deep font-bold underline">
              Register as Voter
            </Link>
          </div>

        </div>

      </div>

      {/* Forgot Password Assistance Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Credential Recovery Assistance"
        subtitle="Identity verification & test accounts"
      >
        <div className="space-y-4 text-xs text-charcoal">
          <p>
            In this demonstration platform, pre-seeded testing accounts can be used to log in immediately:
          </p>
          
          <div className="p-4 rounded-xl bg-sand/70 border border-sandstone space-y-2 font-mono text-xs">
            <div className="text-burgundy font-bold">PRE-CONFIGURED DEMO ACCOUNTS:</div>
            <div>• Voter: <span className="font-bold text-charcoal">voter@voteremote.org</span> / <span className="text-burgundy">password123</span></div>
            <div>• Admin: <span className="font-bold text-charcoal">admin@voteremote.org</span> / <span className="text-burgundy">password123</span></div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setForgotModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default LoginPage;

