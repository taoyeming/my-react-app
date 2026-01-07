import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, PerspectiveCamera, Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { RenderPass } from 'three-stdlib'
import { EffectComposer as ThreeEffectComposer } from 'three-stdlib'
import { AfterimagePass } from 'three-stdlib'
import { Suspense, useRef, useEffect } from 'react'
import { Earth } from './components/Earth'
import { Satellites } from './components/Satellites'
import { SunLight } from './components/SunLight'
import { TimeControls } from './components/TimeControls'
import { TimeManager } from './components/TimeManager'
import { InfoPanel } from './components/InfoPanel'
import { FilterControls } from './components/FilterControls'
import { useStarlinkData } from './hooks/useStarlinkData'
import { TimeProvider } from './context/TimeContext'
import { SelectionProvider, useSelection } from './context/SelectionContext'
import './App.css'

extend({ EffectComposer: ThreeEffectComposer, RenderPass, AfterimagePass })

function Loading() {
  return (
    <Html center>
      <div className="loading-container">
        <div className="radar-scope">
          <div className="radar-sweep"></div>
          <div className="radar-dot dot-1"></div>
          <div className="radar-dot dot-2"></div>
          <div className="radar-dot dot-3"></div>
        </div>
        <div className="loading-text">ESTABLISHING UPLINK...</div>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </Html>
  )
}

function Effects() {
  const composer = useRef()
  const { gl, scene, camera, size } = useThree()

  useEffect(() => {
    if (composer.current) {
      composer.current.setSize(size.width, size.height)
    }
  }, [size])

  useFrame(() => {
    if (composer.current) {
      composer.current.render()
    }
  }, 1) 

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" args={[scene, camera]} />
      <afterimagePass attachArray="passes" damp={0.7} /> 
    </effectComposer>
  )
}

function AppContent() {
  const { satellites, loading } = useStarlinkData()
  const { filterYear } = useSelection()

  const visibleCount = loading ? 0 : (
      filterYear === 'ALL' 
      ? satellites.length 
      : satellites.filter(s => s.launchYear === filterYear).length
  )

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas raycaster={{ params: { Points: { threshold: 0.05 } } }}>
        <Suspense fallback={<Loading />}>
          <color attach="background" args={['#00050a']} />
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
          
          {/* Dynamic Lighting System */}
          <ambientLight intensity={0.2} /> 
          <SunLight />
          
          <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
          
          <TimeManager />
          
          <Earth />
          {!loading && <Satellites satellites={satellites} />}
          
          <OrbitControls 
            enablePan={false}
            minDistance={5.6}
            maxDistance={30}
          />
          
          <EffectComposer>
            <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={2.0} />
          </EffectComposer>

        </Suspense>
      </Canvas>

      <div className="ui-overlay">
        <h1 className="title">Starlink Tracker 3D</h1>
        <p className="subtitle">Live Satellite Constellation Visualization</p>
        <div className="stats">
          <div className="stat-item">
            <span className="label">VISIBLE SATELLITES:</span>
            <span className="value">{loading ? '...' : visibleCount}</span>
          </div>
        </div>
      </div>

      <TimeControls />
      <InfoPanel />
      <FilterControls />

    </div>
  )
}

function App() {
  return (
    <TimeProvider>
      <SelectionProvider>
        <AppContent />
      </SelectionProvider>
    </TimeProvider>
  )
}

export default App