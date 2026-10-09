import React, { useState } from 'react';
import { Settings as SettingsIcon, Camera, Sliders, Bell, CheckCircle } from 'lucide-react';
import { useLiveData } from '../context/useLiveData';

export const Settings = () => {
  const { settings, updateSettings, cameras, toggleCameraStatus } = useLiveData();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleSetting = (key) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Threshold Configuration */}
      <div className="glass-card glow-purple">
        <div className="card-title-row">
          <div className="card-title">
            <Sliders color="var(--accent-purple)" size={20} />
            <span>AI Detection & Operational Thresholds</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="setting-row">
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Queue Congestion Alert Limit</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Trigger HIGH severity queue alert when shopper count in queue exceeds this limit.
              </div>
            </div>
            <input
              type="number"
              className="setting-input"
              value={settings.queueCongestionThreshold}
              onChange={(e) => updateSettings({ queueCongestionThreshold: parseInt(e.target.value) || 1 })}
            />
          </div>

          <div className="setting-row">
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Shelf LOW Stock Warning Level (%)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Trigger WARNING alert when inventory shelf capacity drops below this percentage.
              </div>
            </div>
            <input
              type="number"
              className="setting-input"
              value={settings.shelfLowThreshold}
              onChange={(e) => updateSettings({ shelfLowThreshold: parseInt(e.target.value) || 5 })}
            />
          </div>

          <div className="setting-row">
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Shelf OUT Stock Critical Level (%)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Trigger HIGH alert when inventory shelf capacity drops below this percentage.
              </div>
            </div>
            <input
              type="number"
              className="setting-input"
              value={settings.shelfOutThreshold}
              onChange={(e) => updateSettings({ shelfOutThreshold: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="glass-card glow-cyan">
        <div className="card-title-row">
          <div className="card-title">
            <Bell color="var(--accent-cyan)" size={20} />
            <span>Notification & Alert Channels</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="setting-row">
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Audio Alarm on Critical Alerts</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Play sound chime when HIGH severity queue or stock-out occurs.</div>
            </div>
            <button
              className={`toggle-btn ${settings.audioAlertsEnabled ? 'active' : ''}`}
              onClick={() => handleToggleSetting('audioAlertsEnabled')}
            >
              {settings.audioAlertsEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          <div className="setting-row">
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Desktop System Notifications</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Send OS native push notifications for live store alerts.</div>
            </div>
            <button
              className={`toggle-btn ${settings.desktopNotifications ? 'active' : ''}`}
              onClick={() => handleToggleSetting('desktopNotifications')}
            >
              {settings.desktopNotifications ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>
      </div>

      {/* Connected Cameras Management Table */}
      <div className="glass-card glow-cyan">
        <div className="card-title-row">
          <div className="card-title">
            <Camera color="var(--accent-cyan)" size={20} />
            <span>Edge Connected IP & RTSP Cameras</span>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Camera Name</th>
              <th style={{ padding: '12px' }}>Zone Location</th>
              <th style={{ padding: '12px' }}>RTSP Stream URL</th>
              <th style={{ padding: '12px' }}>Stream Quality</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cameras.map((cam) => (
              <tr key={cam.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>{cam.name}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{cam.location}</td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontSize: '0.78rem' }}>
                  {cam.rtspUrl}
                </td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                  {cam.resolution} @ {cam.fps} FPS
                </td>
                <td style={{ padding: '12px' }}>
                  <span className={`status-badge ${cam.status === 'ONLINE' ? 'FULL' : 'OUT'}`}>
                    {cam.status}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button
                    className="alert-action-btn"
                    onClick={() => toggleCameraStatus(cam.id)}
                    style={{ marginRight: '8px' }}
                  >
                    Toggle {cam.status === 'ONLINE' ? 'Offline' : 'Online'}
                  </button>
                  <button className="alert-action-btn">Re-calibrate Zone</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSave}
            style={{
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
              border: 'none',
              color: '#000',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {saveSuccess ? <CheckCircle size={18} /> : <SettingsIcon size={18} />}
            <span>{saveSuccess ? 'Settings Saved Successfully!' : 'Save System Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
