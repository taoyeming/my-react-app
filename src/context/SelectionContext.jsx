import { createContext, useContext, useState } from 'react'

const SelectionContext = createContext()

export function SelectionProvider({ children }) {
  // Filter state
  const [filterYear, setFilterYear] = useState('ALL') 
  const [selectedSat, setSelectedSat] = useState(null)
  
  // Quality Settings
  const [bloomEnabled, setBloomEnabled] = useState(true)

  return (
    <SelectionContext.Provider value={{ 
      filterYear, setFilterYear, 
      selectedSat, setSelectedSat,
      bloomEnabled, setBloomEnabled
    }}>
      {children}
    </SelectionContext.Provider>
  )
}

export function useSelection() {
  return useContext(SelectionContext)
}
