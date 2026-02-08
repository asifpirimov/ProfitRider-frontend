import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BillingProvider } from './context/BillingContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

import AddSession from './pages/AddSession';
import History from './pages/History';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import Billing from './pages/Billing';
import BillingSuccess from './pages/BillingSuccess';
import BillingCancel from './pages/BillingCancel';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import RefundPolicy from './pages/legal/RefundPolicy';
import Contact from './pages/legal/Contact';
import Security from './pages/legal/Security';

function App() {
  return (
    <AuthProvider>
      <BillingProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Legal Routes */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/contact-support" element={<Contact />} />
              <Route path="/security" element={<Security />} />

              {/* Protected Routes */}
              <Route path="/onboarding" element={
                <PrivateRoute>
                  <Onboarding />
                </PrivateRoute>
              } />

              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />

              <Route path="/add-session" element={
                <PrivateRoute>
                  <AddSession />
                </PrivateRoute>
              } />

              <Route path="/history" element={
                <PrivateRoute>
                  <History />
                </PrivateRoute>
              } />

              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />

              <Route path="/subscription" element={
                <PrivateRoute>
                  <Subscription />
                </PrivateRoute>
              } />

              <Route path="/billing" element={
                <PrivateRoute>
                  <Billing />
                </PrivateRoute>
              } />

              <Route path="/billing/success" element={
                <PrivateRoute>
                  <BillingSuccess />
                </PrivateRoute>
              } />

              <Route path="/billing/cancel" element={
                <PrivateRoute>
                  <BillingCancel />
                </PrivateRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </BillingProvider>
    </AuthProvider>
  );
}

export default App;
