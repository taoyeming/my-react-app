import { useTime } from '../context/TimeContext'

export function TimeControls() {
  const { speed, setSpeed, displayTime } = useTime()

  const formatDate = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  return (
    <div className="time-controls">
      <div className="clock-display">
        {formatDate(displayTime)}
      </div>

      <div className="control-row">
        <button onClick={() => setSpeed(-100)} className="btn">{'<<'}</button>
        <button onClick={() => setSpeed(0)} className="btn">PAUSE</button>
        <button onClick={() => setSpeed(1)} className="btn">1x</button>
        <button onClick={() => setSpeed(100)} className="btn">{'>>'}</button>
        <div className="speed-val">{speed}x</div>
      </div>
      
      <input 
          type="range" 
          min="-500" 
          max="500" 
          value={speed} 
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="speed-slider"
        />

      <style>{`
        .time-controls {
          position: absolute;
          bottom: 30px;
          left: 30px;
          color: white;
          font-family: 'Segoe UI', monospace;
          background: rgba(0, 0, 0, 0.6);
          padding: 15px;
          border-left: 2px solid #00ffcc;
          backdrop-filter: blur(5px);
          width: 280px;
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .clock-display {
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          text-align: center;
          margin-bottom: 5px;
          letter-spacing: 1px;
        }
        .control-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn {
          background: rgba(0, 255, 204, 0.1);
          border: 1px solid rgba(0, 255, 204, 0.3);
          color: #00ffcc;
          padding: 4px 8px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
        }
        .btn:hover {
          background: rgba(0, 255, 204, 0.3);
        }
        .speed-val {
          font-size: 12px;
          color: #aaa;
          min-width: 40px;
          text-align: right;
        }
        .speed-slider {
          width: 100%;
          cursor: pointer;
          height: 4px;
        }
      `}</style>
    </div>
  )
}