import { useState, useEffect, useRef } from 'react'
import { useSelection } from '../context/SelectionContext'

export function BackgroundMusic() {
  const AUDIO_URL = 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Stellardrone/Light_Years/Stellardrone_-_01_-_Red_Giant.mp3'
  
  const { musicEnabled, setMusicEnabled } = useSelection()
  const audioRef = useRef(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(AUDIO_URL)
      audioRef.current.loop = true
      audioRef.current.volume = 0.4
    }

    const playAudio = () => {
      if (!musicEnabled || !audioRef.current) return;
      audioRef.current.play().catch(err => {
        console.warn("Autoplay blocked. User interaction required.")
      })
    }

    if (musicEnabled) {
      playAudio()
    }

    // Still keep interaction listener but ONLY if music is supposed to be enabled
    const handleFirstInteraction = () => {
      if (musicEnabled && audioRef.current && audioRef.current.paused) {
        playAudio()
      }
      window.removeEventListener('click', handleFirstInteraction)
    }

    window.addEventListener('click', handleFirstInteraction)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      window.removeEventListener('click', handleFirstInteraction)
    }
  }, [])

  // Sync Audio Playback with Context State
  useEffect(() => {
    if (!audioRef.current) return
    
    if (musicEnabled) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(e => console.warn("Playback blocked"))
      }
    } else {
      audioRef.current.pause()
    }
  }, [musicEnabled])

  return null // No UI here, logic only
}
