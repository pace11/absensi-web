import { useState, useEffect, useCallback, useRef } from 'react'
import { notification } from 'antd'

export default function useGetLocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState(null)

  const isRequestingRef = useRef(false)
  const triggeredManuallyRef = useRef(false)

  const notifyError = (title, desc) => {
    notification.error({
      message: title,
      description: desc,
      duration: 5,
    })
  }

  const fetchLocation = useCallback(() => {
    if (isRequestingRef.current) return

    isRequestingRef.current = true
    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        isRequestingRef.current = false
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLoading(false)
      },
      (err) => {
        isRequestingRef.current = false
        setLoading(false)

        let message =
          'Terjadi kesalahan saat mengambil lokasi. Pastikan Internet/Wi-Fi aktif dan coba beberapa saat lagi'
        if (err.code === err.PERMISSION_DENIED) {
          message = 'Akses lokasi ditolak.'
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          message =
            'Sistem tidak bisa menentukan lokasi kamu. Pastikan Internet/Wi-Fi aktif dan coba beberapa saat lagi'
        } else if (err.code === err.TIMEOUT) {
          message = 'Permintaan lokasi timeout.'
        }

        setError(message)
        notifyError('Gagal mengambil lokasi', message)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }, [])

  const getLocation = useCallback(
    (manual = false) => {
      if (manual) triggeredManuallyRef.current = true

      if (!navigator.geolocation) {
        const msg = 'Geolocation tidak didukung oleh browser ini.'
        setError(msg)
        notifyError('Tidak didukung', msg)
        return
      }

      if ('permissions' in navigator) {
        navigator.permissions
          .query({ name: 'geolocation' })
          .then((result) => {
            setPermissionStatus(result.state)

            if (result.state === 'denied') {
              const msg =
                'Akses lokasi ditolak. Silakan ubah di pengaturan browser.'
              setError(msg)
              notifyError('Ditolak', msg)
              return
            }

            fetchLocation()

            result.onchange = () => {
              setPermissionStatus(result.state)
            }
          })
          .catch(() => {
            const msg = 'Tidak dapat memeriksa status izin lokasi.'
            setError(msg)
            notifyError('Gagal akses permission', msg)
          })
      } else {
        fetchLocation()
      }
    },
    [fetchLocation],
  )

  useEffect(() => {
    getLocation()
  }, [getLocation])

  return {
    location,
    error,
    loading,
    permissionStatus,
    refreshLocation: () => getLocation(true),
  }
}
