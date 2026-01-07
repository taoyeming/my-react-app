import { useState } from 'react'
import { useSelection } from '../context/SelectionContext'

export function SettingsMenu() {
  const { bloomEnabled, setBloomEnabled } = useSelection()
  const [open, setOpen] = useState(false)

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
          <div className="menu-item">
            <span>BLOOM EFFECT</span>
            <button 
              className={`toggle-btn ${bloomEnabled ? 'on' : 'off'}`}
              onClick={() => setBloomEnabled(!bloomEnabled)}
            >
              {bloomEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className="menu-info">
            Turn off Bloom to improve FPS on low-end devices.
          </div>
        </div>
      )}

      <style>{`
        .settings-menu {
          position: absolute;
          top: 30px;
          right: 330px; /* Left of InfoPanel */
          z-index: 50;
        }
        .gear-btn {
          background: rgba(0,0,0,0.6);
          border: 1px solid #00ffcc;
          color: #fff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .gear-btn:hover, .gear-btn.active {
          background: #00ffcc;
          color: #000;
        }
        .menu-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 200px;
          background: rgba(10, 20, 30, 0.95);
          border: 1px solid #00ffcc;
          padding: 15px;
          border-radius: 10px;
          color: #fff;
          font-family: monospace;
        }
        .menu-title {
          font-weight: bold;
          border-bottom: 1px solid #444;
          padding-bottom: 5px;
          margin-bottom: 10px;
          color: #00ffcc;
        }
        .menu-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-size: 12px;
        }
        .toggle-btn {
          padding: 2px 8px;
          border: 1px solid #666;
          background: transparent;
          color: #888;
          cursor: pointer;
          font-family: monospace;
        }
        .toggle-btn.on {
          border-color: #00ffcc;
          color: #00ffcc;
          background: rgba(0, 255, 204, 0.1);
        }
        .menu-info {
          font-size: 10px;
          color: #666;
          line-height: 1.4;
        }

        /* Mobile Adjust */
        @media (max-width: 768px) {
          .settings-menu {
            top: 20px;
            right: 20px;
          }
        }
      `}</style>
    </div>
  )
}
