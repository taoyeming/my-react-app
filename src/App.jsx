import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, PerspectiveCamera, Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { RenderPass } from 'three-stdlib'
import { EffectComposer as ThreeEffectComposer } from 'three-stdlib'
import { AfterimagePass } from 'three-stdlib'
import { Suspense, useRef, useEffect } from 'react'
import { Earth } from './components/Earth'
import { Satellites } from './components/Satellites'
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
  }, 1) // Render priority 1 (after default)

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" args={[scene, camera]} />
      {/* damp: 0.8 means 80% of the previous frame is kept. High trail. */}
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
          
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={3} />
          
          <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
          
          <TimeManager />
          
          <Earth />
          {!loading && <Satellites satellites={satellites} />}
          
          <OrbitControls 
            enablePan={false}
            minDistance={5.6}
            maxDistance={30}
          />
          
          {/* Post-Processing Pipeline */}
          {/* We use standard EffectComposer from pmndrs for Bloom, but simple Afterimage via stdlib */}
          {/* Mixing them is tricky. Let's stick to just pmndrs Bloom for now and add a custom Afterimage if needed.
              Actually, simply enabling Bloom gives a "glow" which is often mistaken for trails.
              Let's try pure Bloom first as it's cleaner. */}
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
