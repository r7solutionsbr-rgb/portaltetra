import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Login } from './pages/Login';
import { CompanyProfile } from './pages/settings/CompanyProfile';
import { Team } from './pages/settings/Team';

// Views
import { Dashboard } from './components/dashboard/Dashboard';
import { FinancialCenter } from './components/finance/FinancialCenter';
import { DeliveryAudit } from './components/audits/DeliveryAudit';
import { BotInteraction } from './components/bot/BotInteraction';
import { PaymentApproval } from './components/finance/PaymentApproval';
import { FleetManagement } from './components/fleet/FleetManagement';
import { PeopleManagement } from './components/people/PeopleManagement';
import { CustomerManagement } from './components/crm/CustomerManagement';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/finance" element={<FinancialCenter />} />
            <Route path="/audit" element={<DeliveryAudit />} />
            <Route path="/payment-approval" element={<PaymentApproval />} />
            <Route path="/fleet" element={<FleetManagement />} />
            <Route path="/people" element={<PeopleManagement />} />
            <Route path="/bot" element={<BotInteraction />} />
            <Route path="/crm" element={<CustomerManagement />} />

            {/* Settings Routes */}
            <Route path="/settings/company" element={<CompanyProfile />} />
            <Route path="/settings/team" element={<Team />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
