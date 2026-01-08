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
import { SearchBar } from './components/SearchBar'
import { CameraManager } from './components/CameraManager'
import { SettingsMenu } from './components/SettingsMenu' // New
import { BackgroundMusic } from './components/BackgroundMusic' // New
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
  // Custom effect composer logic if needed
  return null
}

function AppContent() {
  const { satellites, loading } = useStarlinkData()
  const { filterYear, bloomEnabled, setSelectedSat } = useSelection() // Get bloom state and setter
  const controlsRef = useRef()

  const visibleCount = loading ? 0 : (
      filterYear === 'ALL' 
      ? satellites.length 
      : satellites.filter(s => s.launchYear === filterYear).length
  )

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas 
        raycaster={{ params: { Points: { threshold: 0.15 } } }}
        onPointerMissed={() => setSelectedSat(null)}
      >
        <Suspense fallback={<Loading />}>
          <color attach="background" args={['#00050a']} />
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
          
          <ambientLight intensity={0.2} /> 
          <SunLight />
          
          <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
          
          <TimeManager />
          
          <Earth />
          {!loading && <Satellites satellites={satellites} />}
          
          <OrbitControls 
            ref={controlsRef}
            enablePan={false}
            minDistance={5.6}
            maxDistance={30}
          />

          <CameraManager controlsRef={controlsRef} />
          
          {/* Conditional Rendering of Post-Processing */}
          {bloomEnabled && (
            <EffectComposer>
              <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={2.0} />
            </EffectComposer>
          )}

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

      <SearchBar />
      <BackgroundMusic />
      <TimeControls />
      <InfoPanel />
      <SettingsMenu />

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
