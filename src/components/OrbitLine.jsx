import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { getSatellitePosition } from '../services/satelliteService'
import * as THREE from 'three'

export function OrbitLine({ satrec, startTime }) {
  const points = useMemo(() => {
    if (!satrec) return []

    const pts = []
    // Predict orbit for next 95 minutes (approx 1 period)
    const segments = 100
    const duration = 95 * 60 * 1000 // ms
    
    const startMs = startTime.getTime()

    for (let i = 0; i <= segments; i++) {
      const t = new Date(startMs + (i / segments) * duration)
      const data = getSatellitePosition(satrec, t)
      if (data) {
        pts.push(new THREE.Vector3(data.pos[0], data.pos[1], data.pos[2]))
      }
    }
    return pts
  }, [satrec, startTime]) // Re-calc if sat or time drastically changes (though time is fluid, maybe just on sat change)

  return (
    <Line 
      points={points} 
      color="#ff0055" 
      lineWidth={1.5} 
      transparent 
      opacity={0.8}
    />
  )
}
