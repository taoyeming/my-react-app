import { useState } from 'react'
import { useSelection } from '../context/SelectionContext'

export function SettingsMenu() {
  const { 
    bloomEnabled, setBloomEnabled, 
    musicEnabled, setMusicEnabled,
    filterYear, setFilterYear
  } = useSelection()
  
  const [open, setOpen] = useState(false)
  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025]

  return (
    <div className="settings-menu">
      <button 
        className={`gear-btn ${open ? 'active' : ''}`} 
        onClick={() => setOpen(!open)}
      >
        ⚙️
      </button>

      {open && (
        <div className="menu-dropdown">
          <div className="menu-title">SETTINGS</div>
          
          <div className="menu-section">
            <div className="section-label">VISUALS</div>
            <div className="menu-item">
              <span>BLOOM EFFECT</span>
              <button 
                className={`toggle-btn ${bloomEnabled ? 'on' : 'off'}`}
                onClick={() => setBloomEnabled(!bloomEnabled)}
              >
                {bloomEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className="menu-section">
            <div className="section-label">AUDIO</div>
            <div className="menu-item">
              <span>AMBIENT MUSIC</span>
              <button 
                className={`toggle-btn ${musicEnabled ? 'on' : 'off'}`}
                onClick={() => setMusicEnabled(!musicEnabled)}
              >
                {musicEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className="menu-section">
            <div className="section-label">FILTER BY LAUNCH</div>
            <div className="year-grid">
              <button 
                className={`year-btn ${filterYear === 'ALL' ? 'active' : ''}`}
                onClick={() => setFilterYear('ALL')}
              >
                ALL
              </button>
              {years.map(year => (
                <button
                  key={year}
                  className={`year-btn ${filterYear === year ? 'active' : ''}`}
                  onClick={() => setFilterYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-footer">
            v1.0.0 Stable | Starlink 3D
          </div>
        </div>
      )}

      <style>{`
        .settings-menu {
          position: absolute;
          top: 30px;
          right: 30px; 
          z-index: 100; /* Highest priority */
        }
        .gear-btn {
          background: rgba(0,0,0,0.6);
          border: 1px solid #00ffcc;
          color: #fff;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          backdrop-filter: blur(5px);
        }
        .gear-btn:hover, .gear-btn.active {
          background: #00ffcc;
          color: #000;
          box-shadow: 0 0 15px rgba(0, 255, 204, 0.4);
        }
        .menu-dropdown {
          position: absolute;
          top: 60px;
          right: 0;
          width: 240px;
          background: rgba(10, 20, 30, 0.98);
          border: 1px solid #00ffcc;
          padding: 20px;
          border-radius: 12px;
          color: #fff;
          font-family: monospace;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .menu-title {
          font-weight: bold;
          font-size: 16px;
          border-bottom: 1px solid rgba(0, 255, 204, 0.2);
          padding-bottom: 8px;
          margin-bottom: 15px;
          color: #00ffcc;
          letter-spacing: 2px;
        }
        .menu-section {
          margin-bottom: 15px;
        }
        .section-label {
          font-size: 10px;
          color: #666;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }
        .menu-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }
        .toggle-btn {
          padding: 4px 10px;
          border: 1px solid #444;
          background: transparent;
          color: #888;
          cursor: pointer;
          font-family: monospace;
          font-size: 11px;
          transition: all 0.2s;
        }
        .toggle-btn.on {
          border-color: #00ffcc;
          color: #00ffcc;
          background: rgba(0, 255, 204, 0.1);
        }
        .year-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 5px;
        }
        .year-btn {
          background: transparent;
          border: 1px solid #333;
          color: #666;
          padding: 5px 0;
          font-size: 10px;
          cursor: pointer;
          font-family: monospace;
        }
        .year-btn.active {
          border-color: #00ffcc;
          color: #00ffcc;
          background: rgba(0, 255, 204, 0.1);
        }
        .menu-footer {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-size: 9px;
          color: #444;
          text-align: center;
        }

        /* Mobile Adjust */
        @media (max-width: 768px) {
          .settings-menu {
            top: 20px;
            right: 20px;
          }
          .menu-dropdown {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 85%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  )
}
