import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getSatellitePosition } from '../services/satelliteService'
import { useTime } from '../context/TimeContext'
import { useSelection } from '../context/SelectionContext'
import { SatelliteModel } from './SatelliteModel'
import { OrbitLine } from './OrbitLine'

// Module-level variable to persist animation start time across React remounts (StrictMode)
let globalAnimationStart = null

const SatelliteShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: 1 }
  },
  vertexShader: `
    uniform float uTime;
    uniform float uPixelRatio;
    attribute vec3 color;
    attribute float aStartTime;
    
    varying vec3 vColor;
    varying float vAge;

    void main() {
      float age = uTime - aStartTime;
      vAge = age;

      vec3 finalColor = color;
      float pointSize = 0.0;

      if (age > 0.0) {
        if (age < 0.2) {
           float t = age / 0.2;
           // Reduced size: 12.0 -> 6.0
           pointSize = 6.0 * uPixelRatio * t; 
           finalColor = vec3(1.0); 
        } else {
           float t = (age - 0.2) * 2.0;
           float settleFactor = exp(-t * 3.0);
           // Reduced size: 5.0 -> 2.5, 10.0 -> 5.0
           pointSize = (2.5 + 5.0 * settleFactor) * uPixelRatio; 
           finalColor = mix(color, vec3(1.0), settleFactor);
        }
      }

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = pointSize * (20.0 / length(mvPosition.xyz));
      gl_Position = projectionMatrix * mvPosition;

      vColor = finalColor;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    varying float vAge;

    void main() {
      if (vAge <= 0.0) discard;

      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      
      float radius = 0.45;
      float edge = 0.05;
      float alpha = 1.0 - smoothstep(radius - edge, radius, dist);
      
      if (alpha < 0.1) discard;

      float strokeWidth = 0.1;
      float isStroke = smoothstep(radius - strokeWidth - edge, radius - strokeWidth, dist);
      vec3 finalRGB = mix(vColor, vColor * 0.3, isStroke); 

      gl_FragColor = vec4(finalRGB, alpha);
    }
  `
}

