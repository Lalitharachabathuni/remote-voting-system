import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  Vote, 
  LogOut, 
  Menu, 
  X, 
  User,
  ShieldCheck
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-dark-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Civic Platform Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-civic-cyan p-[1px] shadow-glow-cyan transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-dark-900 rounded-[11px] flex items-center justify-center">
                <Vote className="w-5 h-5 text-civic-cyan" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-brand-400 transition-colors">
                  VoteRemote
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded">
                  SECURE PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tighter">
                Digital Remote Voting System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                isActive('/') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Overview
            </Link>
            
            {isAuthenticated && (
              <Link 
                to="/voter/dashboard" 
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  isActive('/voter/dashboard') ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Voter Portal
              </Link>
            )}

            {/* If Authenticated as Admin */}
            {isAuthenticated && isAdmin && (
              <Link 
                to="/admin" 
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center space-x-1.5 ${
                  isActive('/admin') ? 'text-civic-cyan bg-civic-cyan/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-civic-cyan" />
                <span>Election Authority</span>
              </Link>
            )}

            {/* Direct Admin Access Link when not logged in */}
            {!isAuthenticated && (
              <Link 
                to="/login" 
                className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-civic-cyan hover:bg-white/5 rounded-lg transition-colors flex items-center space-x-1"
                title="Election Authority Portal Login"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-civic-cyan" />
                <span>Authority Login</span>
              </Link>
            )}
          </nav>

          {/* Right Action / Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-white/10">
                <div className="text-right">
                  <div className="text-xs font-semibold text-white leading-none">
                    {user.fullName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {user.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-civic-rose hover:bg-civic-rose/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 rounded-lg shadow-sm transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-dark-900/95 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-lg"
          >
            Platform Overview
          </Link>
          {isAuthenticated && (
            <Link
              to="/voter/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Voter Portal
            </Link>
          )}
          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-civic-cyan hover:bg-white/5 rounded-lg"
            >
              Election Authority Dashboard
            </Link>
          )}
          {!isAuthenticated && (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-civic-cyan hover:bg-white/5 rounded-lg"
            >
              Election Authority Login
            </Link>
          )}
          
          <div className="pt-3 border-t border-white/10">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full py-2 text-xs text-center text-civic-rose font-medium bg-civic-rose/10 rounded-lg"
              >
                Sign Out ({user.fullName})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-medium text-slate-200 bg-white/10 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center text-xs font-semibold text-white bg-brand-600 rounded-lg"
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
