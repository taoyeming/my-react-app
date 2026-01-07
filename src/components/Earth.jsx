import { useTexture } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Earth() {
  const earthRef = useRef()
  const cloudsRef = useRef()

  const [colorMap, normalMap, specularMap, cloudsMap, lightsMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png', // Night lights
  ])

  // Enhance the night lights texture explicitly
  // lightsMap.encoding = THREE.sRGBEncoding

  return (
    <group>
      {/* Earth Mesh */}
      <mesh ref={earthRef} rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          specularMap={specularMap}
          emissiveMap={lightsMap}
          emissive={new THREE.Color(0xffff88)}
          emissiveIntensity={0.6}
          shininess={15}
        />
      </mesh>

      {/* Clouds Mesh */}
      <mesh ref={cloudsRef} rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[5.05, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending} 
        />
      </mesh>
    </group>
  )
}
