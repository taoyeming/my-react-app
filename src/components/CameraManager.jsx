import { useFrame, useThree } from '@react-three/fiber'
import { useSelection } from '../context/SelectionContext'
import { useTime } from '../context/TimeContext'
import { getSatellitePosition } from '../services/satelliteService'
import * as THREE from 'three'
import { useRef } from 'react'

export function CameraManager({ controlsRef }) {
  const { selectedSat } = useSelection()
  const { timeRef } = useTime()
  const { camera } = useThree()
  
  // To detect if user is manually overriding the camera
  // If user drags, we might want to pause tracking? 
  // For simplicity, let's say tracking is "soft" - it pulls you, but you can fight it.
  
  useFrame((state, delta) => {
    if (!selectedSat || !controlsRef.current) return

    const data = getSatellitePosition(selectedSat.satrec, timeRef.current)
    if (!data) return

    const targetPos = new THREE.Vector3(data.pos[0], data.pos[1], data.pos[2])

    // 1. Move Controls Target (Focus Point) to the Satellite
    // Smooth lerp for cinematic feel
    const lerpFactor = 2.0 * delta // Adjust speed
    controlsRef.current.target.lerp(targetPos, lerpFactor)

    // 2. Move Camera Position?
    // If we want "Follow Mode", we should keep the camera at a constant offset relative to the sat.
    // Or simpler: Just keep the target locked, user can rotate around it.
    // Let's implement "Target Lock" first (Focus on Sat), as full "Follow" can be disorienting on a rotating earth.
    
    // However, if the sat is on the other side of the Earth, we DO need to move the camera.
    // Let's calculate a "Desire Camera Position" if distance is too far.
    
    const dist = camera.position.distanceTo(targetPos)
    if (dist > 10) {
       // If too far, zoom in smoothly
       const dir = new THREE.Vector3().subVectors(camera.position, targetPos).normalize()
       const desirePos = targetPos.clone().add(dir.multiplyScalar(8)) // Stay 8 units away
       camera.position.lerp(desirePos, lerpFactor * 0.5)
    }
    
    controlsRef.current.update()
  })

  return null
}
