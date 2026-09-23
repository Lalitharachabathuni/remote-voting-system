import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  UserPlus, 
  Shield, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Mail, 
  User, 
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound
} from 'lucide-react';
import api from '../services/api';

const DEFAULT_CONSTITUENCIES = [
  {
    _id: 'default-vizag',
    name: 'Visakhapatnam Parliamentary Constituency',
    code: 'PC-AP-04',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam'
  },
  {
    _id: 'default-blr',
    name: 'Bengaluru South Parliamentary Constituency',
    code: 'PC-KA-26',
    state: 'Karnataka',
    district: 'Bengaluru Urban'
  },
  {
    _id: 'default-hyd',
    name: 'Hyderabad Parliamentary Constituency',
    code: 'PC-TS-09',
    state: 'Telangana',
    district: 'Hyderabad'
  }
];

const RegisterPage = () => {
  // Account Mode: 'VOTER' or 'ADMIN'
  const [accountType, setAccountType] = useState('VOTER');
  
  const [step, setStep] = useState(1);
  const [constituencies, setConstituencies] = useState(DEFAULT_CONSTITUENCIES);
  const [constituenciesLoading, setConstituenciesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '1998-06-15',
    registeredConstituencyId: DEFAULT_CONSTITUENCIES[0]._id,
    registeredState: DEFAULT_CONSTITUENCIES[0].state,
    registeredDistrict: DEFAULT_CONSTITUENCIES[0].district,
    currentCity: 'Bengaluru',
    currentState: 'Karnataka',
    currentPincode: '560001',
    occupation: 'Software Engineer',
    authorityPasscode: 'ADMIN2026',
    password: '',
    confirmPassword: ''
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConstituencies();
  }, []);

  const fetchConstituencies = async () => {
    try {
      const res = await api.get('/elections/constituencies');
      if (res.data && res.data.constituencies && res.data.constituencies.length > 0) {
        setConstituencies(res.data.constituencies);
        setFormData(prev => ({
          ...prev,
          registeredConstituencyId: res.data.constituencies[0]._id,
          registeredState: res.data.constituencies[0].state,
          registeredDistrict: res.data.constituencies[0].district
        }));
      }
    } catch (err) {
      console.warn('Could not fetch remote constituencies list, using defaults:', err.message);
    } finally {
      setConstituenciesLoading(false);
    }
  };

  const handleConstituencyChange = (e) => {
    const cId = e.target.value;
    const found = constituencies.find(c => c._id === cId);
    setFormData(prev => ({
      ...prev,
      registeredConstituencyId: cId,
      registeredState: found ? found.state : prev.registeredState,
      registeredDistrict: found ? found.district : prev.registeredDistrict
    }));
  };

  const handleNext = () => {
    setErrorMessage('');
    if (step === 1) {
      if (!formData.fullName || !formData.email) {
        setErrorMessage('Please fill in your name and email.');
        return;
      }
    }
    if (step === 2 && accountType === 'VOTER') {
      if (!formData.registeredConstituencyId) {
        setErrorMessage('Please select your registered home constituency.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setErrorMessage('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    
    const payload = {
      ...formData,
      role: accountType,
      registeredConstituencyId: formData.registeredConstituencyId.startsWith('default-')
        ? undefined
        : formData.registeredConstituencyId
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      if (accountType === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/voter/dashboard');
      }
    } else {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-lg w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-civic-cyan/10 border border-civic-cyan/20 text-civic-cyan mb-1">
            {accountType === 'VOTER' ? <UserPlus className="w-6 h-6" /> : <Shield className="w-6 h-6 text-civic-cyan" />}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {accountType === 'VOTER' ? 'Citizen Voter Registration' : 'Election Authority Registration'}
          </h2>
          <p className="text-xs text-slate-400">
            {accountType === 'VOTER' 
              ? 'Create a secure voter profile for digital remote election access'
              : 'Register an administrative official account with authority credentials'}
          </p>
        </div>

        {/* Account Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-dark-900/80 rounded-2xl border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setAccountType('VOTER'); setStep(1); }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center space-x-2 transition-all ${
              accountType === 'VOTER' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Citizen Voter</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setAccountType('ADMIN'); setStep(1); }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center space-x-2 transition-all ${
              accountType === 'ADMIN' ? 'bg-civic-cyan/20 border border-civic-cyan/40 text-civic-cyan shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Election Authority</span>
          </button>
        </div>

        {/* Step Indicator (Only for Voter) */}
        {accountType === 'VOTER' && (
          <div className="flex items-center justify-between px-6 py-2 bg-dark-900/60 rounded-xl border border-white/5 text-xs">
            <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-brand-400 font-semibold' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
              <span>Personal</span>
            </div>
            <div className="w-8 h-[1px] bg-white/10"></div>
            <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-brand-400 font-semibold' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
              <span>Constituency</span>
            </div>
            <div className="w-8 h-[1px] bg-white/10"></div>
            <div className={`flex items-center space-x-1.5 ${step >= 3 ? 'text-brand-400 font-semibold' : 'text-slate-500'}`}>
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
              <span>Security</span>
            </div>
          </div>
        )}

        {/* Main Wizard Form Card */}
        <div className="rounded-2xl glass-panel p-6 sm:p-8 shadow-glass border border-white/10 space-y-5">
          
          {errorMessage && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-civic-rose/10 border border-civic-rose/20 text-civic-rose text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* VOTER FLOW */}
            {accountType === 'VOTER' && (
              <>
                {/* Step 1: Personal Details */}
                {step === 1 && (
                  <div className="space-y-3 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Full Legal Name (as per Electoral Roll)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Vikram Aditya Rao"
                          className="w-full px-3.5 py-2.5 pl-10 rounded-xl glass-input text-xs"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="voter@example.com"
                          className="w-full px-3.5 py-2.5 pl-10 rounded-xl glass-input text-xs"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Registered Constituency & Location */}
                {step === 2 && (
                  <div className="space-y-3 animate-in fade-in">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-slate-300">
                          Registered Home Constituency
                        </label>
                        {constituenciesLoading && (
                          <span className="text-[10px] text-brand-300 flex items-center space-x-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Syncing...</span>
                          </span>
                        )}
                      </div>
                      <select
                        value={formData.registeredConstituencyId}
                        onChange={handleConstituencyChange}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs bg-dark-900"
                      >
                        {constituencies.map(c => (
                          <option key={c._id} value={c._id}>
                            {c.name} ({c.code || 'PC'} · {c.state})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-2 border-t border-white/[0.08]">
                      <div className="text-[11px] font-semibold text-brand-300 uppercase tracking-wider mb-2">
                        Current Relocated Location (Away from Home)
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Current City
                          </label>
                          <input
                            type="text"
                            value={formData.currentCity}
                            onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                            placeholder="e.g. Bengaluru"
                            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Current State
                          </label>
                          <input
                            type="text"
                            value={formData.currentState}
                            onChange={(e) => setFormData({ ...formData, currentState: e.target.value })}
                            placeholder="e.g. Karnataka"
                            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Occupation / Reason for Relocation
                        </label>
                        <input
                          type="text"
                          value={formData.occupation}
                          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                          placeholder="e.g. Software Engineer / University Student"
                          className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Security & Credentials */}
                {step === 3 && (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="bg-brand-500/10 border border-brand-500/20 p-3 rounded-xl text-xs text-brand-300">
                      <div className="font-semibold flex items-center space-x-1 mb-0.5">
                        <ShieldCheck className="w-4 h-4 text-brand-400" />
                        <span>Digital Voter Identifier</span>
                      </div>
                      <span>A unique Voter ID (<code className="font-mono font-bold">VID-2026-XXXX</code>) will be issued upon registration.</span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Create Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="At least 6 characters"
                          className="w-full px-3.5 py-2.5 pl-10 rounded-xl glass-input text-xs"
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Re-enter password"
                          className="w-full px-3.5 py-2.5 pl-10 rounded-xl glass-input text-xs"
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Wizard Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 flex items-center space-x-1.5 transition-all"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  ) : <div></div>}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white flex items-center space-x-1.5 transition-all"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-civic-cyan hover:from-brand-500 hover:to-civic-cyan text-xs font-semibold text-white shadow-md flex items-center space-x-2 transition-all disabled:opacity-50"
                    >
                      <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            )}

            {/* ADMIN / AUTHORITY REGISTRATION FLOW */}
            {accountType === 'ADMIN' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-3.5 rounded-xl bg-civic-cyan/10 border border-civic-cyan/20 text-civic-cyan text-xs">
                  <div className="font-semibold flex items-center space-x-1.5 mb-1">
                    <KeyRound className="w-4 h-4" />
                    <span>Election Authority Access Passcode</span>
                  </div>
                  <div>Default evaluation security passcode: <code className="font-mono font-bold bg-dark-950 px-1.5 py-0.5 rounded text-white">ADMIN2026</code></div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Official Authority Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Smt. Radhika Krishnan (Chief Election Officer)"
                      className="w-full px-3.5 py-2.5 pl-10 rounded-xl glass-input text-xs"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Official Authority Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="admin@voteremote.org"
                      className="w-full px-3.5 py-2.5 pl-10 rounded-xl glass-input text-xs"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Authority Security Passcode
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.authorityPasscode}
                      onChange={(e) => setFormData({ ...formData, authorityPasscode: e.target.value })}
                      placeholder="ADMIN2026"
                      className="w-full px-3.5 py-2.5 pl-10 rounded-xl glass-input text-xs font-mono text-civic-cyan"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-civic-cyan to-brand-600 hover:from-civic-cyan/90 hover:to-brand-500 text-white font-semibold text-xs shadow-glow-cyan flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    <Shield className="w-4 h-4" />
                    <span>{loading ? 'Creating Authority Account...' : 'Register as Election Authority'}</span>
                  </button>
                </div>
              </div>
            )}

          </form>

        </div>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:underline font-semibold">
            Sign in here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
