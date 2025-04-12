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
  Alert,
} from 'antd'
import useGetLocation from '@/hooks/useGetLocation'
import Axios from 'axios'
import { useState } from 'react'
import { useFetching } from '@/hooks/useFetching'
import { BADGE_STATUS } from '@/constants'
import { AimOutlined } from '@ant-design/icons'
import { roundTo } from '@/helpers/utils'
import {
  getDistanceFromLatLonInMeters,
  convertLatLng,
} from '@/helpers/utils'

const Clock = dynamic(() => import('@/components/clock'), {
  ssr: false,
})

export default function Absensi({ holiday }) {
  const {
    data: attendances,
    isLoading,
    reloadData,
  } = useFetching({
    path: '/api/attend/user',
  })
  const { data: setting } = useFetching({ path: '/api/setting' })
  const settingLocation = convertLatLng(
    setting?.[0]?.coordinates || '',
  )

  const {
    location,
    loading: loadingLocation,
    refreshLocation,
  } = useGetLocation()

  const radiusInMeters = getDistanceFromLatLonInMeters({
    lat1: settingLocation?.[0],
    lon1: settingLocation?.[1],
    lat2: location?.lat || 0,
    lon2: location?.lng || 0,
  })

  const [loading, setLoading] = useState(false)

  const handleAttendances = async (type) => {
    const message = {
      check_in: 'Absen masuk selesai',
      check_out: 'Absen pulang selesai',
    }
    setLoading(type)
    try {
      await Axios({
        url: `/api/attend/create?type=${type}`,
        method: 'POST',
        data: {
          coordinates: `${location?.lat || 'lat'},${
            location?.lng || 'lng'
          }`,
          radius: radiusInMeters,
        },
      })
      notification.success({
        message: 'Info',
        description: message[type],
        duration: 5,
      })
    } catch (error) {
      if (!!error?.response?.data?.message) {
        notification.error({
          message: 'Error',
          description: `${error.response.data.message}`,
          duration: 5,
        })
      }
    } finally {
      reloadData()
      setLoading(false)
    }
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
  ]

  return (
    <Row
      gutter={[16, 16]}
      style={{ flexDirection: 'column' }}
      align="middle"
      justify="center"
    >
      {!holiday && (
        <Col
          lg={10}
          xl={10}
          xxl={10}
          md={18}
          sm={24}
          xs={24}
          style={{ width: '100%' }}
        >
          <Alert
            message={`Pastikan lokasi Anda terdeteksi dengan benar sebelum melakukan absensi. Sistem membutuhkan akurasi lokasi dalam radius maksimal ${
              setting?.[0]?.radius || 0
            } meter`}
            type="info"
            showIcon
          />
        </Col>
      )}
      <Col lg={10} xl={10} xxl={10} md={18} sm={24} xs={24}>
        <Card
          variant="borderless"
          style={{
            background: 'linear-gradient(to right, #1677ff, #0050c0)',
            color: 'white',
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Clock />
            </Col>
            {holiday && (
              <Col span={24}>
                <Alert
                  message="Sabtu & Minggu Libur"
                  type="warning"
                  showIcon
                />
              </Col>
            )}
            {!holiday && (
              <>
                <Col span={24}>
                  <Row align="middle" justify="center">
                    <Button
                      type="dashed"
                      onClick={() => refreshLocation()}
                      icon={<AimOutlined />}
                      loading={loadingLocation}
                    >
                      Ambil Lokasi
                    </Button>
                  </Row>
                </Col>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Typography.Text
                    style={{ color: 'white' }}
                  >{`Lat: ${
                    location?.lat ? roundTo(location.lat) : '?'
                  }, Lng: ${
                    location?.lng ? roundTo(location.lng) : '?'
                  }`}</Typography.Text>
                </Col>
                {!!location?.lng && location?.lat && (
                  <Col span={24} style={{ textAlign: 'center' }}>
                    <Typography.Text
                      style={{ color: 'white' }}
                    >{`radius: ${radiusInMeters} meter`}</Typography.Text>
                  </Col>
                )}
              </>
            )}
          </Row>
          <Card variant="borderless" style={{ marginTop: '20px' }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Row>
                  <Col span={24} style={{ textAlign: 'center' }}>
                    <Typography.Text>
                      Waktu Kerja Normal
                    </Typography.Text>
                  </Col>
                  <Col span={24} style={{ textAlign: 'center' }}>
                    <Typography.Title
                      level={3}
                      style={{ padding: 0, margin: 0 }}
                    >
                      08:00 - 17:00
                    </Typography.Title>
                  </Col>
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
                    disabled={holiday}
                  >
                    Masuk
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => handleAttendances('check_out')}
                    loading={loading === 'check_out'}
                    disabled={holiday}
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
                  scroll={{
                    x: 500,
                  }}
                  loading={isLoading}
                />
              </Col>
            </Row>
          </Card>
        </Card>
      </Col>
    </Row>
  )
}
