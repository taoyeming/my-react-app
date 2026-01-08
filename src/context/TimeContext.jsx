import { createContext, useContext, useRef, useState } from 'react'

const TimeContext = createContext()

export function TimeProvider({ children }) {
  // Speed multiplier (1 = real time, 60 = 1 min/sec, -60 = reverse 1 min/sec)
  const [speed, setSpeed] = useState(10)
  
  // The actual simulated time (Javascript Date object)
  // We use a Ref for the physics loop to avoid re-rendering components 60 times a second
  const timeRef = useRef(new Date())

  // A throttled state just for displaying the clock in the UI
  const [displayTime, setDisplayTime] = useState(new Date())

  return (
    <TimeContext.Provider value={{ speed, setSpeed, timeRef, displayTime, setDisplayTime }}>
      {children}
    </TimeContext.Provider>
  )
}

export function useTime() {
  return useContext(TimeContext)
}
