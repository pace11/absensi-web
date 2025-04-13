import {
  Card,
  Calendar,
  Badge,
  Row,
  Col,
  Popconfirm,
  Table,
  Typography,
  Button,
  Space,
  Spin,
  Tag,
} from 'antd'
import { useFetching } from '@/hooks/useFetching'
import { useState } from 'react'
import dayjs from 'dayjs'
import { badgeStatus } from '@/helpers/utils'
import {
  ReloadOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons'

export default function Kalender({ user_id = '' }) {
  const [currentDate, setCurrentDate] = useState(
    dayjs().format('YYYY-MM-DD'),
  )
  const {
    data: listAttendances,
    isLoading,
    reloadData,
  } = useFetching({
    path: `/api/attend/list?date=${currentDate}&user_id=${user_id}`,
  })

  const cellRender = (currentDate) => {
    const columns = [
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
        title: 'Keterangan',
        key: 'description',
        width: 200,
        render: ({ description }) => (
          <Typography.Text mark={!!description}>
            {description || '-'}
          </Typography.Text>
        ),
      },
    ]
    const dateStr = currentDate.format('YYYY-MM-DD')

    const data = listAttendances?.attendances?.find(
      (item) => item.created_at_local === dateStr,
    )

    if (!data) return null

    return (
      <Popconfirm
        title={
          <Table
            size="small"
            columns={columns}
            dataSource={[data]}
            pagination={false}
          />
        }
        icon={false}
        okText="Yes"
        showCancel={false}
      >
        <Row>
          <Col span={24}>
            <Badge
              status={badgeStatus(data.status).status}
              text={badgeStatus(data.status).text}
            />
          </Col>
          <Col span={24}>
            <Button size="small">Detail</Button>
          </Col>
        </Row>
      </Popconfirm>
    )
  }

  return (
    <>
      <Card
        title="Kalender"
        extra={[
          <Space key="action-kalender">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => reloadData()}
            >
              Refresh data
            </Button>
          </Space>,
        ]}
      >
        <Spin spinning={isLoading}>
          <Row gutter={[8, 8]}>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Tag icon={<CheckCircleOutlined />} color="success">
                {`Absen Full: ${listAttendances?.count?.present}`}
              </Tag>
              <Tag icon={<MinusCircleOutlined />} color="error">
                {`Tidak Hadir: ${listAttendances?.count?.absent}`}
              </Tag>
              <Tag icon={<InfoCircleOutlined />} color="warning">
                {`Ijin/Cuti/Sakit: ${listAttendances?.count?.leave}`}
              </Tag>
            </Col>
            <Col span={24}>
              <Calendar
                dateCellRender={cellRender}
                onPanelChange={(date) => {
                  setCurrentDate(dayjs(date).format('YYYY-MM-DD'))
                  reloadData()
                }}
              />
            </Col>
          </Row>
        </Spin>
      </Card>
    </>
  )
}
