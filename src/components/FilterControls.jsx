import { useSelection } from '../context/SelectionContext'

export function FilterControls() {
  const { filterYear, setFilterYear } = useSelection()

  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025]

  return (
    <div className="filter-controls">
      <div className="label">FILTER BY LAUNCH YEAR</div>
      <div className="button-group">
        <button 
          className={filterYear === 'ALL' ? 'active' : ''}
          onClick={() => setFilterYear('ALL')}
        >
          ALL
        </button>
        {years.map(year => (
          <button
            key={year}
            className={filterYear === year ? 'active' : ''}
            onClick={() => setFilterYear(year)}
          >
            {year}
          </button>
        ))}
      </div>

      <style>{`
        .filter-controls {
          position: absolute;
          bottom: 30px;
          right: 30px;
          background: rgba(0,0,0,0.6);
          padding: 15px;
          border-right: 2px solid #00ffcc; /* Right border for symmetry */
          backdrop-filter: blur(5px);
          text-align: right;
          width: auto;
          max-width: 300px;
          pointer-events: auto;
        }
        .label {
          color: #aaa;
          font-size: 10px;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }
        .button-group {
          display: flex;
          justify-content: flex-end; /* Align right */
          gap: 5px;
          flex-wrap: wrap;
        }
        button {
          background: transparent;
          border: 1px solid #444;
          color: #888;
          padding: 5px 10px;
          font-family: monospace;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }
        button:hover {
          border-color: #fff;
          color: #fff;
        }
        button.active {
          background: #00ffcc;
          color: #000;
          border-color: #00ffcc;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}