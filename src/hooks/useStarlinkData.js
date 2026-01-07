import { useState, useEffect } from 'react'
import { fetchStarlinkTle } from '../services/satelliteService'

export function useStarlinkData() {
  const [satellites, setSatellites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStarlinkTle()
      .then(data => {
        setSatellites(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return { satellites, loading, error }
}
