import { Alert, Badge } from 'antd'
import Axios from 'axios'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'
import bcrypt from 'bcryptjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrBefore)

export const getMeApi = async ({ token }) => {
  try {
    const result = await Axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_API}/user/me`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const updatePasswordApi = async ({ payload, token }) => {
  try {
    const result = await Axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API}/update-password`,
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const authApi = async ({ endpoint, payload }) => {
  try {
    const result = await Axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      data: payload,
    })
    return result
  } catch (error) {
    throw error
  }
}

export const logoutApi = async () => {
  try {
    const result = await Axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_API}/logout`,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_simpeg')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const createApi = async ({ endpoint, payload }) => {
  try {
    const result = await Axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_simpeg')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const updateApi = async ({
  endpoint,
  payload,
  method = 'PATCH',
}) => {
  try {
    const result = await Axios({
      method,
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_simpeg')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const deleteApi = async ({ endpoint }) => {
  try {
    const result = await Axios({
      method: 'DELETE',
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_simpeg')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const restoreApi = async ({ endpoint }) => {
  try {
    const result = await Axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API}${endpoint}`,
      headers: {
        Authorization: `Bearer ${Cookies.get('token_simpeg')}`,
      },
    })
    return result
  } catch (error) {
    throw error
  }
}

export const randomColor = () => {
  const color = [
    '#f9ca24',
    '#f0932b',
    '#f9ca24',
    '#6ab04c',
    '#5B8FF9',
    '#5B8FF9',
    '#eb4d4b',
    '#eb4d4b',
    '#be2edd',
    '#e056fd',
    '#7ed6df',
    '#30336b',
  ]
  const randomNumber = Math.round(
    Math.random() * (color.length - 0) + 0,
  )
  return color[randomNumber]
}

export const roleUser = ({ user = {} }) => {
  return String(user?.role || '').toLocaleLowerCase()
}

export const messageGolongan = ({ data = {} }) => {
  const diff = dayjs().diff(data?.tmt_golongan, 'year')

  if (diff >= 2)
    return (
      <Alert
        message="Sudah siap untuk naik golongan ke selanjutnya"
        type="success"
        showIcon
      />
    )
  return null
}

export const statusKinerja = ({ value = 0 }) => {
  if (value >= 90) {
    return <Alert message="Sangat Baik" type="success" showIcon />
  }

  if (value >= 75 && value < 90) {
    return <Alert message="Cukup Baik" type="success" showIcon />
  }

  if (value >= 60 && value < 75) {
    return <Alert message="Baik" type="success" showIcon />
  }

  return (
    <Alert message="Perlu ditingkatkan" type="warning" showIcon />
  )
}

export const getMonthId = ({ month = 0 }) => {
  const mapping = [
    '',
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]
  return mapping?.[month]
}

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

export const convertLatLng = (string) => {
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
