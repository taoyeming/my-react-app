import { createContext, useContext, useState } from 'react'

const SelectionContext = createContext()

export function SelectionProvider({ children }) {
  // Filter state
  const [filterYear, setFilterYear] = useState('ALL') // 'ALL' or number (e.g. 2023)
  
  // Selected satellite (object with full data)
  const [selectedSat, setSelectedSat] = useState(null)

  return (
    <SelectionContext.Provider value={{ 
      filterYear, 
      setFilterYear, 
      selectedSat, 
      setSelectedSat 
    }}>
      {children}
    </SelectionContext.Provider>
  )
}

export function useSelection() {
  return useContext(SelectionContext)
}
