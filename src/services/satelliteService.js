import * as satellite from 'satellite.js'

const STARLINK_TLE_URL = '/starlink.tle' // Use local mock data to avoid 403 block

export async function fetchStarlinkTle() {
  try {
    const response = await fetch(STARLINK_TLE_URL)
    if (!response.ok) throw new Error('Failed to fetch TLE data')
    const data = await response.text()
    return parseTle(data)
  } catch (error) {
    console.error('Error fetching TLE:', error)
    return []
  }
}

function parseTle(tleData) {
  const lines = tleData.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  const satellites = []

  for (let i = 0; i < lines.length; i += 3) {
    if (lines[i] && lines[i+1] && lines[i+2]) {
      // Parse Line 2 for NORAD ID (columns 3-7)
      const line2 = lines[i+2]
      const noradId = line2.substring(2, 7).trim()

      // Parse Line 1 for Int'l Designator (columns 10-17) => Launch Year + Launch Number
      // Example: 23042A (2023, launch 042)
      const line1 = lines[i+1]
      const intlDes = line1.substring(9, 17).trim()
      
      // Parse Year: 
      // If first two digits < 57, it's 2000s (e.g. 23 -> 2023)
      // Else 1900s (e.g. 98 -> 1998)
      let yearPrefix = parseInt(intlDes.substring(0, 2))
      let fullYear = yearPrefix < 57 ? 2000 + yearPrefix : 1900 + yearPrefix

      satellites.push({
        name: lines[i],
        line1: lines[i+1],
        line2: lines[i+2],
        satrec: satellite.twoline2satrec(lines[i+1], lines[i+2]),
        noradId: noradId,
        intlDes: intlDes,
        launchYear: fullYear
      })
    }
  }
  return satellites
}

export function getSatellitePosition(satrec, date) {
  const positionAndVelocity = satellite.propagate(satrec, date)
  if (!positionAndVelocity || !positionAndVelocity.position) return null

  const positionEci = positionAndVelocity.position

  // Also return velocity for speed calc (in km/s)
  const velocityEci = positionAndVelocity.velocity

  const gmst = satellite.gstime(date)
  const positionGd = satellite.eciToGeodetic(positionEci, gmst)

  const longitude = positionGd.longitude
  const latitude = positionGd.latitude
  const height = positionGd.height // in km

  const earthRadius = 5
  const scale = earthRadius / 6371
  const r = earthRadius + (height * scale)

  const x = r * Math.cos(latitude) * Math.cos(longitude)
  const y = r * Math.sin(latitude)
  const z = -r * Math.cos(latitude) * Math.sin(longitude)

  // Calculate speed in km/h
  // v = sqrt(vx^2 + vy^2 + vz^2)
  const velocityKmS = Math.sqrt(
    velocityEci.x * velocityEci.x + 
    velocityEci.y * velocityEci.y + 
    velocityEci.z * velocityEci.z
  )

  return {
    pos: [x, y, z],
    heightKm: height,
    speedKmH: velocityKmS * 3600
  }
}