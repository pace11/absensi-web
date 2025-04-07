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
} from 'antd'
import { useFetching } from '@/hooks/useFetching'
import { useState } from 'react'
import dayjs from 'dayjs'
import { badgeStatus } from '@/helpers/utils'
import { ReloadOutlined } from '@ant-design/icons'

export default function Kalender() {
  const [currentDate, setCurrentDate] = useState(
    dayjs().format('YYYY-MM-DD'),
  )
  const {
    data: listAttendances,
    isLoading,
    reloadData,
  } = useFetching({
    path: `/api/attend/list?date=${currentDate}`,
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

    const data = listAttendances?.find(
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
          <Calendar
            cellRender={cellRender}
            onPanelChange={(date) => {
              setCurrentDate(dayjs(date).format('YYYY-MM-DD'))
              reloadData()
            }}
          />
        </Spin>
      </Card>
    </>
  )
}
