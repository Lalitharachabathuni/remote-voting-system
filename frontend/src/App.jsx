import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VoterDashboard from './pages/VoterDashboard';
import ElectionDetailsPage from './pages/ElectionDetailsPage';
import VotingFlow from './pages/VotingFlow';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { LoadingSpinner } from './components/ui/Feedback';

// Automatic Scroll to Top or Hash Target on Route Change
const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-sand">
        <LoadingSpinner size="lg" label="Authenticating session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/voter/dashboard" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-sand text-charcoal selection:bg-burgundy/20 selection:text-burgundy">
      <ScrollToHash />
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Core Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          
          {/* Voter Protected Routes */}
          <Route 
            path="/voter/dashboard" 
            element={
              <ProtectedRoute>
                <VoterDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/voter/elections" 
            element={
              <ProtectedRoute>
                <VoterDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/voter/elections/:electionId" 
            element={
              <ProtectedRoute>
                <ElectionDetailsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/voter/elections/:electionId/vote" 
            element={
              <ProtectedRoute>
                <VotingFlow />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/voter/elections/:electionId/success" 
            element={
              <ProtectedRoute>
                <VotingFlow />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/voter/vote/:electionId" 
            element={
              <ProtectedRoute>
                <VotingFlow />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/voter/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/voter/security" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/elections" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/candidates" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/voters" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/results" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/audit" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback Aliases & 404 */}
          <Route path="/profile" element={<Navigate to="/voter/profile" replace />} />
          <Route path="/dashboard" element={<Navigate to="/voter/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

