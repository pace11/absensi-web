import { useState, useEffect } from 'react'
import { getLocalTime } from '@/helpers/utils'
import { Typography } from 'antd'
import dayjs from 'dayjs'

const Clock = () => {
  const [time, setTime] = useState(getLocalTime())
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getLocalTime())
      setDate(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography.Text style={{ color: 'white' }}>
        Waktu hari ini
      </Typography.Text>
      <Typography.Title
        level={1}
        style={{ margin: 0, padding: 0, color: 'white' }}
      >
        {time || ''}
      </Typography.Title>
      <Typography.Text style={{ color: 'white' }}>
        {dayjs(date).locale('id').format('dddd, DD MMMM YYYY')}
      </Typography.Text>
    </div>
  )
}

export default Clock
