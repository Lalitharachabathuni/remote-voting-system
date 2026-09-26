import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  LogOut, 
  Menu, 
  X, 
  User,
  LayoutDashboard,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import Logo from './ui/Logo';
import DemoSwitcher from './DemoSwitcher';

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Overview', path: '/' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Security', path: '/#security' },
    { name: 'FAQ', path: '/#faq' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sandstone bg-warmwhite/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex-shrink-0" onClick={() => setMobileMenuOpen(false)}>
            <Logo size="md" subtitle="Secure Digital Voting Platform" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'text-burgundy bg-sand border border-sandstone font-bold'
                    : 'text-charcoal hover:text-burgundy hover:bg-sand/60'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Authenticated Links */}
            {isAuthenticated && (
              <Link
                to={isAdmin ? '/admin' : '/voter/dashboard'}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive(isAdmin ? '/admin' : '/voter/dashboard')
                    ? 'text-burgundy bg-burgundy/10 border border-burgundy/30 font-bold'
                    : 'text-charcoal hover:text-burgundy hover:bg-sand/60'
                }`}
              >
                {isAdmin ? <Shield className="w-3.5 h-3.5 text-terracotta" /> : <LayoutDashboard className="w-3.5 h-3.5 text-jade" />}
                <span>{isAdmin ? 'Authority Portal' : 'Voter Dashboard'}</span>
              </Link>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Demo Switcher */}
            <DemoSwitcher />

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl bg-warmwhite border border-sandstone hover:bg-sand-100 transition-colors focus:outline-none focus:ring-2 focus:ring-burgundy shadow-subtle"
                >
                  <div className="w-6 h-6 rounded-full bg-burgundy text-warmwhite flex items-center justify-center font-bold text-xs">
                    {user?.fullName ? user.fullName.charAt(0) : 'U'}
                  </div>
                  <div className="text-left text-xs leading-none">
                    <span className="font-bold text-charcoal block truncate max-w-[120px]">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] text-warmgray font-mono">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-warmgray" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-warmwhite border border-sandstone p-1.5 shadow-elevated z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-2 border-b border-sandstone mb-1">
                        <p className="text-xs font-bold text-charcoal truncate">{user.fullName}</p>
                        <p className="text-[11px] text-warmgray truncate">{user.email}</p>
                      </div>

                      <Link
                        to={isAdmin ? '/admin' : '/voter/dashboard'}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-charcoal hover:bg-sand-100 rounded-lg transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-jade" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        to="/voter/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-charcoal hover:bg-sand-100 rounded-lg transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-terracotta" />
                        <span>My Profile</span>
                      </Link>

                      <div className="border-t border-sandstone my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-terracotta-red hover:bg-terracotta-50 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-charcoal hover:text-burgundy hover:bg-sand-100 rounded-xl border border-sandstone transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-semibold text-warmwhite bg-burgundy hover:bg-burgundy-700 rounded-xl shadow-card transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <DemoSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-charcoal hover:bg-sand-100 border border-sandstone"
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-sandstone bg-warmwhite px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-charcoal hover:bg-sand-100 rounded-xl"
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/voter/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-bold text-burgundy hover:bg-sand-100 rounded-xl"
                >
                  {isAdmin ? 'Authority Portal' : 'Voter Dashboard'}
                </Link>
                <Link
                  to="/voter/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-charcoal hover:bg-sand-100 rounded-xl"
                >
                  Voter Profile
                </Link>
              </>
            )}
          </nav>

          <div className="pt-3 border-t border-sandstone">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-xs font-bold text-charcoal">{user.fullName}</p>
                  <p className="text-[11px] text-warmgray">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-3 text-xs text-center text-terracotta-red font-semibold bg-terracotta-50 border border-terracotta-200 rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-semibold text-charcoal bg-sand-100 border border-sandstone rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-semibold text-warmwhite bg-burgundy rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
