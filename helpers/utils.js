import { Badge } from 'antd'
import dayjs from 'dayjs'
import bcrypt from 'bcryptjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrBefore)

export const getDistanceFromLatLonInMeters = ({
  lat1 = 0,
  lon1 = 0,
  lat2 = 0,
  lon2 = 0,
}) => {
  if (!lat2 && !lon2) return 0
  const R = 6371000 // radius Bumi dalam meter
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return Math.round(distance) // dalam meter
}

export const roundTo = (value, decimals = 5) =>
  Math.round(value * 10 ** decimals) / 10 ** decimals

export const getLocalTime = () => {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(new Date())
    .replace('.', ':')
}

export const getDatesInMonth = ({ year, month } = {}) => {
  const dates = []
  const daysInMonth = new Date(year, month, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    dates.push(
      date
        .toLocaleDateString('id-ID', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .split('/')
        .reverse()
        .join('-'),
    )
  }

  return dates
}

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

export const checkPassword = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword)
  return match
}

export const convertLatLng = (string = '') => {
  if (!string) return null
  return String(string).replace(' ', '').split(',')
}

export const badgeStatus = (status = 'checked_in') => {
  const mapping = {
    checked_in: {
      status: 'processing',
      text: 'Absen Masuk',
    },
    present: {
      status: 'success',
      text: 'Absen Full',
    },
    absent: {
      status: 'error',
      text: 'Tidak Hadir',
    },
    leave: {
      status: 'warning',
      text: 'Ijin/Cuti/Sakit',
    },
  }
  return mapping[status]
}

export const getDateRange = (start, end) => {
  const dates = []
  let current = dayjs(start)
  const last = dayjs(end)

  while (current.isSameOrBefore(last, 'day')) {
    const day = current.day()
    if (![0, 6].includes(day)) {
      dates.push(current.format('YYYY-MM-DD HH:mm:ss'))
    }
    current = current.add(1, 'day')
  }

  return dates
}

export const convertDateRange = (dateRange) => {
  return (
    dateRange
      ?.split(',')
      ?.map((date) =>
        dayjs(date).locale('id').format('dddd DD MMMM YYYY'),
      )
      .join(', ') || '-'
  )
}

export const badgeStatusLeave = (status) => (
  <Badge
    status={Boolean(status) ? 'success' : 'processing'}
    text={Boolean(status) ? 'Disetujui' : 'Menunggu disetujui'}
  />
)
