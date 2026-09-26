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
  KeyRound,
  Check
} from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Card } from '../components/ui/Card';
import Register3DVisual from '../components/visuals/Register3DVisual';

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

export const RegisterPage = () => {
  const [accountType, setAccountType] = useState('VOTER'); // 'VOTER' or 'ADMIN'
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

  const handleNext = (e) => {
    e?.preventDefault();
    setErrorMessage('');

    if (step === 1) {
      if (!formData.fullName.trim() || !formData.email.trim()) {
        setErrorMessage('Please provide your full legal name and email address.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
    }

    if (step === 2 && accountType === 'VOTER') {
      if (!formData.registeredConstituencyId) {
        setErrorMessage('Please select your registered home constituency.');
        return;
      }
      if (!formData.currentCity.trim() || !formData.currentState.trim()) {
        setErrorMessage('Please provide your current remote city and state.');
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
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    setLoading(true);

    const isDefaultId = typeof formData.registeredConstituencyId === 'string' && 
      formData.registeredConstituencyId.startsWith('default-');

    const payload = {
      ...formData,
      email: formData.email.trim().toLowerCase(),
      fullName: formData.fullName.trim(),
      role: accountType,
      registeredConstituencyId: isDefaultId ? undefined : formData.registeredConstituencyId
    };

    try {
      const res = await register(payload);
      setLoading(false);

      if (res.success) {
        if (accountType === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/voter/dashboard');
        }
      } else {
        setErrorMessage(res.error || 'Registration could not be completed. Please check your details.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.response?.data?.error || err.message || 'Registration failed. Please check your data.');
    }
  };

  const stepsData = [
    { num: '01', title: 'PERSONAL', desc: 'Basic details & contact' },
    { num: '02', title: 'VERIFICATION', desc: 'Constituency & roll' },
    { num: '03', title: 'SECURITY', desc: 'Credentials & pass' },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-sand">
      <div className="max-w-5xl w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-2.5 rounded-2xl bg-warmwhite border border-sandstone text-burgundy mb-1 shadow-subtle">
            {accountType === 'VOTER' ? <UserPlus className="w-5 h-5 text-burgundy" /> : <Shield className="w-5 h-5 text-terracotta" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            {accountType === 'VOTER' ? 'Citizen Voter Registration' : 'Election Authority Registration'}
          </h1>
          <p className="text-xs text-warmgray max-w-sm mx-auto">
            {accountType === 'VOTER'
              ? 'Create your verified voter profile for secure remote digital voting'
              : 'Register an official authority account for electoral supervision'}
          </p>
        </div>

        {/* Account Mode Switcher (Voter vs Authority) */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-sand/70 rounded-2xl border border-sandstone text-xs font-semibold max-w-md mx-auto">
          <button
            type="button"
            onClick={() => { setAccountType('VOTER'); setStep(1); setErrorMessage(''); }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              accountType === 'VOTER'
                ? 'bg-warmwhite text-burgundy shadow-subtle border border-sandstone font-bold'
                : 'text-warmgray hover:text-charcoal'
            }`}
          >
            <User className="w-4 h-4 text-burgundy" />
            <span>Citizen Voter</span>
          </button>
          
          <button
            type="button"
            onClick={() => { setAccountType('ADMIN'); setStep(1); setErrorMessage(''); }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              accountType === 'ADMIN'
                ? 'bg-warmwhite text-terracotta shadow-subtle border border-sandstone font-bold'
                : 'text-warmgray hover:text-charcoal'
            }`}
          >
            <Shield className="w-4 h-4 text-terracotta" />
            <span>Election Official</span>
          </button>
        </div>

        {/* 3-Step Progress Indicator (For Voter Flow) */}
        {accountType === 'VOTER' && (
          <div className="p-4 bg-warmwhite rounded-2xl border border-sandstone shadow-subtle">
            <div className="grid grid-cols-3 gap-2">
              {stepsData.map((s, idx) => {
                const stepNum = idx + 1;
                const isCompleted = step > stepNum;
                const isCurrent = step === stepNum;

                return (
                  <div
                    key={s.num}
                    className={`p-3 rounded-xl border transition-all text-left ${
                      isCurrent
                        ? 'bg-burgundy/10 border-burgundy text-burgundy'
                        : isCompleted
                        ? 'bg-jade/10 border-jade/40 text-jade'
                        : 'bg-sand/40 border-sandstone text-warmgray'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold mb-0.5">
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 text-jade" />
                      ) : (
                        <span>{s.num}</span>
                      )}
                      <span>{s.title}</span>
                    </div>
                    <div className="text-[11px] opacity-80 hidden sm:block">{s.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content Grid: Form (Left/Main) + 3D Visual (Right on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Wizard Form Card */}
          <div className={accountType === 'VOTER' ? 'lg:col-span-7' : 'lg:col-span-12 max-w-2xl mx-auto w-full'}>
            <Card className="bg-warmwhite border-sandstone shadow-elevated p-6 sm:p-8 space-y-5">
              
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
                
                {/* ================= VOTER FLOW ================= */}
                {accountType === 'VOTER' && (
                  <>
                    {/* STEP 1: Personal Information */}
                    {step === 1 && (
                      <div className="space-y-4 animate-in fade-in duration-150">
                        <Input
                          label="Full Legal Name"
                          required
                          icon={User}
                          placeholder="e.g. Vikram Aditya Rao"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          helperText="Must match your official government ID or electoral record"
                        />

                        <Input
                          label="Email Address"
                          type="email"
                          required
                          icon={Mail}
                          placeholder="voter@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          helperText="Used for authentication and remote voting notifications"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Input
                            label="Phone Number"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                          <Input
                            label="Date of Birth"
                            type="date"
                            required
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Registered Constituency & Relocation Location */}
                    {step === 2 && (
                      <div className="space-y-4 animate-in fade-in duration-150">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-charcoal tracking-wide">
                              Registered Home Constituency <span className="text-terracotta-red">*</span>
                            </label>
                            {constituenciesLoading && (
                              <span className="text-[11px] text-burgundy flex items-center gap-1 font-mono">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Loading...</span>
                              </span>
                            )}
                          </div>

                          <select
                            value={formData.registeredConstituencyId}
                            onChange={handleConstituencyChange}
                            className="vr-input font-sans bg-warmwhite border-sandstone"
                          >
                            {constituencies.map(c => (
                              <option key={c._id} value={c._id}>
                                {c.name} ({c.code || 'PC'} · {c.state})
                              </option>
                            ))}
                          </select>
                          <p className="text-xs text-warmgray">
                            The parliamentary constituency where you are legally registered on the electoral roll.
                          </p>
                        </div>

                        <div className="pt-3 border-t border-sandstone space-y-3">
                          <div className="text-xs font-bold text-burgundy uppercase tracking-wider font-mono">
                            Declared Remote / Relocated Location
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input
                              label="Current City"
                              required
                              placeholder="e.g. Bengaluru"
                              value={formData.currentCity}
                              onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                            />
                            <Input
                              label="Current State"
                              required
                              placeholder="e.g. Karnataka"
                              value={formData.currentState}
                              onChange={(e) => setFormData({ ...formData, currentState: e.target.value })}
                            />
                          </div>

                          <Input
                            label="Occupation / Reason for Relocation"
                            placeholder="e.g. Software Engineer / University Student"
                            value={formData.occupation}
                            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                            helperText="Reason for residing away from registered home constituency"
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Security Credentials */}
                    {step === 3 && (
                      <div className="space-y-4 animate-in fade-in duration-150">
                        <div className="p-3.5 rounded-xl bg-sand/80 border border-sandstone flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 text-jade flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-charcoal">
                            <p className="font-bold text-burgundy">Synthetic Voter Identification</p>
                            <p className="text-warmgray mt-0.5">
                              Upon registration, you will be issued a cryptographic identifier (<code className="font-mono text-burgundy font-bold">VID-2026-XXXX</code>) to cast remote ballots.
                            </p>
                          </div>
                        </div>

                        <PasswordInput
                          label="Create Password"
                          required
                          placeholder="At least 6 characters"
                          showStrengthMeter={true}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        <PasswordInput
                          label="Confirm Password"
                          required
                          placeholder="Re-enter your password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                      </div>
                    )}

                    {/* Wizard Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-sandstone">
                      {step > 1 ? (
                        <Button
                          type="button"
                          variant="secondary"
                          size="md"
                          onClick={handleBack}
                          icon={ArrowLeft}
                          iconPosition="left"
                        >
                          Back
                        </Button>
                      ) : <div />}

                      {step < 3 ? (
                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                          onClick={handleNext}
                          icon={ArrowRight}
                          iconPosition="right"
                          className="bg-burgundy hover:bg-burgundy-deep text-warmwhite font-bold"
                        >
                          Continue
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                          isLoading={loading}
                          icon={CheckCircle2}
                          iconPosition="right"
                          className="bg-burgundy hover:bg-burgundy-deep text-warmwhite font-bold"
                        >
                          Complete Registration
                        </Button>
                      )}
                    </div>
                  </>
                )}

                {/* ================= AUTHORITY REGISTRATION FLOW ================= */}
                {accountType === 'ADMIN' && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="p-3.5 rounded-xl bg-sand/80 border border-sandstone text-charcoal text-xs space-y-1">
                      <div className="font-bold flex items-center gap-1.5 font-mono text-terracotta">
                        <KeyRound className="w-4 h-4" />
                        <span>AUTHORITY SECURITY PASSCODE</span>
                      </div>
                      <p className="text-warmgray text-xs">
                        Evaluation passcode: <code className="font-mono font-bold bg-warmwhite px-1.5 py-0.5 rounded text-burgundy border border-sandstone">ADMIN2026</code>
                      </p>
                    </div>

                    <Input
                      label="Official Full Name & Title"
                      required
                      icon={User}
                      placeholder="e.g. Smt. Radhika Krishnan (Election Authority)"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />

                    <Input
                      label="Official Authority Email"
                      type="email"
                      required
                      icon={Mail}
                      placeholder="admin@voteremote.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <Input
                      label="Authority Security Passcode"
                      required
                      icon={KeyRound}
                      placeholder="ADMIN2026"
                      value={formData.authorityPasscode}
                      onChange={(e) => setFormData({ ...formData, authorityPasscode: e.target.value })}
                      className="font-mono text-terracotta font-bold"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <PasswordInput
                        label="Password"
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <PasswordInput
                        label="Confirm Password"
                        required
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>

                    <div className="pt-3 border-t border-sandstone">
                      <Button
                        type="submit"
                        variant="terracotta"
                        size="md"
                        className="w-full font-bold"
                        isLoading={loading}
                        icon={Shield}
                        iconPosition="left"
                      >
                        Register as Election Authority
                      </Button>
                    </div>
                  </div>
                )}

              </form>

            </Card>
          </div>

          {/* Right/Bottom 3D Identity Visual */}
          {accountType === 'VOTER' && (
            <div className="lg:col-span-5 flex items-center justify-center">
              <Register3DVisual />
            </div>
          )}

        </div>

        {/* Existing Account Footer */}
        <div className="text-center text-xs text-warmgray">
          Already registered?{' '}
          <Link to="/login" className="text-burgundy hover:text-burgundy-deep font-bold underline">
            Sign in to your account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;

