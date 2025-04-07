import {
  Card,
  Table,
  Space,
  Button,
  notification,
  Modal,
  Row,
  Col,
  Alert,
} from 'antd'
import { useFetching } from '@/hooks/useFetching'
import {
  PlusOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Axios from 'axios'
import { convertDateRange, badgeStatusLeave } from '@/helpers/utils'
import dayjs from 'dayjs'

const Drawer = dynamic(() => import('./drawer'))

export default function IjinEmployee() {
  const { data, isLoading, reloadData } = useFetching({
    path: '/api/leave/user',
  })
  const [open, setOpen] = useState(false)
  const [isDelete, setDelete] = useState(false)

  const showConfirmDelete = (params) => {
    Modal.confirm({
      title: 'Hapus data',
      content: (
        <p>
          Kamu yakin ingin menghapus data <b>{params.name}</b> ?
        </p>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: 'Ya, Hapus',
      cancelText: 'Tidak',
      onOk: async () => {
        setDelete(params.ids)
        try {
          const response = await Axios({
            method: 'DELETE',
            url: `/api/leave/delete?ids=${params.ids}`,
          })
          if (response.status === 200) {
            notification.success({
              message: 'Info',
              description: 'Berhasil menghapus data',
              duration: 1,
            })
            setDelete(false)
            reloadData()
          }
        } catch (error) {
          notification.error({
            message: 'Error',
            description: `${error.message}`,
            duration: 1,
          })
        } finally {
          setDelete(false)
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
              danger
              type="primary"
              icon={<DeleteOutlined />}
              onClick={() => showConfirmDelete(item)}
              loading={item.ids === isDelete}
            >
              Hapus
            </Button>
          </Space>
        ) : null,
    },
  ]

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Alert
            message="Informasi"
            description="Request ijin masih bisa dihapus apabila status masih menunggu disetujui"
            type="info"
            showIcon
          />
        </Col>
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
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setOpen(true)}
                >
                  Buat ijin baru
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

      <Drawer
        isOpen={open}
        onClose={() => {
          setOpen(false)
          reloadData()
        }}
      />
    </>
  )
}