export function Satellites({ satellites }) {
  const geometryRef = useRef()
  const materialRef = useRef()
  const { timeRef } = useTime()
  const { camera, gl } = useThree()
  const { filterYear, setSelectedSat, selectedSat } = useSelection()
  const lastUpdateRef = useRef(0)
  
  const [nearestSat, setNearestSat] = useState(null)
  const [introStartTime, setIntroStartTime] = useState(null)

  const { positions, colors, startTimes } = useMemo(() => {
    const count = satellites?.length || 0
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const start = new Float32Array(count)

    for (let i = 0; i < count; i++) {
        col[i*3] = 0; col[i*3+1] = 1; col[i*3+2] = 1;
        start[i] = Math.random() * 2.0; 
    }
    return { positions: pos, colors: col, startTimes: start }
  }, [satellites])

  useEffect(() => {
    if (satellites.length > 0) {
      // If we haven't started animation globally, set it now
      if (!globalAnimationStart) {
        globalAnimationStart = Date.now()
      }
      // Use the global start time
      setIntroStartTime(globalAnimationStart)
    }
  }, [satellites])

  useFrame(({ clock }) => {
    if (!geometryRef.current || !satellites || satellites.length === 0) return

    if (materialRef.current && introStartTime) {
      materialRef.current.uniforms.uTime.value = (Date.now() - introStartTime) / 1000
      materialRef.current.uniforms.uPixelRatio.value = gl.getPixelRatio()
    }

    if (clock.elapsedTime - lastUpdateRef.current < 0.05) return
    lastUpdateRef.current = clock.elapsedTime

    const currentTime = timeRef.current
    const posAttribute = geometryRef.current.attributes.position
    const colAttribute = geometryRef.current.attributes.color
    const cameraPos = camera.position

    let minDistSq = Infinity
    let closestIndex = -1
    let closestPos = new THREE.Vector3()

    const tempColor = new THREE.Color()

    satellites.forEach((sat, i) => {
      if (filterYear !== 'ALL' && sat.launchYear !== filterYear) {
        posAttribute.setXYZ(i, 0, 0, 0)
        return 
      }

      const data = getSatellitePosition(sat.satrec, currentTime)
      if (data) {
        const { pos } = data
        if (nearestSat && nearestSat.index === i) {
           posAttribute.setXYZ(i, 0, 0, 0)
        } else {
           posAttribute.setXYZ(i, pos[0], pos[1], pos[2])
        }

        if (selectedSat && selectedSat.noradId === sat.noradId) {
            colAttribute.setXYZ(i, 1, 0, 1) 
        } else {
            const r = Math.sqrt(pos[0]*pos[0] + pos[1]*pos[1] + pos[2]*pos[2])
            let t = (r - 5.2) / (5.45 - 5.2)
            t = Math.max(0, Math.min(1, t)) 
            const hue = 0.05 + (0.45 * t) 
            tempColor.setHSL(hue, 1.0, 0.5)
            colAttribute.setXYZ(i, tempColor.r, tempColor.g, tempColor.b)
        }

        const distSq = cameraPos.distanceToSquared(new THREE.Vector3(pos[0], pos[1], pos[2]))
        if (distSq < minDistSq) {
          minDistSq = distSq
          closestIndex = i
          closestPos.set(pos[0], pos[1], pos[2])
        }
      }
    })
    
    posAttribute.needsUpdate = true
    colAttribute.needsUpdate = true

    const LOD_THRESHOLD = 0.8
    if (closestIndex !== -1 && minDistSq < LOD_THRESHOLD * LOD_THRESHOLD) {
      const closestSatData = satellites[closestIndex]
      if (filterYear === 'ALL' || closestSatData.launchYear === filterYear) {
          const dummyObj = new THREE.Object3D()
          dummyObj.position.copy(closestPos)
          dummyObj.lookAt(0, 0, 0) 
          const newRotation = dummyObj.rotation.clone()

          if (!nearestSat || nearestSat.index !== closestIndex) {
            setNearestSat({ index: closestIndex, position: closestPos, rotation: newRotation })
          } else {
            setNearestSat(prev => ({ ...prev, position: closestPos, rotation: newRotation }))
          }
      } else {
          if (nearestSat) setNearestSat(null)
      }
    } else {
      if (nearestSat) setNearestSat(null)
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    const index = e.index
    if (index !== undefined && satellites[index]) {
      const sat = satellites[index]
      if (filterYear !== 'ALL' && sat.launchYear !== filterYear) return;
      const data = getSatellitePosition(sat.satrec, timeRef.current)
      if (!data) return
      const satPos = new THREE.Vector3(data.pos[0], data.pos[1], data.pos[2])
      const cameraPos = camera.position
      const rayDir = new THREE.Vector3().subVectors(satPos, cameraPos).normalize()
      const b = 2 * (cameraPos.dot(rayDir))
      const c = cameraPos.lengthSq() - (4.95 * 4.95)
      const disc = b*b - 4*c
      if (disc > 0 && ((-b - Math.sqrt(disc)) / 2) < cameraPos.distanceTo(satPos)) return
      setSelectedSat(sat)
    }
  }

  return (
    <>
      <points onClick={handleClick}>
        <bufferGeometry ref={geometryRef}>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
          <bufferAttribute attach="attributes-aStartTime" count={startTimes.length} array={startTimes} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial 
           ref={materialRef}
           attach="material"
           args={[SatelliteShaderMaterial]}
           transparent={true}
           depthWrite={false}
           blending={THREE.NormalBlending} 
        />
      </points>

      {nearestSat && (
        <SatelliteModel position={nearestSat.position} rotation={nearestSat.rotation} />
      )}

      {selectedSat && (
         <OrbitLine satrec={selectedSat.satrec} startTime={new Date()} />
      )}
    </>
  )
}