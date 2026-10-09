import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export const AppContext = createContext();

export const API_BASE = window.location.hostname ? `http://${window.location.hostname}:8000` : 'http://127.0.0.1:8000';
export const WS_BASE = window.location.hostname ? `ws://${window.location.hostname}:8000` : 'ws://127.0.0.1:8000';

// Fallback Model Metrics (if backend offline during initial load)
const FALLBACK_MODEL_METRICS = {
  queue_wait_regression: { test_mae: 0.316, test_rmse: 0.833, baseline_mae: 3.396, baseline_rmse: 4.575 },
  queue_congestion_classification: { test_accuracy: 0.961, test_macro_f1: 0.957, baseline_accuracy: 0.450, baseline_macro_f1: 0.207 },
  shelf_status_classification: { test_accuracy: 0.993, test_macro_f1: 0.990, baseline_accuracy: 0.623, baseline_macro_f1: 0.256 },
  footfall_forecast_regression: { test_mae: 3.192, test_rmse: 4.523, baseline_mae: 7.487, baseline_rmse: 11.544 },
  metadata: { split_ratio: "70/15/15 Time Split (Chronological, No Shuffle)", synthetic_data_note: "Trained on synthetic data" }
};

export const AppProvider = ({ children }) => {
  // Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('retail_user');
    return saved ? JSON.parse(saved) : { username: 'admin', full_name: 'Store Operations Manager', role: 'admin' };
  });

  // Navigation & Settings
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStore, setSelectedStore] = useState('Supermarket Flagship #1');
  const [faceBlurEnabled, setFaceBlurEnabled] = useState(true);
  const [queueCapacityThreshold, setQueueCapacityThreshold] = useState(3);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // WebSocket Live Connection State
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // ML Model Metrics
  const [modelMetrics, setModelMetrics] = useState(FALLBACK_MODEL_METRICS);

  // KPIs
  const [kpiMetrics, setKpiMetrics] = useState({
    activeShoppers: 38,
    totalFootfallToday: 540,
    avgDwellTimeMins: 7.4,
    avgQueueWaitMins: 3.2,
    stockOutsCount: 2,
    footfallTrend: 14.2,
    dwellTrend: -1.8,
    queueWaitTrend: -0.5,
    stockOutsTrend: 2
  });

  // Counters
  const [counters, setCounters] = useState([
    { id: 'C1', name: 'Billing Counter #1', activeStaff: 'Priya S.', queueLength: 4, avgWaitTime: 3.2, status: 'CONGESTED' },
    { id: 'C2', name: 'Billing Counter #2', activeStaff: 'Rahul M.', queueLength: 2, avgWaitTime: 1.6, status: 'NORMAL' },
    { id: 'C3', name: 'Express Checkout', activeStaff: 'Automated', queueLength: 1, avgWaitTime: 0.8, status: 'NORMAL' },
    { id: 'C4', name: 'Service Desk & Pickup', activeStaff: 'Amit K.', queueLength: 0, avgWaitTime: 0.0, status: 'CLOSED' }
  ]);

  // Shelves
  const [shelves, setShelves] = useState([
    {
      id: 'S1', name: 'Fresh Organic Milk 1L', sku: 'SKU-8821', category: 'Dairy', aisle: 'Aisle 1 - Dairy',
      count: 4, maxCount: 24, stockPercent: 16.7, status: 'OUT', lastRestocked: '18h ago',
      imageSnippet: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'S2', name: 'Artisan Whole Wheat Bread', sku: 'SKU-1049', category: 'Bakery', aisle: 'Aisle 2 - Bakery',
      count: 1, maxCount: 20, stockPercent: 5.0, status: 'OUT', lastRestocked: '22h ago',
      imageSnippet: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'S3', name: 'Greek Yogurt 500g', sku: 'SKU-4402', category: 'Dairy', aisle: 'Aisle 1 - Dairy',
      count: 26, maxCount: 30, stockPercent: 86.7, status: 'FULL', lastRestocked: '3h ago',
      imageSnippet: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'S4', name: 'Natural Mineral Water 1.5L', sku: 'SKU-9901', category: 'Beverages', aisle: 'Aisle 3 - Beverages',
      count: 36, maxCount: 40, stockPercent: 90.0, status: 'FULL', lastRestocked: '2h ago',
      imageSnippet: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'S5', name: 'Roasted Salted Cashews 200g', sku: 'SKU-3120', category: 'Snacks', aisle: 'Aisle 4 - Snacks',
      count: 14, maxCount: 25, stockPercent: 56.0, status: 'LOW', lastRestocked: '11h ago',
      imageSnippet: 'https://images.unsplash.com/photo-1536591375315-1b8368903277?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'S6', name: 'Organic Bananas 1kg', sku: 'SKU-7740', category: 'Produce', aisle: 'Aisle 2 - Fresh Produce',
      count: 10, maxCount: 35, stockPercent: 28.6, status: 'LOW', lastRestocked: '14h ago',
      imageSnippet: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80'
    }
  ]);

  // Chart datasets
  const [hourlyFootfallData, setHourlyFootfallData] = useState([
    { time: '09:00', today: 120 },
    { time: '10:00', today: 240 },
    { time: '11:00', today: 380 },
    { time: '12:00', today: 510 },
    { time: '13:00', today: 430 },
    { time: '14:00', today: 360 },
    { time: '15:00', today: 490 },
    { time: '16:00', today: 620 }
  ]);

  const [zoneDwellData, setZoneDwellData] = useState([
    { zone: 'Dairy & Milk', minutes: 8.4 },
    { zone: 'Bakery', minutes: 5.2 },
    { zone: 'Fresh Produce', minutes: 7.1 },
    { zone: 'Snacks & Soda', minutes: 4.8 },
    { zone: 'Electronics & Home', minutes: 11.3 }
  ]);

  const [waitTimeTrendData, setWaitTimeTrendData] = useState([
    { time: '11:00', actual: 2.2, forecast: 2.4 },
    { time: '11:15', actual: 2.5, forecast: 2.8 },
    { time: '11:30', actual: 3.1, forecast: 3.5 },
    { time: '11:45', actual: 3.8, forecast: 4.0 },
    { time: '12:00', actual: 3.2, forecast: 3.4 }
  ]);

  // Operational Alerts
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'Queue Congestion Warning',
      description: 'Billing Counter #1 exceeded threshold (4 shoppers in queue).',
      severity: 'WARNING',
      timestamp: '11:45:10'
    },
    {
      id: 2,
      title: 'Shelf Stock-Out Detected',
      description: 'Artisan Whole Wheat Bread reached OUT status (<20% stock).',
      severity: 'HIGH',
      timestamp: '11:42:00'
    },
    {
      id: 3,
      title: 'ML Inference Sync Active',
      description: 'Live edge predictions streaming wait times & shelf categories.',
      severity: 'INFO',
      timestamp: '11:30:00'
    }
  ]);

  // Fetch initial REST metrics on mount
  useEffect(() => {
    const fetchInitialMetrics = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/model-metrics`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.queue_wait_regression) {
            setModelMetrics(data);
          }
        }
      } catch (err) {
        console.warn('Backend REST metrics endpoint offline, using local fallback:', err.message);
      }
    };
    fetchInitialMetrics();
  }, []);

  // Real WebSocket Connection Lifecycle
  useEffect(() => {
    let isMounted = true;

    const connectWS = () => {
      try {
        const socket = new WebSocket(`${WS_BASE}/ws`);
        wsRef.current = socket;

        socket.onopen = () => {
          if (isMounted) {
            setWsConnected(true);
            console.log('Connected to Retail Intelligence WebSocket /ws');
          }
        };

        socket.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            if (data.kpiMetrics) {
              setKpiMetrics(data.kpiMetrics);
            }
            if (data.counters) {
              setCounters(data.counters);
            }
            if (data.shelves) {
              setShelves(data.shelves);
            }
            if (data.waitTimeTrendData) {
              setWaitTimeTrendData(data.waitTimeTrendData);
            }
            if (data.hourlyFootfallData) {
              setHourlyFootfallData(data.hourlyFootfallData);
            }
            if (data.zoneDwellData) {
              setZoneDwellData(data.zoneDwellData);
            }
            if (data.modelMetrics && Object.keys(data.modelMetrics).length > 0) {
              setModelMetrics(data.modelMetrics);
            }
            setLastUpdated(new Date().toLocaleTimeString());
          } catch (err) {
            console.error('Failed to parse WS payload:', err);
          }
        };

        socket.onclose = () => {
          if (isMounted) {
            setWsConnected(false);
            reconnectTimeoutRef.current = setTimeout(connectWS, 3000);
          }
        };

        socket.onerror = () => {
          if (isMounted) {
            setWsConnected(false);
            socket.close();
          }
        };
      } catch (err) {
        if (isMounted) {
          setWsConnected(false);
          reconnectTimeoutRef.current = setTimeout(connectWS, 3000);
        }
      }
    };

    connectWS();

    return () => {
      isMounted = false;
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, []);

  // Fallback Simulation (only runs when WebSocket is NOT connected)
  useEffect(() => {
    if (wsConnected) return; // Backend is active, do not run fallback simulation

    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
      setKpiMetrics((prev) => ({
        ...prev,
        activeShoppers: Math.max(15, Math.min(65, prev.activeShoppers + (Math.floor(Math.random() * 3) - 1)))
      }));

      // Light jitter on counters
      setCounters((prev) =>
        prev.map((c) => {
          if (c.status === 'CLOSED') return c;
          const delta = Math.floor(Math.random() * 3) - 1;
          const nextLen = Math.max(0, Math.min(8, c.queueLength + delta));
          const wait = parseFloat((nextLen * 0.8).toFixed(1));
          const status = nextLen >= 4 ? 'CONGESTED' : nextLen >= 2 ? 'NORMAL' : 'NORMAL';
          return { ...c, queueLength: nextLen, avgWaitTime: wait, status };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [wsConnected]);

  // Shelf stock updater action
  const updateShelfStock = (shelfId, newCount) => {
    setShelves((prev) =>
      prev.map((s) => {
        if (s.id === shelfId) {
          const count = newCount !== undefined ? newCount : s.maxCount;
          const pct = Math.round((count / s.maxCount) * 100);
          const status = pct > 60 ? 'FULL' : pct >= 20 ? 'LOW' : 'OUT';
          return { ...s, count, stockPercent: pct, status, lastRestocked: 'Just now' };
        }
        return s;
      })
    );
  };

  const dismissAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const acknowledgeAlert = (id) => {
    dismissAlert(id);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeTab,
        setActiveTab,
        selectedStore,
        setSelectedStore,
        faceBlurEnabled,
        setFaceBlurEnabled,
        queueCapacityThreshold,
        setQueueCapacityThreshold,
        wsConnected,
        lastUpdated,
        isLive: true,
        kpiMetrics,
        counters,
        shelves,
        alerts,
        hourlyFootfallData,
        zoneDwellData,
        waitTimeTrendData,
        modelMetrics,
        updateShelfStock,
        dismissAlert,
        acknowledgeAlert,
        settings: { face_blur_enabled: faceBlurEnabled, queue_threshold: queueCapacityThreshold }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppContextProvider = AppProvider;
export const useApp = () => useContext(AppContext);
export default AppContext;
