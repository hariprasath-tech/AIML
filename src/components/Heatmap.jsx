import React, { useState } from 'react';
import { Map, Info } from 'lucide-react';

const STORE_ZONES = [
  { id: 'z1', name: 'Entrance A', category: 'Entrance', density: 'high', count: 18, avgDwell: '1.2m' },
  { id: 'z2', name: 'Fresh Produce', category: 'Grocery', density: 'high', count: 24, avgDwell: '6.4m' },
  { id: 'z3', name: 'Organic Dairy', category: 'Grocery', density: 'medium', count: 12, avgDwell: '4.1m' },
  { id: 'z4', name: 'Bakery & Deli', category: 'Grocery', density: 'high', count: 21, avgDwell: '8.5m' },
  { id: 'z5', name: 'Beverages', category: 'Drinks', density: 'medium', count: 15, avgDwell: '3.8m' },
  { id: 'z6', name: 'Entrance B', category: 'Entrance', density: 'low', count: 5, avgDwell: '0.8m' },
  
  { id: 'z7', name: 'Aisle 1 - Cereal', category: 'Grocery', density: 'medium', count: 11, avgDwell: '4.5m' },
  { id: 'z8', name: 'Aisle 2 - Snacks', category: 'Snacks', density: 'high', count: 29, avgDwell: '9.2m' },
  { id: 'z9', name: 'Aisle 3 - Spices', category: 'Grocery', density: 'low', count: 6, avgDwell: '3.1m' },
  { id: 'z10', name: 'Aisle 4 - Canned', category: 'Grocery', density: 'low', count: 8, avgDwell: '2.9m' },
  { id: 'z11', name: 'Confectionery', category: 'Snacks', density: 'high', count: 26, avgDwell: '7.8m' },
  { id: 'z12', name: 'Frozen Foods', category: 'Frozen', density: 'medium', count: 14, avgDwell: '5.0m' },

  { id: 'z13', name: 'TV & Audio', category: 'Electronics', density: 'high', count: 32, avgDwell: '14.2m' },
  { id: 'z14', name: 'Smartphones', category: 'Electronics', density: 'high', count: 38, avgDwell: '18.5m' },
  { id: 'z15', name: 'Home Appliances', category: 'Electronics', density: 'medium', count: 16, avgDwell: '11.0m' },
  { id: 'z16', name: 'Men Apparel', category: 'Apparel', density: 'medium', count: 19, avgDwell: '12.4m' },
  { id: 'z17', name: 'Women Apparel', category: 'Apparel', density: 'high', count: 31, avgDwell: '16.8m' },
  { id: 'z18', name: 'Kids & Toys', category: 'Apparel', density: 'medium', count: 17, avgDwell: '9.5m' },

  { id: 'z19', name: 'Personal Care', category: 'Health', density: 'low', count: 7, avgDwell: '3.5m' },
  { id: 'z20', name: 'Pharmacy', category: 'Health', density: 'medium', count: 13, avgDwell: '6.2m' },
  { id: 'z21', name: 'Counter 1 Zone', category: 'Checkout', density: 'low', count: 4, avgDwell: '2.1m' },
  { id: 'z22', name: 'Counter 2 Zone', category: 'Checkout', density: 'high', count: 22, avgDwell: '6.8m' },
  { id: 'z23', name: 'Counter 3 Zone', category: 'Checkout', density: 'low', count: 3, avgDwell: '1.2m' },
  { id: 'z24', name: 'Store Exit', category: 'Exit', density: 'low', count: 6, avgDwell: '0.5m' }
];

export const Heatmap = () => {
  const [selectedZone, setSelectedZone] = useState(STORE_ZONES[1]);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const categories = ['ALL', 'Grocery', 'Electronics', 'Apparel', 'Checkout', 'Snacks'];

  const filteredZones = STORE_ZONES.filter(
    (z) => filterCategory === 'ALL' || z.category === filterCategory
  );

  return (
    <div className="glass-card glow-cyan">
      <div className="card-title-row">
        <div className="card-title">
          <Map color="var(--accent-purple)" size={20} />
          <span>Interactive Store Floor Heatmap</span>
        </div>
        <div className="shelf-filters" style={{ marginBottom: 0 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
              style={{ padding: '4px 12px', fontSize: '0.75rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px' }}>
        {/* Heatmap Grid */}
        <div className="heatmap-grid">
          {filteredZones.map((zone) => (
            <div
              key={zone.id}
              className={`heatmap-cell ${zone.density}`}
              onClick={() => setSelectedZone(zone)}
              style={{
                outline: selectedZone?.id === zone.id ? '2px solid var(--accent-cyan)' : 'none'
              }}
            >
              <div style={{ fontSize: '0.65rem', textAlign: 'center', fontWeight: 600 }}>
                {zone.name}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '2px' }}>
                {zone.count} 👤
              </div>
            </div>
          ))}
        </div>

        {/* Selected Zone Detail Panel */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '12px' }}>
              <Info size={16} />
              <span>Zone Details</span>
            </div>

            {selectedZone ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zone Name</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedZone.name}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {selectedZone.category}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Occupancy</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {selectedZone.count} shoppers
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Dwell Time</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
                    {selectedZone.avgDwell}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Select a zone cell on the grid</div>
            )}
          </div>

          <div style={{ marginTop: '16px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Heat Legend: <br />
            <span style={{ color: '#93C5FD' }}>■ Low</span> | <span style={{ color: '#FDE68A' }}>■ Med</span> | <span style={{ color: '#FECDD3' }}>■ High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
