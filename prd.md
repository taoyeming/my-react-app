# Product Requirements Document: 3D Starlink Tracker

## 1. Project Overview
A web-based 3D visualization application that renders the Earth and the live constellation of Starlink satellites. The application aims to provide a realistic visual experience using high-resolution Earth textures and accurate satellite positioning based on orbital elements (TLE data).

## 2. Core Features
- **3D Interactive Globe:**
    - Zoomable and rotatable Earth model.
    - Realistic texturing (Day map, Bump map for topography, Specular map for oceans).
    - Atmospheric glow effect.
- **Starlink Constellation:**
    - Visualization of thousands of active Starlink satellites.
    - Real-time position calculation using SGP4 propagation (via `satellite.js`).
    - Efficient rendering using Instanced Meshes to handle high object counts.
- **Data Source:**
    - Fetch Two-Line Element (TLE) sets from CelesTrak (publicly available satellite data).

## 3. Technology Stack
- **Framework:** React (Vite build tool).
- **3D Engine:** Three.js.
- **React Adapter:** React Three Fiber (R3F) & @react-three/drei (helpers).
- **Math/Physics:** `satellite.js` (for SGP4 orbital propagation).
- **Styling:** CSS Modules or Styled Components (minimal).

## 4. Non-Functional Requirements
- **Performance:** Must maintain 60FPS while rendering 3000+ satellite objects.
- **Responsiveness:** Canvas must resize to fit the browser window.
- **Visuals:** High-quality assets (textures) loaded asynchronously.

## 5. User Flow
1. User opens the webpage.
2. A loading screen appears while Earth textures and TLE data are fetched.
3. The 3D scene renders:
   - A realistic Earth is centered.
   - Thousands of small dots (satellites) orbit the Earth.
4. User can drag to rotate the view and scroll to zoom in/out.
