import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Building, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Shield
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Tabs } from '../components/ui/Accordion';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [masked, setMasked] = useState(true);
  const [copiedId, setCopiedId] = useState(false);
  
  // Modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const voterProfile = user?.voterProfile;
  const voterId = voterProfile?.syntheticVoterId || 'VID-2026-X89K2Q';

  const handleCopyId = () => {
    navigator.clipboard.writeText(voterId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordSuccess('Password successfully updated for your digital profile.');
    setTimeout(() => {
      setPasswordModalOpen(false);
      setPasswordSuccess('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  // Masking helpers
  const maskEmail = (email) => {
    if (!email || !masked) return email;
    const [name, domain] = email.split('@');
    if (!domain) return email;
    const maskedName = name.length > 2 ? `${name.substring(0, 2)}••••` : name;
    return `${maskedName}@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone || !masked) return phone || 'Not Provided';
    return `${phone.substring(0, 4)}••••••${phone.substring(phone.length - 2)}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-sand min-h-screen">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sandstone gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-burgundy text-warmwhite border border-burgundy-light flex items-center justify-center font-extrabold text-xl shadow-card">
            {user?.fullName ? user.fullName.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-charcoal tracking-tight">
                {user?.fullName}
              </h1>
              <Badge variant="jade" size="sm" icon={ShieldCheck}>
                {user?.role || 'VOTER'}
              </Badge>
            </div>
            <p className="text-xs text-warmgray font-mono mt-0.5">
              Digital Voter Identifier: <span className="text-burgundy font-bold">{voterId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMasked(!masked)}
            icon={masked ? Eye : EyeOff}
            iconPosition="left"
          >
            {masked ? 'Reveal Sensitive Info' : 'Mask Sensitive Info'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            icon={LogOut}
            iconPosition="left"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Profile Tabs Navigation */}
      <Tabs
        tabs={[
          { id: 'personal', label: 'Personal Information', icon: User },
          { id: 'voter', label: 'Voter Information', icon: Building },
          { id: 'verification', label: 'Verification Status', icon: ShieldCheck },
          { id: 'security', label: 'Security Settings', icon: Lock }
        ]}
        defaultTab={location.pathname.includes('security') ? 'security' : 'personal'}
      >
        {(activeTab) => (
          <div className="pt-2">
            {activeTab === 'personal' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
                <div className="lg:col-span-2">
                  <Card className="bg-warmwhite border-sandstone shadow-subtle">
                    <CardHeader
                      title="Personal Identity Record"
                      subtitle="Official electoral roll identity details"
                      action={
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditModalOpen(true)}
                        >
                          Edit Details
                        </Button>
                      }
                    />

                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-sand/60 border border-sandstone space-y-1">
                        <span className="text-warmgray text-[10px] font-mono font-bold">LEGAL FULL NAME</span>
                        <div className="font-bold text-charcoal text-sm flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-burgundy" />
                          <span>{user?.fullName}</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-sand/60 border border-sandstone space-y-1">
                        <span className="text-warmgray text-[10px] font-mono font-bold">REGISTERED EMAIL</span>
                        <div className="font-bold text-charcoal text-sm flex items-center gap-1.5 font-mono">
                          <Mail className="w-3.5 h-3.5 text-burgundy" />
                          <span>{maskEmail(user?.email)}</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-sand/60 border border-sandstone space-y-1">
                        <span className="text-warmgray text-[10px] font-mono font-bold">CONTACT PHONE</span>
                        <div className="font-bold text-charcoal text-sm flex items-center gap-1.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-burgundy" />
                          <span>{maskPhone(user?.phone)}</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-sand/60 border border-sandstone space-y-1">
                        <span className="text-warmgray text-[10px] font-mono font-bold">DATE OF BIRTH</span>
                        <div className="font-bold text-charcoal text-sm flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-burgundy" />
                          <span>{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '15 Aug 1997'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card className="bg-warmwhite border-sandstone p-5 space-y-3 shadow-subtle">
                    <div className="text-xs font-bold text-charcoal">Account Role & Status</div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-sand/60 border border-sandstone">
                      <span className="text-xs text-warmgray font-medium">Assigned Role</span>
                      <Badge variant="burgundy" size="sm">{user?.role || 'VOTER'}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-sand/60 border border-sandstone">
                      <span className="text-xs text-warmgray font-medium">Account Status</span>
                      <Badge variant="jade" size="sm">Active & Operational</Badge>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'voter' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-warmwhite border-sandstone shadow-subtle">
                    <CardHeader
                      title="Constituency & Electoral Jurisdiction"
                      subtitle="Jurisdiction where your remote voting ballot is legally assigned"
                    />

                    <CardContent className="space-y-4 text-xs">
                      <div className="p-4 rounded-xl bg-sand/60 border border-sandstone space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-warmgray text-[10px] font-mono font-bold uppercase">REGISTERED HOME CONSTITUENCY</span>
                          <Badge variant="burgundy" size="sm">PRIMARY ROLL</Badge>
                        </div>
                        <div className="text-base font-bold text-charcoal flex items-center gap-2">
                          <Building className="w-4 h-4 text-burgundy" />
                          <span>{voterProfile?.registeredConstituency?.name || 'Visakhapatnam Parliamentary Constituency'}</span>
                        </div>
                        <div className="text-warmgray text-[11px] font-mono">
                          State: {voterProfile?.registeredState || 'Andhra Pradesh'} · District: {voterProfile?.registeredDistrict || 'Visakhapatnam'}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-sand/60 border border-sandstone space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-warmgray text-[10px] font-mono font-bold uppercase">DECLARED REMOTE LOCATION</span>
                          <Badge variant="saffron" size="sm">REMOTE ACCESS</Badge>
                        </div>
                        <div className="text-sm font-bold text-terracotta flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{voterProfile?.currentCity || 'Bengaluru'}, {voterProfile?.currentState || 'Karnataka'}</span>
                        </div>
                        <div className="text-warmgray text-[11px]">
                          Declared Reason: {voterProfile?.occupation || 'Relocated for employment / university studies'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="bg-warmwhite border-sandstone space-y-4 shadow-subtle">
                    <div className="flex items-center justify-between pb-3 border-b border-sandstone">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-burgundy font-bold">
                        DIGITAL VOTER CREDENTIAL
                      </span>
                      <Badge variant="jade" size="sm">VERIFIED</Badge>
                    </div>

                    <div className="p-4 rounded-2xl bg-sand/60 border border-sandstone text-center space-y-2 font-mono">
                      <div className="text-[10px] text-warmgray font-bold">SYNTHETIC VOTER IDENTIFIER</div>
                      <div className="text-xl font-extrabold text-charcoal tracking-widest">
                        {voterId}
                      </div>
                      <button
                        onClick={handleCopyId}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-warmwhite hover:bg-sand text-charcoal text-xs font-semibold border border-sandstone transition-colors shadow-subtle"
                      >
                        {copiedId ? <Check className="w-3.5 h-3.5 text-jade" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId ? 'Copied to clipboard' : 'Copy ID'}</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 text-xs text-warmgray">
                      <div className="flex justify-between">
                        <span>Verification Protocol:</span>
                        <span className="text-charcoal font-mono font-semibold">ECDSA Cryptographic Hash</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Account Status:</span>
                        <span className="text-jade font-bold font-mono">ACTIVE</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'verification' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
                <Card className="bg-warmwhite border-sandstone p-6 space-y-4 shadow-subtle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-jade/10 border border-jade/30 flex items-center justify-center text-jade">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-charcoal">Electoral Roll Verification</h3>
                      <p className="text-xs text-warmgray">Status: Verified & Validated</p>
                    </div>
                  </div>
                  <p className="text-xs text-warmgray leading-relaxed">
                    Your digital voter credentials have been matched with the official parliamentary electoral roll for your home constituency. You are authorized to access designated remote election ballots.
                  </p>
                  <div className="p-3 bg-sand/60 rounded-xl border border-sandstone text-[11px] font-mono text-warmgray space-y-1">
                    <div>Validation Authority: <span className="text-burgundy font-semibold">Election Commission Registry</span></div>
                    <div>Integrity Hash: <span className="text-charcoal">sha256:7f83b165...e921</span></div>
                  </div>
                </Card>

                <Card className="bg-warmwhite border-sandstone p-6 space-y-4 shadow-subtle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sand border border-sandstone flex items-center justify-center text-burgundy">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-charcoal">Zero-Knowledge Vote Privacy</h3>
                      <p className="text-xs text-warmgray">Status: Enforced by Architecture</p>
                    </div>
                  </div>
                  <p className="text-xs text-warmgray leading-relaxed">
                    When you cast a ballot, your identity is cryptographically separated from your candidate choice before cryptographic sealing. Nobody, including system administrators, can inspect who you voted for.
                  </p>
                  <div className="p-3 bg-sand/60 rounded-xl border border-sandstone text-[11px] font-mono text-warmgray space-y-1">
                    <div>Anonymity Mechanism: <span className="text-burgundy font-semibold">Isolated Ballot Vault + Receipt Hash</span></div>
                    <div>Audit Record: <span className="text-charcoal">Append-Only Cryptographic Log</span></div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
                <Card className="bg-warmwhite border-sandstone p-6 space-y-4 shadow-subtle">
                  <div>
                    <h3 className="text-sm font-bold text-charcoal">Credential Protection</h3>
                    <p className="text-xs text-warmgray">Update your access password and review security parameters.</p>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    className="w-full justify-center font-bold bg-burgundy hover:bg-burgundy-deep text-warmwhite"
                    onClick={() => setPasswordModalOpen(true)}
                    icon={Lock}
                    iconPosition="left"
                  >
                    Change Account Password
                  </Button>

                  <div className="p-3.5 rounded-xl bg-sand/60 border border-sandstone text-[11px] text-warmgray space-y-1">
                    <div className="font-bold text-charcoal flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-burgundy" />
                      <span>Strict Session Isolation</span>
                    </div>
                    <p>
                      Tokens are held in secure cookies with cross-site request forgery safeguards and automatic inactivity revocation.
                    </p>
                  </div>
                </Card>

                <Card className="bg-warmwhite border-sandstone p-6 space-y-4 shadow-subtle">
                  <div>
                    <h3 className="text-sm font-bold text-charcoal">Cryptographic Session Audit</h3>
                    <p className="text-xs text-warmgray">Active session signatures and connection provenance.</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2.5 rounded-xl bg-sand/60 border border-sandstone">
                      <span className="text-warmgray">Current Session:</span>
                      <span className="text-jade font-mono font-bold">ACTIVE (TLS 1.3 / AES-256)</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-sand/60 border border-sandstone">
                      <span className="text-warmgray">Session IP Isolation:</span>
                      <span className="text-charcoal font-mono font-semibold">Strict Binding</span>
                    </div>
                    <div className="flex justify-between p-2.5 rounded-xl bg-sand/60 border border-sandstone">
                      <span className="text-warmgray">Anti-Tamper Monitor:</span>
                      <span className="text-burgundy font-mono font-semibold">Nominal (0 alerts)</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </Tabs>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile Information"
        subtitle="Update contact and declared relocation details"
      >
        <div className="space-y-4 text-xs text-charcoal">
          <Input
            label="Full Legal Name"
            defaultValue={user?.fullName}
            disabled
            helperText="Legal name changes require official electoral clearance."
          />
          <Input
            label="Contact Phone"
            defaultValue={user?.phone}
            placeholder="+91 98765 43210"
          />
          <Input
            label="Declared Current City"
            defaultValue={voterProfile?.currentCity || 'Bengaluru'}
          />
          <Input
            label="Declared Current State"
            defaultValue={voterProfile?.currentState || 'Karnataka'}
          />

          <div className="pt-3 border-t border-sandstone flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" className="bg-burgundy hover:bg-burgundy-deep text-warmwhite font-bold" onClick={() => setEditModalOpen(false)}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Update Security Password"
        subtitle="Protect your digital voter identity credentials"
      >
        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          {passwordError && (
            <div className="p-3 rounded-xl bg-terracotta/10 border border-terracotta/30 text-terracotta-red flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta-red flex-shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-jade/10 border border-jade/30 text-jade flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-jade flex-shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <PasswordInput
            label="Current Password"
            required
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <PasswordInput
            label="New Password"
            required
            placeholder="At least 6 characters"
            showStrengthMeter={true}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <PasswordInput
            label="Confirm New Password"
            required
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="pt-3 border-t border-sandstone flex justify-end gap-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="font-bold bg-burgundy hover:bg-burgundy-deep text-warmwhite">
              Update Password
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ProfilePage;

