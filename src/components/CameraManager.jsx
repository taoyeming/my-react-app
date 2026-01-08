import { useFrame, useThree } from '@react-three/fiber'
import { useSelection } from '../context/SelectionContext'
import { useTime } from '../context/TimeContext'
import { getSatellitePosition } from '../services/satelliteService'
import * as THREE from 'three'
import { useEffect } from 'react'

export function CameraManager({ controlsRef }) {
  const { selectedSat } = useSelection()
  const { timeRef } = useTime()
  const { camera } = useThree()
  
  // Disable/Enable controls based on selection
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !selectedSat
    }
  }, [selectedSat, controlsRef])

  useFrame((state, delta) => {
    if (!selectedSat) {
      // RESET LOGIC: Return to Earth-centered view
      if (!controlsRef.current) return

      const defaultTarget = new THREE.Vector3(0, 0, 0)
      const defaultUp = new THREE.Vector3(0, 1, 0)
      const distToCenter = controlsRef.current.target.distanceTo(defaultTarget)
      
      // If we are still in the "transition back" phase
      if (distToCenter > 0.001 || camera.up.distanceTo(defaultUp) > 0.001 || camera.position.length() < 12) {
        const lerpFactor = delta * 5.0

        // 1. Smoothly return target to Earth center
        controlsRef.current.target.lerp(defaultTarget, lerpFactor)
        
        // 2. Smoothly reset Up vector to world-up
        const currentUp = camera.up.clone()
        currentUp.lerp(defaultUp, lerpFactor)
        camera.up.copy(currentUp)

        // 3. Zoom out if we were in close-up tracking mode
        // If distance is less than 15, pull back
        if (camera.position.length() < 15) {
          const currentDir = camera.position.clone().normalize()
          const targetCamPos = currentDir.multiplyScalar(15)
          camera.position.lerp(targetCamPos, lerpFactor)
        }

        controlsRef.current.update()
      }
      return
    }

    const now = timeRef.current
    const data = getSatellitePosition(selectedSat.satrec, now)
    if (!data) return

    const targetPos = new THREE.Vector3(data.pos[0], data.pos[1], data.pos[2])

    // Calculate orientation for Chase Cam
    const futureDate = new Date(now.getTime() + 1000) 
    const futureData = getSatellitePosition(selectedSat.satrec, futureDate)
    
    if (futureData) {
      const futurePos = new THREE.Vector3(futureData.pos[0], futureData.pos[1], futureData.pos[2])
      
      // Basis Vectors
      const forward = new THREE.Vector3().subVectors(futurePos, targetPos).normalize()
      const up = targetPos.clone().normalize() // Perpendicular to Earth Core
      const right = new THREE.Vector3().crossVectors(forward, up).normalize()
      
      // Chase Camera Position parameters
      // Primary: Above (distanceUp), Secondary: Behind (distanceBack)
      const distanceUp = 0.18    // Primarily above
      const distanceBack = 0.06  // Slightly behind
      const distanceSide = 0.03  // Tiny side offset for depth
      
      const desiredCamPos = targetPos.clone()
        .add(forward.clone().multiplyScalar(-distanceBack))
        .add(up.clone().multiplyScalar(distanceUp))
        .add(right.clone().multiplyScalar(distanceSide))

      // DYNAMIC LERP for Smooth "Move Over" + Strict "Tracking"
      // If we are far (switching sats), use low factor for flight.
      // If we are close (tracking), use high factor for lock.
      const dist = camera.position.distanceTo(desiredCamPos)
      const isFar = dist > 2.0
      
      // Tuned factors: 
      // 2.0 = smooth flight across globe
      // 10.0 = tight tracking
      const lerpFactor = isFar ? 2.0 : 10.0 

      // 1. Move Camera
      camera.position.lerp(desiredCamPos, delta * lerpFactor)
      
      // 2. Align Up Vector (Lerp this too for smooth roll)
      const currentUp = camera.up.clone()
      currentUp.lerp(up, delta * lerpFactor)
      camera.up.copy(currentUp)
      
      // 3. Look At Target
      // We need to lerp the look-at point too, otherwise rotation snaps.
      // OrbitControls target serves as our persistent "look at" point.
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetPos, delta * lerpFactor)
        camera.lookAt(controlsRef.current.target)
        controlsRef.current.update()
      }
    }
  })

  return null
}
