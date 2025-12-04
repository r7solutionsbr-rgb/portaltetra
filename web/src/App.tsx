import React, { useState, useEffect } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { FinancialCenter } from './components/finance/FinancialCenter';
import { DeliveryAudit } from './components/audits/DeliveryAudit';
import { BotInteraction } from './components/bot/BotInteraction';
import { PaymentApproval } from './components/finance/PaymentApproval';
import { FleetManagement } from './components/fleet/FleetManagement';
import { PeopleManagement } from './components/people/PeopleManagement';
import { CustomerManagement } from './components/crm/CustomerManagement';
import { View, NAV_ITEMS } from './constants';

const AppContent: React.FC = () => {
  const { user } = useUser();
  const [view, setView] = useState<View>('dashboard');

  useEffect(() => {
    // When role changes, check if the current view is still accessible.
    // If not, switch to the first accessible view.
    const currentViewAccessible = NAV_ITEMS.find(item => item.view === view)?.roles.includes(user.role);

    if (!currentViewAccessible) {
      const firstAccessibleView = NAV_ITEMS.find(item => item.roles.includes(user.role));
      if (firstAccessibleView) {
        setView(firstAccessibleView.view);
      }
    }
  }, [user.role, view]);


  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard />;
      case 'finance':
        return <FinancialCenter />;
      case 'audit':
        return <DeliveryAudit />;
      case 'payment-approval':
        return <PaymentApproval />;
      case 'fleet':
        return <FleetManagement />;
      case 'people':
        return <PeopleManagement />;
      case 'bot':
        return <BotInteraction />;
      case 'crm':
        return <CustomerManagement />;
      default:
        const firstAccessibleView = NAV_ITEMS.find(item => item.roles.includes(user.role));
        return firstAccessibleView?.view === 'dashboard' ? <Dashboard /> : <CustomerManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar currentView={view} setView={setView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
