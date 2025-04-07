import { useState, useEffect } from 'react'

export default function useGetLocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setError(null)
      },
      (err) => {
        setError(`Error: ${err.message}`)
      },
      {
        enableHighAccuracy: true, // Lebih akurat (mungkin butuh lebih banyak waktu)
        timeout: 10000, // Timeout 10 detik
        maximumAge: 0, // Jangan pakai cache, selalu ambil lokasi terbaru
      },
    )
  }

  useEffect(() => {
    // Cek izin lokasi sebelum meminta
    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          if (result.state === 'granted') {
            getLocation() // Langsung ambil lokasi jika sudah diizinkan
          } else if (result.state === 'prompt') {
            // Jika izin belum diberikan, bisa minta dengan button
            setError('Permission required to get location.')
          } else {
            setError('Location access was denied.')
          }
        })
    }
  }, [])

  return { getLocation, location, error }
}
