import { useFrame } from '@react-three/fiber'
import { useTime } from '../context/TimeContext'
import { useRef } from 'react'

export function TimeManager() {
  const { speed, timeRef, setDisplayTime } = useTime()
  const lastUiUpdateRef = useRef(0)

  useFrame((_, delta) => {
    // 1. Advance the physics time
    // delta is in seconds.
    // If speed is 100, we add 100 seconds to the current time per real second.
    const currentTime = timeRef.current.getTime()
    const newTime = currentTime + (delta * 1000 * speed)
    timeRef.current = new Date(newTime)

    // 2. Update the UI clock (throttled)
    // Only update React state 10 times a second to save performance
    if (Date.now() - lastUiUpdateRef.current > 100) {
      setDisplayTime(new Date(newTime))
      lastUiUpdateRef.current = Date.now()
    }
  })

  return null
}
