import { useSelection } from '../context/SelectionContext'
import { useTime } from '../context/TimeContext'
import { getSatellitePosition } from '../services/satelliteService'
import { useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber' // Can't use useFrame outside Canvas, so we use interval

export function InfoPanel() {
  const { selectedSat } = useSelection()
  const { timeRef, speed } = useTime()
  const [liveData, setLiveData] = useState(null)

  // Use an interval to update the display independent of React render loop
  // to avoid re-rendering the whole UI 60fps
  useEffect(() => {
    if (!selectedSat) return

    const interval = setInterval(() => {
      const data = getSatellitePosition(selectedSat.satrec, timeRef.current)
      if (data) {
        setLiveData(data)
      }
    }, 100) // Update UI 10 times/sec

    return () => clearInterval(interval)
  }, [selectedSat, timeRef]) // Re-bind if selection changes

  if (!selectedSat) return null

  return (
    <div className="info-panel">
      <div className="header">
        <div className="badge">TARGET LOCKED</div>
        <h2 className="sat-name">{selectedSat.name}</h2>
      </div>
      
      <div className="grid">
        <div className="row">
          <label>NORAD ID</label>
          <span>{selectedSat.noradId}</span>
        </div>
        <div className="row">
          <label>INT'L CODE</label>
          <span>{selectedSat.intlDes}</span>
        </div>
        <div className="row">
          <label>LAUNCH YEAR</label>
          <span>{selectedSat.launchYear}</span>
        </div>
        
        <div className="divider"></div>

        <div className="row highlight">
          <label>ALTITUDE</label>
          <span>{liveData ? liveData.heightKm.toFixed(1) : '---'} km</span>
        </div>
        <div className="row highlight">
          <label>VELOCITY</label>
          <span>{liveData ? liveData.speedKmH.toFixed(0) : '---'} km/h</span>
        </div>
      </div>

      <style>{`
        .info-panel {
          position: absolute;
          top: 90px;
          right: 30px;
          width: 280px;
          background: rgba(10, 20, 40, 0.85);
          border: 1px solid #00ffcc;
          box-shadow: 0 0 20px rgba(0, 255, 204, 0.2);
          color: white;
          font-family: 'Segoe UI', monospace;
          backdrop-filter: blur(10px);
          padding: 20px;
          pointer-events: none; /* Let clicks pass through if needed, but usually panel is interactive */
          pointer-events: auto;
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .header {
          border-bottom: 2px solid #00ffcc;
          margin-bottom: 15px;
          padding-bottom: 10px;
        }
        .badge {
          background: #00ffcc;
          color: #000;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 6px;
          display: inline-block;
          margin-bottom: 5px;
        }
        .sat-name {
          margin: 0;
          font-size: 20px;
          letter-spacing: 1px;
        }
        .grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }
        .row label {
          color: #88aacc;
          font-size: 12px;
        }
        .row span {
          font-weight: bold;
          font-family: monospace;
          font-size: 14px;
        }
        .divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
          margin: 10px 0;
        }
        .highlight span {
          color: #00ffcc;
          font-size: 16px;
        }
      `}</style>
    </div>
  )
}
