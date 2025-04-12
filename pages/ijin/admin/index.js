import {
  Card,
  Table,
  Space,
  Button,
  notification,
  Modal,
  Row,
  Col,
} from 'antd'
import { useFetching } from '@/hooks/useFetching'
import {
  ReloadOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import Axios from 'axios'
import { convertDateRange, badgeStatusLeave } from '@/helpers/utils'
import dayjs from 'dayjs'

export default function IjinAdmin() {
  const { data, isLoading, reloadData } = useFetching({
    path: '/api/leave/admin',
  })
  const [isAcc, setAcc] = useState(false)

  const showConfirmAcc = (params) => {
    Modal.confirm({
      title: 'Konfirmasi',
      content: <p>ACC request ijin ini ?</p>,
      icon: <ExclamationCircleOutlined />,
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: async () => {
        setAcc(params.ids)
        try {
          const response = await Axios({
            method: 'POST',
            url: `/api/leave/acc?ids=${params.ids}`,
          })
          if (response.status === 200) {
            notification.success({
              message: 'Info',
              description: 'Berhasil ACC Ijin',
              duration: 5,
            })
            setAcc(false)
            reloadData()
          }
        } catch (error) {
          notification.error({
            message: 'Error',
            description: `${error.message}`,
            duration: 5,
          })
        } finally {
          setAcc(false)
        }
      },
      onCancel: () => {},
    })
  }

  const columns = [
    {
      title: 'Tanggal',
      key: 'date_range',
      render: ({ date_range }) => `${convertDateRange(date_range)}`,
    },
    {
      title: 'Durasi',
      key: 'duration',
      render: ({ duration }) => `${duration} Hari`,
    },
    {
      title: 'Keterangan',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: 'Status',
      key: 'is_accepted',
      render: ({ is_accepted }) => badgeStatusLeave(is_accepted),
    },
    {
      title: 'Tanggal dibuat',
      key: 'created_at',
      render: ({ created_at }) =>
        dayjs(created_at)
          .locale('id')
          .format('dddd, DD MMMM YYYY HH:mm'),
    },
    {
      title: 'Aksi',
      render: (item) =>
        !Boolean(item.is_accepted) ? (
          <Space direction="horizontal">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => showConfirmAcc(item)}
              loading={item.ids === isAcc}
            >
              ACC Ijin
            </Button>
          </Space>
        ) : null,
    },
  ]

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Ijin"
            extra={[
              <Space key="action-pengguna">
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={() => reloadData()}
                >
                  Refresh data
                </Button>
              </Space>,
            ]}
          >
            <Table
              size="large"
              rowKey="users"
              columns={columns}
              loading={isLoading}
              dataSource={data}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
