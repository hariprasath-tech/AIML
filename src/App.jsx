import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LiveCameraFeed from './components/LiveCameraFeed';
import ShopperAnalytics from './components/ShopperAnalytics';
import InventoryMonitor from './components/InventoryMonitor';
import QueueMonitor from './components/QueueMonitor';
import AlertsFeed from './components/AlertsFeed';
import PrivacyConfig from './components/PrivacyConfig';
import { Camera, BarChart3, ShoppingBag, Users, Bell, Shield, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('live-feed');
  const [selectedStore, setSelectedStore] = useState('store-101');
  const [activeCamera, setActiveCamera] = useState('cam-1');
  
  // Real-time Telemetry State
  const [fps, setFps] = useState(34.2);
  const [latency, setLatency] = useState(14.8);
  const [shoppersCount, setShoppersCount] = useState(34);
  const [queueLength, setQueueLength] = useState(6);

  // Initial Simulated Shelf Data
  const [shelfData, setShelfData] = useState([
    { id: 'S1', name: 'Fresh Organic Milk 1L', sku: 'SKU-8821', location: 'Dairy Aisle A1', status: 'LOW STOCK', fillPercent: 18, camera: 'CAM-03', confidence: 96.4 },
    { id: 'S2', name: 'Artisan Whole Wheat Bread', sku: 'SKU-1049', location: 'Bakery Rack B3', status: 'OUT OF STOCK', fillPercent: 0, camera: 'CAM-03', confidence: 99.1 },
    { id: 'S3', name: 'Greek Yogurt 500g', sku: 'SKU-4402', location: 'Chilled Section C2', status: 'FULL', fillPercent: 88, camera: 'CAM-03', confidence: 97.8 },
    { id: 'S4', name: 'Natural Mineral Water 1.5L', sku: 'SKU-9901', location: 'Beverage Rack D1', status: 'FULL', fillPercent: 94, camera: 'CAM-04', confidence: 98.2 },
  ]);

  // Initial Simulated Queue Data
  const [queueData, setQueueData] = useState([
    { id: 'Q1', name: 'Billing Counter #1', count: 6, waitTime: 4.5, threshold: 5 },
    { id: 'Q2', name: 'Express Checkout #2', count: 2, waitTime: 1.2, threshold: 5 },
    { id: 'Q3', name: 'Self-Checkout Kiosk', count: 1, waitTime: 0.5, threshold: 4 },
  ]);

  // Simulated Alert Stream
  const [alerts, setAlerts] = useState([
    { id: 1, title: 'Shelf Stock-Out Detected', description: 'Artisan Whole Wheat Bread on Bakery Rack B3 reached 0% inventory level.', severity: 'HIGH', timestamp: '15:28:10' },
    { id: 2, title: 'Queue Congestion Warning', description: 'Billing Counter #1 exceeded threshold (6 persons in queue).', severity: 'WARNING', timestamp: '15:25:44' },
    { id: 3, title: 'AI Edge Node Synced', description: 'Camera 01 & Camera 02 ONNX inference latency stable at 14.8ms.', severity: 'INFO', timestamp: '15:20:00' },
  ]);

  // Hourly Footfall Data for Recharts
  const footfallData = [
    { time: '09:00', count: 120 },
    { time: '10:00', count: 240 },
    { time: '11:00', count: 380 },
    { time: '12:00', count: 510 },
    { time: '13:00', count: 420 },
    { time: '14:00', count: 360 },
    { time: '15:00', count: 480 },
    { time: '16:00', count: 610 },
  ];

  const dwellTimeData = [
    { zone: 'Dairy & Milk', minutes: 8.4 },
    { zone: 'Bakery', minutes: 5.2 },
    { zone: 'Fresh Produce', minutes: 7.1 },
    { zone: 'Snacks & Soda', minutes: 4.8 },
    { zone: 'Electronics', minutes: 11.3 },
  ];

  const zoneHeatmap = [
    { name: 'Entrance & Lobby', intensity: 88, shoppers: 14 },
    { name: 'Dairy & Chilled', intensity: 92, shoppers: 11 },
    { name: 'Bakery Rack', intensity: 45, shoppers: 5 },
    { name: 'Billing Queue 1', intensity: 78, shoppers: 6 },
    { name: 'Checkout Express', intensity: 30, shoppers: 2 },
  ];

  const queueForecast = [
    { time: '15:00', actual: 4, predicted: 4 },
    { time: '15:05', actual: 5, predicted: 5 },
    { time: '15:10', actual: 6, predicted: 6 },
    { time: '15:15', actual: null, predicted: 8 },
    { time: '15:20', actual: null, predicted: 9 },
    { time: '15:25', actual: null, predicted: 5 },
  ];

  // Simulation Interval to simulate real-time edge telemetry jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(32 + Math.random() * 5);
      setLatency(13.5 + Math.random() * 3);
      setShoppersCount(prev => Math.max(15, Math.min(60, prev + Math.floor(Math.random() * 3) - 1)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledgeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleClearAllAlerts = () => {
    setAlerts([]);
  };

  const handleTriggerRestock = (shelfId) => {
    setShelfData(prev => prev.map(s => {
      if (s.id === shelfId) {
        return { ...s, status: 'REPLENISHING', fillPercent: 40 };
      }
      return s;
    }));
    setAlerts(prev => [
      {
        id: Date.now(),
        title: 'Restock Request Dispatched',
        description: `Automated replenishment order sent to store inventory manager.`,
        severity: 'INFO',
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
  };

  const handleOpenNewCounter = (queueName) => {
    setQueueData(prev => prev.map(q => {
      if (q.name === queueName) {
        return { ...q, count: Math.max(2, q.count - 3), waitTime: 1.5 };
      }
      return q;
    }));
    setAlerts(prev => [
      {
        id: Date.now(),
        title: 'Extra Cash Counter Dispatched',
        description: `Counter #4 opened dynamically to alleviate queue congestion on ${queueName}.`,
        severity: 'INFO',
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
  };

  const handleResetDemo = () => {
    setShoppersCount(34);
    setQueueLength(6);
    setShelfData([
      { id: 'S1', name: 'Fresh Organic Milk 1L', sku: 'SKU-8821', location: 'Dairy Aisle A1', status: 'LOW STOCK', fillPercent: 18, camera: 'CAM-03', confidence: 96.4 },
      { id: 'S2', name: 'Artisan Whole Wheat Bread', sku: 'SKU-1049', location: 'Bakery Rack B3', status: 'OUT OF STOCK', fillPercent: 0, camera: 'CAM-03', confidence: 99.1 },
      { id: 'S3', name: 'Greek Yogurt 500g', sku: 'SKU-4402', location: 'Chilled Section C2', status: 'FULL', fillPercent: 88, camera: 'CAM-03', confidence: 97.8 },
      { id: 'S4', name: 'Natural Mineral Water 1.5L', sku: 'SKU-9901', location: 'Beverage Rack D1', status: 'FULL', fillPercent: 94, camera: 'CAM-04', confidence: 98.2 },
    ]);
  };

  return (
    <div className="app-container">
      {/* Header Bar */}
      <Header
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        fps={fps}
        latency={latency}
        unreadAlertsCount={alerts.length}
        onResetDemo={handleResetDemo}
      />

      {/* Main Navigation Tabs */}
      <nav className="nav-tabs-container">
        <button
          className={`nav-tab ${activeTab === 'live-feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('live-feed')}
        >
          <Camera size={16} />
          <span>Live AI Camera Feed</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={16} />
          <span>Shopper Analytics & Heatmap</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <ShoppingBag size={16} />
          <span>Shelf Inventory Visibility</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveTab('queue')}
        >
          <Users size={16} />
          <span>Queue Management & Forecast</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <Bell size={16} />
          <span>Alerts & Incident Log ({alerts.length})</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          <Shield size={16} />
          <span>Privacy & Edge Specs</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-content">
        {activeTab === 'live-feed' && (
          <LiveCameraFeed
            activeCamera={activeCamera}
            setActiveCamera={setActiveCamera}
            shoppersCount={shoppersCount}
            queueLength={queueLength}
            shelfStatus={shelfData}
          />
        )}

        {activeTab === 'analytics' && (
          <ShopperAnalytics
            footfallData={footfallData}
            dwellTimeData={dwellTimeData}
            zoneHeatmap={zoneHeatmap}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryMonitor
            shelfData={shelfData}
            onTriggerRestock={handleTriggerRestock}
          />
        )}

        {activeTab === 'queue' && (
          <QueueMonitor
            queueData={queueData}
            forecastData={queueForecast}
            onOpenNewCounter={handleOpenNewCounter}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsFeed
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onClearAllAlerts={handleClearAllAlerts}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyConfig
            fps={fps}
            latency={latency}
          />
        )}
      </main>
    </div>
  );
}
