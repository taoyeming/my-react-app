import { createContext, useContext, useState, useEffect } from 'react'

const SelectionContext = createContext()

export function SelectionProvider({ children }) {
  // Filter state
  const [filterYear, setFilterYear] = useState('ALL') 
  const [selectedSat, setSelectedSat] = useState(null)
  
  // Quality Settings
  const [bloomEnabled, setBloomEnabled] = useState(true)
  
  // Music state with localStorage persistence
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const saved = localStorage.getItem('music_enabled')
    return saved !== null ? JSON.parse(saved) : false // Default to FALSE
  })

  // Persistence effect
  useEffect(() => {
    localStorage.setItem('music_enabled', JSON.stringify(musicEnabled))
  }, [musicEnabled])

  return (
    <SelectionContext.Provider value={{ 
      filterYear, setFilterYear, 
      selectedSat, setSelectedSat,
      bloomEnabled, setBloomEnabled,
      musicEnabled, setMusicEnabled
    }}>
      {children}
    </SelectionContext.Provider>
  )
}

export function useSelection() {
  return useContext(SelectionContext)
}
