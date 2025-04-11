import dynamic from 'next/dynamic'
import {
  Card,
  Typography,
  Button,
  notification,
  Table,
  Row,
  Col,
  Tag,
} from 'antd'
// import useGetLocation from '@/hooks/useGetLocation'
import Axios from 'axios'
import { useState } from 'react'
import { useFetching } from '@/hooks/useFetching'
import { useRouter } from 'next/router'
import { BADGE_STATUS } from '@/constants'

const Clock = dynamic(() => import('@/components/clock'), {
  ssr: false,
})

export default function Absensi() {
  const router = useRouter()
  const {
    data: attendances,
    isLoading,
    reloadData,
  } = useFetching({
    path: '/api/attend/user',
  })

  // const { getLocation, location } = useGetLocation()

  const [loading, setLoading] = useState(false)

  const handleAttendances = async (type) => {
    const message = {
      check_in: 'Absen masuk selesai',
      check_out: 'Absen pulang selesai',
    }
    setLoading(type)
    // if (location?.lat && location?.lng) {
    try {
      await Axios({
        url: `/api/attend/create?type=${type}`,
        method: 'POST',
        data: {
          // coordinates: `${location?.lat || ''},${
          //   location?.lng || ''
          // }`,
          coordinates: 'lat,lng',
        },
      })
      notification.success({
        message: 'Info',
        description: message[type],
        duration: 2,
      })
    } catch (error) {
      if (!!error?.response?.data?.message) {
        notification.error({
          message: 'Error',
          description: `${error.response.data.message}`,
          duration: 2,
        })
      }
    } finally {
      reloadData()
      setLoading(false)
    }
    // }
  }

  const attendanceColumns = [
    {
      title: 'Jam Masuk',
      key: 'check_in',
      render: ({ check_in }) => (
        <Typography.Text>{check_in || '-'}</Typography.Text>
      ),
    },
    {
      title: 'Jam Pulang',
      key: 'check_out',
      render: ({ check_out }) => (
        <Typography.Text>{check_out || '-'}</Typography.Text>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: ({ status }) =>
        status ? (
          <Tag color={BADGE_STATUS?.[status]?.color}>
            {BADGE_STATUS?.[status]?.text}
          </Tag>
        ) : (
          '-'
        ),
    },
    {
      title: 'Aksi',
      render: () => (
        <Button
          size="small"
          type="default"
          onClick={() => router.push('/kalender')}
        >
          Lihat detail
        </Button>
      ),
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        variant="borderless"
        style={{
          width: 500,
          background: 'linear-gradient(to right, #1677ff, #0050c0)',
          color: 'white',
        }}
      >
        <Clock />
        <Card variant="borderless" style={{ marginTop: '20px' }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Row align="middle" justify="center">
                <Typography.Text>Waktu Kerja Normal</Typography.Text>
              </Row>
            </Col>
            <Col span={24}>
              <Row align="middle" justify="center">
                <Typography.Title
                  level={3}
                  style={{ padding: 0, margin: 0 }}
                >
                  08:00 - 17:00
                </Typography.Title>
              </Row>
            </Col>
            <Col span={24}>
              <Row align="middle" justify="space-around">
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    // getLocation()
                    handleAttendances('check_in')
                  }}
                  loading={loading === 'check_in'}
                >
                  Masuk
                </Button>
                <Button
                  type="dashed"
                  size="large"
                  onClick={() => router.push('/ijin')}
                >
                  Ijin
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => handleAttendances('check_out')}
                  loading={loading === 'check_out'}
                >
                  Pulang
                </Button>
              </Row>
            </Col>
            <Col span={24}>
              <Table
                rowKey="attendances"
                size="small"
                columns={attendanceColumns}
                dataSource={
                  attendances?.length > 0
                    ? attendances
                    : [{ check_in: '', check_out: '' }]
                }
                pagination={false}
                loading={isLoading}
              />
            </Col>
          </Row>
        </Card>
      </Card>
    </div>
  )
}
