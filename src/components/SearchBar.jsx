import { useState, useMemo } from 'react'
import { useSelection } from '../context/SelectionContext'
import { useStarlinkData } from '../hooks/useStarlinkData'

export function SearchBar() {
  const { setSelectedSat } = useSelection()
  const { satellites } = useStarlinkData()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(false)

  // Filter logic (memoized)
  const results = useMemo(() => {
    if (!query || query.length < 2) return []
    const lowerQ = query.toLowerCase()
    return satellites
      .filter(s => 
        s.name.toLowerCase().includes(lowerQ) || 
        s.noradId.includes(lowerQ)
      )
      .slice(0, 5) // Limit to 5 results
  }, [query, satellites])

  const handleSelect = (sat) => {
    setSelectedSat(sat)
    setQuery('')
    setActive(false)
  }

  return (
    <div className="search-bar">
      <div className="input-wrapper">
        <input 
          type="text" 
          placeholder="SEARCH SATELLITE (ID/NAME)..." 
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setActive(true)}
          onBlur={() => setTimeout(() => setActive(false), 200)} // Delay to allow click
        />
        <div className="icon">🔍</div>
      </div>

      {active && results.length > 0 && (
        <div className="results-list">
          {results.map(sat => (
            <div 
              key={sat.noradId} 
              className="result-item"
              onClick={() => handleSelect(sat)}
            >
              <span className="name">{sat.name}</span>
              <span className="id">#{sat.noradId}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .search-bar {
          position: absolute;
          top: 150px; /* Below Title */
          left: 30px;
          width: 280px;
          pointer-events: auto;
          font-family: 'Segoe UI', monospace;
          z-index: 10;
        }
        .input-wrapper {
          position: relative;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid #00ffcc;
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
        }
        input {
          width: 100%;
          background: transparent;
          border: none;
          color: #fff;
          padding: 10px 15px;
          font-family: inherit;
          font-size: 12px;
          outline: none;
        }
        input::placeholder {
          color: #00ffcc;
          opacity: 0.5;
        }
        .icon {
          padding-right: 10px;
          opacity: 0.7;
          font-size: 12px;
        }
        .results-list {
          margin-top: 5px;
          background: rgba(10, 20, 30, 0.9);
          border: 1px solid rgba(0, 255, 204, 0.3);
          max-height: 200px;
          overflow-y: auto;
        }
        .result-item {
          padding: 8px 15px;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s;
        }
        .result-item:hover {
          background: rgba(0, 255, 204, 0.2);
        }
        .result-item .name {
          color: #fff;
          font-size: 12px;
        }
        .result-item .id {
          color: #aaa;
          font-size: 10px;
        }
      `}</style>
    </div>
  )
}
