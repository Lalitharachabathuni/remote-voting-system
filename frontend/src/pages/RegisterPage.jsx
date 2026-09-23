import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  UserPlus, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Mail, 
  User, 
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '1998-06-15',
    registeredConstituencyId: '',
    registeredState: 'Andhra Pradesh',
    registeredDistrict: 'Visakhapatnam',
    currentCity: 'Bengaluru',
    currentState: 'Karnataka',
    currentPincode: '560001',
    occupation: 'Software Engineer',
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
      if (res.data && res.data.constituencies) {
        setConstituencies(res.data.constituencies);
        if (res.data.constituencies.length > 0) {
          setFormData(prev => ({
            ...prev,
            registeredConstituencyId: res.data.constituencies[0]._id,
            registeredState: res.data.constituencies[0].state,
            registeredDistrict: res.data.constituencies[0].district
          }));
        }
      }
    } catch (err) {
      console.warn('Could not fetch constituencies list:', err.message);
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
    if (step === 2) {
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
    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      navigate('/voter/dashboard');
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
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Voter Registration
          </h2>
          <p className="text-xs text-slate-400">
            Create a synthetic prototype voter profile for remote election access
          </p>
        </div>

        {/* Step Indicator */}
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

        {/* Main Wizard Form Card */}
        <div className="rounded-2xl glass-panel p-6 sm:p-8 shadow-glass border border-white/10 space-y-5">
          
          {errorMessage && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-civic-rose/10 border border-civic-rose/20 text-civic-rose text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Registered Home Constituency
                  </label>
                  <select
                    value={formData.registeredConstituencyId}
                    onChange={handleConstituencyChange}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs bg-dark-900"
                  >
                    {constituencies.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.code} · {c.state})
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
                    <span>Synthetic Voter Identifier</span>
                  </div>
                  <span>A unique prototype Voter ID (<code className="font-mono font-bold">VID-2026-XXXX</code>) will be auto-generated upon submission.</span>
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

          </form>

        </div>

        <div className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-brand-400 hover:underline font-semibold">
            Sign in here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
