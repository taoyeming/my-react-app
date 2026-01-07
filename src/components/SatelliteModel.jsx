import { useRef } from 'react'

export function SatelliteModel({ position, rotation }) {
  const groupRef = useRef()

  return (
    <group ref={groupRef} position={position} rotation={rotation} dispose={null}>
      <group scale={0.03}> {/* Scale increased to 3x current size */}
        
        {/* Main Chassis (Flat rectangular body) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.05, 0.3]} />
          <meshStandardMaterial 
            color="#e0e0e0" 
            roughness={0.4} 
            metalness={0.6} 
          />
        </mesh>

        {/* Solar Array (Single large panel extending up/out) */}
        {/* Starlink satellites often have a single large vertical array ("Shark fin") or deployed flat */}
        <mesh position={[0, 0.35, 0]} rotation={[0.2, 0, 0]}> 
          <boxGeometry args={[0.02, 0.7, 0.3]} /> 
          <meshStandardMaterial 
            color="#1a2b4a" 
            roughness={0.2} 
            metalness={0.8}
            emissive="#0a1b3a"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Detail: Comms array underneath */}
        <mesh position={[0, -0.03, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.2]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Connection Hinge */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
    </group>
  )
}