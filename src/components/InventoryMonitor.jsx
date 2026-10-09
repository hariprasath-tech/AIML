import React, { useState } from 'react';
import { PackageSearch, AlertTriangle, RefreshCw, Search, X, CheckCircle } from 'lucide-react';
import { useLiveData } from '../context/useLiveData';

export const InventoryMonitor = () => {
  const { shelves, updateShelfStock } = useLiveData();
  const [selectedAisle, setSelectedAisle] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalShelf, setActiveModalShelf] = useState(null);
  const [restockSuccessMsg, setRestockSuccessMsg] = useState(false);

  const categories = ['ALL', 'Aisle 1', 'Aisle 2', 'Aisle 3', 'Aisle 4'];

  const filteredShelves = shelves.filter((s) => {
    const matchesAisle = selectedAisle === 'ALL' || s.aisle.includes(selectedAisle);
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAisle && matchesSearch;
  });

  const outOfStockItems = shelves.filter((s) => s.status === 'OUT' || s.status === 'LOW');

  const handleRestock = (shelf) => {
    updateShelfStock(shelf.id, shelf.maxCount);
    setRestockSuccessMsg(true);
    setTimeout(() => {
      setRestockSuccessMsg(false);
      setActiveModalShelf(null);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Controls & Search Bar */}
      <div className="glass-card glow-cyan">
        <div className="card-title-row" style={{ marginBottom: 0 }}>
          <div className="card-title">
            <PackageSearch color="var(--accent-cyan)" size={20} />
            <span>Shelf Stock & Inventory Visibility</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search SKU or Product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="shelf-filters" style={{ marginTop: '16px', marginBottom: 0 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${selectedAisle === cat ? 'active' : ''}`}
              onClick={() => setSelectedAisle(cat)}
            >
              {cat === 'ALL' ? 'All Aisles' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Out of Stock Alert Summary Banner */}
      {outOfStockItems.length > 0 && (
        <div
          style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle color="var(--accent-rose)" size={20} />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>
                Stock-Out Attention Required ({outOfStockItems.length} items LOW or OUT)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {outOfStockItems.map((item) => `${item.name} (${item.status})`).join(', ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shelf Grid */}
      <div className="shelf-grid">
        {filteredShelves.map((shelf) => (
          <div key={shelf.id} className="shelf-card" onClick={() => setActiveModalShelf(shelf)}>
            <div className="shelf-header">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {shelf.aisle}
              </span>
              <span className={`status-badge ${shelf.status}`}>{shelf.status}</span>
            </div>

            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', margin: '4px 0' }}>
              {shelf.name}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              SKU: {shelf.sku}
            </div>

            {/* Progress Bar */}
            <div className="stock-bar-bg">
              <div
                className={`stock-bar-fill ${shelf.status}`}
                style={{ width: `${shelf.stockPercent}%` }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginTop: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Stock Level</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {shelf.count} / {shelf.maxCount} ({shelf.stockPercent}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Shelf Detail Drawer / Modal */}
      {activeModalShelf && (
        <div className="modal-overlay" onClick={() => setActiveModalShelf(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="card-title-row">
              <div className="card-title">
                <PackageSearch color="var(--accent-cyan)" size={20} />
                <span>Shelf Camera Inspector</span>
              </div>
              <button
                onClick={() => setActiveModalShelf(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Camera Snippet View */}
            <div
              style={{
                width: '100%',
                height: '180px',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '16px',
                border: '1px solid var(--border-color)'
              }}
            >
              <img
                src={activeModalShelf.imageSnippet}
                alt={activeModalShelf.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  background: 'rgba(0,0,0,0.8)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                CAM-02 (Aisle View)
              </div>
              <span className={`status-badge ${activeModalShelf.status}`} style={{ position: 'absolute', bottom: 8, right: 8 }}>
                {activeModalShelf.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{activeModalShelf.name}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  SKU: {activeModalShelf.sku} · Category: {activeModalShelf.category}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Capacity</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {activeModalShelf.count} / {activeModalShelf.maxCount} units
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last Restocked</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{activeModalShelf.lastRestocked}</div>
                </div>
              </div>

              {restockSuccessMsg ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--accent-emerald)', padding: '12px', borderRadius: '8px', color: 'var(--accent-emerald)', textAlign: 'center', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <CheckCircle size={18} />
                  <span>Restock Request Sent to Store Inventory!</span>
                </div>
              ) : (
                <button
                  onClick={() => handleRestock(activeModalShelf)}
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
                    border: 'none',
                    color: '#000',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px'
                  }}
                >
                  <RefreshCw size={16} />
                  <span>Trigger Immediate Restock Request</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryMonitor;
