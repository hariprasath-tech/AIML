import React, { useState } from 'react';
import { AppContextProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import ShopperAnalytics from './components/ShopperAnalytics';
import InventoryMonitor from './components/InventoryMonitor';
import QueueMonitor from './components/QueueMonitor';
import AlertsFeed from './components/AlertsFeed';
import Settings from './components/Settings';
import './styles/dashboard.css';

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onNavigate={setActiveTab} />;
      case 'analytics':
        return <ShopperAnalytics />;
      case 'inventory':
        return <InventoryMonitor />;
      case 'queue':
        return <QueueMonitor />;
      case 'alerts':
        return <AlertsFeed />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview onNavigate={setActiveTab} />;
    }
  };

  const tabTitles = {
    dashboard: { title: 'Store Intelligence Overview', desc: 'Real-time AI telemetry, footfall metrics, shelf stock and queue monitoring' },
    analytics: { title: 'Shopper Behaviour & Footfall Analytics', desc: 'Entry/exit tracking, zone dwell time distribution and floor heatmaps' },
    inventory: { title: 'Shelf Stock & Inventory Visibility', desc: 'Real-time shelf status detection (FULL / LOW / OUT) and restock triggers' },
    queue: { title: 'Billing Queue & Congestion Management', desc: 'Counter wait-time monitoring, 15-minute AI congestion forecast & smart open recommendations' },
    alerts: { title: 'AI Operational Alerts Feed', desc: 'Severity-filtered notifications for long queues, stock-outs and camera streams' },
    settings: { title: 'System & Edge AI Settings', desc: 'Configure detection thresholds, notification channels and connected cameras' }
  };

  const currentHeader = tabTitles[activeTab] || tabTitles.dashboard;

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-wrapper">
        <Header />
        
        <main className="page-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">{currentHeader.title}</h1>
              <p className="page-description">{currentHeader.desc}</p>
            </div>
          </div>

          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppContextProvider>
      <MainContent />
    </AppContextProvider>
  );
}

export default App;
