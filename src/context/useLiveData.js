import { useContext } from 'react';
import { AppContext } from './AppContext';

/**
 * Custom hook to consume live retail intelligence data.
 * abstracts the data source so UI components can easily switch between 
 * simulated context state, WebSockets (ws://localhost:8000/ws), and REST APIs (/api/metrics).
 */
export const useLiveData = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useLiveData must be used within an AppContextProvider');
  }

  return {
    // Core Telemetry & States
    stores: context.stores,
    selectedStore: context.selectedStore,
    setSelectedStore: context.setSelectedStore,
    privacyMode: context.privacyMode,
    setPrivacyMode: context.setPrivacyMode,
    cameras: context.cameras,
    isLive: context.isLive,
    lastUpdated: context.lastUpdated,

    // Analytics & Metrics
    kpiMetrics: context.kpiMetrics,
    boundingBoxes: context.boundingBoxes,
    shelves: context.shelves,
    counters: context.counters,
    alerts: context.alerts,
    settings: context.settings,

    // Chart Datasets
    hourlyFootfallData: context.hourlyFootfallData,
    zoneDwellData: context.zoneDwellData,
    waitTimeTrendData: context.waitTimeTrendData,

    // ML Model Metrics & Live Status
    modelMetrics: context.modelMetrics,
    wsConnected: context.wsConnected,

    // Actions & Mutators
    acknowledgeAlert: context.acknowledgeAlert,
    dismissAlert: context.dismissAlert,
    updateShelfStock: context.updateShelfStock,
    toggleCameraStatus: context.toggleCameraStatus,
    updateSettings: context.updateSettings
  };
};

export default useLiveData;
