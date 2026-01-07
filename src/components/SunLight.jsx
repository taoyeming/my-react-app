import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTime } from '../context/TimeContext'
import * as THREE from 'three'

export function SunLight() {
  const lightRef = useRef()
  const { timeRef } = useTime()

  useFrame(() => {
    if (!lightRef.current) return
    
    // Simulate Sun position based on time
    // Earth rotates 360 degrees in 24 hours.
    // In our scene, Earth texture is fixed (0 rotation offset initially), 
    // so we rotate the Light around the Earth to simulate day/night cycle.
    
    const now = timeRef.current
    const hours = now.getUTCHours()
    const minutes = now.getUTCMinutes()
    const totalHours = hours + minutes / 60
    
    // Angle: Noon (12:00 UTC) -> Sun at Z+ (Front) or specific longitude?
    // Let's align roughly: 
    // 00:00 UTC -> Sun at opposite side of Prime Meridian.
    // 12:00 UTC -> Sun at Prime Meridian.
    
    // 24 hours = 2PI
    const angle = (totalHours / 24) * Math.PI * 2
    
    // Orbit radius for light (far enough to be parallel rays)
    const r = 50 
    
    // Calculate X, Z (assuming Sun orbits around Y axis for simplicity in this vis)
    // Actually, realistic sun declination changes by season, but let's stick to equatorial orbit for clear day/night
    // We want the sun to move from East to West relative to surface, 
    // which means Light source moves West to East? 
    // No, Earth rotates West to East. So Light can be static if we rotated Earth mesh.
    // But our Satellites rely on Earth being static ECEF?
    // Wait, my satellite logic `eciToGeodetic` -> `spherical to cartesian`.
    // ECI (Earth Centered Inertial) frame: Earth Rotates.
    // ECEF (Earth Centered Earth Fixed) frame: Earth is Static.
    
    // My `satelliteService.js` logic:
    // It converts ECI to Geodetic (Lat/Lon). 
    // Then converts Lat/Lon to 3D Sphere Point.
    // This places the satellite correctly above the *Texture* of the static earth sphere.
    // So my scene is essentially ECEF (Earth is fixed, texture matches Lat/Lon).
    
    // In ECEF, the Sun *moves* around the Earth once every 24h.
    // So yes, I need to rotate the Light source.
    
    // At 12:00 UTC, Sun is roughly over Greenwich (Lon 0).
    // In Three.js, my Earth texture has Prime Meridian at... usually +Z or -Z depending on UVs.
    // Standard Earth texture: Prime Meridian is at UV u=0.5? 
    // Let's assume standard alignment.
    
    const x = r * Math.sin(angle - Math.PI) // Offset to match texture phase
    const z = r * Math.cos(angle - Math.PI)
    
    lightRef.current.position.set(x, 0, z)
  })

  return (
    <directionalLight 
      ref={lightRef}
      intensity={3.0} 
      castShadow 
      color="#ffffee"
    />
  )
}
